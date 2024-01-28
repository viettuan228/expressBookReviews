const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body

  if(username && password){
    if(isValid){
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "User successfully registed!"})
    }else{
        return res.status(404).json({message: "User already exist"})
    }
  }
});
 
// Get the book list available in the shop
public_users.get('/',function (req, res) {
const promise = new Promise((resolve, reject)=>{
setTimeout(()=>{
const data = books;
resolve(data)
}, 1000)});
promise.then((data)=>{
    res.status(200).json({message: "Get the book list successfully", data: data})
}).catch((error) => {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  });

  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const promise = new Promise((resolve, reject)=>{
        setTimeout(()=>{
        const data = books[isbn];
        resolve(data)
        }, 1000)});

        promise.then((data)=>{
            if(data){
                res.status(200).json({message: "Get the book by isbn successfully", data: data})
            } else{
                res.status(404).json({message: "ISBN is invalid", data: {}})
            }         
        }).catch((error) => {
            console.error('Error fetching data:', error.message);
            res.status(500).json({ message: 'Internal server error' });
          });
        
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author}=req.params;

      const promise = new Promise((resolve, reject)=>{
        setTimeout(()=>{
        const data = Object.keys(books).reduce((acc, cur) => {
        if(books[cur].author === author){
             acc.push(books[cur])
            }
        return acc;
        },[]);
        resolve(data)
        }, 1000)});

    promise.then((data)=>{
            if(data){
                res.status(200).json({message: "Get the book by author successfully", data: data})
            } else{
                res.status(404).json({message: "Author is invalid", data: {}})
            }         
        }).catch((error) => {
            console.error('Error fetching data:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const {title}=req.params;

    const promise = new Promise((resolve, reject)=>{
      setTimeout(()=>{
      const data = Object.keys(books).reduce((acc, cur) => {
      if(books[cur].title === title){
           acc.push(books[cur])
          }
      return acc;
      },[]);
      resolve(data)
      }, 1000)});

  promise.then((data)=>{
          if(data && data.length > 0){
              res.status(200).json({message: "Get the book by title successfully", data: data})
          } else{
              res.status(404).json({message: "Title is invalid", data: {}})
          }         
      }).catch((error) => {
          console.error('Error fetching data:', error.message);
          res.status(500).json({ message: 'Internal server error' });
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const {isbn}=req.params;

    const promise = new Promise((resolve, reject)=>{
      setTimeout(()=>{
      const data = books[isbn].reviews;
      resolve(data)
      }, 1000)});

  promise.then((data)=>{
          if(data && data.length > 0){
              res.status(200).json({message: "Get the book reviews by isbn successfully", data: data})
          } else{
              res.status(404).json({message: "ISBN is invalid", data: {}})
          }         
      }).catch((error) => {
          console.error('Error fetching data:', error.message);
          res.status(500).json({ message: 'Internal server error' });
      });
});

module.exports.general = public_users;
