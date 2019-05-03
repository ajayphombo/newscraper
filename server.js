var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapedDb";
var PORT = 3000;
var db = require("./models");
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout:"main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);
console.log("\n----------------------------------\n" +
    "----------------------------------\n" +
    "--------------------------------------\ngrabbing right now");
app.get("/scrape", function (req, res) {
    db.News.find({}).then(function(currentNews){
        let currentTitle= currentNews.map(function(news){
             return news.title;
        });
    

    axios.get("https://www.nytimes.com/").then(function (response) {
        //console.log(response.data)
        var $ = cheerio.load(response.data);
        var articleArr=[];
    
        $("article.css-8atqhb").each(function (i, element) {
            var results = {};

            var title = $(element).text();
            var link = $(element).children().find("a").attr("href");
            var addLink = "https://www.nytimes.com" + link;

            results.title = title;
            results.link = addLink;

if(results.title){
    if(!currentTitle.includes(results.title)){
        articleArr.push(results);
    }
}
});

            db.News.create(articleArr)
                .then(function (dbNews) {
                    res.render("index", { dbNews });

                })
                .catch(function (err) {
                    console.log(err);
                });

        
    });
    });

});

app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.News.find({})
        .then(function (dbNews) {
            // If we were able to successfully find Articles, send them back to the client
            res.render("index", { dbNews });
            //console.log(dbNews);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



app.get("/clear", function (req, res) {
    // Grab every document in the Articles collection
    db.News.deleteMany({})
        .then(function (dbNews) {
            // If we were able to successfully find Articles, send them back to the client
            res.redirect("/");
            //console.log(dbNews);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

