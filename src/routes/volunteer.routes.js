const express = require("express");
const router = express.Router();

const volunteerController = require("../controllers/volunteer.controller");

router.post("/", volunteerController.createVolunteer);
router.get("/:category", volunteerController.getVolunteers);
router.get("/suggested/:category", volunteerController.getSuggested);

module.exports = router;