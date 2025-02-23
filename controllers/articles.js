const articlesRouter = require("express").Router()
const Article = require("../models/article")
const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads")
  },
  filename: (req, file, callback) => {
    callback(null, Date.now()+"_"+file.originalname)
  }
})
const upload = multer({storage})

articlesRouter.get("/", async (req, res) => {
  const articles = await Article.find().populate("tags")
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

articlesRouter.post("/", upload.single("img"), async (req, res) => {
  const img = req.file
  console.log(img)
  const { title, text, tags } = req.body
  console.log(JSON.parse(tags));
  const createdArticle = await Article.create({title, text, tags: JSON.parse(tags), image: img.filename})
  res.send(createdArticle)
})


module.exports = articlesRouter