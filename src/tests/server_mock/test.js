const express = require('express');
const app = express();

// Parse JSON bodies for this app. Make sure you put
// `app.use(express.json())` **before** your route handlers!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  console.log(req.body); // JavaScript object containing the parse JSON
  res.json(req.body);
});
app.listen(3000);