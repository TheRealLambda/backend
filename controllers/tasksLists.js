const jwt = require("jsonwebtoken")
const tasksListsRouter = require("express").Router()
const TasksList = require("../models/tasksList")
const User = require("../models/user")

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

tasksListsRouter.get("/", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const tasksLists = await TasksList.find({user: user._id}).populate("tasksCollections")

  res.json(tasksLists)
})

tasksListsRouter.get("/:id", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const tasksLists = await TasksList.findOne({user: user._id, _id: req.params.id})

  res.json(tasksLists)
})

tasksListsRouter.post("/", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const { name } = req.body
  const newTasksList = await TasksList.create({name, user: user._id})

  res.json(newTasksList)
})

module.exports = tasksListsRouter