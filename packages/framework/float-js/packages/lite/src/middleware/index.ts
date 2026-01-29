/**
 * Float.js Edge Middleware (Lite / Client)
 * Client-side friendly middleware utilities
 */

// ============================================================================
// TYPES
// ============================================================================

export interface MiddlewareRequest {
  /** HTTP method */
  method: string;
  /** Request URL */
  url: string;
  /** Parsed URL */
  nextUrl: NextURL;
  /** Request headers */
  headers: Headers;
  /** Cookies from request */
  cookies: RequestCookies;
  /** Geolocation data (if available) */
  geo?: GeoData;
  /** IP address */
  ip?: string;
  /** Original request */
  request: Request;
}

export interface NextURL {
  /** Full URL */
  href: string;
  /** Origin */
  origin: string;
  /** Protocol */
  protocol: string;
  /** Hostname */
  hostname: string;
  /** Port */
  port: string;
  /** Pathname */
  pathname: string;
  /** Search params */
  searchParams: URLSearchParams;
  /** Search string */
  search: string;
  /** Hash */
  hash: string;
  /** Base path */
  basePath: string;
  /** Locale */
  locale?: string;
  /** Clone the URL */
  clone(): NextURL;
}

export interface RequestCookies {
  get(name: string): { name: string; value: string } | undefined;
  getAll(): Array<{ name: string; value: string }>;
  has(name: string): boolean;
  set(name: string, value: string, options?: CookieOptions): void;
  delete(name: string): void;
}

export interface CookieOptions {
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export interface GeoData {
  city?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export type MiddlewareHandler = (
  request: MiddlewareRequest
) => Promise<MiddlewareResponse | void> | MiddlewareResponse | void;

export type MiddlewareResponse = Response | NextResponse;

export interface MiddlewareConfig {
  matcher?: string | string[];
}

// ============================================================================
// NEXT RESPONSE
// ============================================================================

export class NextResponse extends Response {
  private _cookies: Map<string, { value: string; options?: CookieOptions }> = new Map();
  private _headers: Headers;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init);
    this._headers = new Headers(init?.headers);
  }

  get cookies() {
    const self = this;
    return {
      set(name: string, value: string, options?: CookieOptions) {
        self._cookies.set(name, { value, options });
        self._headers.append('Set-Cookie', self._serializeCookie(name, value, options));
      },
      delete(name: string) {
        self._cookies.delete(name);
        self._headers.append('Set-Cookie', `${name}=; Max-Age=0; Path=/`);
      },
      get(name: string) {
        const cookie = self._cookies.get(name);
        return cookie ? { name, value: cookie.value } : undefined;
      },
      getAll() {
        return Array.from(self._cookies.entries()).map(([name, { value }]) => ({ name, value }));
      },
    };
  }

  private _serializeCookie(name: string, value: string, options?: CookieOptions): string {
    let cookie = `${name}=${encodeURIComponent(value)}`;

    if (options?.domain) cookie += `; Domain=${options.domain}`;
    if (options?.path) cookie += `; Path=${options.path}`;
    if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options?.expires) cookie += `; Expires=${options.expires.toUTCString()}`;
    if (options?.httpOnly) cookie += '; HttpOnly';
    if (options?.secure) cookie += '; Secure';
    if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;

    return cookie;
  }

  /**
   * Continue to the next middleware/handler
   */
  static next(init?: { request?: { headers?: Headers } }): NextResponse {
    const response = new NextResponse(null, { status: 200 });

    if (init?.request?.headers) {
      init.request.headers.forEach((value, key) => {
        response._headers.set(`x-middleware-request-${key}`, value);
      });
    }

    // Mark as "continue"
    response._headers.set('x-middleware-next', '1');

    return response;
  }

  /**
   * Redirect to a URL
   */
  static redirect(url: string | URL, status: 301 | 302 | 303 | 307 | 308 = 307): NextResponse {
    const urlString = typeof url === 'string' ? url : url.toString();
    return new NextResponse(null, {
      status,
      headers: { Location: urlString },
    });
  }

  /**
   * Rewrite to a different URL (internal redirect)
   */
  static rewrite(url: string | URL): NextResponse {
    const urlString = typeof url === 'string' ? url : url.toString();
    const response = new NextResponse(null, { status: 200 });
    response._headers.set('x-middleware-rewrite', urlString);
    return response;
  }

  /**
   * Return a JSON response
   */
  static json(data: unknown, init?: ResponseInit): NextResponse {
    const body = JSON.stringify(data);
    return new NextResponse(body, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  }
}

// ============================================================================
// MATCHER UTILITIES
// ============================================================================

/**
 * Convert matcher pattern to regex
 */
function matcherToRegex(pattern: string): RegExp {
  // Handle special patterns
  if (pattern === '*') return /.*/;
  if (pattern === '/') return /^\/$/;

  // Convert Next.js-style patterns to regex
  let regex = pattern
    // Escape special regex chars (except our patterns)
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    // Convert :param to named capture groups
    .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '(?<$1>[^/]+)')
    // Convert * to match any characters
    .replace(/\\\*/g, '.*')
    // Handle (group) for optional segments
    .replace(/\\\(([^)]+)\\\)/g, '($1)?');

  return new RegExp(`^${regex}$`);
}

/**
 * Check if path matches any of the patterns
 */
export function matchesPath(path: string, matcher?: string | string[]): boolean {
  if (!matcher) return true;

  const patterns = Array.isArray(matcher) ? matcher : [matcher];
  return patterns.some(pattern => matcherToRegex(pattern).test(path));
}

// ============================================================================
// REQUEST PARSING
// ============================================================================

export function createNextUrl(url: URL, basePath: string = ''): NextURL {
  return {
    href: url.href,
    origin: url.origin,
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    searchParams: url.searchParams,
    search: url.search,
    hash: url.hash,
    basePath,
    locale: undefined,
    clone() {
      return createNextUrl(new URL(url.href), basePath);
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const middleware = {
  NextResponse,
  matchesPath,
  createNextUrl,
};

