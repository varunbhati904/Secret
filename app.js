const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userdb", {useNewUrlParser: true ,  useUnifiedTopology: true});
app.use(express.static("public"));
app.set("view engine", 'ejs');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, {secret: secret, encyptedFields: ["password"], excludeFromEncryption: ['email'] });

const User = mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
})

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.find({email: username},function(err, foundUser){
    if(err){
      console.log(err)
    }else{
      if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  }
});
});

app.listen(3000,function(){
  console.log("server is running on port 3000");
});
