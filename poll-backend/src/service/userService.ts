import { Injectable } from '@nestjs/common';
import { pool } from 'src/dao';
import { User } from 'src/model/user';

@Injectable()
export class UserService {
  async createUser(user: Partial<User>) {
    const queryText = `INSERT INTO users(name, real_id, address) VALUES($1, $2, $3) RETURNING *`;
    const values = [user.name, user.real_id, user.address];

    try {
      const res = await pool.query(queryText, values);
      console.log('Data is successfully inserted', res.rows[0]);
      return JSON.stringify({
        status: 1,
        msg: `successfully create user ${user.name}`,
      });
    } catch (err) {
      console.error(err);
      return JSON.stringify({
        status: 0,
        msg: err,
      });
    }
  }
  async login(address: string) {
    const queryText = `SELECT name, real_id FROM users WHERE address = $1`;
    const values = [address];
    console.log(address);

    try {
      const res = await pool.query(queryText, values);
      if (res.rows.length > 0) {
        console.log('User found:', res.rows[0]);
        return JSON.stringify({
          status: 1,
          ...res.rows[0],
        });
      } else {
        return JSON.stringify({
          status: 0,
          msg: 'No user found with the specified address',
        });
      }
    } catch (err) {
      console.error('Error executing query', err.stack);
      return err;
    }
  }
}
