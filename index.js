const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qewiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        //Database Name
        const database = client.db('ass-12');
        //Collection Name variables
        const serviceCollection = database.collection('services');
        const blogCollection = database.collection('blogs');


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('running my crud server')
});
app.listen(port, () => {
    console.log("running on port:", port);
});