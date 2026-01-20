import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function testDbMethods() {
  const db = await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });

  console.log('Available methods on db object:');
  console.log(Object.getOwnPropertyNames(db.constructor.prototype));
  
  // Test if methods exist
  console.log('has all method:', typeof db.all === 'function');
  console.log('has get method:', typeof db.get === 'function');
  console.log('has run method:', typeof db.run === 'function');
}

testDbMethods().catch(console.error);