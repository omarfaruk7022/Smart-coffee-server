const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fb3re46.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("db connected");
    const productsCollection = client.db("smart-coffee").collection("products");
    const cartCollection = client.db("smart-coffee").collection("cartList");
    const usersCollection = client.db("smart-coffee").collection("users");

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });
    app.post("/addToCart/", async (req, res) => {
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });
    app.get("/cartList/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cart = await cartCollection.find(query).toArray();
      res.send(cart);
    });
    app.delete("/cartList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    })
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      res.send({ data: user });
    });
    app.get("/cartList", async (req, res) => {
      const cursor = cartCollection.find({});
      const cart = await cursor.toArray();
      res.send(cart);
    });
    app.patch("/cartList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: req.body.status,
        },
      };
      const result = await cartCollection.updateOne(query, updateDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Smart Coffee");
});

app.listen(port, () => {
  console.log(`Smart Coffee listening on port ${port}`);
});
