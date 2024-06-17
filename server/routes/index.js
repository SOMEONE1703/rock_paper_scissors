var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */

router.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist', 'index.html'));
});

module.exports = router;
