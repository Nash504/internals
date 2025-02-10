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
      <div
        className="main-card"
        style={{ backgroundColor: "white", borderColor: "#1a8754" }}
      >
        <h1 style={{ color: "#1a8754", marginBottom: "20px" }}>
          NoteVault Flash
        </h1>

        {file && (
          <div
            style={{
              backgroundColor: "#f0fff4",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
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
                <h3 style={{ color: "#1a8754", margin: 0 }}>
                  File Uploaded Successfully
                </h3>
                <p style={{ color: "#1a8754", margin: "5px 0 0 0" }}>
                  Document uploaded and ready for processing
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#ebfef0",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#d1fae5",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#1a8754",
                    borderRadius: "4px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="file-upload">
          <label
            htmlFor="file-upload"
            className="upload-label"
            style={{
              backgroundColor: "#1a8754",
              borderColor: "#1a8754",
              color: "white",
            }}
          >
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
          <button
            disabled={loading}
            onClick={Read}
            style={{
              backgroundColor: "#1a8754",
              borderColor: "#1a8754",
              color: "white",
            }}
          >
            {loading ? <div className="spinner"></div> : "Summarize"}
          </button>
          <button
            onClick={() => setShowFlashcards(!showFlashcards)}
            style={{
              backgroundColor: "#1a8754",
              borderColor: "#1a8754",
              color: "white",
            }}
          >
            {showFlashcards ? "Hide Flashcards" : "Show Flashcards"}
          </button>
        </div>
      </div>

      {response && (
        <div
          className="card"
          style={{ backgroundColor: "white", color: "#374151" }}
        >
          <h2 style={{ color: "#1a8754", marginBottom: "15px" }}>Summary</h2>
          <p
            style={{
              backgroundColor: "#f0fff4",
              color: "black",
              borderRadius: "8px",
              padding: "15px",
            }}
          >
            {response}
          </p>
        </div>
      )}

      {showFlashcards && flashcards.length > 0 && (
        <div className="card" style={{ backgroundColor: "white" }}>
          <h2 style={{ color: "#1a8754", marginBottom: "15px" }}>Flashcards</h2>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              cursor: "pointer",
              minHeight: "150px",
              padding: "20px",
              backgroundColor: isFlipped ? "#f0fff4" : "#ffffff",
              border: "1px solid #d1fae5",
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
            <button
              onClick={previousCard}
              style={{
                backgroundColor: "#1a8754",
                borderColor: "#1a8754",
                color: "white",
              }}
            >
              Previous
            </button>
            <button
              onClick={nextCard}
              style={{
                backgroundColor: "#1a8754",
                borderColor: "#1a8754",
                color: "white",
              }}
            >
              Next
            </button>
          </div>

          <p style={{ color: "#1a8754", marginTop: "10px", fontSize: "14px" }}>
            Card {currentCard + 1} of {flashcards.length}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
