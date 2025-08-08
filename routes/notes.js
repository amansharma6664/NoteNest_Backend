const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser'); // Middleware to verify user's JWT
const Note = require('../models/Note'); // Mongoose model for Note
const { body, validationResult } = require('express-validator'); // For input validation

// Route 1: Get all notes for a logged-in user using: GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchUser, async (req, res) => {
  try {
    // Find all notes created by the logged-in user
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Add a new note using: POST "/api/notes/addnote"
router.post('/addnote', fetchUser, [
  body('title', 'Title is required').notEmpty(),
  body('description', 'Description is required').notEmpty()
], async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Validate request inputs
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Create and save the new note
    const note = new Note({ title, description, tag, user: req.user.id });
    const savedNote = await note.save();

    res.json(savedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 3: Update an existing note using: PUT "/api/notes/updatenote/:id"
router.put('/updatenote/:id', fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  const newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  try {
    // Find the note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");

    // Check if the note belongs to the logged-in user
    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Not Allowed");

    // Update the note
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true } // Return the updated note
    );

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Delete an existing note using: DELETE "/api/notes/deletenote/:id"
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
  try {
    // Find the note to be deleted
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");

    // Check if the note belongs to the logged-in user
    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Not Allowed");

    // Delete the note
    await Note.findByIdAndDelete(req.params.id);

    res.json({ success: "Note has been deleted", note });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
