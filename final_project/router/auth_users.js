const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "maolene",
    password: "maolene23",
  },
];

const isValid = (username) => {
  const isExist = users.find((user) => user.username == username);
  if (isExist) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  const data = users.find((user) => user.username == username);
  if (data.username == username && data.password == password) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username) && authenticatedUser(username, password)) {
      const token = jwt.sign(
        {
          username: username,
        },
        "nomad23",
        { expiresIn: 60 * 60 }
      );
      const sessionToken = token;
      req.session.auth = { sessionToken };
      console.log(`Logged in : ${username}`);
      return res.send("Login success!");
    } else if (isValid(username)) {
      return res.send("Login failed: Wrong password");
    } else {
      return res.send("Login failed : Account not found");
    }
  } else {
    return res.send("Login failed: Please fill the login form");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  if (req.body.review) {
    const newReview = req.body.review;
    for (let index = 1; index <= Object.keys(books).length; index++) {
      if (books[index].isbn == isbn) {
        const arrOfKeys = Object.keys(books[index].reviews);
        if (arrOfKeys.includes(username)) {
          const book = { ...books[index] };
          book.reviews = { ...book.reviews, [username]: newReview };
          books[index] = book;
          return res.send("Review changed succesfully");
        } else {
          const book = { ...books[index] };
          book.reviews = { ...book.reviews, [username]: newReview };
          books[index] = book;
          return res.send("Review added succesfully");
        }
      }
    }
    return res.send("Book cannot be found");
  } else {
    return res.send("Please fill the review form");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  for (let index = 1; index <= Object.keys(books).length; index++) {
    if (books[index].isbn == isbn) {
      const arrOfKeys = Object.keys(books[index].reviews);
      if (arrOfKeys.includes(username)) {
        const book = { ...books[index] };
        book.reviews = { ...book.reviews };
        delete book.reviews[username];
        books[index] = book;
        return res.send("Review deleted succesfully");
      } else {
        return res.send("You have not added any review yet");
      }
    }
  }
});

regd_users.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Cannot log out");
    } else {
      console.log(`Logged out : ${req.user.username}`);
      return res.send("Logout success!");
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
