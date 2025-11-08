import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Calendar, 
  Clock, 
  User, 
  Check, 
  X, 
  Eye,
  Filter,
  Loader,
  AlertTriangle,
  MoreVertical
} from "lucide-react";
import "./Appointments.css";
import API_URL from "../../services/api";

function Appointments() {
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const physicianId = localStorage.getItem("userId");

  // Fetch physician's appointments
  useEffect(() => {
    const getPhysicianAppointments = async () => {
      if (!physicianId) {
        setErrorMessage("Physician ID not available. Please sign in again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/appointments/${physicianId}`
        );
        setScheduledAppointments(response.data);
      } catch (err) {
        console.error("Unable to load appointments", err);
        setErrorMessage("Unable to load appointments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getPhysicianAppointments();
  }, [physicianId]);

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update local state
      setScheduledAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: newStatus } : appointment
        )
      );
    } catch (err) {
      console.error("Status update unsuccessful", err);
      alert("Unable to update appointment status");
    }
  };

  // Filter appointments based on current filter
  const filteredAppointments = scheduledAppointments.filter(appointment => {
    if (currentFilter === "all") return true;
    return appointment.status === currentFilter;
  });

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved": return "schedule_status_confirmed";
      case "pending": return "schedule_status_pending";
      case "cancelled": return "schedule_status_cancelled";
      case "completed": return "schedule_status_completed";
      default: return "schedule_status_pending";
    }
  };

  // Open appointment details
  const openAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  if (isLoading) {
    return (
      <div className="schedule_loading_state">
        <Loader className="schedule_loading_spinner" size={32} />
        <p>Loading your schedule...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="schedule_error_state">
        <AlertTriangle size={24} />
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="schedule_manager_container">
      {/* Header Section */}
      <div className="schedule_manager_header">
        <div className="schedule_title_section">
          <Calendar className="schedule_header_icon" size={24} />
          <div>
            <h1 className="schedule_main_title">Appointment Schedule</h1>
            <p className="schedule_subtitle">Manage your patient consultations</p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="schedule_statistics">
        <div className="schedule_stat_card">
          <span className="schedule_stat_number">{scheduledAppointments.length}</span>
          <span className="schedule_stat_label">Total Bookings</span>
        </div>
        <div className="schedule_stat_card schedule_stat_pending">
          <span className="schedule_stat_number">
            {scheduledAppointments.filter(a => a.status === "pending").length}
          </span>
          <span className="schedule_stat_label">Awaiting Review</span>
        </div>
        <div className="schedule_stat_card schedule_stat_confirmed">
          <span className="schedule_stat_number">
            {scheduledAppointments.filter(a => a.status === "approved").length}
          </span>
          <span className="schedule_stat_label">Confirmed</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="schedule_filter_controls">
        <button 
          className={`schedule_filter_btn ${currentFilter === "all" ? "schedule_filter_active" : ""}`}
          onClick={() => setCurrentFilter("all")}
        >
          <Filter size={16} />
          All Appointments
        </button>
        <button 
          className={`schedule_filter_btn ${currentFilter === "pending" ? "schedule_filter_active" : ""}`}
          onClick={() => setCurrentFilter("pending")}
        >
          Pending Review
        </button>
        <button 
          className={`schedule_filter_btn ${currentFilter === "approved" ? "schedule_filter_active" : ""}`}
          onClick={() => setCurrentFilter("approved")}
        >
          Confirmed
        </button>
        <button 
          className={`schedule_filter_btn ${currentFilter === "cancelled" ? "schedule_filter_active" : ""}`}
          onClick={() => setCurrentFilter("cancelled")}
        >
          Cancelled
        </button>
        <button 
          className={`schedule_filter_btn ${currentFilter === "completed" ? "schedule_filter_active" : ""}`}
          onClick={() => setCurrentFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Appointments List */}
      <div className="schedule_appointments_list">
        {filteredAppointments.length === 0 ? (
          <div className="schedule_empty_state">
            <Calendar size={48} className="schedule_empty_icon" />
            <h3>No Appointments Available</h3>
            <p>
              {currentFilter === "all" 
                ? "You don't have any scheduled appointments." 
                : `No ${currentFilter} appointments found.`}
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="schedule_appointment_card">
              <div className="schedule_card_header">
                <div className="schedule_patient_info">
                  <div className="schedule_patient_identity">
                    <User className="schedule_info_icon" size={18} />
                    <div>
                      <h3 className="schedule_patient_id">Patient ID: {appointment.patientId}</h3>
                      {appointment.patientName && (
                        <p className="schedule_patient_name">{appointment.patientName}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`schedule_status_badge ${getStatusStyle(appointment.status)}`}>
                  {appointment.status}
                </div>
              </div>

              <div className="schedule_appointment_details">
                <div className="schedule_detail_row">
                  <Calendar className="schedule_detail_icon" size={16} />
                  <span className="schedule_detail_text">
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="schedule_detail_row">
                  <Clock className="schedule_detail_icon" size={16} />
                  <span className="schedule_detail_text">
                    {new Date(appointment.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {appointment.description && (
                  <div className="schedule_description">
                    <p className="schedule_reason_text">
                      <strong>Consultation Reason:</strong> {appointment.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="schedule_action_buttons">
                {appointment.status === "pending" && (
                  <>
                    <button
                      className="schedule_action_btn schedule_approve_btn"
                      onClick={() => updateAppointmentStatus(appointment._id, "approved")}
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      className="schedule_action_btn schedule_cancel_btn"
                      onClick={() => updateAppointmentStatus(appointment._id, "cancelled")}
                    >
                      <X size={16} />
                      Decline
                    </button>
                  </>
                )}
                
                {appointment.status === "approved" && (
                  <button
                    className="schedule_action_btn schedule_complete_btn"
                    onClick={() => updateAppointmentStatus(appointment._id, "completed")}
                  >
                    <Check size={16} />
                    Mark Completed
                  </button>
                )}

                <button
                  className="schedule_action_btn schedule_details_btn"
                  onClick={() => openAppointmentDetails(appointment)}
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="schedule_modal_overlay" onClick={closeModal}>
          <div className="schedule_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="schedule_modal_header">
              <h2 className="schedule_modal_title">Appointment Details</h2>
              <button 
                className="schedule_modal_close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="schedule_modal_body">
              <div className="schedule_modal_section">
                <h3 className="schedule_modal_section_title">Patient Information</h3>
                <div className="schedule_modal_details">
                  <div className="schedule_modal_detail">
                    <span className="schedule_modal_label">Patient ID:</span>
                    <span className="schedule_modal_value">{selectedAppointment.patientId}</span>
                  </div>
                  {selectedAppointment.patientName && (
                    <div className="schedule_modal_detail">
                      <span className="schedule_modal_label">Patient Name:</span>
                      <span className="schedule_modal_value">{selectedAppointment.patientName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="schedule_modal_section">
                <h3 className="schedule_modal_section_title">Appointment Information</h3>
                <div className="schedule_modal_details">
                  <div className="schedule_modal_detail">
                    <span className="schedule_modal_label">Scheduled Date:</span>
                    <span className="schedule_modal_value">
                      {new Date(selectedAppointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="schedule_modal_detail">
                    <span className="schedule_modal_label">Scheduled Time:</span>
                    <span className="schedule_modal_value">
                      {new Date(selectedAppointment.date).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="schedule_modal_detail">
                    <span className="schedule_modal_label">Current Status:</span>
                    <span className={`schedule_status_badge ${getStatusStyle(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAppointment.description && (
                <div className="schedule_modal_section">
                  <h3 className="schedule_modal_section_title">Consultation Details</h3>
                  <p className="schedule_modal_description">{selectedAppointment.description}</p>
                </div>
              )}
            </div>

            <div className="schedule_modal_footer">
              {selectedAppointment.status === "pending" && (
                <div className="schedule_modal_actions">
                  <button
                    className="schedule_modal_btn schedule_modal_approve"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment._id, "approved");
                      closeModal();
                    }}
                  >
                    <Check size={16} />
                    Approve Appointment
                  </button>
                  <button
                    className="schedule_modal_btn schedule_modal_cancel"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment._id, "cancelled");
                      closeModal();
                    }}
                  >
                    <X size={16} />
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;