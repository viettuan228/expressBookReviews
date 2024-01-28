const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const user = users.find(user => user.username === username);
return !!user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=> user.username === username && user.password === password);
if(validusers.length > 0) return true;
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in!"});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password,
        username: username
    }, 'fingerprint_customer',{expiresIn: 60 * 360})
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in!");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;

  let book = books[isbn];
  if(!book){
    return req.status(404).json({message: "Book not found!"})
  } 
  const user = req.user.username;

book.reviews[user] = review;
  return res.status(200).json({message: "Review has been added!", data: books});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(!book){
        return res.status(404).json({message: "Book not found!"})
    }
    const user = req.user.username;
    if(!book.reviews[user]){
return res.status(404).json({message: "Review not found for this book in this authenticated user"})
    }
    delete book.reviews[user]
return res.status(200).json({message: "Review has been deleted", data: books})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
