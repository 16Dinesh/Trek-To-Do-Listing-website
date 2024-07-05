const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");

// Routers
const listingsRouter = require('./routes/listings.js');
const reviewsRouter = require('./routes/review.js');

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/TrekToDo")
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// home page
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});


// Routes
app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);

// Error Test
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found?"))
});

// Error Handler 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SomeThing Went Wrong!" } = err;
    res.status(statusCode).render("listings/error", { err });
    // res.status(statusCode).send(message);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});