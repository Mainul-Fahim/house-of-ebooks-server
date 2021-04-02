const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId= require('mongodb').ObjectId;
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config();

const port = process.env.PORT||5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yu2o5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Error',err);
    const bookCollection = client.db("houseOfBooks").collection("books");
    const ordersCollection = client.db("houseOfBooks").collection("orders");

      app.get('/books',(req,res) => {
          bookCollection.find()
          .toArray((err,items)=>{
            res.send(items)
          })
      })

      app.get('/book/:id',(req,res) => {
          bookCollection.find({_id: ObjectId(req.params.id)})
          .toArray((err,items)=>{
              res.send(items[0])
          })
      })
      app.get('/orders/:id',(req,res) => {
        ordersCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err,items)=>{
            res.send(items[0])
        })
    })
      app.post('/addBooks',(req, res) => {
          const newBook=req.body;
          console.log('new book',newBook);
          bookCollection.insertOne(newBook)
          .then(result =>{
              console.log('insertedCount',result);
              res.send(result)
          })
      })  
//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})