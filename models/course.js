const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
  course_term: String,
  course_name: String,
  course_type: String,
  course_crn: String,
  course_instructor: String,
  course_days: String,
  course_time: String,
  course_location: String,
  course_department: String
})

module.exports = mongoose.model("Course", courseSchema)