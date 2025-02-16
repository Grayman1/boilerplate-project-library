/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
let dotenv = require('dotenv').config()
var expect = require("chai").expect;
let mongodb = require("mongodb");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;


module.exports = function (app) {
// SET-UP MONGOOSE DB CONNECTIONS
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// CREATE NEW SCHEMA
  let bookSchema = new Schema({
    title: {type: String, required: true},
    comments: [String],
    commentcount: {type:Number}    
  });
  // CREATE NEW INSTANCE
  let Book = mongoose.model("Book", bookSchema)


  app.route('/api/books')
    .get(function (req, res){
      // create array
      let arrayOfBooks = [];
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find(
        {},
        (err, results) => {
          if (!err && results) {
            results.forEach((result) => {
              let book = result.toJSON()
              book['commentcount'] = book.comments.length
              arrayOfBooks.push(book)
            })
            return res.json(arrayOfBooks)
          }
        }
      )      
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        return res.json('missing required field title')
      }
      
      //response will contain new book object including atleast _id and title
      let newBook = new Book ({
        title: title,
        comments: []
      })
      newBook.save((err, createdBook) =>{
        if (!err && createdBook) {
          return res.json(createdBook)
        }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.remove(
      {}, 
      (err, jsonStatus)=> {
        if(err || !jsonStatus) {
          console.log(err)
        }else if (!err && jsonStatus){
          return res.json('complete delete successful')
        }
      })
    });


  app.route('/api/books/:id')
    .get((req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(
        bookid,
        (err, result) => {
        if (!err && result) {
          return res.json(result)
        } else if (!result) {
          return res.json('no book exists')
        }
        }
      )
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.json('missing required field comment')
      }

      Book.findByIdAndUpdate(
        bookid,
        {$push: {comments: comment}},
        {new: true},
        (err, updatedBook) => {
          if (!err && updatedBook) {
            return res.json(updatedBook) 
          } else if (!updatedBook) {
            return res.json('no book exists')
          }
        }
      )
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(
        bookid,
        (err, deletedBook) => {
          if (!err && deletedBook) {
            return res.json('delete successful')
          } else if (!deletedBook) {
            return res.json('no book exists')
          }
        }
      )
    });
      
  
};
