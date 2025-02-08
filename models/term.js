const mongoose = require("mongoose")

const termSchema = new mongoose.Schema({
  term_start: String,
  term_end: String,
  term_number: String,
})

module.exports = mongoose.model("Term", termSchema)