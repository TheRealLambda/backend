const express = require("express")
const app = express()
const path = require("path")

const PORT = process.env.PORT || 8080

app.use(express.static("dist"))

app.get('*', (req,res) =>{
  console.log("Here");
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});
app.listen(PORT, (error) => console.log("Server started..."))

// app.use((req, res, next) => {
//   console.log(req.url)
//   // console.log(__dirname);
//   next()
// })

// const items = [
//   {
//     name: "albaik",
//     rating: "magnificinet"
//   },
//   {
//     name: "raik",
//     rating: "amazing"
//   },
//   {
//     name: "mxconalds",
//     rating: "crap"
//   }
// ]

// app.get("/api/items", async (req, res) => {
//   res.send(items)
// })
