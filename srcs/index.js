const express = require('express');
const cors = require('cors');
require('express-async-errors');
const api = express();

/**
 * * Router definition
 */
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');

/**
 * * API configuration
 */
api.use(cors());
api.use(express.json());
// api.use(express.urlencoded());
const authentication = require('./middlewares/authMiddleware')

/**
 * * API routing
 */
api.use('/auth', authRouter);

api.use('/users', authentication.all, userRouter);

api.use('/categories', categoryRouter);

//* Default error handler
api.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({status: false, message: 'Something broke!'});
});

/**
 * * Start API server
 */
var port = process.env.PORT || 1009;
api.listen(port, () => {
    console.log(`Online Academy API is running at http://localhost:${port}`)
});