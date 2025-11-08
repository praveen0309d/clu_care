import React, { useState } from "react";
import axios from "axios";
import { 
  Upload, 
  FileImage, 
  X, 
  Activity,
  Stethoscope,
  AlertCircle,
  Brain
} from "lucide-react";
import "./PredictForm.css";
import API_URL from "../../services/api";

const PredictForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload a medical image first!");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${API_URL}disease/predict`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAnalysisResult(response.data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setFileName(file.name);
      } else {
        alert("Please select a valid image file.");
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileName("");
  };

  return (
    <div className="health_analyzer_container">
      <div className="health_analyzer_header">
        <div className="health_analyzer_title_section">
          <Brain size={28} className="health_analyzer_icon" />
          <div>
            <h1 className="health_analyzer_title">Medical Image Analysis</h1>
            <p className="health_analyzer_subtitle">AI-powered disease detection from medical images</p>
          </div>
        </div>
      </div>
      
      <div className="health_analyzer_content">
        <form onSubmit={handleFormSubmit} className="health_analyzer_form">
          <div className="health_analyzer_upload_section">
            <label htmlFor="health_analyzer_file_input" className="health_analyzer_upload_label">
              Upload Medical Scan
            </label>
            
            <div 
              className={`health_analyzer_drop_area ${isDragActive ? "health_analyzer_drop_area--active" : ""} ${fileName ? "health_analyzer_drop_area--filled" : ""}`}
              onDragEnter={handleDragEvents}
              onDragLeave={handleDragEvents}
              onDragOver={handleDragEvents}
              onDrop={handleFileDrop}
            >
              <input
                id="health_analyzer_file_input"
                type="file"
                onChange={handleFileSelection}
                accept="image/*"
                className="health_analyzer_file_input"
              />
              
              <div className="health_analyzer_drop_content">
                <div className="health_analyzer_upload_graphic">
                  <FileImage size={48} className="health_analyzer_upload_icon" />
                </div>
                
                {fileName ? (
                  <div className="health_analyzer_file_details">
                    <div className="health_analyzer_file_info">
                      <FileImage size={20} />
                      <p className="health_analyzer_file_name">{fileName}</p>
                    </div>
                    <button 
                      type="button" 
                      className="health_analyzer_remove_button"
                      onClick={clearSelectedFile}
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="health_analyzer_drop_message">
                      <span 
                        className="health_analyzer_click_upload"
                        onClick={() => document.getElementById('health_analyzer_file_input').click()}
                      >
                        Click to upload
                      </span> or drag your file here
                    </p>
                    <p className="health_analyzer_file_requirements">
                      Supports JPG, PNG, GIF • Maximum 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="health_analyzer_submit_button"
            disabled={isProcessing || !selectedFile}
          >
            {isProcessing ? (
              <>
                <div className="health_analyzer_processing_spinner"></div>
                Analyzing Medical Image...
              </>
            ) : (
              <>
                <Activity size={18} />
                Analyze Image
              </>
            )}
          </button>
        </form>

        {analysisResult && (
          <div className="health_analyzer_results">
            <h3 className="health_analyzer_results_title">
              <Stethoscope size={20} />
              Diagnostic Results
            </h3>
            <div className="health_analyzer_result_card">
              <div className="health_analyzer_result_item">
                <span className="health_analyzer_result_label">Identified Condition:</span>
                <span className="health_analyzer_result_value health_analyzer_condition">
                  {analysisResult.predicted_class}
                </span>
              </div>
              
              <div className="health_analyzer_result_item">
                <span className="health_analyzer_result_label">Confidence Score:</span>
                <div className="health_analyzer_confidence_display">
                  <div className="health_analyzer_confidence_track">
                    <div 
                      className="health_analyzer_confidence_level" 
                      style={{width: `${analysisResult.confidence}%`}}
                    ></div>
                  </div>
                  <span className="health_analyzer_confidence_value">
                    {analysisResult.confidence}%
                  </span>
                </div>
              </div>
              
              <div className="health_analyzer_result_item">
                <span className="health_analyzer_result_label">Recommended Specialist:</span>
                <span className="health_analyzer_result_value health_analyzer_specialist">
                  {analysisResult.doctor}
                </span>
              </div>
              
              <div className="health_analyzer_result_item health_analyzer_result_item--full">
                <span className="health_analyzer_result_label">AI Analysis Report:</span>
                <div className="health_analyzer_ai_insight">
                  {analysisResult.ai_response}
                </div>
              </div>
            </div>
            
            <div className="health_analyzer_actions">
              <button className="health_analyzer_action_button health_analyzer_action_primary">
                <Stethoscope size={16} />
                Find Specialist
              </button>
              <button className="health_analyzer_action_button health_analyzer_action_secondary">
                <Upload size={16} />
                New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictForm;