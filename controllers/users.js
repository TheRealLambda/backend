const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  console.log("YAYAYAY");
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    name,
    passwordHash,
  })


  response.status(201).json(user)
})

module.exports = usersRouter