const mongoose = require("mongoose")

const tasksCollectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  tasksList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TasksList"
  },
  name: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ]
})

module.exports = mongoose.model("TasksCollection", tasksCollectionSchema)