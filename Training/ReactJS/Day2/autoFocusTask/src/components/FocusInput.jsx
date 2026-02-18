import { useRef, useEffect } from "react";

function FocusInput() {
  const textareaRef = useRef(null);
  const saveCountRef = useRef(0);

 
  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleManualSave = () => {
    saveCountRef.current += 1;
    console.log("Manual saves:", saveCountRef.current);
  };

  return (
    <div className="container">
      <h2>Memo Pad</h2>

      <textarea
        ref={textareaRef}
        placeholder="Write something..."
        rows={5}
        cols={40}
      />

      <br />

      <button onClick={handleManualSave}>
        Save
      </button>
    </div>
  );
}

export default FocusInput;
