const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');

const mongoUri = "mongodb+srv://coderfool:Gomigo99911@cluster0.mau2m.gcp.mongodb.net/gomigo?retryWrites=true&w=majority";
const amqpUri = 'amqps://byiwnscu:3zcUMryYSJ_-Dck7ndnJKEtadGbDgQ4w@lionfish.rmq.cloudamqp.com/byiwnscu';

const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

mongoClient.connect(err => {
    collection = mongoClient.db("gomigo").collection("users");    
});

app = express();

app.use(express.static(path.resolve('./')));
app.use(bodyParser.urlencoded({extended: true}));

const upload = multer({storage: multer.memoryStorage()});

app.post('/upload', upload.single('file'), (req, res) => {
    if (collection === null) {
        res.write('Could not connect to mongodb');
        res.end();
        return;
    }
    req.body.filename = req.file.originalname;
    req.body.buffer = req.file.buffer;
    collection.insertOne(req.body).then(data => {
        amqp.connect(amqpUri, (err, conn) => {
            conn.createChannel((err, channel) => {
                channel.sendToQueue('userdata', Buffer.from(ObjectId(data.insertedId).toString()));
            });
        });
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>Successfully added to mongodb.</p><br><a href="/index.html">Back</a>');
        res.end();
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
