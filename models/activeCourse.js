const mongoose = require("mongoose")

const activeCourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  term: String,
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
})

module.exports = mongoose.model("ActiveCourse", activeCourseSchema)