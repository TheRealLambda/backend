const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
  title: String,
  text: String
})

module.exports = mongoose.model("Article", articleSchema)