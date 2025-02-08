const mongoose = require("mongoose")

const tasksListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  tasksCollections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TasksCollection"
    }
  ]
})

module.exports = mongoose.model("TasksList", tasksListSchema)