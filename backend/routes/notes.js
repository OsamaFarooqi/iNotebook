const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../modules/Note");
const fetchuser = require("../middleware/fetchuser");

// Router 1: Get all notes using Get "/api/notes/fetchallnotes", Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find();
    // console.log(notes);
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
      //console.log({ error: errors.array() });
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

// Router 3: Update an existing note using Put "/api/notes/updatenote/:id", Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body; // seprate things using destructeing approch
    // Check weither note exists or not
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send(`Note not found for Id: ${req.body.noteid}`);
    }

    // Create new note using updated requested conetent
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Check weither user is authorized to access update the note or not.
    if (note.userId.toString() !== req.user.id) {
      //req.user.id is coming from middleware funtion fetchuser
      return res.status(401).send("Access denied");
    }

    // Update note
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Note Updated Successfully!",
      note,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Internal server error. ${error.message}`);
  }
});

// Router 4: Delete specific note using DELETE "/api/notes/deletenote/:id", Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Check weither note exists or not
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send(`Note not found for Id: ${req.params.id}`);
    }

    // Check weither user is authorized to access update the note or not.
    if (note.userId.toString() !== req.user.id) {
      //req.user.id is coming from middleware funtion fetchuser
      return res.status(401).send("Access denied");
    }

    // Update note
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note deleted successfully", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`Internal server error. ${error.message}`);
  }
});

module.exports = router;
