var express = require("express");
var router = express.Router();

module.exports = (RoomData) => {
  /* GET home page. */
  router.get("/:RoomName", function (req, res, next) {
    console.log("Router", RoomData[req.params.RoomName]);
    if (RoomData[req.params.RoomName] != null) {
      res.render("index", {
        RoomName: req.params.RoomName,
        RoomData: RoomData[req.params.RoomName].toString()
      });
    } else {
      res.render("index", {
        RoomName: req.params.RoomName,
        RoomData: ""
      });
    }
  });

  return router;
};
