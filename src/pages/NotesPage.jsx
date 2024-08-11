import { databases } from "../appwrite/config";
import { db } from "../appwrite/databases";
import NoteCard from "../components/NoteCard";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import Controls from "../components/Controls";

const NotesPage = () => {
  const { notes, setNotes } = useContext(NoteContext);
  return (
    <div>
      {notes.map((note) => (
        <NoteCard key={note.$id} note={note}></NoteCard>
      ))}
      <Controls />
    </div>
  );
};

export default NotesPage;
