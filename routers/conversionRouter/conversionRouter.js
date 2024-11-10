const express = require("express");
const router = express.Router();
const conversion = require("../../controllers/documentConversionController");

router.post("/convert_document", conversion);

module.exports = router;
