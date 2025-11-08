import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import "./Navbar.css"

const NavigationBar = () => {
  const navigate = useNavigate();
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
  };

  // Get color based on role
  const getNavbarColor = () => {
    const roleColors = {
      patient: "var(--patient-primary)",
      doctor: "var(--doctor-primary)",
      pharmacy: "var(--pharmacy-primary)",
      admin: "var(--admin-primary)",
      default: "var(--neutral-primary)"
    };
    return roleColors[role] || roleColors.default;
  };

  return (
    <header className="nav-header" style={{ backgroundColor: getNavbarColor() }}>
      <div className="nav-wrapper">
        {/* Brand Logo */}
        <div className="nav-logo">
          <Link to="/" className="logo-link">
            <Stethoscope size={24} />
            <span>CluCare</span>
          </Link>
        </div>

        {/* Desktop User Section - Hidden on mobile */}
        <div className="desktop-user-section">
          {userEmail && (
            <div className="user-details">
              <span className="user-role">{role?.toUpperCase()}</span>
              <span className="user-email">{userEmail}</span>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            className="logout-button"
            aria-label="Logout"
          >
            <LogOut size={18} />
            <span className="logout-label">Logout</span>
          </button>
        </div>

        {/* Mobile Logout - Always visible in top right */}
        <button 
          onClick={handleLogout} 
          className="mobile-logout-icon"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>



        {/* Mobile Navigation Panel */}
        <div className={`mobile-nav-panel ${mobileMenuActive ? 'mobile-nav-panel--active' : ''}`}>
          {userEmail && (
            <div className="mobile-user-info">
              <span className="user-role-label">{role?.toUpperCase()}</span>
              <span className="user-email-text">{userEmail}</span>
            </div>
          )}
          
          {/* Add your navigation links here for mobile menu */}

        </div>


      </div>
    </header>
  );
};

export default NavigationBar;