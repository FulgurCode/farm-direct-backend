import { MongoClient, ServerApiVersion } from "mongodb"

const uri = "mongodb+srv://sample:sample@cluster0.poe1vdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

export const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

export let db;

export const mongoStart = async () => {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    db = client.db("farm-direct");
    // Send a ping to confirm a successful connection
    await client.db("farm-direct").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
