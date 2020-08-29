const express = require('express');
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  console.log('Time: %d', Date.now(), res);
  next()
});
app.use(express.static(__dirname + "/../src", { index: "index.html", }));
app.listen(port, () => console.log(`listening on port ${port}!`));
console.log(app);
