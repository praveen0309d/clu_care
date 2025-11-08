import React from "react";
import { 
  FileText, 
  Download, 
  Calendar,
  TestTube
} from "lucide-react";
import "./LabReports.css";
import API_URL from "../../services/api";

const LabReports = ({ labReports }) => {
  if (!labReports || labReports.length === 0) {
    return (
      <div className="test_results_empty">
        <TestTube size={48} className="test_results_empty_icon" />
        <h3>No test results available</h3>
        <p>You don't have any lab reports at the moment.</p>
      </div>
    );
  }

  return (
    <div className="test_results_container">
      <div className="test_results_header">
        <div className="test_results_title_section">
          <TestTube size={28} className="test_results_icon" />
          <div>
            <h1 className="test_results_title">Laboratory Results</h1>
            <p className="test_results_subtitle">Your medical test reports and analysis</p>
          </div>
        </div>
        <div className="test_results_stats">
          <span className="test_results_count">{labReports.length} reports</span>
        </div>
      </div>

      <div className="test_results_grid">
        {labReports.map((report, index) => (
          <div key={index} className="test_results_card">
            <div className="test_results_card_header">
              <div className="test_results_main_info">
                <FileText size={20} className="test_results_file_icon" />
                <div className="test_results_test_info">
                  <h3 className="test_results_test_name">{report.testName}</h3>
                  <div className="test_results_date">
                    <Calendar size={14} />
                    {report.date}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="test_results_content">
              <div className="test_results_section">
                <h4 className="test_results_section_title">Test Findings</h4>
                <p className="test_results_value">{report.results}</p>
              </div>
              
              {report.file && (
                <div className="test_results_actions">
                  <a
                    href={`${API_URL}${report.file}`.replace(/([^:]\/)\/+/g, "$1")}
                    download={report.file.split("/").pop()}
                    className="test_results_download_btn"
                  >
                    <Download size={16} />
                    Download Report
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabReports;