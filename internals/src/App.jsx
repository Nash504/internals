import { useState } from "react";
import pdfToText from "react-pdftotext";
import GetResponse from "./components/gemini"; // Import the GetResponse function
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // State to store the response from Gemini

  const HandleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const Read = () => {
    setLoading(true);
    pdfToText(file)
      .then((data) => {
        return GetResponse(data); // Pass the content to GetResponse
      })
      .then((responseText) => {
        setResponse(responseText);
        console.log(response); // Set the summarized response
      })
      .catch((err) => {
        console.log("Error fetching response:", err); // Handle errors from GetResponse
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        className="file-upload"
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <input type="file" onChange={HandleFile}></input>
      </div>
      <div className="buttons">
        <button disabled={loading} onClick={Read}>
          {loading ? "Loading..." : "Summarize"}
        </button>
        <button>Ask Questions</button>
      </div>

      {response && (
        <div className="card">
          <p>
            Summary: <b>{response}</b>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
