var express= require("express");
//var mongojs= require("mongojs");
var axios= require("axios");
var cheerio=require("cheerio");
//var mongoose=require("mongoose");
//var exphbs = require("express-handlebars");

//var PORT=3000;

//var User = require

console.log("\n----------------------------------\n"+
                "----------------------------------\n"+
                "--------------------------------------\ngrabbing right now");

axios.get("https://www.nytimes.com/").then(function(response){
    //console.log(response.data)
    var $ = cheerio.load(response.data);

    var results = [];
    $("article.css-8atqhb").each(function(i, element) {
       //console.log(element);
        //var objNews=$(element).find("article.css-8atqhb");
       // Save the text of the element in a "title" variable
   var title = $(element).text();
//console.log(objNews);
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().find("a").attr("href");
    var addLink="https://www.nytimes.com"+link;
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: addLink
    });

});

console.log(results);
});