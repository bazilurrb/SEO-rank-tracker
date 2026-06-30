import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
// import keywordRouter from './routes/keywordRoutes.js';
import rankRouter from './routes/rankRoutes.js';


dotenv.config();

connectDB();

const app = express()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running...'));
app.use("/api/auth", authRouter);
app.use("/api/rank", rankRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));