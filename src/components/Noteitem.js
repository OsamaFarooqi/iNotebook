import React, { useContext } from "react";
import notesContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const { note } = props;
  const context = useContext(notesContext);
  const { deleteNote, editNote } = context;

  const handleDelete = () => {
    deleteNote(note._id);
  };

  const handleEdit = () => {
    editNote(note._id);
  };
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <div className="flex">
            <i className="fa-solid fa-trash" onClick={handleDelete}></i>
            <i className="fa-solid fa-pencil mx-2" onClick={handleEdit}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
