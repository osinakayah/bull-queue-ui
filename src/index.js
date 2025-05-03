const express = require('express');
const { Queue } = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const redisConnection = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
}
const queueNames = process.env.QUEUES.split(',')

const queueMqObjects = queueNames.map((queueName)=>{
    return new Queue(queueName, {
        connection: redisConnection,
    })
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const bullAdapters = queueMqObjects.map((queueMqObject)=>{
    return new BullMQAdapter(queueMqObject)
});

createBullBoard({
    queues: bullAdapters,
    serverAdapter: serverAdapter,
});

const app = express();

app.use('/admin/queues', serverAdapter.getRouter());

// other configurations of your server

app.listen(3002, () => {
    console.log('Running on 3002...');
    console.log('For the UI, open http://localhost:3002/admin/queues');
});
