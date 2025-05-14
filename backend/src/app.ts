import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './configs/db.config';
import userRoutes from './routes/user.route';
import menuRoutes from './routes/menu.route';
import orderRoutes from './routes/order.route';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;