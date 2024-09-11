import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://rafaeashraf91:vOIhDXQkK3UgrPNq@cluster0.cdz37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


const connectToDatabase = async () => {
    try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
        );
      } catch(err) {
        console.error(err);
      }
}

connectToDatabase()

let db = client.db("sample_mflix");

export default db;