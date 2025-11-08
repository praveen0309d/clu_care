import React, { useState } from "react";
import axios from "axios";
import "./FetusPredictor.css";
import API_URL from "../../services/api";

const FetusPredictor = () => {
  const [image, setImage] = useState(null);
  const [predictedImg, setPredictedImg] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${API_URL}/machine/predict`,
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000
        }
      );

      setDetections(response.data.detections || []);
      setPredictedImg(response.data.image || null);
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Prediction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setImage(null);
    setPredictedImg(null);
    setDetections([]);
    setFileName("");
    // Reset file input
    const fileInput = document.querySelector('.Fetus_fileInput');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="Fetus_container">
      <h2 className="Fetus_title">Fetus Abnormality Detection</h2>
      
      <div className="Fetus_uploadSection">
        <label htmlFor="fetusImageUpload" className="Fetus_uploadLabel">
          Upload Ultrasound Image
        </label>
        
        <div className="Fetus_fileInputWrapper">
          <input
            id="fetusImageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="Fetus_fileInput"
          />
          <div className="Fetus_fileDisplay">
            {fileName || "Choose an ultrasound image..."}
          </div>
        </div>
        
        <div className="Fetus_buttonGroup">
          <button 
            onClick={handlePredict} 
            className="Fetus_predictBtn"
            disabled={isLoading || !image}
          >
            {isLoading ? (
              <>
                <span className="Fetus_loadingSpinner"></span>
                Analyzing...
              </>
            ) : (
              "Predict Abnormalities"
            )}
          </button>
          
          <button 
            onClick={clearResults}
            className="Fetus_clearBtn"
          >
            Clear
          </button>
        </div>
      </div>

      {detections.length > 0 && (
        <div className="Fetus_resultsSection">
          <h3 className="Fetus_resultsTitle">Detection Results</h3>
          
          <div className="Fetus_detectionsList">
            <h4 className="Fetus_detectionsTitle">Found Abnormalities:</h4>
            <ul className="Fetus_detections">
              {detections.map((d, idx) => (
                <li key={idx} className="Fetus_detectionItem">
                  <span className="Fetus_detectionClass">{d.class}</span>
                  <span className="Fetus_detectionConfidence">
                    Confidence: {(d.confidence * 100).toFixed(1)}%
                  </span>
                  <div className="Fetus_confidenceBar">
                    <div 
                      className="Fetus_confidenceFill"
                      style={{ width: `${d.confidence * 100}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {predictedImg && (
        <div className="Fetus_imageSection">
          <h3 className="Fetus_imageTitle">Annotated Ultrasound</h3>
          <div className="Fetus_imageContainer">
            <img
              src={predictedImg}
              alt="Prediction result"
              className="Fetus_annotatedImage"
            />
          </div>
        </div>
      )}

      {!image && (
        <div className="Fetus_instructions">
          <h4>How to use:</h4>
          <ul>
            <li>Upload a clear ultrasound image</li>
            <li>Click "Predict Abnormalities" to analyze</li>
            <li>Review the detection results and annotated image</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FetusPredictor;