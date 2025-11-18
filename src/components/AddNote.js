import React, { useCallback, useContext, useState } from "react";
import notesContext from "../context/notes/noteContext";

const AddNote = () => {
  const context = useContext(notesContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const [errors, setErrors] = useState({});
  const validate = useCallback(() => {
    const newErrors = {};

    if (note.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (note.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters.";
    }
    if (note.tag.trim().length < 3) {
      newErrors.tag = "Tag must be at least 3 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // we're checking the length of errors, if there are any error then the length will be more than 1, that's where we know okay there is an error and we need to fix them before contianuing the form submition.
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      // Add new note and wait untill it's completed
      await addNote(note.title, note.description, note.tag);
      // Reset form after successful submit
      setNote({ title: "", description: "", tag: "" });
    } catch (error) {}
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <div className="container my-3">
        <h2>Add New Note</h2>
        {/* noValidate is used to prevent default form validation using JS. We'll validate the form using custom logic which is market best practice. */}
        <form onSubmit={handleSubmit} className="my-3" noValidate>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              id="title"
              name="title"
              value={note.title}
              aria-describedby="titleHelp"
              onChange={handleChange}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              id="description"
              name="description"
              value={note.description}
              onChange={handleChange}
              minLength={5}
              required
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              id="tag"
              name="tag"
              value={note.tag}
              onChange={handleChange}
              minLength={3}
              required
            />
            {errors.tag && <div className="invalid-feedback">{errors.tag}</div>}
          </div>
          <button type="submit" className="btn btn-primary">
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
