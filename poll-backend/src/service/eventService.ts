import { Injectable } from '@nestjs/common';
import { pool } from 'src/dao';
import { PollEvent } from 'src/model/event';
import { Token } from 'src/model/token';

@Injectable()
export class EventService {
  async createEvent(req: Partial<PollEvent & { tokens: Token[] }>) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const queryText = `INSERT INTO poll_events(uid, name, creator, options, ticket, remained_ticket, image_url, hash) VALUES($1, $2, $3, $4::text[], $5, $6, $7, $8) RETURNING *`;
      const values = [
        req.uid,
        req.name,
        req.creator,
        `{${req.options}}`,
        `${req.ticket}`,
        `${req.remained_ticket}`,
        req.image_url,
        req.hash,
      ];
      const res = await client.query(queryText, values);
      console.log('event is successfully inserted', res.rows[0]);

      for (let i = 0; i < req.tokens.length; i++) {
        const token = req.tokens[i];
        const queryText_2 = `INSERT INTO tokens(hash, r, s, v, isIssued, event_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values_2 = [
          token.hash,
          token.r,
          token.s,
          `${token.v}`,
          `${token.isIssued}`,
          `${res.rows[0].id}`,
        ];
        const res_2 = await client.query(queryText_2, values_2);
        console.log('token is successfully inserted', res_2.rows[0]);
      }

      await client.query('COMMIT');

      return JSON.stringify({
        status: 1,
        msg: `successfully create event ${req.name}`,
      });
    } catch (err) {
      console.error(err);
      return JSON.stringify({
        status: 0,
        msg: err,
      });
    }
  }
  async queryAllEvents() {
    const queryText = `SELECT * FROM poll_events`;

    try {
      const res = await pool.query(queryText);
      if (res.rows.length > 0) {
        return JSON.stringify({
          status: 1,
          res: res.rows,
        });
      } else {
        return JSON.stringify({
          status: 0,
          msg: 'No event found',
        });
      }
    } catch (err) {
      console.error('Error executing query', err.stack);
      return err;
    }
  }
  async queryEventByCreator(creator: string) {
    const queryText = `
      SELECT * FROM poll_events WHERE creator = $1;
    `;
    const values = [creator];

    try {
      const res = await pool.query(queryText, values);
      if (res.rows.length > 0) {
        return JSON.stringify({
          status: 1,
          res: res.rows,
        });
      } else {
        return JSON.stringify({
          status: 0,
          msg: 'No event found',
        });
      }
    } catch (err) {
      console.error('Error executing query', err.stack);
      return err;
    }
  }
  async vote(event_id: number) {
    const client = await pool.connect();
    try {
      const updateEventQuery = `UPDATE poll_events SET remained_ticket = remained_ticket - 1 WHERE id = $1`;
      await client.query(updateEventQuery, [event_id]);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error executing query', err.stack);
      return { status: 0, error: err.message };
    } finally {
      client.release();
    }
  }
}
