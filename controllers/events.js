const jwt = require("jsonwebtoken")
const eventsRouter = require("express").Router()
const Event = require("../models/event")
const User = require("../models/user")

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

eventsRouter.get("/all", async (req, res) => {
  console.log("GET /api/events/all")

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = User.findOne({ _id: decodedToken.id})

  const events = await Event.find({ user: user._id})
  res.json(events)
})
eventsRouter.get("/", async (req, res) => {
  console.log("GET /api/events");

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})


  const events = await Event.find({ user: user._id})
  console.log(user);
  // console.log(events.length > 10);
  // events.length > 10 ? await Event.deleteMany({}) : 0

  //{initialPosition: {left: posLeft, top: posTop, height: 75}, week: "current", eventObject: null}
  const modifiedEvents = events.map(event => {
    const eventObject = {
      _id: event._id,
      color: event.color || "#00A36C",
      title: event.title,
      reminder: event.reminder,
      description: event.description,
      activities: event.activities.filter(a=>a!==null),
      tasks: event.tasks.filter(a=>a!==null),
      start_time: event.start_time,
      end_time: event.end_time,
      type: event.type
    }
    // console.log(event)

    const firstDayOfYear = new Date(2024, 1-1, 1)
    const daysUntilFirstSunday = firstDayOfYear.getDay() === 0 ? 0 : 7-firstDayOfYear.getDay()
    
    //get first sunday after first day of year. Calculations will use this as the first day of the year
    const firstSundayOfYear = new Date(firstDayOfYear)
    firstSundayOfYear.setDate(firstSundayOfYear.getDate() + daysUntilFirstSunday)
    
    const numberOfWeeks = Number(req.query.week)
    const period = Number(req.query.period)
    const prevWeekStart = new Date(firstSundayOfYear.getFullYear(), 1-1, firstSundayOfYear.getDate()+period*(numberOfWeeks-1), 0, 0)
    const prevWeekEnd = new Date(firstSundayOfYear.getFullYear(), 1-1, firstSundayOfYear.getDate()+period*(numberOfWeeks-1) + period-1, 23, 59)
  
    const currentWeekStart = new Date(firstSundayOfYear.getFullYear(), 1-1, firstSundayOfYear.getDate()+period*numberOfWeeks)
    const currentWeekEnd = new Date(firstSundayOfYear.getFullYear(), 1-1, firstSundayOfYear.getDate()+period*numberOfWeeks + period-1, 23, 59)
  
    const nextWeekStart = new Date(firstSundayOfYear.getFullYear(), 1-1, firstSundayOfYear.getDate()+period*(numberOfWeeks+1), 0, 0)
    const nextWeekEnd = new Date(firstSundayOfYear.getFullYear(), 1-1, firstSundayOfYear.getDate()+period*(numberOfWeeks+1) + period-1, 23, 59)
    
    let week = null
    if(new Date(event.start_time).getTime() >= prevWeekStart.getTime() && new Date(event.start_time).getTime() <= prevWeekEnd.getTime()) {
      week = "prev"
    } else if(new Date(event.start_time).getTime() >= currentWeekStart.getTime() && new Date(event.start_time).getTime() <= currentWeekEnd.getTime()) {
      week = "curr"
    } else if(new Date(event.start_time).getTime() >= nextWeekStart.getTime() && new Date(event.start_time).getTime() <= nextWeekEnd.getTime()) {
      week = "next"
    }

    return {...eventObject, week}
  }).filter(event => event !== undefined)
  res.json(modifiedEvents)
})

eventsRouter.patch("/:id", async (req, res) => {

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})

  const _id = req.params.id
  const {color, title, reminder, description, activities, tasks, start_time, end_time, type} = req.body
  const event = await Event.findOne({_id})
  // console.log("event.user", event.user, "\nuser._id", user._id, event.user.toString() === user._id.toString());
  if(event.user.toString() !== user._id.toString()) {
    console.log("Non-authorized access to event");
    return res.json({error: "Non-authorized access to event"})
  }

  if(event) {
    console.log(true);
    event.color = color
    event.title = title
    event.reminder = reminder
    event.description = description
    event.activities = activities
    event.tasks = tasks
    event.start_time = start_time
    event.end_time = end_time
    event.type = type
    await event.save()
  }
  res.json(event)
})

eventsRouter.get("/:id", async (req, res) => {
  console.log("GET /api/events/"+req.params.id)
  const _id = req.params.id
  const event = await Event.findOne({_id})
  console.log(event);
  res.json(event)
})



eventsRouter.post("/", async (req, res) => {
  console.log("POST /api/events", req.body);
  const body = req.body
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({_id: decodedToken.id})

  const newEvent = await Event.create({...body, user: user._id})
  user.events = user.events.concat(newEvent._id)
  await user.save()

  console.log();
  res.json(newEvent)
})

eventsRouter.patch("/:id/activity", async (req, res) => {
  const activity = req.body
  const _id = req.params.id
  const event = await Event.findOne({_id})

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})
  if(event.user !== user._id) {
    return res.json({error: "Non-authorized access to event"})
  }

  event.activities.push(activity)
  await event.save()
  res.json(event)
})

eventsRouter.patch("/:id/task", async (req, res) => {
  console.log("PATCH /api/events/:id/task", req.body);
  const task = req.body
  const _id = req.params.id
  const event = await Event.findOne({_id})

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = await User.findOne({ _id: decodedToken.id})
  if(event.user !== user._id) {
    return res.json({error: "Non-authorized access to event"})
  }

  event.tasks.push(task)
  await event.save()
  res.json(event)
})

eventsRouter.delete("/:id", async (req, res) => {
  const _id = req.params.id

  const event = await Event.findOne({_id})

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken) {
    return res.json({error: "Error"})
  }
  const user = User.findOne({ _id: decodedToken.id})
  if(event.user !== user._id) {
    return res.json({error: "Non-authorized access to event"})
  }

  await event.deleteOne()
  res.json(event)
})

eventsRouter.post("/delete", async (req, res) => {
  const course_crn = req.body.crn
  console.log(course_crn);
  const result = await Event.deleteMany({course_crn})
  console.log(result);
  res.json(result)
})

eventsRouter.post("/search", async (req, res) => {
  const events = (await Event.find()).filter(event => req.body.search_text.length > 0 && event.title.includes(req.body.search_text) && new Date(event.start_time) > new Date(req.body.start_time) && new Date(event.end_time) < new Date(req.body.end_time))
  res.json(events)
})

module.exports = eventsRouter