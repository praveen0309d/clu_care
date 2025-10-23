import React, { useState } from "react";
import axios from "axios";
import "./PredictForm.css";

const PredictForm = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/disease/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPrediction(res.data);
    } catch (err) {
      console.error("Prediction failed:", err);
      alert("Prediction failed. Check server logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
      } else {
        alert("Please select an image file.");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
  };

  return (
    <div className="predict_container">
      <h2 className="predict_title">Disease Prediction</h2>
      
      <div className="predict_formContainer">
<form onSubmit={handleSubmit} className="predict_form">
  <div className="predict_uploadSection">
    <label htmlFor="predict_imageUpload" className="predict_uploadLabel">
      Upload Medical Image
    </label>
    
    <div 
      className={`predict_dropZone ${dragActive ? "predict_dropZone--active" : ""} ${fileName ? "predict_dropZone--hasFile" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Hidden file input that will be triggered by both click and drop */}
      <input
        id="predict_imageUpload"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="predict_fileInput"
      />
      
      <div className="predict_dropContent">
        <div className="predict_uploadIcon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#4a6fa5" fillOpacity="0.2"/>
            <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {fileName ? (
          <div className="predict_fileInfo">
            <p className="predict_fileName">{fileName}</p>
            <button type="button" className="predict_removeBtn" onClick={removeFile}>
              Remove
            </button>
          </div>
        ) : (
          <>
            <p className="predict_dropText">
              <span 
                className="predict_dropHighlight"
                onClick={() => document.getElementById('predict_imageUpload').click()}
                style={{cursor: 'pointer', textDecoration: 'underline'}}
              >
                Click to upload
              </span> or drag and drop
            </p>
            <p className="predict_fileTypes">JPG, PNG, GIF up to 10MB</p>
          </>
        )}
      </div>
    </div>
  </div>
  
  <button 
    type="submit" 
    className="predict_submitBtn"
    disabled={isLoading || !file}
  >
    {isLoading ? (
      <>
        <span className="predict_loadingSpinner"></span>
        Analyzing Image...
      </>
    ) : (
      "Predict Disease"
    )}
  </button>
</form>

        {prediction && (
          <div className="predict_results">
            <h3 className="predict_resultsTitle">Analysis Results</h3>
            <div className="predict_resultCard">
              <div className="predict_resultItem">
                <span className="predict_resultLabel">Predicted Condition:</span>
                <span className="predict_resultValue predict_condition">{prediction.predicted_class}</span>
              </div>
              <div className="predict_resultItem">
                <span className="predict_resultLabel">Confidence Level:</span>
                <span className="predict_resultValue">
                  <span className="predict_confidenceBar">
                    <span 
                      className="predict_confidenceFill" 
                      style={{width: `${prediction.confidence}%`}}
                    ></span>
                  </span>
                  {prediction.confidence}%
                </span>
              </div>
              <div className="predict_resultItem">
                <span className="predict_resultLabel">Recommended Specialist:</span>
                <span className="predict_resultValue predict_specialist">{prediction.doctor}</span>
              </div>
              <div className="predict_resultItem predict_resultItem--full">
                <span className="predict_resultLabel">AI Analysis:</span>
                <div className="predict_aiResponse">{prediction.ai_response}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictForm;