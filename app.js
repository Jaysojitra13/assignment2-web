// Add the following declaration at the top of .js files******************************************************************************* ITE5315 – Assignment 2* I declare that this assignment is my own work in accordance with Humber Academic Policy.* No part of this assignment has been copied manually or electronically from any other source* (including web sites) or distributed to other students.** Name: Jay Sojitra Student ID: N01580178 Date: ____________________********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const exphbs = require("express-handlebars");
const fs = require("fs");

// define port
const port = process.env.port || 3000;

// to use required image and css files in public folder
app.use(express.static(path.join(__dirname, "public")));
// setting up template engine as hbs
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

// default route
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

app.get("/name", function (req, res) {
  res.render("productnamesearch");
});

app.get("/id", function (req, res) {
  res.render("productidsearch");
});

app.get("/all", (req, res) => {
  fs.readFile("datasetB.json", (err, data) => {
    if (err) {
      console.log(err);
      res.json("Error in file read");
    }
    const jsonData = JSON.parse(data.toString());

    res.render("alldata", {
      data: jsonData,
    });
  });
});
app
  .route("/data")
  .get((req, res) => {
    fs.readFile("datasetB.json", (err, data) => {
      if (err) {
        console.log(err);
        res.json("Error in file read");
      }
      console.log(data.toString());
      res.json("Data is ready");
    });
  })
  // Step7 and Step8 , Managing both in single post request based on condition
  .post((req, res) => {
    const { productId, productName } = req.body;

    fs.readFile("datasetB.json", (err, data) => {
      if (err) {
        console.log(err);
        res.json("Error in file read");
      }
      const jsonData = JSON.parse(data.toString());

      let foundEle = null;
      if (productId) {
        [foundEle] = jsonData.filter((d) => d.asin === productId);
      }
      if (productName) {
        foundEle = jsonData.filter((d) => d.title.includes(productName));
      }

      if (foundEle) {
        return res.json(foundEle);
      } else {
        return res.json("No data found");
      }
    });
  });

// to get list of users
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});

// error handling route. if any gibberish route will be handled here
app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});

// start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
