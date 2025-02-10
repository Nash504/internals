import { useState } from "react";
import pdfToText from "react-pdftotext";
import GetResponse from "./components/gemini";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const HandleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF uploaded successfully!");
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const generateFlashcards = (text) => {
    const paragraphs = text
      .split(/\n\n/)
      .filter((p) => p.trim().length > 50)
      .slice(0, 5)
      .map((p, index) => ({
        id: index,
        front: `Key Concept ${index + 1}`,
        back: p.trim(),
      }));
    return paragraphs;
  };

  const Read = async () => {
    if (!file) {
      toast.error("Please select a file to summarize");
      return;
    }
    setLoading(true);
    try {
      const data = await pdfToText(file);
      const summaryResponse = await GetResponse(data);
      setResponse(summaryResponse);
      const cards = generateFlashcards(summaryResponse);
      setFlashcards(cards);
      setShowFlashcards(true);
      toast.success("Document processed successfully!");
    } catch (err) {
      toast.error("Error processing document: " + err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const previousCard = () => {
    setIsFlipped(false);
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <div className="card">
        <h1 className="card-header">NoteVault Flash</h1>

        {file && (
          <div className="card-body">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",

                padding: "10px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#d1fae5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1a8754",
                }}
              >
                ✓
              </div>
              <div>
                <h3
                  className="card-header"
                  style={{ justifycontent: "center", margin: 0 }}
                >
                  File Uploaded Successfully
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="file-upload">
          <label htmlFor="file-upload" className="upload-label">
            {file ? file.name : "Upload PDF"}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={HandleFile}
            accept=".pdf"
          />
        </div>

        <div className="buttons">
          <button disabled={loading} onClick={Read}>
            {loading ? <div className="spinner"></div> : "Summarize"}
          </button>
          <button onClick={() => setShowFlashcards(!showFlashcards)}>
            {showFlashcards ? "Hide Flashcards" : "Show Flashcards"}
          </button>
        </div>
      </div>

      {response && (
        <div className=" summary-card">
          <h2 className="card-header">Summary</h2>
          <p className="card-body">{response}</p>
        </div>
      )}

      {showFlashcards && flashcards.length > 0 && (
        <div className="card">
          <h2 className="card-header">Flashcards</h2>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              cursor: "pointer",
              minHeight: "150px",
              padding: "20px",
              backgroundColor: isFlipped ? "#f0fff4" : "#ffffff",
              border: "4px solid #d1fae5",
              borderRadius: "8px",
              marginBottom: "15px",
              transition: "all 0.3s ease",
              color: "black",
            }}
          >
            <p>
              {isFlipped
                ? flashcards[currentCard].back
                : flashcards[currentCard].front}
            </p>
          </div>

          <div className="buttons">
            <button onClick={previousCard}>Previous</button>
            <button onClick={nextCard}>Next</button>
          </div>

          <p className="card-footer">
            Card {currentCard + 1} of {flashcards.length}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
