var express = require("express");
const passport = require("../middleware/passport");
const { isEmployee, isCustomer } = require("../middleware/auth");
var router = express.Router();
const { sql, poolPromise } = require("../model/dbConfig");
const { queryPaginating } = require("../model/queryDB");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    return res.status(200).json("Hello World");
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.get("/members", async function (req, res) {
  try {
    let pageSize = req.query.PageSize && !isNaN(req.query.PageSize) ? parseInt(req.query.PageSize, 10) : 25;
    let pageNumber = req.query.PageNumber && !isNaN(req.query.PageNumber) ? parseInt(req.query.PageNumber, 10) : 1;
    const result = await queryPaginating(
      "SELECT * from ACCOUNTS",
      pageSize,
      pageNumber
    );


    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No members found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching members:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
