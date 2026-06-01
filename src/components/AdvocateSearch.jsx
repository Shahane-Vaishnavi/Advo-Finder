import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import AdvocateCard from './AdvocateCard';
import { advocateAPI } from '../api';
import '../styles/AdvocateSearch.css';

export default function AdvocateSearch({ initialSearchTerm = '' }) {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    specialization: initialSearchTerm,
    city: '',
  });

  const specializations = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Labor Law',
    'Corporate Law',
    'Constitutional Law',
    'Cyber Crime',
    'Property Law',
  ];

  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Pune',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await advocateAPI.searchAdvocates(filters);
      setAdvocates(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to search advocates');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (initialSearchTerm) {
      handleSearch();
    }
  }, []);

  return (
    <div className="advocate-search-container">
      <div className="search-header">
        <h2>Find Verified Advocates</h2>
        <p>Search and connect with legal experts in your area</p>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label>Specialization</label>
          <select
            name="specialization"
            value={filters.specialization}
            onChange={handleFilterChange}
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>City</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-search"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Searching...
            </>
          ) : (
            <>
              <FaSearch />
              Search
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="advocates-grid">
        {loading && (
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
            <p>Searching for advocates...</p>
          </div>
        )}

        {!loading && advocates.length === 0 && !error && (
          <div className="empty-state">
            <FaSearch className="empty-icon" />
            <h3>No advocates found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}

        {!loading && advocates.length > 0 && (
          <>
            <div className="results-header">
              <p className="results-count">Found {advocates.length} advocate{advocates.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="grid">
              {advocates.map(advocate => (
                <AdvocateCard key={advocate.id} advocate={advocate} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
