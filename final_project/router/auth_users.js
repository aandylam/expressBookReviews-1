const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithUserName = users.filter((user) => {
    return user.username === username;
  });
  if (userswithUserName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if the user is authenticated
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    console.log(username);
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ data: password }, "access", {
        expiresIn: 60 * 60,
      });
      req.session.authorization = {
        accessToken: token,
        username,
      };
      return res.status(200).json({ message: "User logged in", token: token });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.authorization.username;
  console.log("Username: " + username);
  if (!isValid(username)) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review modified" });
    } else {
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review added" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization.username;
  if (!isValid(username)) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in" });
  }

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
