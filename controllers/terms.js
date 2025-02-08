const termsRouter = require("express").Router()
const Term = require("../models/term")

termsRouter.get("/", async (req, res) => {
  const terms = await Term.find({})
  res.json(terms)
})

module.exports = termsRouter