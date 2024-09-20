const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
    optionSuccessStatus: 200,

}

//middleware
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elzgrcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const animalCollection = client.db("animalsDB").collection("animals");

        //get  animals
        app.get("/animals", async (req, res) => {
            const category = req.query.category || "Land Animal";
            const query = { category };
            const animals = await animalCollection.find(query).toArray();
            res.send(animals)
        })

        //get for category
        app.get("/category", async(req, res)=>{
            const category = await animalCollection.find().toArray();
            res.send(category);
        })

        //create animal data
        app.post("/create-animal", async (req, res) => {
            const animalInfo = req.body;
            const result = await animalCollection.insertOne(animalInfo);
            res.send(result);
        })

    


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Animals site i s running')
})

app.listen(port, () => {
    console.log(`Animals site running port is ${port}`);
})