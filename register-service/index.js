//imports
const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express();
const PORT = 3701;

// parse application/json
app.use(bodyParser.json());

//connect to rabbitmq
async function connect_rabbitmq(){
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    channel.assertQueue('task_queue', { durable: false });
    console.log("Connected to RabbitMQ");
    return channel;
}

//user registry endpoint
app.post('/register', async (req, res) => {
    const user = req.body;
    //save into db

    //publish user created event
    const channel = await connect_rabbitmq();
    channel.sendToQueue('task_queue', Buffer.from(JSON.stringify(user)));
    console.log("User created event published");
    res.status(201).send("User registered successfully");
});

app.listen(PORT, () => {
    console.log(`User registration service listening at http://localhost:${PORT}`);
});