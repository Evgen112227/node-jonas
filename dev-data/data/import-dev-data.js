const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful');
  });

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
//IMPORT DATA TO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfullt loaded 🔃🔃🔃🔃🔃');
  } catch (err) {
    console.log(err);
  }
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted 😥😥😥😥😥');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
