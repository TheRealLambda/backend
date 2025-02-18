const config = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const eventsRouter = require("./controllers/events")
const coursesRouter = require("./controllers/courses")
const termsRouter = require("./controllers/terms")
const activeCoursesRouter = require("./controllers/activeCourses")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const mongoose = require("mongoose")
const tasksCollectionsRouter = require("./controllers/tasksCollections")
const tasksRouter = require("./controllers/tasks")
const tasksListsRouter = require("./controllers/tasksLists")
const path = require("path")
const articlesRouter = require("./controllers/articles")


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))
app.use(middleware.requestLogger)

app.use("/api/events", eventsRouter)
app.use("/api/courses", coursesRouter)
app.use("/api/terms", termsRouter)
app.use("/api/active-courses", activeCoursesRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use("/api/tasks-lists", tasksListsRouter)
app.use("/api/tasks-collections", tasksCollectionsRouter)
app.use("/api/tasks", tasksRouter)
app.use("/api/articles", articlesRouter)

app.get('*', (req,res) =>{
  // console.log("Here");
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)






module.exports = app