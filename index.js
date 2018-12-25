//npm Packages
const express        = require('express');
const mongoose       = require('mongoose');
const bodyParser     = require('body-parser');
const fileUpload     = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo   = require("connect-mongo");
const connectFlash   = require("connect-flash");

//Route Controllers
const createPostController  = require('./controllers/createPost');
const homePageController    = require('./controllers/homePage');
const newPostController     = require('./controllers/newPost');
const getPostController     = require('./controllers/getPost');
const createUserController  = require('./controllers/createUser');
const newUserController     = require('./controllers/newUser');
const loginController       = require('./controllers/login');
const loginUserController   = require('./controllers/loginUser');
const logoutController      = require('./controllers/logout');

//Middlewares
const newPost      = require('./middleware/newPost');
const auth         = require('./middleware/auth');
const authRedirect = require('./middleware/authredirect');

const app = new express();

mongoose.connect("mongodb://localhost/blog_db",  { useNewUrlParser: true })
  .then(() => 'You are now connected to Mongo!')
  .catch(err => console.error('Something went wrong', err));

const mongoStore = connectMongo(expressSession); //to store sessions in the database

app.use(expressSession({
  secret: 'thisisthesecretkeytoencryptsession',
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  })
}))

app.set("view engine", "ejs");
app.use(fileUpload());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(connectFlash());

app.use(function(req, res, next){
	res.locals.currentUser = req.session.userId;
	next();
})

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", auth, createPostController);
app.post("/posts/new", newPost, newPostController);
app.get('/user/register', authRedirect, createUserController);
app.post('/user/register', authRedirect, newUserController);
app.get('/user/login', authRedirect, loginController);
app.post('/user/login', authRedirect, loginUserController);
app.get('/user/logout',logoutController);

app.listen(3000, ()=>{
  console.log("Server started on port 3000")
});
