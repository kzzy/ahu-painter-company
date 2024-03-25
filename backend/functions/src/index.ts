import { onRequest } from 'firebase-functions/v2/https';
import * as express from 'express';
import { getStock, updateStock, getLastUpdate, updateLastUpdate } from './controllers/paintController'
import { createDBUser, updateDBUser, deleteDBUser, deleteFBAuthUser, createFBAuthUser } from './controllers/usersController';

const app = express();

// Endpoints for getting and updating paint inventory information
app.get("/paint", getStock);
app.patch("/paint/:colour", updateStock);
app.get("/paint/last", getLastUpdate);
app.patch("/paint/last/update", updateLastUpdate);

// Endpoints for managing users in the database
app.put('/user/create', createDBUser);
app.patch('/user/:userID', updateDBUser);
app.delete('/user/delete', deleteDBUser)

// Endpoints for managing users in Firebase Auth
app.put('/authuser/create', createFBAuthUser)
app.delete('/authuser/delete', deleteFBAuthUser)

exports.app = onRequest(app);