const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middle Wares //
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vhdpi0m.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// MongoDB Collection //
async function run() {
    const postCollection = client.db('socia-buzz').collection('post')
    const likesCollection = client.db('socia-buzz').collection('like')
    try {
        app.get("/post", async (req, res) => {
            const query = {};
            const cursor = await postCollection.find(query);
            const posts = await cursor.toArray();
            const reverseArray = posts.reverse();
            res.send(reverseArray);
        });
        app.post("/post", async (req, res) => {
            const items = req.body;
            const result = await postCollection.insertOne(items);
            res.send(result);
        });
        app.get("/post", async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const cursor = await postCollection.find(query).toArray();;
            res.send(cursor);
        });
        app.post("/like", async (req, res) => {
            const items = req.body;
            const result = await likesCollection.insertOne(items);
            res.send(result);
        });
        app.get("/like", async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const cursor = await likesCollection.find(query).toArray();;
            res.send(cursor);
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));
app.get('/', (req, res) => {
    res.send('Socio Buzz Server is Running')
})
app.listen(port, () => {
    console.log(`Socio Buzz Server is Running on ${port}`);
})