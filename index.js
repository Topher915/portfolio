const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json');
const methodOverride = require('method-override')
const { v4: uuid } = require('uuid');
uuid();

app.use(function(req, res, next) {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

let comments = [
    {
        username: 'Trey',
        comment: 'Run like an antelope',
        id: uuid()
    },
    {
        username: 'Mike',
        comment: 'Cause youre a big black furry creature from Mars.',
        id: uuid()
    },
    {   username: 'Page',
        comment: 'Is this still Lawnboy?',
        id: uuid()
    },
    {
        username: 'Fish',
        comment: 'I come unglued while in mid-air.',
        id: uuid()
    }
]

// read route
app.get('/comments', (req, res) => {
    res.render('comments/index', { comments })
})

// new comment route
app.get('/comments/new', (req, res) => {
    res.render('comments/new', { comments })
})

// comment post route
app.post('/comments', (req, res) => {
    const { username, comment} = req.body;
    comments.push({username, comment, id: uuid() });
    res.redirect('/comments');
})

// get comments by id
app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id)
    res.render('comments/show', { comment })
})

// Updating a comment
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const newCommentText = req.body.comment;
    const foundComment = comments.find(c => c.id === id);
    foundComment.comment = newCommentText; 
    res.redirect('/comments')
})

// Route to edit comments
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id)
    res.render('comments/edit', { comment })
})

app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
})

app.get('/', (req, res) => {
    res.render('comingsoon', {title: 'comingsoon'})
})

app.get('/home', (req, res) => {
    res.render('home', {title: 'home'})
})

app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
    ]
    res.render('cats', { cats, title: 'Cats' })
})

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    if (data) {
        res.render('subreddit', { ...data, title: subreddit });
    } else {
        res.render('notfound', { subreddit, title: subreddit })
    }
})

app.get('/index', (req, res) => {
    res.render('index')
})

app.get('/yolklore', (req, res) => {
    const view = 'yolklore'
    res.render('yolklore', { view, title: 'yolklore' })
})

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('random', { num, title: 'random' })
})

app.get('/css', (req, res) => {
    res.render('css', {title: 'css'})
})

app.get('/phish', (req, res) => {
    res.send("GET Phish reponse")
})

app.post('/phish', (req, res) => {
    const {set, song} = req.body
    res.send(`POST Phish response ${set} set ${song}`)
})


app.listen(80, () => {
    console.log("LISTENING ON PORT 80")
})