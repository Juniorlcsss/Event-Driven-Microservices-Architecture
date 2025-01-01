//imports
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const app = express();
const PORT = 3702;

//connect
async function connect(){
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('task_queue');

    channel.consume('task_queue', async (msg) => {
        const user = JSON.parse(msg.content.toString());
        console.log(`User created: ${msg.content.toString()}`);
        
        channel.ack(msg.content.toString());
    });

    return channel;
}

connect();

app.listen(PORT, ()=>{
    console.log(`User registration service listening at http://localhost:${PORT}`);
})