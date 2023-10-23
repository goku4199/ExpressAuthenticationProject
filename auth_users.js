const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

var userlist = users.filter((user)=>user.username===username)
if(userlist.length > 0){
    return true;
}else{
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    var authuser = users.filter((user)=>{return (user.username === username && user.password == password)})

    if(authuser.length > 0){
        return true
    }else{
        return false
    }

}

regd_users.get("/login",(req,res)=> {
    console.log("444")
})

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if(!username || !password){
      return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username,password)){

    let accessToken = jwt.sign({
        data:password
    }, 'access', {expiresIn: 60*60})

    req.session.authorization={
        accessToken,username
    }

    return res.status(200).send("User successfully logged in")
  }else{
      res.status(404).json({message: "Invalid login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //console.log(req);
  var isbn = req.params.isbn
  var user = req.session.authorization.username
  var review = req.query.review

  if(!review || !user || !isbn){
    res.send("one of field is empty")
  }else{
      books[isbn].reviews[user] = review;
      res.send(books[isbn])
  }

});

regd_users.delete("/auth/review/:isbn",(req,res) => {
    var isbn = req.params.isbn
    var user = req.session.authorization.username

    if(!user || !isbn){
        res.send("one of field is empty")
    }else{
          delete books[isbn].reviews[user]
          res.send(books[isbn])
    }

})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
