require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

//Engine Templating
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});