const Diary = require('../models/diary.model');

exports.create = async (req, res) => {
  try {
    const diary = await Diary.create(req.body);
    res.status(201).json(diary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findByUserId = async (req, res) => {
  try {
    const diaries = await Diary.findByUserId(req.params.userId);
    res.status(200).json(diaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }
    res.status(200).json(diary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const diary = await Diary.update(req.params.id, req.body);
    res.status(200).json(diary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Diary.delete(req.params.id);
    res.status(200).json({ message: 'Diary deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
