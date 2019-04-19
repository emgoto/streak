const compression = require('compression');
const cors = require('cors');
const express = require('express');

const app = express();

// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// listen for requests :)
const listener = app.listen((process.env.PORT || 3000), () => {
  console.log('Server up and running 🏃');
});