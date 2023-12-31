const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const db = require("./data/database");
const localsMiddleware = require("./middlewares/locals");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const postsRoutes = require("./routes/posts");
const errorRoutes = require("./routes/errorRoutes")
const commentRoutes = require("./routes/comments")
const port = 3000;
const csrf = require("csurf");
const app = express();

const storage = new MongoDBStore({
  uri: "mongodb://localhost:27017",
  databaseName: "check",
  collection: "sessions",
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"));
app.use("/pictures", express.static("pictures"));
app.use(
  session({
    secret: "Super",
    saveUninitialized: false,
    resave: false,
    store: storage,
  })
);
app.use(localsMiddleware);
app.use(csrf());

app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(errorRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(profileRoutes);
app.use(postsRoutes);
app.use(commentRoutes);


db.connectDb()
  .then(function () {
    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((error) => console.error(error));
