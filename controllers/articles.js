const articlesRouter = require("express").Router()
const Article = require("../models/article")

articlesRouter.get("/", async (req, res) => {
  const articles = await Article.find()
  console.log(articles);
  res.send(articles)
})

articlesRouter.get("/:id", async (req, res) => {
  const id = req.params.id
  console.log(id);
  const article = await Article.findById(id)
  console.log(article);
  res.send(article)
})

articlesRouter.post("/", async (req, res) => {
  const body = req.body
  const createdArticle = await Article.create(body)
  res.send(createdArticle)
})

module.exports = articlesRouter