const uploadsRouter = require("express").Router()

uploadsRouter.get("/:id", async (req, res) => {
  res.sendFile(appRoot+"/uploads/"+req.params.id)
})

module.exports = uploadsRouter