import Trash from "../icons/Trash";
import { useRef, useEffect, useState, useContext } from "react";
import { autoGrow, setNewOffset, setZIndex, bodyParser } from "../utils";
import { db } from "../appwrite/databases";
import Spinner from "../icons/Spinner";
import DeleteButton from "./DeleteButton";
import { NoteContext } from "../context/NoteContext";

const NoteCard = ({ note }) => {
  const [saving, setSaving] = useState(false);
  const keyUpTimer = useRef(null);
  const textAreaRef = useRef(null);
  const [position, setPositon] = useState(JSON.parse(note.position));
  const body = bodyParser(note.body);

  //   const position =bodyParser(note.position);
  const colors = bodyParser(note.colors);

  const { setSelectedNote } = useContext(NoteContext);

  const handleKeyUp = () => {
    setSaving(true);

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }
    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = useRef(null);

  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      setZIndex(cardRef.current);
      setSelectedNote(note);
    }
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    saveData("position", newPosition);
    // db.notes.update(note.$id, { position: JSON.stringify(newPosition) });
  };

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };
    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const mouseMove = (e) => {
    //1 - Calculate move direction
    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    //2 - Update start position for next move.
    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    //3 - Update card top and left position.

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

    setPositon(newPosition);
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        onMouseDown={mouseDown}
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton noteId={note.$id} />

        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          ref={textAreaRef}
          onKeyUp={handleKeyUp}
          defaultValue={body}
          style={{ color: colors.colorText }}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
