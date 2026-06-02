import React, { useState, useEffect } from 'react';
import { FaSearch, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPlayCircle, FaHandsHelping, FaPhoneAlt, FaFileSignature, FaBriefcase, FaUserShield, FaUserGraduate, FaWheelchair, FaBalanceScale, FaFilter, FaCheckCircle, FaStar, FaPlusSquare, FaEllipsisV, FaMoon, FaSun } from 'react-icons/fa';
import './index.css';
import './styles/Auth.css';
import './styles/AdvocateCard.css';
import './styles/AdvocateSearch.css';
import LigalSakhiAIAssistant from './components/LigalSakhiAIAssistant';
import { UserProfilePage, AdvocateProfilePage } from './components/ProfilePages';
import UserRegistration from './components/UserRegistration';
import AdvocateRegistration from './components/AdvocateRegistration';
import UserLogin from './components/UserLogin';
import AdvocateLogin from './components/AdvocateLogin';
import AdvocateSearch from './components/AdvocateSearch';
import { tokenStorage } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdvocate, setCurrentAdvocate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem('legalSakhiTheme') || 'light';
    setTheme(savedTheme);
    document.body.classList.toggle('dark', savedTheme === 'dark');

    const savedUser = localStorage.getItem('legalSakhiUser');
    const savedAdvocate = localStorage.getItem('legalSakhiAdvocate');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedAdvocate) setCurrentAdvocate(JSON.parse(savedAdvocate));
  }, []);

  useEffect(() => {
    localStorage.setItem('legalSakhiTheme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setCurrentPage('findAdvocates');
  };

  const updateUserSession = (profile) => {
    setCurrentUser(profile);
    localStorage.setItem('legalSakhiUser', JSON.stringify(profile));
  };

  const updateAdvocateSession = (profile) => {
    setCurrentAdvocate(profile);
    localStorage.setItem('legalSakhiAdvocate', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentAdvocate(null);
    localStorage.removeItem('legalSakhiUser');
    localStorage.removeItem('legalSakhiAdvocate');
    setCurrentPage('home');
  };

  return (
    <div>
      <SocialSidebar />
      <Header
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        currentUser={currentUser}
        currentAdvocate={currentAdvocate}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />

      {currentPage === 'home' && (
        <>
          <Hero />
          <AboutSection setCurrentPage={setCurrentPage} />

          <div className="main-layout">
            <WhatsNew />
            <ActionGrid />
          </div>

          <LegalSakhiCells />
          <SuccessStories />
        </>
      )}

      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'legalResources' && <LegalResourcesPage />}
      {currentPage === 'findAdvocates' && <AdvocateSearch initialSearchTerm={searchTerm} />}
      {currentPage === 'emergency' && <EmergencyPage />}
      {currentPage === 'schemes' && <SchemesPage />}
      {currentPage === 'media' && <MediaPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'userRegistration' && <UserRegistration setCurrentPage={setCurrentPage} onRegistrationSuccess={updateUserSession} />}
      {currentPage === 'advocateRegistration' && <AdvocateRegistration setCurrentPage={setCurrentPage} />}
      {currentPage === 'userLogin' && <UserLogin setCurrentPage={setCurrentPage} onLogin={updateUserSession} />}
      {currentPage === 'advocateLogin' && <AdvocateLogin setCurrentPage={setCurrentPage} onLogin={updateAdvocateSession} />}
      {currentPage === 'userProfile' && currentUser && <UserProfilePage user={currentUser} setUser={updateUserSession} logout={handleLogout} />}
      {currentPage === 'advocateProfile' && currentAdvocate && <AdvocateProfilePage advocate={currentAdvocate} setAdvocate={updateAdvocateSession} logout={handleLogout} />}
      <Footer />
      <div className="accessibility-btn">
        <FaWheelchair />
      </div>
      <LigalSakhiAIAssistant />
    </div>
  );
}

function Header({ setCurrentPage, searchTerm, setSearchTerm, handleSearch, currentUser, currentAdvocate, onLogout, theme, setTheme }) {
  return (
    <header className="sticky-header">
      <div className="very-top-bar">
        <div className="left-links">
          Skip to Main Content | Screen Reader Access | हिंदी | मराठी
        </div>
        <div className="right-links">
          Last Updated: 14 May 2026 | Visitor No: 12,47,839
        </div>
      </div>
      <div className="top-header">
        <div className="header-logos" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
          <img src="/LigalSakhiLogo.png" alt="LegalSakhi Logo" className="brand-logo" />
          <div>
            <h1>महिला सहायता एवं कानूनी सहयोग</h1>
            <span className="subtitle">LegalSakhi - Women Helper & Legal Advocate Finder</span>
            <span className="sub-subtitle">Turning Her Silence into Strength.</span>
          </div>
        </div>
        <div className="search-and-login">
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search here..."
            />
            <button onClick={handleSearch} aria-label="Search">
              <FaSearch />
            </button>
          </div>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          {currentUser ? (
            <>
              <button className="login-btn-outline" onClick={() => setCurrentPage('userProfile')}>My Profile</button>
              <button className="login-btn-solid" onClick={onLogout}>Logout</button>
            </>
          ) : currentAdvocate ? (
            <>
              <button className="login-btn-outline" onClick={() => setCurrentPage('advocateProfile')}>Advocate Dashboard</button>
              <button className="login-btn-solid" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="login-btn-outline" onClick={() => setCurrentPage('userLogin')}>User Login</button>
              <button className="login-btn-outline" onClick={() => setCurrentPage('userRegistration')}>User Register</button>
              <button className="login-btn-solid" onClick={() => setCurrentPage('advocateLogin')}>Advocate Login</button>
              <button className="login-btn-solid" onClick={() => setCurrentPage('advocateRegistration')}>Advocate Register</button>
            </>
          )}
        </div>
      </div>
      <nav className="main-nav">
        <a href="#" className="active" onClick={() => setCurrentPage('home')}>Home</a>
        <a href="#" onClick={() => setCurrentPage('about')}>About Us</a>
        <a href="#" onClick={() => setCurrentPage('legalResources')}>Legal Resources</a>
        <a href="#" onClick={() => setCurrentPage('findAdvocates')}>Find Advocates</a>
        <a href="#" onClick={() => setCurrentPage('emergency')}>Emergency Help</a>
        <a href="#" onClick={() => setCurrentPage('schemes')}>Schemes & Support</a>
        <a href="#" onClick={() => setCurrentPage('media')}>Media</a>
        <a href="#" onClick={() => setCurrentPage('contact')}>Contact Us</a>
      </nav>
    </header>
  );
}

function SocialSidebar() {
  return (
    <div className="social-sidebar">
      <a href="https://www.facebook.com/profile.php?id=61589661144564" target="_blank" rel="noopener noreferrer" className="fb"><FaFacebookF /></a>
      <a href="https://x.com/LigalSakhi" target="_blank" rel="noopener noreferrer" className="x"><FaTwitter /></a>
      <a href="https://www.instagram.com/legalsakhi.in" target="_blank" rel="noopener noreferrer" className="ig"><FaInstagram /></a>
      <a href="#" className="yt"><FaYoutube /></a>
    </div>
  );
}

function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`hero-section slide-${slide}`}>
      {slide === 0 ? (
        <div className="hero-content">
          <h2>Find Verified Legal Advocates Near You</h2>
          <p>Connecting women with trusted legal professionals across Maharashtra</p>
          <button className="hero-btn">Free. Safe. Confidential.</button>
        </div>
      ) : (
        <div className="hero-content">
          <h2>Emergency Help is Just One Call Away</h2>
          <p>Helpline 181 — 24x7 Legal & Safety Support for Women</p>
          <button className="hero-btn">Immediate Assistance</button>
        </div>
      )}
      <div className="carousel-dots">
        <span className={slide === 0 ? "dot active" : "dot"} onClick={() => setSlide(0)}></span>
        <span className={slide === 1 ? "dot active" : "dot"} onClick={() => setSlide(1)}></span>
      </div>
    </div>
  );
}

function AboutSection({ setCurrentPage }) {
  return (
    <div className="about-section">
      <div className="about-img" style={{ background: 'transparent' }}>
        <img src="/Image.png" alt="About Us" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} />
      </div>
      <div className="about-content">
        <span className="badge">Who We Are</span>
        <h2>About Us</h2>
        <br />
        <p>
          LegalSakhi is a dedicated legal support platform created to protect and empower women, girls, and female students, especially those facing violence, abuse, or harassment. Our mission is to ensure that every woman receives immediate legal help, accurate information, and access to trusted advocates when she needs it the most.
        </p>
        <button className="btn-dark" onClick={() => setCurrentPage('about')}>Know More</button>
      </div>
    </div>
  );
}

function WhatsNew() {
  const news = [
    "From Barmer to Global Stage | Ruma Devi's Inspiring Journey | NCW Podcast",
    "Corrigendum Extension of Expression of Interest (EOI) for Empanelment of NGOs/ CSOs as Non-Financial Partners submission date reg",
    "NCW Calls for Faster Trials, Stronger Surveillance and Parole Ban in Heinous Sexual Crime Cases",
    "Walk-In Interview for engagement of Project Associate (1 post) and Project Assistant (2 Posts) on Contract basis and temporary co-terminus with the project in National Commission for Women."
  ];

  return (
    <div className="whats-new">
      <h2>Whats New <FaPlayCircle style={{ color: '#666', fontSize: '20px', marginLeft: 'auto' }} /> <button style={{ background: 'white', border: '1px solid #ddd', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>View all</button></h2>
      {news.map((n, i) => (
        <div key={i} className="news-card">
          <p>◦ {n}</p>
        </div>
      ))}
    </div>
  );
}

//Shude i remove this or not? (i think i will remove this funtion)
function ActionGrid() {
  return (
    <div className="action-grid">
      <div className="action-card bg-1"><FaHandsHelping color="#2d587a" /> PMCC - TERE MERE SAPNE - Training Module</div>
      <div className="action-card bg-2"><FaPhoneAlt color="#c12dd6" /> NCW 24*7 Helpline Call 14490</div>
      <div className="action-card bg-3"><FaFileSignature color="#0da27d" /> Register Complaint</div>
      <div className="action-card bg-4"><FaBriefcase color="#3c8dbc" /> eProposal-Work with us</div>
      <div className="action-card bg-5"><FaUserShield color="#c59918" /> Login for State Maharashtra Officers</div>
    </div>
  );
}

function LegalSakhiCells() {
  return (

    <div className="ncw-cells">
      <h2>LegalSakhi Cells</h2>
      <div className="cells-grid">
        <div className="cell-card c-1"><span style={{ background: '#b74bd4', color: 'white', padding: '8px', borderRadius: '50%' }}><FaPhoneAlt size={14} /></span> Complaint Redressal</div>
        <div className="cell-card c-2"><span style={{ background: '#c59918', color: 'white', padding: '8px', borderRadius: '50%' }}><FaBriefcase size={14} /></span> Policy Monitoring</div>
        <div className="cell-card c-3"><span style={{ background: '#0da27d', color: 'white', padding: '8px', borderRadius: '50%' }}><FaUserShield size={14} /></span> Women Safety & Welfare</div>
        <div className="cell-card c-4"><span style={{ background: '#3c8dbc', color: 'white', padding: '8px', borderRadius: '50%' }}><FaHandsHelping size={14} /></span> Empowering Women</div>
        <div className="cell-card c-5"><span style={{ background: '#d9534f', color: 'white', padding: '8px', borderRadius: '50%' }}><FaFileSignature size={14} /></span> Other Supporting Cells</div>
      </div>
    </div>
  );
}

function SuccessStories() {
  return (
    <div className="success-stories">
      <div className="story-left">
        <span className="badge">Success Stories</span>
        <h2>We have Stories to inspire you</h2>
        <p>Countless stories of strength, resilience, and transformation, we highlight the profound impact our helpline has made on the lives of women across the globe.</p>
        <button className="btn-dark">Know More</button>
      </div>
      <div className="story-cards">
        <div className="story-card">
          <div className="story-card-img sc-1">STOP VIOLENCE AGAINST WOMEN</div>
          <div className="story-card-content">
            <span className="story-card-badge">Domestic Violence</span>
            <p>The Commission received a complaint from a woman, who was pregnant.</p>
          </div>
        </div>
        <div className="story-card">
          <div className="story-card-img sc-2">Child Custody Illustration</div>
          <div className="story-card-content">
            <span className="story-card-badge">Child Custody</span>
            <p>The Commission received a complaint from Chheharta, Amritsar, Punjab.</p>
          </div>
        </div>
        <div className="story-card">
          <div className="story-card-img sc-3">Shelter Home Illustration</div>
          <div className="story-card-content">
            <span className="story-card-badge">Shelter Home</span>
            <p>The Commission received a complaint from Muzaffarnagar, Uttar Pradesh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About LegalSakhi</h1>
        <p>A compassionate, women-centric legal assistance platform built with one clear purpose: to support and protect women, girls, and female students.</p>
      </div>

      <div className="about-body">
        <section className="about-text-block">
          <p>We understand that legal problems often appear during the most stressful and vulnerable moments of a woman’s life. Whether it is domestic violence, sexual harassment, stalking, cyberbullying, assault, or workplace discrimination, victims often don’t know who to trust, where to go, or how to begin the legal process. LegalSakhi was created to solve exactly this problem.</p>
        </section>

        <section className="about-grid">
          <div className="about-card">
            <h3>Our Mission</h3>
            <p>LegalSakhi aims to make legal support accessible, fast, safe, and understandable for every woman. Our mission is to ensure that no woman feels alone while seeking justice.</p>
            <ul>
              <li>Connecting victims with verified, trustworthy advocates</li>
              <li>Providing emergency legal guidance</li>
              <li>Offering step-by-step action plans</li>
              <li>Simplifying complex legal procedures</li>
              <li>Educating women about their rights, protections, and legal options</li>
              <li>Offering real support through live chat and direct calling</li>
            </ul>
            <p><strong>LegalSakhi acts as a bridge between victims and the justice system, ensuring that help reaches women at the right time.</strong></p>
          </div>

          <div className="about-card">
            <h3>Why LegalSakhi Exists</h3>
            <p>Many women hesitate to report crimes because of fear or social pressure, lack of legal knowledge, no trusted support, confusion about where to complain, not knowing the right lawyer, language barriers, and worry about safety.</p>
            <p>LegalSakhi removes these barriers by offering:</p>
            <ul>
              <li>Anonymous and safe communication</li>
              <li>Simple legal information in English, Hindi, and Marathi</li>
              <li>Verified lawyer connections</li>
              <li>One-tap emergency helplines</li>
              <li>A trusted, government-portal-style interface</li>
            </ul>
          </div>
        </section>

        <section className="about-offers">
          <h2>What LegalSakhi Offers</h2>
          <div className="offers-grid">
            <div className="offer-item">
              <h4>🔹 Emergency Legal Help</h4>
              <p>For urgent cases, we guide victims on immediate safety steps, evidence collection, FIR filing, legal rights, police procedures, and digital/online complaint options.</p>
            </div>
            <div className="offer-item">
              <h4>🔹 Live Chat & Call With Advocates</h4>
              <p>Victims can instantly connect with verified nearby advocates, experts in criminal law, family law, cyber law, women’s rights, and professionals who speak their preferred language.</p>
            </div>
            <div className="offer-item">
              <h4>🔹 Lawyer Directory</h4>
              <p>A reliable list of advocates with their experience, practice areas, contact options, availability, and location.</p>
            </div>
            <div className="offer-item">
              <h4>🔹 Know Your Rights</h4>
              <p>Clear, understandable guides on Domestic Violence Act, Sexual Harassment & POSH, Cybercrime and online abuse, Police procedures, Protection orders, and Legal options for minors and students.</p>
            </div>
            <div className="offer-item">
              <h4>🔹 Women Safety Helplines</h4>
              <p>Instant access to National women helplines, Emergency numbers, Local police stations, State government support lines, and NGO support.</p>
            </div>
          </div>
        </section>

        <section className="about-vision">
          <h2>Our Vision & Promise</h2>
          <p>We envision a society where women feel safe, informed, and empowered. No victim suffers in silence. Legal guidance is accessible to all, and justice is not complicated or intimidating.</p>
          <p>We promise Confidentiality, Empathy, Accuracy, Safety-first guidance, Support in 3 languages, and Access to real, verified advocates.</p>
          <blockquote>"We are not just a platform. We are your Sakhi — a friend who stands by you when it matters the most."</blockquote>
        </section>

        <section className="about-creator">
          <h3>Created By</h3>
          <p>LegalSakhi is created by <strong>Vaishnavi Shahane</strong>, with a vision to make legal support more accessible, trustworthy, and life-saving for women across India.</p>
        </section>
      </div>
    </div>
  );
}

function FindAdvocatesPage({ searchTerm, setSearchTerm }) {
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isChatMaximized, setIsChatMaximized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryBar, setShowCategoryBar] = useState(true);
  const categories = [
    'All',
    'Family Law',
    'Criminal Defense',
    'Cyber Law',
    'Property',
    'Workplace Harassment',
    'Women\'s Rights'
  ];

  const advocates = [
    {
      name: "Vaishnavi Shahane",
      skills: "Family Law, Criminal Defense",
      categories: ["Family Law", "Criminal Defense", "Women\'s Rights"],
      languages: "English, Marathi, Hindi",
      exp: "8 Years",
      price: "Free",
      consults: "2k+ consultations",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1",
      bio: "I am a dedicated Family Law and Criminal Defense attorney with over 8 years of experience fighting for women's rights and domestic justice. I believe in empathetic, accessible, and fierce representation.",
      reviews: [
        { user: "Priya S.", rating: 5, comment: "Very helpful and understanding. Guided me through my divorce smoothly." },
        { user: "Anita R.", rating: 5, comment: "Excellent lawyer, highly recommended for criminal defense." }
      ]
    },
    {
      name: "Mayuri Landage",
      skills: "Cyber Law, Women's Rights",
      categories: ["Cyber Law", "Women\'s Rights"],
      languages: "English, Marathi",
      exp: "5 Years",
      price: "Free",
      consults: "1.5k+ consultations",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5",
      bio: "Specializing in cybercrime and online harassment. I help women navigate the complexities of digital safety and hold perpetrators accountable under IT laws.",
      reviews: [
        { user: "Sneha M.", rating: 5, comment: "Helped me remove fake profiles and filed an FIR successfully." },
        { user: "Kiran D.", rating: 5, comment: "Very prompt and professional." }
      ]
    },
    {
      name: "Shravani Pampatvar",
      skills: "Property Law, Civil Litigation",
      categories: ["Property", "Civil Litigation"],
      languages: "English, Hindi, Telugu",
      exp: "12 Years",
      price: "Free",
      consults: "4k+ consultations",
      rating: 4.8,
      image: "https://i.pravatar.cc/150?img=9",
      bio: "Expert in property disputes, inheritance rights, and civil litigation. Ensuring women get their rightful share and legal protection in property matters.",
      reviews: [
        { user: "Lakshmi K.", rating: 5, comment: "Got my ancestral property share. Very knowledgeable." },
        { user: "Ritu", rating: 4, comment: "Good lawyer but very busy." }
      ]
    },
    {
      name: "Priya Sharma",
      skills: "Corporate Law, Workplace Harassment",
      categories: ["Workplace Harassment", "Corporate Law", "Women\'s Rights"],
      languages: "English, Hindi",
      exp: "6 Years",
      price: "Free",
      consults: "800+ consultations",
      rating: 4.9,
      image: "https://i.pravatar.cc/150?img=20",
      bio: "Dedicated to fighting workplace harassment and ensuring safe corporate environments. POSH expert.",
      reviews: [
        { user: "Neha", rating: 5, comment: "She handled my POSH complaint very sensitively." }
      ]
    },
    {
      name: "Anjali Deshmukh",
      skills: "Domestic Violence, Divorce",
      categories: ["Family Law", "Domestic Violence", "Women\'s Rights"],
      languages: "Marathi, English",
      exp: "10 Years",
      price: "Free",
      consults: "3k+ consultations",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=32",
      bio: "Compassionate approach to difficult family situations. Focused on quick resolutions and child custody safety.",
      reviews: [
        { user: "Swati", rating: 5, comment: "A true lifesaver. Handled my case with utmost care." },
        { user: "Pooja", rating: 5, comment: "Highly recommend for domestic violence cases." }
      ]
    },
    {
      name: "Kavita Reddy",
      skills: "Human Rights, NGO Support",
      categories: ["Human Rights", "NGO Support", "Women\'s Rights"],
      languages: "English, Kannada, Hindi",
      exp: "15 Years",
      price: "Pro Bono (Free)",
      consults: "5k+ consultations",
      rating: 4.7,
      image: "https://i.pravatar.cc/150?img=44",
      bio: "Working with multiple NGOs to provide free legal aid to marginalized women. Decades of experience in human rights advocacy.",
      reviews: [
        { user: "Rani", rating: 5, comment: "She fights for the poor. God bless her." },
        { user: "Sushma", rating: 4, comment: "Very supportive." }
      ]
    }
  ];

  const query = searchTerm.trim().toLowerCase();
  const searchTokens = query.split(/\s+/).filter(Boolean);

  const filteredAdvocates = advocates.filter((adv) => {
    const text = [
      adv.name,
      adv.skills,
      adv.languages,
      adv.bio,
      adv.exp,
      adv.price,
      ...(adv.categories || [])
    ].join(' ').toLowerCase();

    const matchesSearch = searchTokens.length === 0
      ? true
      : searchTokens.every((token) => text.includes(token));

    const matchesCategory = selectedCategory === 'All' ||
      (adv.categories || []).some((category) => category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="find-advocates-page">
      <div className="advocates-header-banner">
        <h2>Chat with Advocate</h2>
        <div className="advocates-logo-mini">
          <FaBalanceScale size={24} color="#002e5b" />
        </div>
      </div>

      <div className="advocates-filter-bar">
        <div className="adv-search">
          <FaSearch color="#666" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            placeholder="Search name, skills, specialties, background..."
            aria-label="Search advocates"
          />
        </div>
        <button className="adv-filter-btn" onClick={() => setShowCategoryBar((prev) => !prev)}>
          <FaFilter /> {showCategoryBar ? 'Hide Filters' : 'Filter'}
        </button>
        {showCategoryBar && (
          <div className="adv-categories-scroll">
            {categories.map((category) => (
              <button
                key={category}
                className={`adv-category ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="advocates-grid-layout">
        {filteredAdvocates.map((adv, idx) => (
          <div className="advocate-astrotalk-card" key={idx} onClick={() => setSelectedAdvocate(adv)}>
            <div className="adv-card-top">
              <img src={adv.image} alt={adv.name} className="adv-avatar" />
              <div className="adv-info-main">
                <div className="adv-name-row">
                  <h3>{adv.name}</h3>
                  <FaCheckCircle className="verified-icon" />
                </div>
                <p className="adv-skills">{adv.skills}</p>
                <p className="adv-languages">{adv.languages}</p>
                <div className="adv-rating-row">
                  <div className="stars">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="consults-text">{adv.consults}</span>
                </div>
              </div>
            </div>

            <div className="adv-card-bottom">
              <div className="adv-exp-price">
                <p>Exp: {adv.exp}</p>
                <p className="adv-price"><strong>{adv.price}</strong></p>
              </div>
              <button className="adv-chat-btn" onClick={(e) => { e.stopPropagation(); setActiveChat(adv); }}>Chat</button>
            </div>
          </div>
        ))}
      </div>

      {selectedAdvocate && (
        <div className="modal-overlay" onClick={() => setSelectedAdvocate(null)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedAdvocate(null)}>&times;</button>
            <div className="profile-modal-header">
              <img src={selectedAdvocate.image} alt={selectedAdvocate.name} />
              <div>
                <h2>{selectedAdvocate.name} <FaCheckCircle className="verified-icon" /></h2>
                <p>{selectedAdvocate.skills}</p>
                <div className="adv-rating-row" style={{ marginTop: '8px' }}>
                  <div className="stars">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="consults-text">{selectedAdvocate.rating} / 5 Rating</span>
                </div>
              </div>
            </div>
            <div className="profile-modal-body">
              <h3>About Advocate</h3>
              <p className="adv-bio">{selectedAdvocate.bio}</p>

              <h3 style={{ marginTop: '25px', marginBottom: '15px' }}>Client Reviews</h3>
              <div className="reviews-list">
                {selectedAdvocate.reviews.map((rev, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <strong>{rev.user}</strong>
                      <div className="stars">
                        {[...Array(rev.rating)].map((_, idx) => <FaStar key={idx} />)}
                      </div>
                    </div>
                    <p>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="adv-chat-btn-solid" onClick={() => { setActiveChat(selectedAdvocate); setSelectedAdvocate(null); }}>Start Free Chat</button>
            </div>
          </div>
        </div>
      )}

      {activeChat && (
        <div className={`chat-widget ${isChatMinimized ? 'minimized' : ''} ${isChatMaximized ? 'maximized' : ''}`}>
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={activeChat.image} alt={activeChat.name} style={{ width: '35px', height: '35px', borderRadius: '50%', border: '2px solid white' }} />
              <h4>{activeChat.name}</h4>
            </div>
            <div className="chat-header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="chat-action-btn" onClick={() => { setIsChatMinimized(!isChatMinimized); setIsChatMaximized(false); }} title="Minimize">
                {isChatMinimized ? '▲' : '▼'}
              </button>
              {!isChatMinimized && (
                <button className="chat-action-btn" onClick={() => setIsChatMaximized(!isChatMaximized)} title="Maximize">
                  {isChatMaximized ? '❐' : '□'}
                </button>
              )}
              <button className="chat-action-btn close" onClick={() => { setActiveChat(null); setIsChatMinimized(false); setIsChatMaximized(false); }} title="Close" style={{ fontSize: '20px' }}>&times;</button>
            </div>
          </div>
          {!isChatMinimized && (
            <>
              <div className="chat-body">
                <div className="chat-message received">
                  Hello! I am {activeChat.name}. I am here to help you. Please feel free to share your concerns. Everything you share is completely confidential.
                </div>
              </div>
              <div className="chat-footer">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function EmergencyPage() {
  const helplines = [
    { name: "Women Helpline (All India)", number: "1091", icon: <FaPhoneAlt /> },
    { name: "Police Emergency", number: "112", icon: <FaUserShield /> },
    { name: "Cyber Crime Helpline", number: "1930", icon: <FaSearch /> },
    { name: "Domestic Abuse (NCW)", number: "7827170170", icon: <FaHandsHelping /> },
    { name: "Ambulance", number: "108", icon: <FaPlusSquare /> },
    { name: "Legal Aid / NALSA", number: "15100", icon: <FaBalanceScale /> }
  ];

  return (
    <div className="generic-page-container">
      <div className="emergency-header">
        <h1>🚨 Emergency Help</h1>
        <p>If you are in immediate danger, please call the police or emergency services immediately. Do not hesitate.</p>
      </div>
      <div className="emergency-grid">
        {helplines.map((hp, idx) => (
          <div className="emergency-card" key={idx}>
            <div className="hp-icon">{hp.icon}</div>
            <div className="hp-info">
              <h3>{hp.name}</h3>
              <a href={`tel:${hp.number}`} className="hp-number">{hp.number}</a>
            </div>
            <a href={`tel:${hp.number}`} className="hp-call-btn">Call Now</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ensure FaPlusSquare is available or use another icon if not imported.
// Actually let's use a standard component approach for Schemes
function SchemesPage() {
  const schemes = [
    { title: "One Stop Centre (OSC)", desc: "Provides integrated support and assistance to women affected by violence, both in private and public spaces." },
    { title: "Women Helpline Scheme", desc: "A 24-hour emergency and non-emergency response to women affected by violence." },
    { title: "Ujjawala Scheme", desc: "A comprehensive scheme for prevention of trafficking and rescue, rehabilitation, reintegration, and repatriation of victims." },
    { title: "Swadhar Greh", desc: "Provides temporary accommodation, maintenance, and rehabilitative services to women and girls rendered homeless due to family discord, crime, or violence." }
  ];

  return (
    <div className="generic-page-container">
      <div className="page-header-banner">
        <h2>Schemes & Support Programs</h2>
        <p>Government initiatives to empower and protect women across the nation.</p>
      </div>
      <div className="schemes-grid">
        {schemes.map((scheme, idx) => (
          <div className="scheme-card" key={idx}>
            <div className="scheme-icon"><FaHandsHelping size={30} /></div>
            <h3>{scheme.title}</h3>
            <p>{scheme.desc}</p>
            <button className="read-more-btn">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaPage() {
  return (
    <div className="generic-page-container">
      <div className="page-header-banner">
        <h2>Media & News Gallery</h2>
        <p>Latest updates, news, and video resources on women's empowerment.</p>
      </div>
      <div className="media-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="media-card" key={item}>
            <div className="media-placeholder">
              <FaPlayCircle size={40} color="#ddd" />
            </div>
            <div className="media-info">
              <h4>Empowerment Campaign #{item}</h4>
              <p>Government launches new initiative for digital literacy among women.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="generic-page-container">
      <div className="page-header-banner">
        <h2>Contact Us</h2>
        <p>We are here to help. Reach out to us for any queries or assistance.</p>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          <h3>Get In Touch</h3>
          <p><strong>Address:</strong> LegalSakhi Headquarters,M.B.E. Society's College of Engineering,Ambajogai 431517</p>
          <p><strong>Email:</strong>legalsakhi18@gmail.com</p>
          <p><strong>Phone:</strong> +91 9370904695</p>
          <p><strong>Hours:</strong> Mon - Sat (9:00 AM to 6:00 PM)</p>
        </div>
        <div className="contact-form">
          <h3>Send a Message</h3>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message" rows="5"></textarea>
          <button className="btn-dark">Submit</button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top-section">
        <div className="footer-col">
          <h4>LEGALSAKHI APPLICATIONS</h4>
          <ul>
            <li><a href="#">Complaints</a></li>
            <li><a href="#">Complaint against NRI</a></li>
            <li><a href="#">eProposal</a></li>
            <li><a href="#">MIS for Acid Attack Victims</a></li>
            <li><a href="#">Nation Wide Competition</a></li>
            <li><a href="#">LegalSakhi Staff Login</a></li>
            <li><a href="#">LegalSakhi Internship</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>QUICK LINKS</h4>
          <ul>
            <li><a href="#">Website Policies</a></li>
            <li><a href="#">Help</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Web Information Manager</a></li>
            <li><a href="#">Feedback</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">LegalSakhi Applications</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="newsletter-section">
            <h4>SUBSCRIBE OUR NEWSLETTER</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="" />
              <button>Subscribe</button>
            </div>
          </div>
          <div className="follow-us-section">
            <h4>FOLLOW US ON</h4>
            <p>Our Social Media Networks</p>
            <div className="footer-social-icons">
              <a href="https://www.instagram.com/legalsakhi.in" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.facebook.com/profile.php?id=61589661144564" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://x.com/LigalSakhi" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-section">
        <div className="footer-copyright-info">
          <p>© Content owned, updated and maintained by the LegalSakhi.</p>
          <p>This website belongs to LegalSakhi, Government of Maharashtra.</p>
          <p>Copyright © LegalSakhi 2026</p>
        </div>
        <div className="footer-stats-info">
          <p>Last Update : 10 May 2026</p>
          <p>Visitor No: <strong>39373915</strong></p>
        </div>
      </div>
      <div className="footer-developer-info">
        <p>Designed & Developed by : <strong>Vaishnavi Shahane</strong></p>
      </div>
    </footer>
  );
}

function LegalResourcesPage() {
  const articles = [
    {
      date: "May 23, 2026",
      readTime: "5 min read",
      issue: "Volume I Issue I",
      title: "AI: A Threat to Privacy for Women?",
      author: "Vaishnavi Shahane, LegalSakhi Research Wing",
      excerpt: "CLICK HERE TO READ THE FULL RESEARCH PAPER"
    },
    {
      date: "Jun 10, 2026",
      readTime: "8 min read",
      issue: "Volume I Issue II",
      title: "Domestic Violence Act: A Critical Analysis",
      author: "Mayuri Landage, Expert in Family Law",
      excerpt: "CLICK HERE TO READ THE FULL RESEARCH PAPER"
    },
    {
      date: "Jul 05, 2026",
      readTime: "6 min read",
      issue: "Volume II Issue I",
      title: "Cyber Harassment and Legal Remedies in India",
      author: "Shravani Pampatvar, Cyber Law Specialist",
      excerpt: "CLICK HERE TO READ THE FULL RESEARCH PAPER"
    }
  ];

  return (
    <div className="legal-resources-page">
      <div className="resources-nav-bar">
        <button className="res-nav-link active">All Posts</button>
        <button className="res-nav-link">Volume I Issue I</button>
        <button className="res-nav-link">Volume I Issue II</button>
        <button className="res-nav-link">Volume II Issue I</button>
        <div className="res-nav-more dropdown-container">
          <span>More</span>
          <span>▼</span>
          <div className="dropdown-menu">
            <button className="dropdown-item">Volume III Issue II</button>
            <button className="dropdown-item">Volume IV Issue I</button>
            <button className="dropdown-item">Volume IV Issue II</button>
            <button className="dropdown-item">Volume IV Issue III</button>
            <button className="dropdown-item">Volume IV Issue IV</button>
            <button className="dropdown-item">Volume IV Issue V</button>
            <button className="dropdown-item">Volume IV Issue VI</button>
            <button className="dropdown-item">Volume V Issue I</button>
            <button className="dropdown-item">Volume V Issue II</button>
            <button className="dropdown-item">Volume V Issue III</button>
          </div>
        </div>
        <div className="res-nav-search">
          <FaSearch />
        </div>
      </div>

      <div className="articles-list-container">
        {articles.map((article, index) => (
          <div className="article-card" key={index}>
            <div className="article-header">
              <div className="article-meta">
                <span className="journal-name">LegalSakhi Journal</span>
                <br />
                <span className="journal-date">{article.date} • {article.readTime}</span>
              </div>
              <div className="article-options">
                <FaEllipsisV />
              </div>
            </div>
            <div className="article-body">
              <p className="article-issue"><strong>{article.issue}</strong></p>
              <h2 className="article-title">{article.title}</h2>
              <p className="article-excerpt">
                {article.author} <a href="#" className="read-full-link">{article.excerpt}</a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}