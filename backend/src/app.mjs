import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/epicerie.routes.mjs';
import { notFound, errorHandler } from './middlewares/error.middleware.mjs';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/grocery', itemRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;