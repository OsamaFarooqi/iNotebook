// to connect with db
const mongoose = require("mongoose");
const mongooseURI = "mongodb://localhost:27017/";

const conenctToMongo = () => {
  mongoose.connect(mongooseURI);
  console.log("Connected to MongoDB");
};

module.exports = conenctToMongo;
