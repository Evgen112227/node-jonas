const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');

//param middleware
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.alliasTopTour, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
