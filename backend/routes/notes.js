const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../modules/Note");
const fetchuser = require("../middleware/fetchuser");

// Router 1: Get all notes using Get "/api/notes/fetchallnotes", Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find();
    console.log(notes);
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Router 2: Add new note using Post "/api/notes/addnote", Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = await validationResult(req);
    // cheack if there is any error, return with 400 response code and error messages in json formate.
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      // create new note
      const note = new Note({
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Router 3: Update an existing note using Post "/api/notes/updatenote", Login required
router.post(
  "/updatenote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = await validationResult(req);
    // cheack if there is any error, return with 400 response code and error messages in json formate.
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const note = await Note.findById(req.body.noteid);
      if (!note) {
        return res.send(`Note not found for Id: ${req.body.noteid}`);
      }
      note.title = req.body.title;
      note.description = req.body.description;
      note.tag = req.body.tag;
      const noteSaved = await note.save();
      if (!noteSaved) {
        return res.send("Unable to save note. Internel server error.");
      }
      res.send("Note Updated Successfully!");
    } catch (error) {
      console.error(error.message);
      res.status(500).send(`Internal server error. ${error.message}`);
    }
  }
);

// Router 4: Delete specific note using Post "/api/notes/deletenote", Login required
router.post("/deletenote", fetchuser, async (req, res) => {
  try {
    const deletedNotes = await Note.findOneAndDelete({ _id: req.body.id });
    if (!deletedNotes) {
      return res.send(`There some error while  Deleting note ${req.body.id}.`);
    }
    res.send("Note Deleted successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
