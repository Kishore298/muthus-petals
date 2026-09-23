import express from 'express';
import { createtestimonial, deleteTestimonail, getTestimonail } from '../controllers/CreateTestimonial.js';

const route = express.Router();

// ✅ was '/createtestmonial' — missing the 'i'
route.post('/createtestimonial', createtestimonial);

// ✅ was '/getTestimonial' — capital T didn't match frontend's lowercase
route.get('/gettestimonial', getTestimonail);

route.delete('/deletetestimonial/:id', deleteTestimonail);

export default route;
