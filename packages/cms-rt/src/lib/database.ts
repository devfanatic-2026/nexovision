import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize database connection
export async function initializeDb(): Promise<Database> {
  // Determine database path from environment variable or use default
  const dbPath = process.env.DB_FILE || './cms.sqlite';

  // Open the database
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign key constraints
  await db.exec('PRAGMA foreign_keys = ON;');

  // Run schema initialization
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      inspire TEXT
    );

    CREATE TABLE IF NOT EXISTS authors (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      job TEXT,
      avatar TEXT,
      bio TEXT
    );

    CREATE TABLE IF NOT EXISTS author_socials (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
    );

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

    CREATE TABLE IF NOT EXISTS article_authors (
      article_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      PRIMARY KEY (article_id, author_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
    );
  `);

  return db;
}