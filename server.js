import 'express-async-errors';
import morgan from 'morgan';
import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleWare from './middleware/error-handler.js';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import authRouter from './routes/authRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';

const app = express();
dotenv.config();

// db and authenticateUser

// routers

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ msg: 'Welcome!' });
})

app.get('/api/v1', (req, res) => {
    res.json({ msg: 'API!' });
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 5001

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error);
    }
}

start();