const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.xrerq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    
    const productCollection = client.db('Bike').collection('product');
    // perform actions on the collection object
    app.get('/product', async (req, res) => {

        const quary = {}
        const cursor = productCollection.find(quary)
        const products = await cursor.toArray();
        res.send(products)
    });
    app.get('/product/:id',async(req,res)=>{
        const id =req.params.id;
        
        const quary={_id:ObjectId(id)}
        const products=await productCollection.findOne(quary);
        res.send(products);

    });
    //My items collection

   
    //post 

    app.post('/product', async (req, res) => {
        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct)
        res.send(result)
    })
    //delete
    app.delete('/product/:id', async (req, res) => {
        const id = req.params.id;
        const quary = { _id: ObjectId(id) }
        const result = await productCollection.deleteOne(quary);
        res.send(result);
    });
    // update quantity
    app.put('/product/:id', async(req, res) =>{
        const id = req.params.id;
        const updatequantity = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                quantity: updatequantity.quantity
               
            },
        };
        const result = await productCollection.updateOne(filter, updatedDoc, options);
        res.send(result);

    })
    
    console.log('connected to bike db')
});



app.get('/', (req, res) => {
    res.send('Running Bike BD server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})