const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_ice_cream_shop_db')
const app = express()

app.use(express.json());
app.use(require('morgan')('dev'));

app.post('/api/flavors', async (req, res, next) => {

})
app.get('/api/flavors', async (req, res, next) => {

})
app.get('/api/flavors/:id', async (req, res, next) => {
    
})
app.put('/api/flavors/:id', async (req, res, next) => {

})
app.delete('/api/flavors/:id', async (req, res, next) => {

})

const init = async () => {
    await client.connect();
    console.log('connected to the database');
    let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT now(), updated_at TIMESTAMP DEFAULT now(), flavor VARCHAR(255), is_favorite BOOLEAN DEFAULT FALSE);`;
    
    await client.query(SQL);
    console.log('tables created');
    SQL = `INSERT INTO flavors (flavor, is_favorite) VALUES('vanilla', true);
    INSERT INTO flavors (flavor, is_favorite) VALUES('chocolate', false);
    INSERT INTO flavors (flavor, is_favorite) VALUES('strawberry', false);`;
    await client.query(SQL);
    console.log('data seeded')
}

init();