const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (users.includes(username)) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      users.push({ username, password });
      return res.status(200).json({ message: "User registered" });
    }
  } else {
    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (books) {
    return res.send(JSON.stringify(books, null, 4));
  } else {
    return res.status(404).json({ message: "No books available" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const book_isbn = req.params.isbn;
  if (books[book_isbn]) {
    return res.send(books[book_isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.replace(/-/g, " ");
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.replace(/-/g, " ");
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book_isbn = req.params.isbn;
  if (books[book_isbn]) {
    if (books[book_isbn].reviews) {
      return res.send(JSON.stringify(books[book_isbn].reviews, null, 4));
    } else {
      return res.status(404).json({ message: "No reviews found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
