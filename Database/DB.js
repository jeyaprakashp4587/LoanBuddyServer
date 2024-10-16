const mongoose = require("mongoose");
//
const DbConfig =
  "mongodb+srv://jeyaprakash:7Nb9FkAwcU7wbN3x@cluster0.pvdaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//
const DB = mongoose.createConnection(DbConfig);
module.exports = { DB };

// 7Nb9FkAwcU7wbN3x
