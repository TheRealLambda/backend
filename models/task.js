const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  tasksCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TasksCollection"
  },
  title: String,
  description: String,
  date: String,
  completed: Boolean
})

module.exports = mongoose.model("Task", taskSchema)