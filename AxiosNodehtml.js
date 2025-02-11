// Description: Node.js HTML Client
// Requires: npm install express ejs axios body-parser

const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Base URL for API (เปลี่ยนเป็นพอร์ต 5500)
const baseUrl = 'http://localhost:5500';

// Set the template engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.resolve(__dirname, 'public')));

// Home route
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/books`);
        res.render("books", { books: response.data });
    } catch (error) {
        console.error("Error fetching books:", error.message);
        res.status(500).send('Server Error');
    }
});

// Get book by ID
app.get("/books/:id", async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/books/${req.params.id}`);
        res.render("book", { book: response.data });
    } catch (err) {
        console.error(`Error fetching book with ID ${req.params.id}:`, err.message);
        res.status(500).send('Error');
    }
});

// Render create form
app.get("/create", (req, res) => {
    res.render("create");
});

// Create new book
app.post("/create", async (req, res) => {
    try {
        const data = { title: req.body.title, author: req.body.author };
        await axios.post(`${baseUrl}/books`, data);
        res.redirect("/");
    } catch (err) {
        console.error("Error creating book:", err.message);
        res.status(500).send('Error');
    }
});

// Render update form
app.get("/update/:id", async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/books/${req.params.id}`);
        res.render("update", { book: response.data });
    } catch (err) {
        console.error(`Error fetching book for update (ID: ${req.params.id}):`, err.message);
        res.status(500).send('Error');
    }
});

// Update book
app.post("/update/:id", async (req, res) => {
    try {
        const data = { title: req.body.title, author: req.body.author };
        await axios.put(`${baseUrl}/books/${req.params.id}`, data);
        res.redirect("/");
    } catch (err) {
        console.error(`Error updating book (ID: ${req.params.id}):`, err.message);
        res.status(500).send('Error');
    }
});

// Delete book
app.get("/delete/:id", async (req, res) => {
    try {
        await axios.delete(`${baseUrl}/books/${req.params.id}`);
        res.redirect("/");
    } catch (err) {
        console.error(`Error deleting book (ID: ${req.params.id}):`, err.message);
        res.status(500).send('Error');
    }
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
