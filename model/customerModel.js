const mongoose = require("mongoose");

const customerModel = mongoose.Schema({
  email: String,
  password: String,
  fullname: String,
  phone: String,
  image: String,
});

module.exports = mongoose.model("customers", customerModel);
