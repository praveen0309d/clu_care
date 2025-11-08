import React from "react";
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle,
  Droplet,
  Stethoscope,
  Hospital,
  Clipboard,
  HeartPulse
} from "lucide-react";
import './PatientProfile.css';

const PatientProfile = ({ patient }) => {
  if (!patient) return <div className="data-missing-alert">No patient records found.</div>;

  return (
    <div className="health-record-container">
      {/* Personal Details Panel */}
      <section className="data-panel">
        <header className="panel-heading">
          <User className="panel-icon" size={18} />
          <h3 className="panel-title">Personal Information</h3>
        </header>
        <div className="panel-body">
          <div className="field-grid">
            <div className="field-item">
              <span className="field-name">Gender</span>
              <span className="field-data">{patient.gender || 'Not specified'}</span>
            </div>
            <div className="field-item">
              <span className="field-name">Patient Type</span>
              <span className="field-data">{patient.type || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Information Panel */}
      <section className="data-panel">
        <header className="panel-heading">
          <Hospital className="panel-icon" size={18} />
          <h3 className="panel-title">Clinical Details</h3>
        </header>
        <div className="panel-body">
          <div className="field-grid">
            {patient.medicalSpecialty && (
              <div className="field-item">
                <span className="field-name">Medical Specialty</span>
                <span className="field-data">{patient.medicalSpecialty}</span>
              </div>
            )}
            {patient.wardNumber && (
              <div className="field-item">
                <Hospital size={16} className="field-icon" />
                <span className="field-name">Ward Number</span>
                <span className="field-data">{patient.wardNumber}</span>
              </div>
            )}
            {patient.cartNumber && (
              <div className="field-item">
                <Clipboard size={16} className="field-icon" />
                <span className="field-name">Cart Number</span>
                <span className="field-data">{patient.cartNumber}</span>
              </div>
            )}
            {patient.admissionDate && (
              <div className="field-item">
                <Calendar size={16} className="field-icon" />
                <span className="field-name">Admission Date</span>
                <span className="field-data">{patient.admissionDate}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Health Metrics Panel */}
      {(patient.bloodGroup || patient.allergies || patient.conditions) && (
        <section className="data-panel">
          <header className="panel-heading">
            <HeartPulse className="panel-icon" size={18} />
            <h3 className="panel-title">Health Metrics</h3>
          </header>
          <div className="panel-body">
            <div className="field-grid">
              {patient.bloodGroup && (
                <div className="field-item">
                  <Droplet size={16} className="field-icon" />
                  <span className="field-name">Blood Type</span>
                  <span className="field-data">{patient.bloodGroup}</span>
                </div>
              )}
              {patient.allergies && (
                <div className="field-item">
                  <AlertTriangle size={16} className="field-icon" />
                  <span className="field-name">Allergies</span>
                  <span className="field-data">{patient.allergies}</span>
                </div>
              )}
              {patient.conditions && (
                <div className="field-item">
                  <Stethoscope size={16} className="field-icon" />
                  <span className="field-name">Medical Conditions</span>
                  <span className="field-data">{patient.conditions}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Details Panel */}
      {patient.contact && (
        <section className="data-panel">
          <header className="panel-heading">
            <Phone className="panel-icon" size={18} />
            <h3 className="panel-title">Contact Details</h3>
          </header>
          <div className="panel-body">
            <div className="contact-list">
              {patient.contact.phone && (
                <div className="contact-entry">
                  <Phone size={16} className="contact-symbol" />
                  <div className="contact-info">
                    <span className="contact-category">Phone Number</span>
                    <span className="contact-detail">{patient.contact.phone}</span>
                  </div>
                </div>
              )}
              {patient.contact.email && (
                <div className="contact-entry">
                  <Mail size={16} className="contact-symbol" />
                  <div className="contact-info">
                    <span className="contact-category">Email Address</span>
                    <span className="contact-detail">{patient.contact.email}</span>
                  </div>
                </div>
              )}
              {patient.contact.address && (
                <div className="contact-entry">
                  <MapPin size={16} className="contact-symbol" />
                  <div className="contact-info">
                    <span className="contact-category">Home Address</span>
                    <span className="contact-detail">{patient.contact.address}</span>
                  </div>
                </div>
              )}
              {patient.contact.emergencyContact && (
                <div className="contact-entry">
                  <AlertTriangle size={16} className="contact-symbol" />
                  <div className="contact-info">
                    <span className="contact-category">Emergency Contact</span>
                    <span className="contact-detail">{patient.contact.emergencyContact}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PatientProfile;