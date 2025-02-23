const tagsRouter = require("express").Router()
const Tag = require("../models/tag")

tagsRouter.get("/", async (req, res) => {
  const tags = await Tag.find()
  console.log(tags);
  res.send(tags)
})

tagsRouter.post("/", async (req, res) => {
  const body = req.body
  const createdTag = await Tag.create(body)
  console.log(createdTag);
  res.send(createdTag)
})

module.exports = tagsRouter