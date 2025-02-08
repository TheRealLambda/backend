const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  start_time: String,
  end_time: String,
  color: String,
  title: String,
  reminder: String,
  description: String,
  activities: [{
    title: String,
    description: String
  }],
  tasks: [{
    title: String,
    description: String
  }],
  type: String,
  course_instructor: String,
  course_crn: String,
  course_location: String,
  course_type: String,
})

module.exports = mongoose.model("Event", eventSchema)