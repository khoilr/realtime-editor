var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/:RoomName", function (req, res, next) {
  res.render("index", { RoomName: req.params.RoomName });
});

module.exports = router;
