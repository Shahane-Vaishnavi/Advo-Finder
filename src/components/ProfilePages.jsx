import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaFilter, FaSearch, FaShieldAlt, FaSignOutAlt, FaStar, FaUserCircle } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
const specializations = [
  'Family Lawyer',
  'Criminal Lawyer',
  'Civil Lawyer',
  'Corporate Lawyer',
  'Cyber Crime Lawyer',
  'Property Lawyer',
  'Divorce Lawyer',
  'Women\'s Rights Lawyer',
  'Labour Lawyer',
  'Consumer Court Lawyer',
];

export function UserProfilePage({ user, setUser, logout }) {
  const [profile, setProfile] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/user/profile/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
          setUser(data);
        }
      } catch (error) {
        setStatusMessage('Unable to load profile details.');
      }
    };
    fetchProfile();
  }, [user, setUser]);

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('');
    try {
      const response = await fetch(`${API_BASE}/user/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profile.full_name,
          email: profile.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatusMessage(data.detail || data.message || 'Unable to save profile.');
      } else {
        setProfile(data);
        setUser(data);
        setStatusMessage('Profile saved successfully.');
      }
    } catch (error) {
      setStatusMessage('Something went wrong while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-shell">
        <div className="profile-card">
          <h2>Profile Required</h2>
          <p>Please log in as a user to access your LegalSakhi profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-shell">
      <div className="profile-header-card">
        <div>
          <div className="page-label">User Profile</div>
          <h1>{profile?.full_name || 'LegalSakhi User'}</h1>
          <p className="page-note">Manage your account details securely and keep your contact information up to date.</p>
        </div>
        <button className="logout-pill" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="profile-panel">
        <div className="profile-card form-card">
          <div className="section-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Update your full name and email address for LegalSakhi notifications.</p>
            </div>
            <span className="badge badge-soft">Verified Member</span>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <input
                type="text"
                value={profile?.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                value={profile?.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>

          {statusMessage && <div className="status-message">{statusMessage}</div>}

          <div className="action-row">
            <button className="submit-btn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="profile-card summary-card">
          <div className="section-heading">
            <div>
              <h2>Account Summary</h2>
              <p>Quick access to your active profile information and legal help registration.</p>
            </div>
          </div>
          <div className="summary-grid">
            <div>
              <span>Full Name</span>
              <strong>{profile?.full_name}</strong>
            </div>
            <div>
              <span>Email Address</span>
              <strong>{profile?.email}</strong>
            </div>
          </div>
          <div className="profile-highlights">
            <div className="highlight-card">
              <FaUserCircle className="highlight-icon" />
              <div>
                <strong>Secure Account</strong>
                <p>Your account is protected with LegalSakhi.</p>
              </div>
            </div>
            <div className="highlight-card">
              <FaCheckCircle className="highlight-icon" />
              <div>
                <strong>Trusted Network</strong>
                <p>Connect with verified advocates anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdvocateProfilePage({ advocate, setAdvocate, logout }) {
  const [profile, setProfile] = useState(advocate);
  const [clients, setClients] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [customSpecialization, setCustomSpecialization] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    if (!advocate) return;
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/advocate/profile/${advocate.id}`);
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
          setAdvocate(data);
          setSelectedSpecialization(data.specialization || '');
          if (data.specialization && !specializations.includes(data.specialization)) {
            setSelectedSpecialization('Other');
            setCustomSpecialization(data.specialization);
          }
        }
      } catch (error) {
        setStatusMessage('Unable to load advocate profile.');
      }
    };
    fetchProfile();
  }, [advocate, setAdvocate]);

  useEffect(() => {
    if (!advocate) return;
    const loadClients = async () => {
      try {
        const params = new URLSearchParams();
        if (filterStatus && filterStatus !== 'All') {
          params.append('status', filterStatus);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        const url = `${API_BASE}/advocate/clients/${advocate.id}${query}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setClients(data.clients || data);
        }
      } catch (error) {
        setStatusMessage('Unable to load client history.');
      }
    };
    loadClients();
  }, [advocate, filterStatus, searchQuery]);

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('');
    try {
      const specializationValue = selectedSpecialization === 'Other' ? customSpecialization : selectedSpecialization;
      const response = await fetch(`${API_BASE}/advocate/profile/${advocate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          city: profile.city,
          specialization: specializationValue,
          experience: profile.experience,
          cases_handled: profile.cases_handled,
          about: profile.about,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatusMessage(data.detail || data.message || 'Unable to save advocate profile.');
      } else {
        setProfile(data);
        setAdvocate(data);
        setStatusMessage('Advocate profile saved successfully.');
      }
    } catch (error) {
      setStatusMessage('Unable to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!advocate) {
    return (
      <div className="profile-shell">
        <div className="profile-card">
          <h2>Advocate Access Required</h2>
          <p>Please log in as an advocate to access your LegalSakhi dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-shell">
      <div className="profile-header-card">
        <div>
          <div className="page-label">Advocate Dashboard</div>
          <h1>{profile?.full_name || 'Verified Advocate'}</h1>
          <p className="page-note">Manage your practice profile, specialization, experience, and client history.</p>
        </div>
        <button className="logout-pill" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="profile-panel">
        <div className="profile-card form-card">
          <div className="section-heading">
            <div>
              <h2>Professional Profile</h2>
              <p>Keep your advocate profile complete to build trust with clients.</p>
            </div>
            <span className="badge badge-soft badge-verified">
              <FaShieldAlt /> Verified Advocate
            </span>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <input
                type="text"
                value={profile?.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                value={profile?.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Bar Council Registration Number</label>
              <input type="text" value={profile?.bar_council_id || ''} disabled />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profile?.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>City / Location</label>
              <input
                type="text"
                value={profile?.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div className="form-field specialization-field">
              <label>Legal Specialization</label>
              <select
                value={selectedSpecialization || (specializations.includes(profile?.specialization) ? profile?.specialization : 'Other')}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSpecialization(value);
                  if (value !== 'Other') {
                    setCustomSpecialization('');
                    setProfile({ ...profile, specialization: value });
                  }
                }}
              >
                <option value="">Choose specialization</option>
                {specializations.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="Other">Other / Custom</option>
              </select>
              {selectedSpecialization === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter a custom specialization"
                  value={customSpecialization}
                  onChange={(e) => {
                    setCustomSpecialization(e.target.value);
                    setProfile({ ...profile, specialization: e.target.value });
                  }}
                />
              )}
            </div>
            <div className="form-field">
              <label>Years of Experience</label>
              <input
                type="text"
                value={profile?.experience || ''}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                placeholder="e.g. 8 years"
              />
            </div>
            <div className="form-field">
              <label>Cases Handled</label>
              <input
                type="text"
                value={profile?.cases_handled || ''}
                onChange={(e) => setProfile({ ...profile, cases_handled: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="form-field form-fullwidth">
              <label>About Me</label>
              <textarea
                rows="5"
                value={profile?.about || ''}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                placeholder="Tell clients about your practice, experience, and services."
              />
            </div>
          </div>

          {statusMessage && <div className="status-message">{statusMessage}</div>}
          <div className="action-row">
            <button className="submit-btn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="profile-card summary-card">
          <div className="section-heading">
            <div>
              <h2>Client History</h2>
              <p>Filter your consultations, track progress, and find ongoing cases quickly.</p>
            </div>
          </div>
          <div className="client-filter-row">
            <div className="form-field">
              <label>Search Client</label>
              <div className="search-box">
                <FaSearch className="input-icon" />
                <input
                  type="search"
                  placeholder="Search by client or category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="form-field">
              <label>Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>All</option>
                <option>Ongoing</option>
                <option>Closed</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div className="client-table-wrap">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Case Category</th>
                  <th>Consultation Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.length ? (
                  clients.map((item) => (
                    <tr key={item.id}>
                      <td>{item.client_name}</td>
                      <td>{item.case_category}</td>
                      <td>{item.consultation_date}</td>
                      <td><span className={`status-pill status-${item.status?.toLowerCase()}`}>{item.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No client history found for this profile yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
