const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.query.username;
  const password = req.query.password;

  if(username && password){
      if(!isValid(username)){
          users.push({"username": username,"password":password})
          return res.status(200).json({message:"user registered now you can login"})

      }else{
          return res.status(404).json({message: "user already exists"})
      }
  }
  return res.status(404).json({message: "unable to register user"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const methcall = new Promise((resolve,reject)=>{

    var data = JSON.stringify(books)
    resolve(data)

  })

  methcall.then(
      (data) => res.send(data)
  )

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const methcall = new Promise((resolve,reject)=>{

  var isbn = req.params.isbn
  isbn = parseInt(isbn)
  var data = JSON.stringify(books.filter((book,index) => index === isbn))
  resolve(data)

  })

  methcall.then(
    (data)=>{res.send(data)}
  )
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const methcall = new Promise((resolve,reject)=>{

  var author = req.params.author
  var data = JSON.stringify(books.filter((book) => book.author === author))
  resolve(data)
  })

  methcall.then(
      (data)=>{res.send(data)}
  )
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const methcall = new Promise((resolve,reject)=>{
        //Write your code here
        var title = req.params.title
        var data = JSON.stringify(books.filter((book) => book.title === title))

        resolve(data)
    })

    methcall.then((data) => res.send(data))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  var isbn = req.params.isbn
  isbn = parseInt(isbn)
  var books1 = books.filter((book,index) => index === isbn)
  
  res.send(books1[0].reviews)
});

module.exports.general = public_users;
