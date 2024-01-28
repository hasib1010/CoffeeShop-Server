const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://coffeeMaster:MjYLdhgNbpnP2k1u@cluster0.bugptt7.mongodb.net/?retryWrites=true&w=majority";

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
        app.get('/coffee', async(req, res)=>{
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
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
