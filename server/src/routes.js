import express from 'express';
import prisma from './prismaClient.js';
import { verifyToken } from './authMiddleware.js';
import * as controller from './controller.js'; 
import { validateFlight } from './validation.js';
import { getAirlines } from './controller.js'; 

const router = express.Router();

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser); 
router.get('/airlines', getAirlines); 

router.get('/flights', verifyToken, controller.getFlights);
router.post('/flights', verifyToken, validateFlight, controller.createFlight);

router.get('/flights/stats', verifyToken, controller.getStats);

router.get('/flights/:id', verifyToken, controller.getFlightById);

router.put('/flights/:id', verifyToken, validateFlight, controller.updateFlight);
router.delete('/flights/:id', verifyToken, controller.deleteFlight);

export default router;