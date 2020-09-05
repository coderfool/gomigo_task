const fs = require('fs');
const path = require('path');
const amqp = require('amqplib/callback_api');
const { BSONType } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const amqpUri = process.env.AMQP_URI;

const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

mongoClient.connect(err => {
    collection = mongoClient.db("gomigo").collection("users");    
});

count = 0;

console.log('Waiting for requests');

amqp.connect(amqpUri, (err, conn) => {
    conn.createChannel((err, channel) => {
        channel.consume('userdata', (msg) => {
            const id = msg.content.toString();
            collection.findOne({_id: ObjectId(id)}).then(data => {
                count++;
                const filename = data.filename;
                fs.mkdir('./downloads', () => {});
                fs.writeFile(path.resolve(`./downloads/${filename}`), data.buffer.read(0, data.buffer.length()), () => {
                    console.log(`Downloaded '${filename}' to 'downloads' directory`);
                });
                fs.writeFile(path.resolve('./request_count.txt'), count, () => {
                    console.log('Updated request_count.txt');
                });
            });
        }, {noAck: true});
    });
});