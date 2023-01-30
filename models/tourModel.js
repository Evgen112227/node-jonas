const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equalt then 40 characters',
      ],
      minlength: [10, 'A tour name must have at least 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tourmust have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: `Difficulty must be either 'easy', 'medium', 'difficult'`,
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below or equal 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a type'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this points to current doc on NEW document creation
          return val < this.price; // 100 < 200 priceDiscount should be less than price
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document middleware runs before save() and .create()
tourSchema.pre('save', function (next) {
  //this pointing to document
  this.slug = slugify(this.name, { lower: true });
  next();
});

//post middleware function executed after all pre functions completed
// tourSchema.post('save', function(doc, next) {
//   next();
// })

//Query middleware
tourSchema.pre(/^find/, function (next) {
  //this pointing to query
  this.find({
    secretTour: { $ne: true },
  });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  next();
});

//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  //this point to current aggreagation document
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//name of the model and schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
