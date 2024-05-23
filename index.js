require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
// middlewares
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zrua0aj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client
      .db('bistroBossRestaurantDB')
      .collection('users');
    const menuCollection = client
      .db('bistroBossRestaurantDB')
      .collection('menu');
    const reviewCollection = client
      .db('bistroBossRestaurantDB')
      .collection('reviews');
    const cartCollection = client
      .db('bistroBossRestaurantDB')
      .collection('carts');

    // user related apis
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.status(200).send(result);
    });
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ massage: 'user already exists', insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.status(200).send(result);
    });
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: 'admin',
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.status(200).send(result);
    });
    // menu related apis
    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.status(200).send(result);
    });
    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.status(200).send(result);
    });
    // carts collection
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };

      const result = await cartCollection.find(query).toArray();
      res.status(200).send(result);
    });
    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.status(200).send(result);
    });
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.status(200).send(result);
    });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('bistro boss restaurant here!!!');
});
app.listen(port, (req, res) => {
  console.log(`server listening on ${port}`);
});
// --------- Naming Convention
/***
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.put('/user/:id')
 * ***/
