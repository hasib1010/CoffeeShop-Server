const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://coffeeMaster:GDizMM2jQAWuLWKE@cluster0.bugptt7.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // Continue with MongoDB operations here


        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffeeCollection");

        app.post("/coffee", async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
        });
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })
        app.put("/coffee/:id", async (req, res) => {
            console.log("updating");
            const id = req.params.id;
            const coffee = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = {
                upsert: true
            }
            const updateCoffee = {
                $set: {
                    chef: coffee.chef,
                    details: coffee.details,
                    name: coffee.name,
                    photo: coffee.photo,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category
                }
            };
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
            res.send(result)

        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Coffee server is running");
})

app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`);
})
