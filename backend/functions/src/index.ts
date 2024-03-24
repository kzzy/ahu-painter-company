import { onRequest } from 'firebase-functions/v2/https';
import * as express from 'express';
import { getStock, updateStock, getLastUpdate } from './controllers/paintController'

const app = express();

// API Endpoints for getting and updating paint inventory information
app.get("/paint", getStock);
app.get("/paint/last", getLastUpdate);
app.patch("/paint/:colour", updateStock);

exports.app = onRequest(app);