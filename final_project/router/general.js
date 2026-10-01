const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
      resolve(books);
    });

    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });

    const book = await getBookByISBN;
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const matchingBooks = [];

      for (let key of keys) {
        if (books[key].author === author) {
          matchingBooks.push(books[key]);
        }
      }

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this author");
      }
    });

    const matchingBooks = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const matchingBooks = [];

      for (let key of keys) {
        if (books[key].title === title) {
          matchingBooks.push(books[key]);
        }
      }

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found with this title");
      }
    });

    const matchingBooks = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
