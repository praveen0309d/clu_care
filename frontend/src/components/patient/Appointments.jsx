import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Plus,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import "./Appointment.css";
import API_URL from "../../services/api";

const Appointment = () => {
  const [currentView, setCurrentView] = useState("myBookings");
  const [specialties, setSpecialties] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    medicalSpecialty: "",
    doctorId: "",
    date: "",
    description: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);

  const authToken = localStorage.getItem("authToken");
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Fetch medical specialties
  const getSpecialties = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/departments`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setSpecialties(response.data);
    } catch (err) {
      console.error("Error loading specialties:", err);
    }
  };

  // Fetch available doctors when specialty changes
  useEffect(() => {
    const getDoctors = async () => {
      if (!bookingForm.medicalSpecialty) {
        setDoctorList([]);
        return;
      }
      try {
        const response = await axios.get(
          `${API_URL}/appointments/staff/available?specialty=${bookingForm.medicalSpecialty}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setDoctorList(response.data);
      } catch (err) {
        console.error("Error loading doctors:", err);
      }
    };
    getDoctors();
  }, [bookingForm.medicalSpecialty, authToken]);

  // Fetch user's bookings
  const getUserBookings = async () => {
    if (!userData || !userData.patientId) return;
    try {
      const response = await axios.get(
        `${API_URL}/appointments/mine/${userData.patientId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setBookingList(response.data);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSpecialties();
    getUserBookings();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  // Submit new booking request
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.doctorId || !bookingForm.date) {
      toast.error("Please select both doctor and appointment time");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/appointments/add`,
        {
          patientId: userData.patientId,
          doctorId: bookingForm.doctorId,
          date: bookingForm.date,
          description: bookingForm.description,
          notes: bookingForm.notes
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      toast.success("Appointment requested successfully!");
      setBookingForm({
        medicalSpecialty: "",
        doctorId: "",
        date: "",
        description: "",
        notes: ""
      });
      getUserBookings();
      setCurrentView("myBookings");
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.error("Failed to submit appointment request");
    }
  };

  // Filter bookings based on search and status
  const filteredBookings = bookingList.filter(booking => {
    const matchesSearch = booking.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Toggle booking details
  const toggleBookingDetails = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (isLoading) {
    return (
      <div className="appoint_Pa_loadingContainer">
        <div className="appoint_Pa_loadingSpinner"></div>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="appoint_Pa_dashboard">
      {/* Header */}
      <header className="appoint_Pa_header">
        <div className="appoint_Pa_headerContent">
          <h1>Appointments</h1>
          <p>Manage your medical appointments</p>
        </div>
        <button 
          className="appoint_Pa_primaryBtn appoint_Pa_newAppointmentBtn"
          onClick={() => setCurrentView("newBooking")}
        >
          <Plus size={18} />
          New Appointment
        </button>
      </header>

      {/* Main Content */}
      <div className="appoint_Pa_content">
        {currentView === "myBookings" ? (
          <div className="appoint_Pa_bookingsView">
            {/* Controls */}
            <div className="appoint_Pa_controlsBar">
              <div className="appoint_Pa_searchBox">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                className="appoint_Pa_filterSelect"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Appointments List */}
            <div className="appoint_Pa_appointmentsContainer">
              {filteredBookings.length === 0 ? (
                <div className="appoint_Pa_emptyState">
                  <Calendar size={48} className="appoint_Pa_emptyIcon" />
                  <h3>No appointments found</h3>
                  <p>You don't have any appointments scheduled yet.</p>
                  <button 
                    className="appoint_Pa_primaryBtn"
                    onClick={() => setCurrentView("newBooking")}
                  >
                    Schedule Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="appoint_Pa_appointmentsList">
                  {filteredBookings.map((booking) => {
                    const formattedDate = formatDate(booking.date);
                    return (
                      <div key={booking._id} className="appoint_Pa_appointmentItem">
                        <div 
                          className="appoint_Pa_appointmentHeader"
                          onClick={() => toggleBookingDetails(booking._id)}
                        >
                          <div className="appoint_Pa_appointmentMainInfo">
                            <div className="appoint_Pa_doctorAvatar">
                              <User size={20} />
                            </div>
                            <div className="appoint_Pa_appointmentDetails">
                              <h4 className="appoint_Pa_doctorName">{booking.doctorName}</h4>
                              <p className="appoint_Pa_department">{booking.department}</p>
                              <div className="appoint_Pa_appointmentMeta">
                                <span className="appoint_Pa_date">
                                  <Calendar size={14} />
                                  {formattedDate.date}
                                </span>
                                <span className="appoint_Pa_time">
                                  <Clock size={14} />
                                  {formattedDate.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="appoint_Pa_appointmentActions">
                            <div className={`appoint_Pa_statusBadge appoint_Pa_status_${booking.status?.toLowerCase()}`}>
                              {booking.status}
                            </div>
                            {expandedBooking === booking._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {expandedBooking === booking._id && (
                          <div className="appoint_Pa_appointmentExpanded">
                            <div className="appoint_Pa_expandedDetails">
                              {booking.description && (
                                <div className="appoint_Pa_detailRow">
                                  <label>Reason for visit:</label>
                                  <span>{booking.description}</span>
                                </div>
                              )}
                              {booking.notes && (
                                <div className="appoint_Pa_detailRow">
                                  <label>Additional notes:</label>
                                  <span>{booking.notes}</span>
                                </div>
                              )}
                              <div className="appoint_Pa_detailRow">
                                <label>Appointment ID:</label>
                                <span className="appoint_Pa_appointmentId">{booking._id}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="appoint_Pa_bookingFormView">
            <div className="appoint_Pa_formHeader">
              <button 
                className="appoint_Pa_backBtn"
                onClick={() => setCurrentView("myBookings")}
              >
                ← Back to Appointments
              </button>
              <h2>Schedule New Appointment</h2>
            </div>

            <form className="appoint_Pa_appointmentForm" onSubmit={handleBookingSubmit}>
              <div className="appoint_Pa_formGrid">
                <div className="appoint_Pa_formGroup">
                  <label className="appoint_Pa_formLabel">
                    <Stethoscope size={16} />
                    Medical Specialty
                  </label>
                  <select
                    name="medicalSpecialty"
                    value={bookingForm.medicalSpecialty}
                    onChange={handleInputChange}
                    className="appoint_Pa_formSelect"
                    required
                  >
                    <option value="">Select a specialty</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="appoint_Pa_formGroup">
                  <label className="appoint_Pa_formLabel">
                    <User size={16} />
                    Select Doctor
                  </label>
                  <select
                    name="doctorId"
                    value={bookingForm.doctorId}
                    onChange={handleInputChange}
                    className="appoint_Pa_formSelect"
                    required
                    disabled={!bookingForm.medicalSpecialty}
                  >
                    <option value="">{bookingForm.medicalSpecialty ? "Choose a doctor" : "Select specialty first"}</option>
                    {doctorList.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="appoint_Pa_formGroup">
                  <label className="appoint_Pa_formLabel">
                    <Calendar size={16} />
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleInputChange}
                    className="appoint_Pa_formInput"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div className="appoint_Pa_formGroup appoint_Pa_fullWidth">
                  <label className="appoint_Pa_formLabel">Reason for Visit</label>
                  <input
                    type="text"
                    name="description"
                    value={bookingForm.description}
                    onChange={handleInputChange}
                    className="appoint_Pa_formInput"
                    placeholder="Brief description of your concern"
                  />
                </div>

                <div className="appoint_Pa_formGroup appoint_Pa_fullWidth">
                  <label className="appoint_Pa_formLabel">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    className="appoint_Pa_formTextarea"
                    placeholder="Any additional information for the doctor"
                    rows="4"
                  />
                </div>
              </div>

              <div className="appoint_Pa_formActions">
                <button 
                  type="button" 
                  className="appoint_Pa_secondaryBtn"
                  onClick={() => setCurrentView("myBookings")}
                >
                  Cancel
                </button>
                <button type="submit" className="appoint_Pa_primaryBtn">
                  Request Appointment
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;