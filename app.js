const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    async function all() {
      const list = await Article.find({});
      res.send(list);
    }
    all();
  })
  .post(function (req, res) {
    const temp = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    temp.save();
    res.send("Successfully Added!");
  })
  .delete(function (req, res) {
    async function all() {
      await Article.deleteMany({});
      res.send("Done!");
    }
    all();
  });

app
  .route("/articles/:title")
  .get(function (req, res) {
    async function data(temp) {
      res.send(await Article.findOne({ title: temp }));
    }
    data(req.params.title);
  })
  .put(function (req, res) {
    async function Update(){
    await Article.updateOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content }
    );
    res.send("Done!")
    }
    Update();
  })
  .patch(function (req, res) {
    async function Update(){
    await Article.updateOne(
      { title: req.params.title },
      {$set:req.body}
    );
    res.send("Done!")
    }
    Update();
  })
  .delete(function (req, res) {
    async function one() {
      await Article.deleteOne({title:req.params.title});
      res.send("Done!");
    }
    one();
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
