const express = require("express");
const router = express.Router();
const fineController = require("../controllers/fine.controller");
const { authenticate } = require("../middlewares/auth");

router.get("/", fineController.getAllFines);
router.get("/me", authenticate, fineController.getFineByUser);
router.patch("/:id/pay", authenticate, fineController.payFine);
router.post("/",authenticate, fineController.createFine)

module.exports = router;
