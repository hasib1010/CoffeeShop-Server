const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.bugptt7.mongodb.net/?retryWrites=true&w=majority`;

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
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details, 
                    photo: updatedCoffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options)
            res.send(result)
        })

        // app.put("/coffee/:id", async (req, res) => {
        //     console.log("updating");
        //     const id = req.params.id;
        //     const updateDetails = req.body;
        //     const filter = { _id: new ObjectId(id) };
        //     console.log(filter);
        //     const options = { upsert: true };
        //     // chef, details, name, photo, supplier, taste, _id, category
        //     const updateCoffee = {
        //         $set: {
        //             chef: updateDetails.chef,
        //             details: updateDetails.details,
        //             name: updateDetails.name,
        //             photo: updateDetails.photo,
        //             supplier: updateDetails.supplier,
        //             taste: updateDetails.taste,
        //             category: updateDetails.category
        //         }
        //     };

        //     const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
        //     console.log(result);
        //     res.send(result);


        // })
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
