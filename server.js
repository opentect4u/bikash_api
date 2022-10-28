const express = require("express"),
  app = express(),
  cors = require('cors'),
  session = require("express-session"),
  path = require("path"),
  port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/assets"));

app.set("view engine", "ejs");

// USING CORS //
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SET SESSION
app.use(
  session({
    secret: "ARDB",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);

app.use((req, res, next) => {
  res.locals.active = req.path.split("/")[2];
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.get("/", (req, res) => {
  //   res.send("Hi Subham");
  // res.render("login/login");
  res.redirect('/admin/login')
});

const { adminRouter } = require("./routes/adminRouter");
const { apiRouter } = require("./routes/apiRouter");

app.use("/admin", adminRouter);
app.use("/api", apiRouter);

// app.get("/admin_master", (req, res) => {
//   res.render("admin/ardb_master_view");
// });

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`App is running at port ${port}`);
});
