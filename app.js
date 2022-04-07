const express = require("express");

const exhbs = require("express-handlebars");

const path = require("path");
const indexRouter = require("./routes/index.routes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const router = require("./routes/auth");
const methodOverride = require("method-override");
const storyRouter = require("./routes/stories");
const app = express();

// hbs helper functions
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// require passport file from config
require("./config/passport")(passport);
const layoutspath = path.join(__dirname, "./views/layouts");
const viewspath = path.join(__dirname, "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Sessions
app.use(
  session({
    secret: "abcdefg",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "mySessions",
    }),
  })
);

// passport middlware
app.use(passport.initialize());
app.use(passport.session());

// set global variable

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(express.static("./public"));
app.use("/css", express.static("public"));
app.use("/img", express.static("public"));

const hbs = exhbs.create({
  extname: ".hbs",
  helpers: { formatDate, stripTags, truncate, editIcon, select },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", viewspath);

// routes
app.use("/", indexRouter);
app.use("/auth", router);
app.use("/stories", storyRouter);

app.use((req, res, next) => {
  res.render("error/404");
});
module.exports = app;
