//Testing using Postman chrome extension

//Add dependencies
const express = require('express');
const app = express();
const Joi = require('joi');

//adding custom middleware function
const log = require('./logger');
const authenticate = require('./authenticate');

//treat ojects as JSON
app.use(express.json()); //parse for JSON objects
app.use(express.urlencoded({ extended: true})); //handle url encoded chararaters

//custom middleware function
app.use(log);
app.use(authenticate);

const books = [
    {id:1, name:'Book1', author:'Author1'},
    {id:2, name:'Book2', author:'Author2'},
    {id:3, name:'Book3', author:'Author3'},
];

//read representational state transfer
app.get('/api/books/:id',(req,res)=>{

    //First check that the book is not in the current list of books
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) return res.status(404).send('Read error, book id could not be found in the list of books')

    //If book is in books that display on screen
    res.send(book);
});

//create representational state transfer
app.post('/api/books', (req,res)=>{
    //validate the user input
    const { error } = bookValidation(req.body);

    //if there is an error info the user
    if(error) return res.status(400).send(error.details[0].message);

    //define object book
    const book ={
        id: books.length + 1,
        name: req.body.name,
        author: req.body.author
    }
    
    //add book to array books and display to user
    books.push(book);
    res.send(books);
})

//update representational state transfer
app.put('/api/books/:id', (req, res) =>{
    //check that the book to be update exist in array books
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) return res.status(404).send('Update error, book id could not be found in books');

    //validate user changes
    const { error } = bookValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //if user input is validate
    book.name   = req.body.name,
    book.author = req.body.author

    //display change to the user
    res.send(book);
});

app.delete('/api/books/:id', (req,res) =>{
    //check that the book exist in the array
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) return res.status(404).send('Delete error, book id could not be found in books');

    //if the book exist find the index
    const index = books.indexOf(book);
    books.splice(index, 1);

    res.send(book);
});

//port
const port = process.env.port || 3000;

app.listen(port, ()=>console.log(`Port ${port} is listening...`));

//bookValidation function
function bookValidation(book){
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        author: Joi.string().min(3).max(30).required()
    };

    //validate the values against the schema
    return Joi.validate(book, schema);
}