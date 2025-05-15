import React, { useState, useEffect, useRef } from "react";
import "../../css/style.css";

import { useNavigate } from "react-router-dom";
import UpdateUserProfile from "./UpdateUserProfile";


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
     image: string; first_name: string, last_name:string, middle_name:string, email: string, password: string, address:string ,
     contact_number: string, zone: string, barangay:string,
    } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const profileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  

  // Fetch admin profile on load
  useEffect(() => {
    const userId = localStorage.getItem('user_id'); // Retrieve the admin ID from local storage

    if (userId) {
      fetch(`${apiUrl}/api/user/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text(); // This might be HTML
          throw new Error(`Error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        setUserProfile(data || null);
      })
      .catch(err => {
        console.error("Failed to fetch user profile:", err.message);
      });
    } else {
        console.log("User ID not found in local storage");
    }
  }, [apiUrl]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Redirect to login page
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = (e: MouseEvent) => {
    if (
      profileRef.current &&
      dropdownRef.current &&
      !profileRef.current.contains(e.target as Node) &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <nav>
      <i className="bx bx-menu toggle-sidebar"></i>
       {/* Search Form */}
       <form action="#">
        {/* <div className="form-group">
          <input type="text" placeholder="Search..." />
          <i className="bx bx-search icon"></i>
        </div> */}
      </form>

      {/* <a href="#" className="nav-link">
        <i className="bx bxs-bell icon"></i>
        <span className="badge">5</span>
      </a>
      <a href="#" className="nav-link">
        <i className="bx bxs-message-square-dots icon"></i>
        <span className="badge">8</span>
      </a>
      <span className="divider"></span> */}

<div className="profile" ref={profileRef} onClick={toggleDropdown}>
{userProfile && (
  <img src={`${apiUrl}/uploads/${userProfile.image}`} alt="Profile" />
)}

  <ul className={`profile-link ${isDropdownOpen ? "show" : ""}`} ref={dropdownRef}>
    <li>
      <p style={{ fontSize: "12px", margin: "4px", paddingLeft: "10px" }}>
      {`Hi, ${userProfile?.first_name} ${userProfile?.last_name}`}
      </p>
    </li>
          <li>
          {/* onClick={() => setIsModalOpen(true)} */}
          <a href="#" onClick={() => setIsModalOpen(true)}>
  <i className="bx bxs-cog"></i> Update Profile
</a>

          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <i className="bx bxs-log-out-circle"></i> Logout
            </a>
          </li>
        </ul>
      </div>

       {isModalOpen && userProfile && (
        <UpdateUserProfile
          initialFirstName={userProfile.first_name}
          initialMiddleName={userProfile.middle_name}
          initialLastName={userProfile.last_name}
          image={userProfile.image}
          initialEmail={userProfile.email}
          address={userProfile.address}
          contact_number={userProfile.contact_number}
          zone ={userProfile.zone}
          barangay={userProfile.barangay}
          initialPassword={userProfile.password}
          userId={localStorage.getItem('user_id') || ""}
          onClose={() => setIsModalOpen(false)}
        />
      )} 
    </nav>
  );
};

export default Navbar;
