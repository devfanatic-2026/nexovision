-- CMS Initial Schema (SQLite)

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    inspire TEXT
);

-- Authors Table
CREATE TABLE IF NOT EXISTS authors (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    job TEXT,
    avatar TEXT,
    bio TEXT
);

-- Author Socials (Relation)
CREATE TABLE IF NOT EXISTS author_socials (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover TEXT,
    category_id TEXT,
    published_time TEXT,
    is_draft INTEGER DEFAULT 0,
    is_main_headline INTEGER DEFAULT 0,
    is_sub_headline INTEGER DEFAULT 0,
    is_category_main_headline INTEGER DEFAULT 0,
    is_category_sub_headline INTEGER DEFAULT 0,
    content TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Article Authors (Many-to-Many)
CREATE TABLE IF NOT EXISTS article_authors (
    article_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    PRIMARY KEY (article_id, author_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
