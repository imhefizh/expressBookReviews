const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function formatName(name) {
  let authorWords = name.split(" ");
  let capitalWords = [];
  let converted = [];
  for (let index = 0; index < authorWords.length; index++) {
    for (let letter = 0; letter < authorWords[index].length; letter++) {
      converted.push(
        letter == 0
          ? authorWords[index][letter].toUpperCase()
          : authorWords[index][letter]
      );
    }
    converted = converted.join("");
    capitalWords.push(converted);
    converted = [];
  }
  return (capitalWords = capitalWords.join(" "));
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid) {
      users.push({
        username: username,
        password: password,
      });
      return res.send("New account registered!");
    } else {
      return res.send(
        "Username has already exist. Please, try another username!"
      );
    }
  } else {
    return res.send(
      "Registration failed, Please provide username and password"
    );
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getListBooks = new Promise((resolved, reject) => {
    setTimeout(() => {
      resolved(res.send(books));
    }, 3000);
    console.log("Loading the list...");
  });
  async function asyncAwait() {
    await getListBooks
      .then((x) => {
        console.log("Loaded succesfully");
        return x;
      })
      .catch();
  }
  asyncAwait();
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const gettingBook = new Promise((resolved, reject) => {
    setTimeout(() => {
      for (let index = 1; index <= Object.keys(books).length; index++) {
        if (books[index].isbn == isbn) {
          resolved(res.send(books[index]));
        }
      }
      reject("The book cannot be found");
    }, 3000);
    console.log("Searching the book by ISBN...");
  });
  gettingBook
    .then((x) => {
      console.log("Loaded succesfully");
      return x;
    })
    .catch((err) => {
      console.log("Searching stops");
      return res.send(err);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const gettingBook = new Promise((resolved, reject) => {
    setTimeout(() => {
      const theAuthor = formatName(author);
      const theBooks = [];
      for (let index = 1; index <= Object.keys(books).length; index++) {
        if (books[index].author == theAuthor) {
          theBooks.push(books[index]);
        }
      }
      resolved(res.send(theBooks));
      reject("The book cannot be found");
    }, 3000);
    console.log("Searching the book by Author...");
  });
  gettingBook
    .then((x) => {
      console.log("Loaded succesfully");
      return x;
    })
    .catch((err) => {
      console.log("Searching stops");
      return res.send(err);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const gettingBook = new Promise((resolved, reject) => {
    setTimeout(() => {
      const theTitle = formatName(title);
      for (let index = 1; index <= Object.keys(books).length; index++) {
        if (books[index].title == theTitle) {
          resolved(res.send(books[index]));
        }
      }
      reject("The book cannot be found");
    }, 3000);
    console.log("Searching the book by Title...");
  });
  gettingBook
    .then((x) => {
      console.log("Loaded succesfully");
      return x;
    })
    .catch((err) => {
      console.log("Searching stops");
      return res.send(err);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  for (let index = 1; index <= Object.keys(books).length; index++) {
    if (books[index].isbn == isbn) {
      if (Object.keys(books[index].reviews).length != 0) {
        return res.send(books[index].reviews);
      } else {
        return res.send("No one reviews for the book");
      }
    }
  }
  return res.send({ msg: "The book cannot be found" });
});

module.exports.general = public_users;
