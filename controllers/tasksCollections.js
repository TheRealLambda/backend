const jwt = require("jsonwebtoken")
const tasksCollectionsRouter = require("express").Router()
const TasksCollection = require("../models/tasksCollection")
const TasksList = require("../models/tasksList")
const User = require("../models/user")

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

tasksCollectionsRouter.get("/", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const tasksList = await TasksList.findOne({user: user._id, _id: req.query.tasksListId})

  const tasksCollections = await TasksCollection.find({user: user._id, tasksList: tasksList._id}).populate("tasks")

  res.json(tasksCollections)
})

tasksCollectionsRouter.post("/", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const { name, tasksList } = req.body
  const newTasksCollection = await TasksCollection.create({name, user: user._id, tasksList})

  const updatedTasksList = await TasksList.findById(tasksList)
  const hello = await TasksList.findByIdAndUpdate(tasksList, {tasksCollections: updatedTasksList.tasksCollections.concat(newTasksCollection)}, {new: true})
  res.json(newTasksCollection)
})

module.exports = tasksCollectionsRouter