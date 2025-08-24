const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error', err.stack));

// --- API Endpoints ---

app.get('/click', async (req, res) => {
  const { affiliate_id, campaign_id, click_id } = req.query;

  if (!affiliate_id || !campaign_id || !click_id) {
    return res.status(400).json({ status: 'error', message: 'Missing required parameters.' });
  }

  try {
    const query = `
      INSERT INTO clicks (affiliate_id, campaign_id, click_id, timestamp)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [affiliate_id, campaign_id, click_id];
    await client.query(query, values);
    res.status(200).json({ status: 'success', message: 'Click tracked successfully.' });
  } catch (error) {
    console.error('Error tracking click:', error);
    if (error.code === '23505') {
      return res.status(409).json({ status: 'error', message: 'Duplicate click ID.' });
    }
    res.status(500).json({ status: 'error', message: 'Failed to track click.' });
  }
});

app.get('/postback', async (req, res) => {
  const { affiliate_id, click_id, amount, currency } = req.query;

  if (!affiliate_id || !click_id || !amount || !currency) {
    return res.status(400).json({ status: 'error', message: 'Missing required parameters.' });
  }

  try {
    const findClickQuery = `
      SELECT id FROM clicks WHERE click_id = $1 AND affiliate_id = $2;
    `;
    const findClickResult = await client.query(findClickQuery, [click_id, affiliate_id]);
    const click = findClickResult.rows[0];

    if (!click) {
      return res.status(404).json({ status: 'error', message: 'Invalid click_id for affiliate_id. Postback ignored.' });
    }

    const insertConversionQuery = `
      INSERT INTO conversions (click_id, amount, currency, timestamp, affiliate_id)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING *;
    `;
    const insertConversionValues = [click.id, amount, currency, affiliate_id];
    await client.query(insertConversionQuery, insertConversionValues);

    res.status(200).json({ status: 'success', message: 'Conversion tracked' });
  } catch (error) {
    console.error('Error handling postback:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process postback.' });
  }
});

app.get('/dashboard/clicks/:affiliateId', async (req, res) => {
  try {
    const { affiliateId } = req.params;
    const query = `
      SELECT *
      FROM clicks
      WHERE affiliate_id = $1
      ORDER BY timestamp DESC;
    `;
    const result = await client.query(query, [affiliateId]);
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error fetching clicks:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
});

app.get('/dashboard/conversions/:affiliateId', async (req, res) => {
  try {
    const { affiliateId } = req.params;
    const query = `
      SELECT *
      FROM conversions
      WHERE affiliate_id = $1
      ORDER BY timestamp DESC;
    `;
    const result = await client.query(query, [affiliateId]);
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error fetching conversions:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
