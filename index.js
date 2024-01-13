import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
let title;
let author;
let book;
let subjects;
let img_API_URL;
const API_URL = "https://openlibrary.org/search.json";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});


app.get("/get-book", async (req, res) => {
   try {
     const sub = req.query.topic;
     const result = await axios.get(API_URL + `?language=eng&subject=${sub}&sort=random`);
     const bookList = result.data.docs;
     book = bookList[Math.floor(Math.random() * bookList.length)]

     title = book.title.toUpperCase();
     author = book.author_name[0].toUpperCase();
     subjects = book.subject;
     img_API_URL = `https://api.serpdog.io/images?api_key=659f657576b77d1c274fd2fe&q=${title} by ${author[0]}&gl=us`;
     const img_results = await axios.get(img_API_URL);
     const imgList = img_results.data.image_results;
     
     res.render("index.ejs", {topic: sub, title: title, author: author, subjects: subjects, img_URL: imgList[0].thumbnail});
   } catch (error) {
     console.error('Error in /get-book:', error.message);
     res.status(500).send('Internal Server Error');
   }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
