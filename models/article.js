const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
  title: String,
  text: String,
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }],
  image: String
})

module.exports = mongoose.model("Article", articleSchema)