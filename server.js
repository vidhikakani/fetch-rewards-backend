var express = require("express");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var controller = require("./controllers/fetchController");
var router = require("./routers/router");

// MongoDB setup

mongoose
    .connect(`mongodb://localhost:27017/fetch`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch(console.error);
mongoose.connection.on("error", (err) => {
    console.log("err", err);
});
mongoose.connection.on("connected", () => {
    console.log("mongoose is connected");
});

// App setup
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Controllers
const fetchController = new controller();

// Router
const fetchRouter = new router(fetchController);

// Setup Routes
app.use("/api", fetchRouter.router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
