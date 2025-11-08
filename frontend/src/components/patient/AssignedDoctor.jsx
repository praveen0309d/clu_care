import React from "react";
import { 
  User, 
  Mail, 
  Hospital, 
  Target,
  Stethoscope,
  Phone
} from "lucide-react";
import "./AssignedDoctor.css";

const AssignedDoctor = ({ doctor }) => {
  if (!doctor) {
    return (
      <div className="doc_profile_empty">
        <User size={48} className="doc_profile_empty_icon" />
        <h3>No physician assigned</h3>
        <p>You don't have a primary care doctor assigned at the moment.</p>
      </div>
    );
  }

  return (
    <div className="doc_profile_container">
      <div className="doc_profile_header">
        <div className="doc_profile_title_section">
          <Stethoscope size={28} className="doc_profile_icon" />
          <div>
            <h1 className="doc_profile_title">Your Care Team</h1>
            <p className="doc_profile_subtitle">Primary care physician information</p>
          </div>
        </div>
      </div>

      <div className="doc_profile_card">
        <div className="doc_profile_main">
          <div className="doc_profile_avatar">
            <User size={32} />
          </div>
          <div className="doc_profile_info">
            <h2 className="doc_profile_name">Dr. {doctor.name}</h2>
            <p className="doc_profile_role">Primary Care Physician</p>
            <div className="doc_profile_badges">
              <span className="doc_profile_badge doc_profile_badge_primary">
                {doctor.specialization}
              </span>
              <span className="doc_profile_badge doc_profile_badge_secondary">
                {doctor.department}
              </span>
            </div>
          </div>
        </div>

        <div className="doc_profile_details">
          <div className="doc_profile_detail_item">
            <div className="doc_profile_detail_icon">
              <Mail size={18} />
            </div>
            <div className="doc_profile_detail_content">
              <p className="doc_profile_detail_label">Email Address</p>
              <p className="doc_profile_detail_value doc_profile_email">{doctor.email}</p>
            </div>
          </div>
          
          <div className="doc_profile_detail_item">
            <div className="doc_profile_detail_icon">
              <Hospital size={18} />
            </div>
            <div className="doc_profile_detail_content">
              <p className="doc_profile_detail_label">Medical Department</p>
              <p className="doc_profile_detail_value">{doctor.department}</p>
            </div>
          </div>
          
          <div className="doc_profile_detail_item">
            <div className="doc_profile_detail_icon">
              <Target size={18} />
            </div>
            <div className="doc_profile_detail_content">
              <p className="doc_profile_detail_label">Specialization</p>
              <p className="doc_profile_detail_value">{doctor.specialization}</p>
            </div>
          </div>

          {doctor.phone && (
            <div className="doc_profile_detail_item">
              <div className="doc_profile_detail_icon">
                <Phone size={18} />
              </div>
              <div className="doc_profile_detail_content">
                <p className="doc_profile_detail_label">Contact Number</p>
                <p className="doc_profile_detail_value">{doctor.phone}</p>
              </div>
            </div>
          )}
        </div>

        <div className="doc_profile_actions">
          <button className="doc_profile_btn doc_profile_btn_primary">
            <Mail size={16} />
            Send Message
          </button>
          <button className="doc_profile_btn doc_profile_btn_secondary">
            <Phone size={16} />
            Schedule Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignedDoctor;