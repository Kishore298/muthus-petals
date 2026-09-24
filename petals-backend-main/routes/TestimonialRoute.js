import express from 'express';
import { createtestimonial, deleteTestimonail, getTestimonail, updateTestimonial } from '../controllers/CreateTestimonial.js';

const route = express.Router();

route.post('/createtestimonial', createtestimonial);
route.get('/gettestimonial', getTestimonail);
route.delete('/deletetestimonial/:id', deleteTestimonail);
route.put('/updatetestimonial/:id', updateTestimonial);

export default route;
