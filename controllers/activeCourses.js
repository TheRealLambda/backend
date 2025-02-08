const jwt = require("jsonwebtoken")
const activeCoursesRouter = require("express").Router()
const ActiveCourse = require("../models/activeCourse")
const Course = require("../models/course")
const Term = require("../models/term")
const Event = require("../models/event")
const User = require("../models/user")

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const createClassEvents = async (course_id, user) => {
  console.log("CREATING CLASS EVENTS");

  function getDaysBetweenDates(start, end, dayName) {
    var result = [];
    var days = {u:0,m:1,t:2,w:3,r:4,fri:5,sat:6};
    var day = days[dayName.toLowerCase()];
    // Copy start date
    var current = new Date(start);
    // Shift to next of required days
    current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
    // While less than end date, add dates to result array
    while (current < end) {
      result.push(new Date(+current));
      current.setDate(current.getDate() + 7);
    }
    return result;  
  }

  // const course_crn = course[0].crn
  // const course_instructor = course[0].instructor
  // const course_location = course[0].location
  // const course_type = course[0].type

  const course = await Course.findOne({_id: course_id})
  // console.log("\nTTTEEERRRMMM:::", course.course_term);
  // console.log("\nTTTEEERRRMMM:::", await Term.find({}));
  const term = await Term.findOne({term_number: course.course_term})

  const title = course.course_name
  const {course_crn, course_instructor, course_location, course_type} = course
  // console.log(term, title, course_crn, course_instructor, course_location, course_type)
  

  const start_hour = course.course_time.substring(0,2)
  const start_minute = course.course_time.substring(2,4)
  const end_hour = course.course_time.substring(5,7)
  const end_minute = course.course_time.substring(7,9)
  // console.log(start_hour, start_minute, end_hour, end_minute)

  const dayString = course.course_days
  const days = [...dayString].map(char => {
    return getDaysBetweenDates(new Date(term.term_start), new Date(term.term_end), char)
  }).flat()

  

  const result = await Promise.all(days.map(async (day) => {
    const start_time = new Date(day)
    start_time.setHours(start_hour, start_minute)
    const end_time = new Date(day)
    end_time.setHours(end_hour, end_minute)

    const newClass = {
      user: user._id,
      type: "class",
      title,
      start_time,
      end_time,
      course_instructor,
      course_crn,
      course_location,
      course_type
    }

    return newClass
  }))
  await Event.create(result)
  console.log("\n", result)
  return result
}

activeCoursesRouter.get("/", async (req, res) => {
  console.log("GET /api/active-courses");

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const result = await ActiveCourse.find({user: user._id})
  const courses = await Promise.all(result.map(activeCourse => activeCourse.populate({path: "course_id"})))
  console.log(result, "\n", courses);
  res.json(courses)
})

activeCoursesRouter.post("/", async (req, res) => {
  console.log("POST /api/active-courses");

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const course_id = req.body.course_id
  const term = req.body.term
  console.log("course_id =", course_id);
  console.log("term =", term);
  console.log(await ActiveCourse.find({course_id}) == false)
  if(await ActiveCourse.find({course_id, user: user._id}) == false) {
    console.log("TTTTTTTTTTTTTTT");
    const result = await ActiveCourse.create({user: user._id, course_id, term})
    console.log("result========:", result);
    const course = await result.populate({path: "course_id"})
    console.log("COURSE========:", course);
    
    const events = await createClassEvents(course_id, user)
  
    res.json(course)
  } else {
    console.log("FFFFFFFFFFFFFFFF");
    res.json({error: "Error"})
  }
})

activeCoursesRouter.delete("/:id", async (req, res) => {
  console.log("DELETE /api/active-courses");

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const _id = req.params.id
  console.log("\n==========\n_id =", _id, "\nuser =", user, "\n==========\n");
  const activeCourse = await ActiveCourse.findOne({_id, user: user._id}).populate({path: "course_id"})
  if(activeCourse) {
    console.log(true);
    await activeCourse.deleteOne()
    const classEvents = await Event.deleteMany({type: "class", title: activeCourse.course_id.course_name})
    res.json(classEvents)
  } else {
    console.log(false);
    res.json({note: "does not exist"})
  }
})

module.exports = activeCoursesRouter