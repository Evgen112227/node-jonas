const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//----------------------- MIDDLEWARES ---------------------------

//express.json() - middleware(it stands in the middle of the request and response). It is just a function that can modify incoming request data
//it is just a step that request goes through while its being processed
app.use(morgan('dev'));
//this middleware adds:
//2023-01-24T11:37:45.224Z
//GET /api/v1/tours 200 2.509 ms - 8555

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from MW🤪');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// req.params - is where all variables that we define stores
// :id? - with questionmark it is optional parameter
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//to use middleware tourRouter for this specific route /api/v1/tours
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
