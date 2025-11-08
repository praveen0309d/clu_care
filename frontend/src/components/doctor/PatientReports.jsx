import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  User, 
  FlaskConical, 
  FileText, 
  Download, 
  Eye, 
  Loader,
  AlertTriangle,
  Calendar,
  Cake,
  ChevronDown,
  ChevronUp,
  Shield,
  Heart
} from "lucide-react";
import "./PatientReports.css";
import API_URL from "../../services/api";

function PatientReports() {
  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState(null);

  const physicianId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (!physicianId) {
          setErrorMessage("Physician authentication required");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/patients/by-doctor/${physicianId}`
        );
        setPatientList(response.data);
      } catch (err) {
        console.error("Error loading patient data:", err);
        setErrorMessage("Unable to load patient information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [physicianId]);

  const togglePatientDetails = (patientId) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };

  const formatReportDate = (dateString) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="clinical_reports_loading">
        <Loader className="clinical_reports_spinner" size={32} />
        <p>Loading clinical reports...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="clinical_reports_error">
        <AlertTriangle size={48} className="clinical_reports_error_icon" />
        <h3>Data Loading Issue</h3>
        <p>{errorMessage}</p>
        <button 
          className="clinical_reports_retry_btn"
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </button>
      </div>
    );
  }

  if (!patientList.length) {
    return (
      <div className="clinical_reports_empty">
        <FlaskConical size={64} className="clinical_reports_empty_icon" />
        <h3>No Patient Assignments</h3>
        <p>You currently don't have any patients under your care.</p>
      </div>
    );
  }

  return (
    <div className="clinical_reports_container">
      {/* Header Section */}
      <div className="clinical_reports_header">
        <div className="clinical_reports_title_section">
          <FlaskConical size={28} className="clinical_reports_header_icon" />
          <div>
            <h1 className="clinical_reports_main_title">Clinical Laboratory Reports</h1>
            <p className="clinical_reports_subtitle">Access and review patient test results</p>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="clinical_patients_list">
        {patientList.map((patient) => (
          <div key={patient.patientId} className="clinical_patient_card">
            {/* Patient Summary */}
            <div 
              className="clinical_patient_summary"
              onClick={() => togglePatientDetails(patient.patientId)}
            >
              <div className="clinical_patient_identity">
                <div className="clinical_patient_avatar">
                  {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div className="clinical_patient_info">
                  <h3 className="clinical_patient_name">{patient.name}</h3>
                  <p className="clinical_patient_id">Medical ID: {patient.patientId}</p>
                  <div className="clinical_patient_metadata">
                    <span className="clinical_metadata_item">
                      <Cake size={14} className="clinical_metadata_icon" />
                      {patient.age} years
                    </span>
                    <span className="clinical_metadata_item">
                      <User size={14} className="clinical_metadata_icon" />
                      {patient.gender}
                    </span>
                  </div>
                </div>
              </div>

              <div className="clinical_report_summary">
                <span className="clinical_report_count">
                  {patient.labReports?.length || 0} test reports
                </span>
                <div className="clinical_expand_indicator">
                  {expandedPatientId === patient.patientId ? 
                    <ChevronUp size={20} /> : 
                    <ChevronDown size={20} />
                  }
                </div>
              </div>
            </div>

            {/* Expanded Reports Section */}
            {expandedPatientId === patient.patientId && (
              <div className="clinical_reports_expanded">
                {patient.labReports && patient.labReports.length > 0 ? (
                  <div className="clinical_reports_grid">
                    {patient.labReports.map((report, index) => (
                      <div key={index} className="clinical_report_item">
                        <div className="clinical_report_header">
                          <div className="clinical_report_title_section">
                            <FlaskConical size={18} className="clinical_report_icon" />
                            <h4 className="clinical_report_test_name">{report.testName}</h4>
                          </div>
                          <span className="clinical_report_date">
                            <Calendar size={14} className="clinical_date_icon" />
                            {formatReportDate(report.date)}
                          </span>
                        </div>

                        <div className="clinical_report_content">
                          <div className="clinical_report_results">
                            <span className="clinical_results_label">Test Findings:</span>
                            <p className="clinical_results_text">
                              {report.results || "Results pending or unavailable"}
                            </p>
                          </div>

                          {report.file && (
                            <div className="clinical_report_actions">
                              <a
                                href={`${API_URL}${report.file}`.replace(/([^:]\/)\/+/g, "$1")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="clinical_action_btn clinical_view_report_btn"
                              >
                                <Eye size={16} className="clinical_action_icon" />
                                View Full Report
                              </a>
                              <a
                                href={`${API_URL}${report.file}`.replace(/([^:]\/)\/+/g, "$1")}
                                download={report.file.split("/").pop()}
                                className="clinical_action_btn clinical_download_btn"
                              >
                                <Download size={16} className="clinical_action_icon" />
                                Download PDF
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="clinical_no_reports">
                    <FileText size={48} className="clinical_no_reports_icon" />
                    <p>No laboratory reports available for this patient</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Notice */}
      <div className="clinical_reports_footer">
        <div className="clinical_footer_notice">
          <Shield size={16} className="clinical_footer_icon" />
          <p className="clinical_footer_text">
            All laboratory reports contain confidential medical information. 
            Ensure compliance with patient privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientReports;