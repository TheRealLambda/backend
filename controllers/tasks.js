const jwt = require("jsonwebtoken")
const tasksRouter = require("express").Router()
const Task = require("../models/task")
const User = require("../models/user")
const TasksCollection = require("../models/tasksCollection")

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

tasksRouter.get("/", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const tasks = await Task.find({user: user._id}).populate("tasksCollection")

  res.json(tasks)
})

tasksRouter.post("/", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  
  const { title, description, date, tasksCollectionId } = req.body
  const tasksCollection = await TasksCollection.findOne({_id: tasksCollectionId})
  console.log(tasksCollection);
  const newTask = await Task.create({title, description, date, tasksCollection: tasksCollectionId, user: user._id})
  tasksCollection.tasks = tasksCollection.tasks.concat(newTask._id)
  await tasksCollection.save()

  res.json(newTask)
})

tasksRouter.patch("/:id", async (req, res) => {
  const body = req.body
  const _id = req.params.id
  const task = await Task.findOne({_id})

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  if(user._id.toString() !== task.user.toString()) {
    return res.json({error: "Non-authorized access to task"})
  }


  if(body.tasksCollection) {
    const oldCollection = await TasksCollection.findById(task.tasksCollection)
    console.log("[Before] oldCollection:", oldCollection);

    oldCollection.tasks = oldCollection.tasks.filter(t => {
      console.log(t.toString(), "===", task._id.toString(), t.toString() === task._id.toString());
      if(t.toString() === task._id.toString()) {
        return false
      } else { 
        return true
    }})

    await oldCollection.save()
    console.log("[After] oldCollection:", oldCollection);

    const newCollection = await TasksCollection.findById(body.tasksCollection)
    newCollection.tasks = newCollection.tasks.concat(task._id)
    await newCollection.save()
  }
  const updatedTask = await Task.findByIdAndUpdate(_id, body, {new: true})
  res.json(updatedTask)
})

module.exports = tasksRouter