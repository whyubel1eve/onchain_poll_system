import { Pool } from 'pg';

export const pool = new Pool({
  user: 'ozias',
  host: 'localhost',
  database: 'poll',
  password: '111111',
  port: 5432,
});
