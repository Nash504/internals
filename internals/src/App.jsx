import { useState } from "react";
import pdfToText from "react-pdftotext";
import GetResponse from "./components/gemini"; // Import the GetResponse function
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [, setContent] = useState(null);
  const [response, setResponse] = useState(null); // State to store the response from Gemini

  const HandleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const Read = () => {
    pdfToText(file)
      .then((data) => {
        setContent(data); // Store the content of the PDF
        return GetResponse(data); // Pass the content to GetResponse
      })
      .then((responseText) => {
        setResponse(responseText);
        console.log(response); // Set the summarized response
      })
      .catch((err) => {
        console.log("Error fetching response:", err); // Handle errors from GetResponse
      });
  };

  return (
    <div>
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
        {response && (
          <p>
            Summary: <b>{response}</b>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
