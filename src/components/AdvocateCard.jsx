import React from 'react';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaGraduate, FaWhatsapp, FaCheckCircle, FaPhone } from 'react-icons/fa';
import '../styles/AdvocateCard.css';

export default function AdvocateCard({ advocate }) {
  if (!advocate) return null;

  const handleWhatsAppClick = () => {
    const phoneNumber = advocate.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      'Hello Advocate, I found your profile on LegalSakhi and would like legal assistance regarding my issue.'
    );
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${advocate.phone}`;
  };

  return (
    <div className="advocate-card">
      {advocate.profile_verified && (
        <div className="verified-badge">
          <FaCheckCircle />
          <span>Verified</span>
        </div>
      )}

      <div className="advocate-header">
        <div className="advocate-info">
          <h3 className="advocate-name">{advocate.full_name}</h3>
          <div className="advocate-bar-council">
            Bar Council: <strong>{advocate.bar_council_number}</strong>
          </div>
        </div>

        <div className="advocate-rating">
          <FaStar className="star-icon" />
          <span className="rating-value">{advocate.rating}</span>
        </div>
      </div>

      <div className="advocate-details">
        <div className="detail-item">
          <FaBriefcase className="detail-icon" />
          <div>
            <div className="detail-label">Specialization</div>
            <div className="detail-value">{advocate.specialization}</div>
          </div>
        </div>

        <div className="detail-item">
          <FaGraduate className="detail-icon" />
          <div>
            <div className="detail-label">Experience</div>
            <div className="detail-value">{advocate.experience} years</div>
          </div>
        </div>

        <div className="detail-item">
          <FaMapMarkerAlt className="detail-icon" />
          <div>
            <div className="detail-label">Location</div>
            <div className="detail-value">{advocate.city}</div>
          </div>
        </div>
      </div>

      {advocate.about && (
        <div className="advocate-about">
          <p>{advocate.about}</p>
        </div>
      )}

      <div className="advocate-actions">
        <button
          className="btn btn-whatsapp"
          onClick={handleWhatsAppClick}
          title="Chat on WhatsApp"
        >
          <FaWhatsapp />
          Chat on WhatsApp
        </button>

        <button
          className="btn btn-call"
          onClick={handleCallClick}
          title="Call advocate"
        >
          <FaPhone />
          Call
        </button>
      </div>
    </div>
  );
}
