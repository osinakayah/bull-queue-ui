const express = require('express');
const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const redis = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
}
const queueNames = process.env.QUEUES.split(',')
const queueObjects = queueNames.map((queueName)=>{
    return new Queue(queueName, {
        redis: redis,
    })
});

const bullAdapters = queueObjects.map((queueObject)=>{
    return new BullAdapter(queueObject)
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: bullAdapters,
    serverAdapter: serverAdapter,
});

const app = express();

app.use('/admin/queues', serverAdapter.getRouter());

// other configurations of your server

app.listen(3002, () => {
    console.log('Running on 3002...');
});
