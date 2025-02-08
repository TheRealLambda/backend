const jwt = require("jsonwebtoken")
const coursesRouter = require("express").Router()
const Course = require("../models/course")
const User = require("../models/user")
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

coursesRouter.get("/", async (req, res) => {
  console.log("GET /api/courses");

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const course_term = req.query.term
  const course_department = req.query.department
  console.log(course_term)
  console.log(course_department)
  console.log(await Course.find({course_department: "Accounting & Finance"}))
  const courses = await Course.find({course_term, course_department})

  res.json(courses)
})


coursesRouter.post("/", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const course = req.body
  console.log(course);
  const newCourse = await Course.create(course)
  res.json(newCourse)
})

module.exports = coursesRouter