const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')
const mongoose = require('mongoose');
const config = require('./config/database');

admin.loadMetadataForTopics()
mongoose.connect(config.database, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to database ', config.database);
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to database: ', err);
});

const app = express();

const port = 3000;

const users = require('./routes/users');

//Body Parser middleware
app.use(bodyParser.json());

//CORS middleware 
app.use(cors());

//Body Parser middleware
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//Set Static folder (Loaction for angluar file)
app.use(express.static(path.join(__dirname, 'public')));

//Index page
app.get('/', (req, res) => {
    res.send('invalid endpoint');
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

//Start Server
app.listen(port, () => {
    console.log('Server started at port ' + port);
});
