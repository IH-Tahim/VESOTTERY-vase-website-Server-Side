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
        const database = client.db('vesottery');
        //Collection Name variables
        const productCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const blogCollection = database.collection('blogs');


        //Get Blogs Function
        app.get('/blogs', async (req, res) => {
            const result = await blogCollection.find({}).toArray();
            res.json(result);
        })


        //Get Products Function
        app.get('/products', async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("running VESOTTERY's server")
});
app.listen(port, () => {
    console.log("running on port:", port);
});