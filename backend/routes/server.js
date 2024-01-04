var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send({ message: "Server is running" })
});

module.exports = router;