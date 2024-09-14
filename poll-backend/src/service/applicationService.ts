import { Injectable } from '@nestjs/common';
import { pool } from 'src/dao';
import { Application } from 'src/model/application';

@Injectable()
export class ApplicationService {
  async createApplication(req: Partial<Application>) {
    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // insert
      const insertText = `INSERT INTO applications(event_id, applicant_name, applicant_address, status) VALUES($1, $2, $3, $4) RETURNING *`;
      const insertValues = [
        `${req.event_id}`,
        req.applicant_name,
        req.applicant_address,
        req.status,
      ];
      const insertRes = await client.query(insertText, insertValues);

      // update
      // const updateText = `UPDATE poll_events SET remained_ticket = remained_ticket - 1 WHERE id = $1`;
      // const updateValues = [req.event_id];
      // await client.query(updateText, updateValues);

      // commit
      await client.query('COMMIT');

      console.log(
        'Data is successfully inserted and ticket count updated',
        insertRes.rows[0],
      );
      return JSON.stringify({
        status: 1,
        msg: `Successfully created application and updated ticket count, applicant: ${req.applicant_address}`,
        ...insertRes.rows[0],
      });
    } catch (err) {
      // rollback
      await client.query('ROLLBACK');
      console.error('Transaction error:', err);
      return JSON.stringify({
        status: 0,
        msg: err.message || err,
      });
    } finally {
      // release connection
      client.release();
    }
  }

  async queryApplication(applicant: string) {
    const queryText = `
      SELECT 
        applications.*, 
        poll_events.uid,
        poll_events.name,
        poll_events.creator,
        poll_events.options,
        poll_events.remained_ticket,
        poll_events.ticket
      FROM 
        applications 
      INNER JOIN 
        poll_events 
      ON 
        applications.event_id = poll_events.id
      WHERE 
        applications.applicant_address = $1;
    `;
    const values = [applicant];

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
  async queryApplicationByEventId(applicant: string, event_id: number) {
    const queryText = `
      SELECT * FROM applications WHERE applicant_address = $1 and event_id = $2;
    `;
    const values = [applicant, `${event_id}`];

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
          msg: 'No application found',
        });
      }
    } catch (err) {
      console.error('Error executing query', err.stack);
      return err;
    }
  }
  async queryApplicationByCreator(creator: string) {
    const queryText = `
      SELECT 
        applications.*, 
        poll_events.uid,
        poll_events.name,
        poll_events.creator,
        poll_events.options
      FROM 
        applications 
      INNER JOIN 
        poll_events 
      ON 
        applications.event_id = poll_events.id
      WHERE 
        poll_events.creator = $1;
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
          msg: 'No application found',
        });
      }
    } catch (err) {
      console.error('Error executing query', err.stack);
      return err;
    }
  }
  async handleApplication(status: string, applicationId: number) {
    const client = await pool.connect();
    try {
      if (status === 'rejected') {
        const updateApplicationQuery = `UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`;
        const applicationResult = await client.query(updateApplicationQuery, [
          status,
          `${applicationId}`,
        ]);
        if (applicationResult.rows.length === 0) {
          throw new Error('No application found');
        }
        await client.query('COMMIT');
        return {
          status: 1,
          message: 'Application updated successfully',
        };
      } else {
        await client.query('BEGIN');

        const updateApplicationQuery = `UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`;
        const applicationResult = await client.query(updateApplicationQuery, [
          status,
          `${applicationId}`,
        ]);
        if (applicationResult.rows.length === 0) {
          throw new Error('No application found');
        }
        const eventId = applicationResult.rows[0].event_id;

        const tokenQuery = `SELECT id FROM tokens WHERE event_id = $1 AND isIssued = false ORDER BY id LIMIT 1 FOR UPDATE`;
        const tokenResult = await client.query(tokenQuery, [eventId]);
        if (tokenResult.rows.length === 0) {
          throw new Error('No available token found');
        }
        const tokenId = tokenResult.rows[0].id;

        const updateTokenQuery = `UPDATE tokens SET isIssued = true WHERE id = $1`;
        await client.query(updateTokenQuery, [tokenId]);

        const updateApplicationTokenQuery = `UPDATE applications SET token_id = $1 WHERE id = $2`;
        await client.query(updateApplicationTokenQuery, [
          tokenId,
          applicationId,
        ]);

        await client.query('COMMIT');

        return {
          status: 1,
          message: 'Application and token updated successfully',
        };
      }
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error executing query', err.stack);
      return { status: 0, error: err.message };
    } finally {
      client.release();
    }
  }
  async queryToken(token_id: number) {
    const queryText = `
    SELECT 
      applications.*, 
      tokens.*
    FROM 
      applications 
    INNER JOIN 
      tokens 
    ON 
      applications.token_id = tokens.id
    WHERE 
      applications.token_id = $1;
  `;
    const values = [token_id];

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
}
