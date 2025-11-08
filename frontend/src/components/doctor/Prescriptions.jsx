import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Pill, 
  User, 
  Calendar, 
  Plus, 
  X, 
  Clock,
  FileText,
  Loader,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import "./Prescriptions.css";
import API_URL from "../../services/api";

function Prescriptions() {
  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [prescriptionForms, setPrescriptionForms] = useState({});
  const [expandedPatients, setExpandedPatients] = useState({});

  // Predefined medication data
  const medicationOptions = [
    "Paracetamol", "Amoxicillin", "Cetirizine", "Vitamin D3",
    "Ibuprofen", "Azithromycin", "Loratadine", "Calcium",
    "Metformin", "Atorvastatin", "Aspirin", "Omeprazole"
  ];

  const timingOptions = [
    "Before breakfast", "After breakfast", "Before lunch",
    "After lunch", "Before dinner", "After dinner",
    "At bedtime", "As needed"
  ];

  const dosageOptions = [
    "1 tablet", "2 tablets", "1/2 tablet", "1 capsule",
    "5ml", "10ml", "15ml", "As directed"
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const physicianData = JSON.parse(localStorage.getItem("userData"));
        const physicianId = physicianData?._id;
        if (!physicianId) {
          setErrorMessage("Physician identification not available");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/patients/by-doctor/${physicianId}`
        );
        setPatientList(response.data || []);
      } catch (err) {
        console.error(err);
        setErrorMessage("Unable to load patient information");
        setPatientList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const togglePatientView = (patientId) => {
    setExpandedPatients(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  const updateMedicationField = (patientId, field, value, index = 0) => {
    setPrescriptionForms((prev) => {
      const patientForm = prev[patientId] || { 
        medications: [{}], 
        prescriptionDate: new Date().toISOString().split('T')[0] 
      };
      let medications = [...patientForm.medications];
      medications[index] = { ...medications[index], [field]: value };
      return { ...prev, [patientId]: { ...patientForm, medications } };
    });
  };

  const addMedicationEntry = (patientId) => {
    setPrescriptionForms((prev) => {
      const patientForm = prev[patientId] || { 
        medications: [{}], 
        prescriptionDate: new Date().toISOString().split('T')[0] 
      };
      return {
        ...prev,
        [patientId]: {
          ...patientForm,
          medications: [...patientForm.medications, {}]
        }
      };
    });
  };

  const removeMedicationEntry = (patientId, index) => {
    setPrescriptionForms((prev) => {
      const patientForm = prev[patientId];
      if (!patientForm || patientForm.medications.length <= 1) return prev;
      
      const medications = patientForm.medications.filter((_, i) => i !== index);
      return { ...prev, [patientId]: { ...patientForm, medications } };
    });
  };

  const updatePrescriptionDate = (patientId, value) => {
    setPrescriptionForms((prev) => {
      const patientForm = prev[patientId] || { 
        medications: [{}], 
        prescriptionDate: value 
      };
      return { ...prev, [patientId]: { ...patientForm, prescriptionDate: value } };
    });
  };

  const submitPrescription = async (patientId) => {
    try {
      const formData = prescriptionForms[patientId];
      if (!formData || !formData.prescriptionDate || 
          formData.medications.some(med => !med.name || !med.dosage || !med.time)) {
        alert("Please complete all required medication fields");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/patients/${patientId}/prescriptions`,
        formData
      );
      
      alert("Prescription successfully recorded!");
      
      // Update local state
      setPatientList((prev) =>
        prev.map((patient) =>
          patient._id === patientId
            ? { 
                ...patient, 
                prescriptions: [...(patient.prescriptions || []), response.data.prescription] 
              }
            : patient
        )
      );
      
      // Reset form for this patient
      setPrescriptionForms((prev) => ({ 
        ...prev, 
        [patientId]: { 
          medications: [{}], 
          prescriptionDate: new Date().toISOString().split('T')[0] 
        } 
      }));
    } catch (err) {
      console.error(err);
      alert("Prescription submission failed");
    }
  };

  if (isLoading) {
    return (
      <div className="med_manager_loading">
        <Loader className="med_manager_spinner" size={32} />
        <p>Loading patient records...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="med_manager_error">
        <AlertTriangle size={48} className="med_manager_error_icon" />
        <h3>Data Loading Issue</h3>
        <p>{errorMessage}</p>
        <button onClick={() => window.location.reload()} className="med_manager_retry_btn">
          Refresh Data
        </button>
      </div>
    );
  }

  if (!patientList || patientList.length === 0) {
    return (
      <div className="med_manager_empty">
        <User size={64} className="med_manager_empty_icon" />
        <h3>No Patient Assignments</h3>
        <p>You currently don't have any patients under your care.</p>
      </div>
    );
  }

  return (
    <div className="med_manager_container">
      {/* Header Section */}
      <div className="med_manager_header">
        <div className="med_manager_title_section">
          <Pill size={28} className="med_manager_header_icon" />
          <div>
            <h1 className="med_manager_main_title">Medication Management</h1>
            <p className="med_manager_subtitle">Prescribe and manage patient medications</p>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="med_patient_list">
        {patientList.map((patient) => {
          const patientForm = prescriptionForms[patient._id] || { 
            medications: [{}], 
            prescriptionDate: new Date().toISOString().split('T')[0] 
          };
          const isPatientExpanded = expandedPatients[patient._id];

          return (
            <div key={patient._id} className="med_patient_card">
              {/* Patient Summary */}
              <div 
                className="med_patient_summary"
                onClick={() => togglePatientView(patient._id)}
              >
                <div className="med_patient_identity">
                  <div className="med_patient_avatar">
                    {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="med_patient_info">
                    <h3 className="med_patient_name">{patient.name}</h3>
                    <p className="med_patient_details">
                      ID: {patient.patientId} • {patient.age} years • {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="med_patient_controls">
                  <div className="med_expand_indicator">
                    {isPatientExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expanded Patient Details */}
              {isPatientExpanded && (
                <div className="med_patient_expanded">
                  {/* Existing Prescriptions */}
                  <div className="med_existing_prescriptions">
                    <h4 className="med_section_title">
                      <FileText size={18} />
                      Current Prescriptions
                    </h4>
                    {patient.prescriptions && patient.prescriptions.length > 0 ? (
                      <div className="med_prescriptions_grid">
                        {patient.prescriptions.map((prescription, index) => (
                          <div key={index} className="med_prescription_card">
                            <div className="med_prescription_header">
                              <span className="med_prescription_date">
                                <Calendar size={14} />
                                {new Date(prescription.date).toLocaleDateString()}
                              </span>
                              <span className="med_prescription_status">Active</span>
                            </div>
                            <div className="med_medications_list">
                              {prescription.medicines && prescription.medicines.map((medicine, medIndex) => (
                                <div key={medIndex} className="med_medication_item">
                                  <span className="med_medication_name">{medicine.name}</span>
                                  <span className="med_medication_schedule">
                                    {medicine.dosage} • {medicine.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="med_no_prescriptions">
                        <Pill size={24} />
                        <p>No active prescriptions</p>
                      </div>
                    )}
                  </div>

                  {/* New Prescription Form */}
                  <div className="med_new_prescription">
                    <h4 className="med_section_title">
                      <Plus size={18} />
                      New Prescription
                    </h4>
                    
                    <div className="med_form_group">
                      <label className="med_form_label">
                        <Calendar size={16} />
                        Prescription Date
                      </label>
                      <input
                        type="date"
                        value={patientForm.prescriptionDate}
                        onChange={(e) => updatePrescriptionDate(patient._id, e.target.value)}
                        className="med_date_input"
                      />
                    </div>

                    <div className="med_medications_form">
                      <label className="med_form_label">Medication Details</label>
                      {patientForm.medications.map((medication, index) => (
                        <div key={index} className="med_medication_row">
                          <div className="med_medication_fields">
                            <select
                              value={medication.name || ""}
                              onChange={(e) => updateMedicationField(patient._id, "name", e.target.value, index)}
                              className="med_medication_select"
                              required
                            >
                              <option value="">Select Medication</option>
                              {medicationOptions.map((med, i) => (
                                <option key={i} value={med}>{med}</option>
                              ))}
                            </select>

                            <select
                              value={medication.dosage || ""}
                              onChange={(e) => updateMedicationField(patient._id, "dosage", e.target.value, index)}
                              className="med_dosage_select"
                              required
                            >
                              <option value="">Dosage</option>
                              {dosageOptions.map((dosage, i) => (
                                <option key={i} value={dosage}>{dosage}</option>
                              ))}
                            </select>

                            <select
                              value={medication.time || ""}
                              onChange={(e) => updateMedicationField(patient._id, "time", e.target.value, index)}
                              className="med_timing_select"
                              required
                            >
                              <option value="">Timing</option>
                              {timingOptions.map((time, i) => (
                                <option key={i} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>

                          {patientForm.medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedicationEntry(patient._id, index)}
                              className="med_remove_btn"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addMedicationEntry(patient._id)}
                        className="med_add_btn"
                      >
                        <Plus size={16} />
                        Add Another Medication
                      </button>
                    </div>

                    <button
                      onClick={() => submitPrescription(patient._id)}
                      className="med_submit_btn"
                    >
                      <Pill size={18} />
                      Submit Prescription
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Prescriptions;