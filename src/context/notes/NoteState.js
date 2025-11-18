import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);

  // Get All Notes from Database
  const getAllNotes = async () => {
    // API Call - fetch all ntes:
    try {
      console.log("getallnotes called");
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxNDZmYzY1YmFkNzg3ODA3NzkxYzBjIn0sImlhdCI6MTc2Mjk0NzMxNX0.CEfU8r8YlOSaYiK39J2qFG4aAcmmdOVAQz_UvPq8gFk",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      // console.log(result);
      // Client Side Logic - fetch all notes:
      setNotes(result); //addes new note and return the new array of notes. We intentially do not used push here
    } catch (error) {
      console.error(error.message);
    }
  };

  // Add New Note
  const addNote = async (title, description, tag) => {
    // API Call - Add new note:
    try {
      console.log("adding note");
      const data = {
        title,
        description,
        tag,
      };

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxNDZmYzY1YmFkNzg3ODA3NzkxYzBjIn0sImlhdCI6MTc2Mjk0NzMxNX0.CEfU8r8YlOSaYiK39J2qFG4aAcmmdOVAQz_UvPq8gFk",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status}. ${response.text}`
        );
      }
      const result = await response.json();
      console.log(result);
      // Client Side Logic - Add new notes:
      getAllNotes(); // to get latest notes from server. To keep single copy of notes displayed and stored(self-coded).
    } catch (error) {
      console.error(error.message);
    }
  };

  // Delete Existing Note
  const deleteNote = async (id) => {
    // API Call - Delete existing note:
    try {
      console.log(id);
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxNDZmYzY1YmFkNzg3ODA3NzkxYzBjIn0sImlhdCI6MTc2Mjk0NzMxNX0.CEfU8r8YlOSaYiK39J2qFG4aAcmmdOVAQz_UvPq8gFk",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      // Client Side Logic - Delete existing notes:
      getAllNotes(); // to get latest notes from server. To keep single copy of notes displayed and stored(self-coded).
    } catch (error) {
      console.error(error.message);
    }
  };

  // Edit Existing Note
  const editNote = async (id, title, description, tag) => {
    // API Call - Edit existing note:
    try {
      console.log(id);
      const data = {
        id,
        title,
        description,
        tag,
      };
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkxNDZmYzY1YmFkNzg3ODA3NzkxYzBjIn0sImlhdCI6MTc2Mjk0NzMxNX0.CEfU8r8YlOSaYiK39J2qFG4aAcmmdOVAQz_UvPq8gFk",
        },
        body: JSON.stringify(data), //send note json to update the existing one.
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      console.log(data);
      const result = await response.json();
      console.log(result);
      // Client Side Logic - Edit existing notes:
      getAllNotes(); // to get latest notes from server. To keep single copy of notes displayed and stored(self-coded).
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, getAllNotes, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
