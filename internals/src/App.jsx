import { useState } from "react";
import pdfToText from "react-pdftotext";

import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState(null);
  const HandleFile = (e) => {
    setFile(e.target.files[0]);
  };
  const Read = () => {
    pdfToText(file)
      .then((data) => {
        setContent(data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      {" "}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <input type="file" onChange={HandleFile}></input>
      </div>
      <button onClick={Read}>Submit</button>
      <div className="card">
        {content && (
          <p>
            Content:<b>{content}</b>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
