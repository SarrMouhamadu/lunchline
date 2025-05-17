import express, { Request, Response } from 'express';
import { addToCart } from '../controllers/cart.controller';

const router = express.Router();

router.post('/', addToCart as express.RequestHandler);

export default router;
