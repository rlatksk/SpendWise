if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express')
const expressLayout = require('express-ejs-layouts');
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoutes = require('./server/routes/auth');

app.use('/', authRoutes);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config()

const port = process.env.PORT;
const database = process.env.MONGO_URIdummy

mongoose.connect(database)
  .then(() => console.log(`Connected to Database ${database}`));

//Engine Templating
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/auth', require('./server/routes/auth'));

app.get('/favicon.ico', (req, res) => res.status(204)); //Just to prevent chart.js console error on favicon.ico

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})