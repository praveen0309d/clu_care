import React, { useEffect, useState } from "react";
import { 
  Pill, 
  Calendar, 
  User, 
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import './Prescriptions.css'
import API_URL from "../../services/api";

const Prescriptions = () => {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const authToken = localStorage.getItem("authToken");

    if (!user || !user.patientId) {
      setErrorMessage("No patient information available");
      setIsLoading(false);
      return;
    }

    const getMedications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/mypatient/${user.patientId}/prescriptions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Unable to load medications (${response.status})`);
        }

        const data = await response.json();
        setMedications(Array.isArray(data) ? data : []);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMedications();
  }, []);

  if (isLoading) {
    return (
      <div className="med_list_loading">
        <div className="med_list_spinner"></div>
        <p>Loading your medications...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="med_list_error">
        <AlertCircle size={24} />
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="med_list_container">
      <div className="med_list_header">
        <div className="med_list_title_section">
          <Pill size={28} className="med_list_icon" />
          <div>
            <h1 className="med_list_title">My Medications</h1>
            <p className="med_list_subtitle">Prescribed treatments and medications</p>
          </div>
        </div>
        <div className="med_list_stats">
          <span className="med_list_count">{medications.length} prescriptions</span>
        </div>
      </div>

      {medications.length === 0 ? (
        <div className="med_list_empty">
          <FileText size={48} className="med_list_empty_icon" />
          <h3>No prescriptions available</h3>
          <p>You don't have any active prescriptions at the moment.</p>
        </div>
      ) : (
        <div className="med_list_grid">
          {medications.map((prescription, index) => (
            <div key={index} className="med_list_card">
              {/* Card Header */}
              <div className="med_list_card_header">
                <div className="med_list_prescription_info">
                  <div className="med_list_prescription_number">
                    <span>Prescription #{index + 1}</span>
                  </div>
                  <div className="med_list_date">
                    <Calendar size={14} />
                    {new Date(prescription.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                {prescription.doctorName && (
                  <div className="med_list_doctor">
                    <User size={14} />
                    Dr. {prescription.doctorName}
                  </div>
                )}
              </div>

              {/* Medications List */}
              <div className="med_list_medications">
                <h4 className="med_list_medications_title">Medications</h4>
                <div className="med_list_medications_list">
                  {(prescription.medicines || prescription.medications || []).map((medicine, medIndex) => (
                    <div key={medIndex} className="med_list_medication_item">
                      <div className="med_list_medication_main">
                        <Pill size={16} className="med_list_medication_icon" />
                        <span className="med_list_medication_name">{medicine.name}</span>
                      </div>
                      <div className="med_list_medication_details">
                        <span className="med_list_dosage">{medicine.dosage || medicine.dose}</span>
                        <span className="med_list_separator">•</span>
                        <span className="med_list_frequency">
                          <Clock size={12} />
                          {medicine.time || medicine.frequency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {prescription.instructions && (
                <div className="med_list_instructions">
                  <div className="med_list_instructions_header">
                    <FileText size={16} />
                    <strong>Special Instructions</strong>
                  </div>
                  <p className="med_list_instructions_text">{prescription.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;