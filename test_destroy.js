const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello'));
app.listen(3000, () => console.log('Running'));
try {
  require('destroy');
  console.log("'destroy' module loaded successfully.");
} catch (e) {
  console.error("Failed to load 'destroy' module:", e.message);
}
