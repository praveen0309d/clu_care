import React, { useEffect, useState } from "react";
import PatientProfile from "../../components/patient/PatientProfile";
import Appointments from "../../components/patient/Appointments";
import Prescriptions from "../../components/patient/Prescriptions";
import LabReports from "../../components/patient/LabReports";
import AssignedDoctor from "../../components/patient/AssignedDoctor";
import PredictForm from "../../components/patient/PredictForm";
import { 
  User, 
  Calendar, 
  Pill, 
  FileText, 
  Stethoscope, 
  Activity,
  Menu,
  X,
  Phone
} from "lucide-react";
import "./PatientDashboard.css";
import API_URL from "../../services/api";

const PatientDashboard = () => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSection, setSelectedSection] = useState("profile");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");

  // Fetch patient information function
  const getPatientData = async () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user || !user.patientId) {
      setErrorMessage("Missing user or patientId! Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/mypatient/${user.patientId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch patient information");
      setPatientInfo(result);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error loading patient information.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPatientData();
    
    // Update time every minute
    const timeInterval = setInterval(() => setCurrentDateTime(new Date()), 60000);
    
    // Monitor screen size
    const handleWindowResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setIsNavigationOpen(false);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const getTimeBasedGreeting = () => {
    const currentHour = currentDateTime.getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (isMobileView) {
      setIsNavigationOpen(false);
    }
  };

  const toggleNavigation = () => {
    setIsNavigationOpen(!isNavigationOpen);
  };

  if (isLoading) return <div className="portal_loading">Loading your health information...</div>;
  if (errorMessage) return <div className="portal_error">{errorMessage}</div>;
  if (!patientInfo) return <div className="portal_error">No patient information available.</div>;

  return (
    <div className="patient_portal_container">
      <div className="portal_main_wrapper">
        {/* Top Header Section */}
        <header className="portal_header_section">
          <div className="header_content_wrapper">
            <div className="greeting_container">
              <h1>{getTimeBasedGreeting()}, {patientInfo.name || 'Valued Patient'}!</h1>
              <p className="welcome_subtitle">We're here to support your health journey</p>
              <div className="current_date_display">
                {currentDateTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            {/* Mobile Menu Toggle */}
            {isMobileView && (
              <button 
                className="mobile_nav_toggle"
                onClick={toggleNavigation}
                aria-label="Toggle navigation menu"
              >
                {isNavigationOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </header>

        <div className="portal_content_area">
          {/* Side Navigation Panel */}
          <nav className={`side_navigation_panel ${isMobileView ? 'mobile_navigation' : ''} ${isNavigationOpen ? 'navigation_open' : ''}`}>
            <div className="user_profile_header">
              <div className="user_avatar_circle">
                {patientInfo.name ? patientInfo.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div className="user_details">
                <h3>{patientInfo.name || 'Patient'}</h3>
                <p>Patient ID: {patientInfo.patientId}</p>
              </div>
              {isMobileView && (
                <button 
                  className="close_navigation_btn"
                  onClick={() => setIsNavigationOpen(false)}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="navigation_menu">
              <button 
                className={`menu_option ${selectedSection === "profile" ? "menu_option_active" : ""}`}
                onClick={() => handleSectionChange("profile")}
              >
                <User className="menu_icon" size={20} />
                <span className="menu_label">Profile</span>
              </button>
              
              <button 
                className={`menu_option ${selectedSection === "appointments" ? "menu_option_active" : ""}`}
                onClick={() => handleSectionChange("appointments")}
              >
                <Calendar className="menu_icon" size={20} />
                <span className="menu_label">Appointments</span>
                {patientInfo.appointments && patientInfo.appointments.length > 0 && (
                  <span className="notification_badge">{patientInfo.appointments.length}</span>
                )}
              </button>
              
              <button 
                className={`menu_option ${selectedSection === "prescriptions" ? "menu_option_active" : ""}`}
                onClick={() => handleSectionChange("prescriptions")}
              >
                <Pill className="menu_icon" size={20} />
                <span className="menu_label">Prescriptions</span>
                {patientInfo.prescriptions && patientInfo.prescriptions.length > 0 && (
                  <span className="notification_badge">{patientInfo.prescriptions.length}</span>
                )}
              </button>
              
              <button 
                className={`menu_option ${selectedSection === "labReports" ? "menu_option_active" : ""}`}
                onClick={() => handleSectionChange("labReports")}
              >
                <FileText className="menu_icon" size={20} />
                <span className="menu_label">Lab Reports</span>
                {patientInfo.labReports && patientInfo.labReports.length > 0 && (
                  <span className="notification_badge">{patientInfo.labReports.length}</span>
                )}
              </button>
              
              <button 
                className={`menu_option ${selectedSection === "doctor" ? "menu_option_active" : ""}`}
                onClick={() => handleSectionChange("doctor")}
              >
                <Stethoscope className="menu_icon" size={20} />
                <span className="menu_label">My Doctor</span>
              </button>

              <button 
                className={`menu_option ${selectedSection === "diseas" ? "menu_option_active" : ""}`}
                onClick={() => handleSectionChange("diseas")}
              >
                <Activity className="menu_icon" size={20} />
                <span className="menu_label">Disease Predict</span>
              </button>  
            </div>

            <div className="navigation_footer">
              <div className="emergency_contact_info">
                <Phone size={16} />
                <div>
                  <p>Emergency Contact</p>
                  <strong>+1 (555) 123-HELP</strong>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="content_display_area">
            <div className="content_wrapper">
              {selectedSection === "profile" && <PatientProfile patient={patientInfo} />}
              {selectedSection === "appointments" && (
                <Appointments
                  patientData={patientInfo}
                  token={authToken}
                  refreshData={getPatientData}
                />
              )}
              {selectedSection === "prescriptions" && (
                <Prescriptions prescriptions={patientInfo.prescriptions || []} />
              )}
              {selectedSection === "labReports" && (
                <LabReports labReports={patientInfo.labReports || []} />
              )}
              {selectedSection === "doctor" && patientInfo.assignedDoctor && (
                <AssignedDoctor doctor={patientInfo.assignedDoctor} />
              )}
              {selectedSection === "diseas" && patientInfo.assignedDoctor && (
                <PredictForm doctor={patientInfo.assignedDoctor} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;