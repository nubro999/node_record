const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diary.controller');

router.post('/', diaryController.create);
router.get('/user/:userId', diaryController.findByUserId);
router.get('/:id', diaryController.findOne);
router.put('/:id', diaryController.update);
router.delete('/:id', diaryController.delete);

module.exports = router;
