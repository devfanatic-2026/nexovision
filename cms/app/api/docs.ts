import { json } from '@float.js/core';

const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Nexovisión CMS API',
        version: '1.0.0',
        description: 'API for managing Nexovisión content (Articles, Authors, Categories)',
    },
    paths: {
        '/api/articles': {
            get: {
                summary: 'List all articles',
                responses: {
                    200: { description: 'Success' }
                }
            },
            post: {
                summary: 'Create a new article',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['slug', 'title', 'content'],
                                properties: {
                                    slug: { type: 'string' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    cover: { type: 'string' },
                                    content: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Created' }
                }
            }
        },
        '/api/authors': {
            get: {
                summary: 'List all authors',
                responses: {
                    200: { description: 'Success' }
                }
            }
        },
        '/api/categories': {
            get: {
                summary: 'List all categories',
                responses: {
                    200: { description: 'Success' }
                }
            }
        },
        '/api/sync': {
            post: {
                summary: 'Trigger manual database synchronization',
                responses: {
                    200: { description: 'Success' }
                }
            }
        }
    }
};

export const GET = () => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>API Documentation - Nexovisión CMS</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            spec: ${JSON.stringify(openApiSpec)},
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
    });
};
