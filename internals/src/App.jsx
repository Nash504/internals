import { useState } from "react";
import pdfToText from "react-pdftotext";
import GetResponse from "./components/gemini";
import { ToastContainer, toast } from "react-toastify"; // Import the GetResponse function
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // State to store the response from Gemini

  const HandleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const Read = () => {
    if (!file) {
      toast.error("Please select a file to summarize");
      return;
    }
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
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="main-card">
        {" "}
        <div className="file-upload">
          <label htmlFor="file-upload" className="upload-label">
            {file ? file.name : " Upload File"}
          </label>
          <input id="file-upload" type="file" onChange={HandleFile} />
        </div>
        <div className="buttons">
          <button disabled={loading} onClick={Read}>
            {loading ? <div className="spinner"></div> : "Summarize"}
          </button>

          <button>Ask Questions</button>
        </div>
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
