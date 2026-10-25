import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import todoRouter from './routes/todoRouter.js';
import adminRouter from './routes/adminRouter.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/auth', authRouter);
app.use('/todos', todoRouter);
app.use('/admin', adminRouter);


app.listen(PORT, () => {
  console.log(`The server is listening PORT: ${PORT}`);
});