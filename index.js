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
        const orderCollection = database.collection('allOrders');
        const userCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');
        const blogCollection = database.collection('blogs');


        //Get Blogs Function
        app.get('/blogs', async (req, res) => {
            const result = await blogCollection.find({}).toArray();
            res.json(result);
        })


        //Get HOME Products Function
        app.get('/homeproducts', async (req, res) => {
            const result = await productCollection.find({}).limit(6).toArray();
            res.json(result);
        })
        //Get Products Function
        app.get('/products', async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.json(result);
        })


        //Get Place Order By OrderId
        app.get('/placeorder/:id', async (req, res) => {
            const orderId = req.params.id;
            const query = { _id: ObjectId(orderId) };
            const result = await productCollection.findOne(query);
            res.json(result);
        })

        //Post Place order By Email Id
        app.post('/placeorder', async (req, res) => {
            const orderDetails = req.body;
            const result = await orderCollection.insertOne(orderDetails);
            res.json(result);
        })

        //Get My Orders By Email Id
        app.get('/myorders/:email', async (req, res) => {
            const userEmail = req.params.email;
            console.log(userEmail);
            const result = await orderCollection.find({ email: userEmail }).toArray();
            res.json(result);
            console.log(result);
        })


        //Save USer Data
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);

            res.json(result);
        })

        // Check Email if Admin or not
        app.get('users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //user Put
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);

            res.json(result);
        })

        // Make New Admin
        app.put('/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await userCollection.updateOne(filter, updateDoc);

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