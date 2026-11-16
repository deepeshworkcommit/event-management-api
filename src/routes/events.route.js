const express = require('express');
const router = express.Router();
const eventController = require('../controller/events.controller');
const eventMiddleware = require("../middleware/event.middleware")

router.post('/create-event',eventMiddleware.checkFirst,eventController.createEvent);
router.post('/register-event/:id',eventMiddleware.checkRegister,eventController.eventRegister);
router.get('/',eventController.getAllEvents);
router.get('/:id',eventController.getEventById);

router.delete('/:id',eventMiddleware.checkFirst,eventController.deleteEvent)

module.exports=router;