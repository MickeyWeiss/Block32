const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_ice_cream_shop_db')
const app = express()

app.use(express.json());
app.use(require('morgan')('dev'));

app.post('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
            INSERT INTO flavors(flavor);
            VALUES($1);
            RETURNING *;`
        const response = await client.query(SQL, [req.body.flavor])
        res.send(response.rows[0])
    }catch (express) {
        next(express)
    }
})
app.get('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
            SELECT * from flavors;`
        const response = await client.query(SQL);
        res.send(response.rows);
    }catch(express){
        next(express)
    }
})
app.get('/api/flavors/:id', async (req, res, next) => {
        try {
            const SQL = `
                WHERE id = $1;
                RETURNING *;`

            const response = await client.query(SQL, [req.body.flavor])
            res.send(respponse.rows[0])
        } catch(express) {
            next(express)
        }
})
app.put('/api/flavors/:id', async (req, res, next) => {
    try{
        const SQL = `
            UPDATE flavors;
            SET flavor = $1, is_favorite = $2, updated_at = now();
            WHERE id = $3;
            RETURNING *`

        const response = await client.query(SQL, [req.body.flavor, req.body.is_favorite, req.params.id]);
        res.send(response.rows[0])
    }catch (express) {
        next(express)
    }
})
app.delete('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
            DELETE from flavors;
            WHERE id = $1;`
        const response = await client.query(SQL, [req.params.id])
        response.sendStatus
    }catch (express) {
        next(express)
    }
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

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`))
}

init();