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
const confirmOrderQueue = new Queue('confirmOrderQueue', {
    redis: redis,
});
const orderQueue = new Queue('orderQueue', {
    redis: redis,
});
const notifyTransferQueue = new Queue('notifyTransferQueue', {
    redis: redis,
});

const bankStatementQueue = new Queue('bankStatementQueue', {
    redis: redis,
});
const notifyDepositQueue = new Queue('notifyDepositQueue', {
    redis: redis,
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [
        new BullAdapter(confirmOrderQueue),
        new BullAdapter(orderQueue),
        new BullAdapter(notifyTransferQueue),

        new BullAdapter(bankStatementQueue),
        new BullAdapter(notifyDepositQueue),
    ],
    serverAdapter: serverAdapter,
});

const app = express();

app.use('/admin/queues', serverAdapter.getRouter());

// other configurations of your server

app.listen(3002, () => {
    console.log('Running on 3002...');
    console.log('For the UI, open http://localhost:3002/admin/queues');
    console.log('Make sure Redis is running on port 6379 by default');
});
