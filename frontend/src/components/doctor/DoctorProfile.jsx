import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  User, 
  Mail, 
  Phone, 
  Hospital, 
  Stethoscope, 
  GraduationCap, 
  Calendar,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Loader,
  AlertCircle,
  Shield
} from "lucide-react";
import "./DoctorProfile.css";
import API_URL from "../../services/api";

function DoctorProfile() {
  const [physician, setPhysician] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const physicianId = localStorage.getItem("userId");

  useEffect(() => {
    if (!physicianId) {
      setErrorMessage("Physician ID not available. Please sign in again.");
      setIsLoading(false);
      return;
    }

    const fetchPhysicianData = async () => {
      try {
        const response = await axios.get(`${API_URL}api/staff/${physicianId}`);
        setPhysician(response.data);
      } catch (err) {
        console.error("Unable to load physician data:", err);
        setErrorMessage("Unable to load your profile information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhysicianData();
  }, [physicianId]);

  const updateAvailability = async () => {
    if (!physician || isUpdating) return;

    const updatedStatus = physician.status === "active" ? "inactive" : "active";
    setIsUpdating(true);

    try {
      await axios.put(
        `${API_URL}api/staff/${physicianId}/status`,
        { status: updatedStatus },
        { 
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          } 
        }
      );

      setPhysician((prev) => ({ ...prev, status: updatedStatus }));
    } catch (err) {
      console.error("Status update unsuccessful:", err);
      alert("Unable to update availability. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="phys_profile_loading">
        <Loader className="phys_profile_spinner" size={32} />
        <p>Loading your professional profile...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="phys_profile_error">
        <AlertCircle size={48} className="phys_profile_error_icon" />
        <h3>Profile Loading Issue</h3>
        <p>{errorMessage}</p>
        <button 
          className="phys_profile_retry_btn"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!physician) {
    return (
      <div className="phys_profile_error">
        <User size={48} className="phys_profile_error_icon" />
        <h3>Profile Information Unavailable</h3>
        <p>We couldn't retrieve your professional details.</p>
      </div>
    );
  }

  return (
    <div className="phys_profile_container">
      {/* Profile Header */}
      <div className="phys_profile_content">
        {/* Professional Details Card */}
        <div className="phys_profile_details_card">
          <div className="phys_profile_card_header">
            <User className="phys_profile_card_icon" size={20} />
            <h2 className="phys_profile_card_title">Professional Information</h2>
          </div>

          <div className="phys_profile_details_grid">
            <div className="phys_profile_detail_item">
              <div className="phys_profile_detail_icon_container">
                <Mail className="phys_profile_detail_icon" size={18} />
              </div>
              <div className="phys_profile_detail_content">
                <span className="phys_profile_detail_label">Email Address</span>
                <span className="phys_profile_detail_value">{physician.email || "Not provided"}</span>
              </div>
            </div>

            <div className="phys_profile_detail_item">
              <div className="phys_profile_detail_icon_container">
                <Phone className="phys_profile_detail_icon" size={18} />
              </div>
              <div className="phys_profile_detail_content">
                <span className="phys_profile_detail_label">Contact Number</span>
                <span className="phys_profile_detail_value">{physician.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="phys_profile_detail_item">
              <div className="phys_profile_detail_icon_container">
                <Hospital className="phys_profile_detail_icon" size={18} />
              </div>
              <div className="phys_profile_detail_content">
                <span className="phys_profile_detail_label">Medical Department</span>
                <span className="phys_profile_detail_value">{physician.department || "Not specified"}</span>
              </div>
            </div>

            <div className="phys_profile_detail_item">
              <div className="phys_profile_detail_icon_container">
                <Stethoscope className="phys_profile_detail_icon" size={18} />
              </div>
              <div className="phys_profile_detail_content">
                <span className="phys_profile_detail_label">Area of Specialization</span>
                <span className="phys_profile_detail_value">{physician.specialization || "Not specified"}</span>
              </div>
            </div>

            <div className="phys_profile_detail_item">
              <div className="phys_profile_detail_icon_container">
                <GraduationCap className="phys_profile_detail_icon" size={18} />
              </div>
              <div className="phys_profile_detail_content">
                <span className="phys_profile_detail_label">Professional Qualifications</span>
                <span className="phys_profile_detail_value">{physician.qualifications || "Not provided"}</span>
              </div>
            </div>

            <div className="phys_profile_detail_item">
              <div className="phys_profile_detail_icon_container">
                <Calendar className="phys_profile_detail_icon" size={18} />
              </div>
              <div className="phys_profile_detail_content">
                <span className="phys_profile_detail_label">Practice Start Date</span>
                <span className="phys_profile_detail_value">{formatJoinDate(physician.joinDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Guidance Card */}
        <div className="phys_profile_guidance_card">
          <div className="phys_profile_card_header">
            <Shield className="phys_profile_card_icon" size={20} />
            <h2 className="phys_profile_card_title">Profile Information</h2>
          </div>
          <div className="phys_profile_guidance_content">
            <p>
              Your professional profile helps patients find and connect with you. 
              Maintaining accurate information and current availability status ensures 
              you receive appropriate appointment requests.
            </p>
            
            <div className="phys_profile_guidance_tips">
              <div className="phys_profile_tip">
                <span className="phys_profile_tip_bullet">•</span>
                Keep your contact information current
              </div>
              <div className="phys_profile_tip">
                <span className="phys_profile_tip_bullet">•</span>
                Update your availability regularly
              </div>
              <div className="phys_profile_tip">
                <span className="phys_profile_tip_bullet">•</span>
                Ensure specialization details are accurate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;