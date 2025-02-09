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
    // Split text into paragraphs and filter out short ones
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

      // Generate flashcards from the text
      const cards = generateFlashcards(data);
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

  const toggleFlashcards = () => {
    if (!response) {
      toast.error("Please summarize the document first");
      return;
    }
    setShowFlashcards(!showFlashcards);
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="main-card">
        <h1 style={{ color: "#ceff48", marginBottom: "20px" }}>
          PDF Processor & Flashcards
        </h1>

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
          <button onClick={toggleFlashcards}>
            {showFlashcards ? "Hide Flashcards" : "Show Flashcards"}
          </button>
        </div>
      </div>

      {response && (
        <div className="card">
          <h2 style={{ color: "#ceff48", marginBottom: "10px" }}>Summary</h2>
          <p>{response}</p>
        </div>
      )}

      {showFlashcards && flashcards.length > 0 && (
        <div className="card">
          <h2 style={{ color: "#ceff48", marginBottom: "15px" }}>Flashcards</h2>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              cursor: "pointer",
              minHeight: "150px",
              padding: "20px",
              backgroundColor: isFlipped ? "#2a363a" : "#364246",
              borderRadius: "8px",
              marginBottom: "15px",
              transition: "all 0.3s ease",
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

          <p style={{ color: "#ceff48", marginTop: "10px", fontSize: "14px" }}>
            Card {currentCard + 1} of {flashcards.length}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
