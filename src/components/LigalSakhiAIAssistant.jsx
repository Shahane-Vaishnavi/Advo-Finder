import React, { useState, useEffect, useRef } from "react";
import {
  FaBalanceScale,
  FaRobot,
  FaTimes,
  FaMinus,
  FaChevronUp,
  FaPaperPlane,
  FaMicrophone,
  FaPaperclip,
  FaPhoneAlt,
  FaExclamationTriangle,
  FaVolumeUp,
  FaVolumeMute,
  FaUserShield,
  FaCheckCircle,
  FaArrowRight,
  FaFolderOpen,
  FaExpand,
  FaCompress
} from "react-icons/fa";
import "./LigalSakhiAIAssistant.css";

const EMERGENCY_KEYWORDS = [
  "violence", "abuse", "threat", "harassment", "emergency", "beaten", "rape", 
  "assault", "hurt", "danger", "stalk", "blackmail", "suicide", "maar", "pitna", 
  "dhanki", "gali", "chhedkhani", "pareshan", "cyber stalking", "dhamki", "attack",
  "हिंसा", "उत्पीड़न", "गाली", "धमकी", "मारपीट", "सुरक्षा", "छेडखानी", "त्रास", "कौटुंबिक हिंसाचार"
];

const TRANSLATIONS = {
  en: {
    welcome: "Namaste! I am LigalSakhi AI, your secure legal companion. I am designed to assist women across India with direct legal awareness, cyber safety, domestic abuse support, FIR processes, and connecting with verified legal advocates. Everything you discuss here is completely confidential.",
    welcomeHeader: "💡 How I can assist you:",
    welcome1: "Women's Rights: POSH Act, Property rights, Free Legal Aid.",
    welcome2: "Cyber Crime: Stalking, Privacy violations, Online Harassment.",
    welcome3: "Domestic Violence: Protection orders, Residential rights, Aid resources.",
    welcome4: "FIR Guidance: Registration steps, Zero FIRs, Police guidelines.",
    welcome5: "Finding Advocates: Verified professional support directory.",
    placeholder: "Describe your legal issue (e.g. harassment, stalking, rights)...",
    listening: "Listening...",
    disclaimer: "LigalSakhi AI provides immediate general legal information. For formal representation, use our 'Find Advocates' portal.",
    clearChat: "Clear Chat",
    emergencyTitle: "Emergency Legal & Safety Helplines",
    emergencyDesc: "If you are in immediate danger, please contact emergency numbers right away.",
    callPolice: "Call Police (112)",
    womenHelpline: "Women Helpline (1091)",
    mahaHelpline: "Maharashtra 181",
    suggestedTray: "Suggested follow-ups:",
    fallbackMsg: "Namaste. Thank you for reaching out. Please let me know how I can help.",
    typingIndicator: "LigalSakhi is preparing trusted guidance...",
    listenBtn: "Listen",
    stopBtn: "Stop",
    clearPrompt: "Are you sure you want to clear your confidential chat history with LigalSakhi AI?"
  },
  hi: {
    welcome: "नमस्ते! मैं लीगलसखी एआई हूँ, आपकी सुरक्षित कानूनी साथी। मैं भारत भर में महिलाओं को प्रत्यक्ष कानूनी जागरूकता, साइबर सुरक्षा, घरेलू हिंसा सहायता, एफआईआर प्रक्रियाओं और सत्यापित कानूनी वकीलों से जुड़ने में मदद करने के लिए बनाई गई हूँ। हमारे बीच होने वाली सभी बातचीत पूरी तरह से गोपनीय है।",
    welcomeHeader: "💡 मैं आपकी कैसे सहायता कर सकती हूँ:",
    welcome1: "महिलाओं के अधिकार: पॉश (POSH) अधिनियम, संपत्ति के अधिकार, मुफ्त कानूनी सहायता।",
    welcome2: "साइबर अपराध: ऑनलाइन पीछा करना (स्टॉकिंग), गोपनीयता का उल्लंघन, ऑनलाइन उत्पीड़न।",
    welcome3: "घरेलू हिंसा: सुरक्षा आदेश, साझा निवास अधिकार, सहायता संसाधन।",
    welcome4: "एफआईआर मार्गदर्शन: पंजीकरण के चरण, जीरो एफआईआर, पुलिस दिशानिर्देश।",
    welcome5: "वकील ढूंढें: सत्यापित पेशेवर सहायता निर्देशिका।",
    placeholder: "अपनी कानूनी समस्या का वर्णन करें (जैसे उत्पीड़न, पीछा करना, अधिकार)...",
    listening: "सुन रहा हूँ...",
    disclaimer: "लीगलसखी एआई तत्काल सामान्य कानूनी जानकारी प्रदान करता है। औपचारिक प्रतिनिधित्व के लिए, हमारे 'वकील ढूंढें' पोर्टल का उपयोग करें।",
    clearChat: "चैट मिटाएं",
    emergencyTitle: "आपातकालीन कानूनी और सुरक्षा हेल्पलाइन",
    emergencyDesc: "यदि आप तत्काल खतरे में हैं, तो कृपया तुरंत आपातकालीन नंबरों पर संपर्क करें।",
    callPolice: "पुलिस को कॉल करें (112)",
    womenHelpline: "महिला हेल्पलाइन (1091)",
    mahaHelpline: "महाराष्ट्र 181",
    suggestedTray: "सुझाए गए अनुवर्ती प्रश्न:",
    fallbackMsg: "नमस्ते। संपर्क करने के लिए धन्यवाद। कृपया मुझे बताएं कि मैं आपकी कैसे मदद कर सकती हूँ।",
    typingIndicator: "लीगलसखी विश्वसनीय मार्गदर्शन तैयार कर रही है...",
    listenBtn: "सुनें",
    stopBtn: "रोकें",
    clearPrompt: "क्या आप वाकई लीगलसखी एआई के साथ अपने गोपनीय चैट इतिहास को मिटाना चाहते हैं?"
  },
  mr: {
    welcome: "नमस्कार! मी लीगलसखी एआय आहे, तुमची सुरक्षित कायदेशीर सोबती. मी संपूर्ण भारतातील महिलांना थेट कायदेशीर जागरूकता, सायबर सुरक्षा, कौटुंबिक हिंसाचार मदत, एफआयआर प्रक्रिया आणि प्रमाणित कायदेशीर वकीलांशी जोडण्यास मदत करण्यासाठी डिझाइन केली आहे. आपल्या मधील सर्व संभाषण पूर्णपणे गोपनीय आहे.",
    welcomeHeader: "💡 मी तुम्हाला कशी मदत करू शकते:",
    welcome1: "महिलांचे हक्क: पॉश (POSH) कायदा, मालमत्ता हक्क, मोफत कायदेशीर मदत.",
    welcome2: "सायबर गुन्हे: ऑनलाइन पाठलाग करणे, गोपनीयतेचे उल्लंघन, ऑनलाइन छळ.",
    welcome3: "कौटुंबिक हिंसाचार: संरक्षण आदेश, सामायिक गृहनिर्माण हक्क, मदत संसाधने.",
    welcome4: "एफआयआर मार्गदर्शन: नोंदणीचे टप्पे, झिरो एफआयआर, पोलिस मार्गदर्शक तत्त्वे.",
    welcome5: "वकील शोधा: प्रमाणित व्यावसायिक मदत निर्देशिका.",
    placeholder: "तुमच्या कायदेशीर समस्येचे वर्णन करा (उदा. छळ, पाठलाग, हक्क)...",
    listening: "ऐकत आहे...",
    disclaimer: "लीगलसखी एआय त्वरित सामान्य कायदेशीर माहिती प्रदान करते. औपचारिक प्रतिनिधित्वासाठी, आमच्या 'वकील शोधा' पोर्टलचा वापर करा.",
    clearChat: "चॅट पुसून टाका",
    emergencyTitle: "आपातकालीन कायदेशीर आणि सुरक्षा हेल्पलाइन",
    emergencyDesc: "जर तुम्ही तात्काळ धोक्यात असाल, तर कृपया ताबडतोब आपत्कालीन नंबरवर संपर्क साधा.",
    callPolice: "पोलिसांना कॉल करा (112)",
    womenHelpline: "महिला हेल्पलाइन (1091)",
    mahaHelpline: "महाराष्ट्र 181",
    suggestedTray: "सुचवलेले पुढील प्रश्न:",
    fallbackMsg: "नमस्कार. संपर्क साधल्याबद्दल धन्यवाद. मी तुम्हाला कशी मदत करू शकते ते कृपया मला सांगा.",
    typingIndicator: "लीगलसखी विश्वसनीय कायदेशीर मार्गदर्शन तयार करत आहे...",
    listenBtn: "ऐका",
    stopBtn: "थांबवा",
    clearPrompt: "तुम्हाला खरोखर लीगलसखी एआय सोबतचा तुमचा गोपनीय चॅट इतिहास पुसून टाकायचा आहे का?"
  }
};

const detectDefaultLanguage = () => {
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language || navigator.userLanguage || "";
    if (browserLang.startsWith("hi")) return "hi";
    if (browserLang.startsWith("mr")) return "mr";
  }
  return "en";
};

const GET_QUICK_ACTIONS = (lang) => {
  if (lang === "hi") {
    return [
      { label: "साइबर अपराध", query: "मुझे ऑनलाइन उत्पीड़न के लिए साइबर अपराध की शिकायत कैसे दर्ज करनी चाहिए?", type: "default" },
      { label: "घरेलू हिंसा", query: "कौटुंबिक हिंसाचार (घरेलू हिंसा) अधिनियम 2005 के तहत क्या सुरक्षा उपलब्ध है?", type: "default" },
      { label: "एफआईआर सहायता", query: "जीरो एफआईआर क्या है और यदि पुलिस एफआईआर दर्ज करने से इनकार करे तो क्या करें?", type: "default" },
      { label: "महिला अधिकार", query: "कार्यस्थल पर उत्पीड़न (POSH) के खिलाफ मेरे कानूनी अधिकार क्या हैं?", type: "default" },
      { label: "वकील खोजें", query: "मैं लीगलसखी पर एक सत्यापित वकील से कैसे संपर्क कर सकती हूँ?", type: "default" },
      { label: "आपातकालीन सहायता", query: "आपातकालीन: मुझे तत्काल सुरक्षा और पुलिस हेल्पलाइन नंबर चाहिए!", type: "emergency" }
    ];
  }
  if (lang === "mr") {
    return [
      { label: "सायबर गुन्हे", query: "मी ऑनलाइन छळासाठी सायबर क्राईम तक्रार कशी नोंदवावी?", type: "default" },
      { label: "कौटुंबिक हिंसाचार", query: "कौटुंबिक हिंसाचार विरोधी कायदा २००५ अंतर्गत कोणती संरक्षणे उपलब्ध आहेत?", type: "default" },
      { label: "एफआयआर मदत", query: "झिरो एफआयआर म्हणजे काय आणि पोलिसांनी एफआयआर नोंदवण्यास नकार दिल्यास काय करावे?", type: "default" },
      { label: "महिलांचे हक्क", query: "कामाच्या ठिकाणी होणाऱ्या छळाविरुद्ध (POSH) माझे कायदेशीर हक्क काय आहेत?", type: "default" },
      { label: "वकील शोधा", query: "मी लीगलसखीवर प्रमाणित वकीलाशी संपर्क कसा साधू?", type: "default" },
      { label: "तातडीची मदत", query: "आणीबाणी: मला तात्काळ आपत्कालीन हेल्पलाइन आणि सुरक्षा संसाधने हवी आहेत!", type: "emergency" }
    ];
  }
  return [
    { label: "Cyber Crime", query: "How do I file a cyber crime complaint for online harassment?", type: "default" },
    { label: "Domestic Violence", query: "What protection is available under the Domestic Violence Act 2005?", type: "default" },
    { label: "FIR Help", query: "What is a Zero FIR and what if the police refuse to file an FIR?", type: "default" },
    { label: "Women's Rights", query: "What are my legal rights against workplace harassment (POSH)?", type: "default" },
    { label: "Find Advocate", query: "How do I find and connect with a verified advocate on LegalSakhi?", type: "default" },
    { label: "Emergency Support", query: "EMERGENCY: I need immediate legal helplines and safety resources!", type: "emergency" }
  ];

};

const GET_FOLLOW_UPS = (lang) => {
  if (lang === "hi") {
    return {
      cyber: [
        "ऑनलाइन पीछा करने की शिकायत कैसे दर्ज करें?",
        "धारा 66E क्या है?",
        "क्या मैं गुमनाम शिकायत दर्ज कर सकती हूँ?"
      ],
      violence: [
        "सुरक्षा आदेश क्या होता है?",
        "मैं सुरक्षा अधिकारी से कैसे संपर्क करूँ?",
        "क्या मानसिक शोषण भी शामिल है?"
      ],
      fir: [
        "जीरो एफआईआर क्या है?",
        "पुलिस एफआईआर दर्ज न करे तो क्या करें?",
        "क्या एफआईआर की कॉपी मुफ्त मिलती है?"
      ],
      rights: [
        "पॉश अधिनियम 2013 क्या है?",
        "संपत्ति में बेटियों के अधिकार क्या हैं?",
        "मुफ्त कानूनी सहायता कैसे लें?"
      ],
      advocate: [
        "एडवोकेट वैष्णवी शहाणे से चैट कैसे करें?",
        "क्या यहाँ कानूनी सलाह मुफ्त है?",
        "वकील किन मामलों में सहायता करते हैं?"
      ],
      default: [
        "मेरे बुनियादी कानूनी अधिकार क्या हैं?",
        "मुझे आपातकालीन नंबर दिखाएं",
        "महिला आयोग में शिकायत कैसे करें?"
      ]
    };
  }
  if (lang === "mr") {
    return {
      cyber: [
        "ऑनलाइन पाठलाग करण्याची तक्रार कशी करावी?",
        "कलम ६६ई (66E) काय आहे?",
        "मी निनावी तक्रार नोंदवू शकते का?"
      ],
      violence: [
        "संरक्षण आदेश म्हणजे काय?",
        "मी संरक्षण अधिकाऱ्याशी कसा संपर्क साधू?",
        "मानसिक छळ देखील कायद्यात समाविष्ट आहे का?"
      ],
      fir: [
        "झिरो एफआयआर म्हणजे काय?",
        "पोलिसांनी एफआयआर नोंदवण्यास नकार दिल्यास काय करावे?",
        "एफआयआरच्या प्रतीसाठी पैसे द्यावे लागतात का?"
      ],
      rights: [
        "पॉश (POSH) कायदा २०१३ काय आहे?",
        "माझा मालमत्ता हक्क काय आहे?",
        "मोफत कायदेशीर मदत कशी मिळवायची?"
      ],
      advocate: [
        "अ‍ॅड. वैष्णवी शहाणे यांच्याशी चॅट कशी करावी?",
        "या पोर्टलवर कायदेशीर सल्ला मोफत आहे का?",
        "येथील वकील कोणत्या क्षेत्रांमध्ये मदत करतात?"
      ],
      default: [
        "माझे मूलभूत हक्क काय आहेत?",
        "मला आपत्कालीन नंबर पुन्हा दाखवा",
        "महिला आयोगाकडे तक्रार कशी करावी?"
      ]
    };
  }
  return {
    cyber: [
      "How do I report online stalking?",
      "What is Section 66E of the IT Act?",
      "Can I file a cyber complaint anonymously?"
    ],
    violence: [
      "What is a Protection Order?",
      "How do I contact a Protection Officer?",
      "Is emotional and financial abuse covered?"
    ],
    fir: [
      "What is a Zero FIR?",
      "What if the police refuse my FIR?",
      "Do I have to pay for a copy of the FIR?"
    ],
    rights: [
      "What is the POSH Act 2013?",
      "What are my inheritance and property rights?",
      "How can I get free legal aid from NALSA?"
    ],
    advocate: [
      "How do I chat with Adv. Vaishnavi Shahane?",
      "Is the legal consultation free on this portal?",
      "What practice areas do advocates cover here?"
    ],
    default: [
      "What are my basic fundamental rights?",
      "Show me emergency numbers again",
      "How do I register a complaint on NCW?"
    ]
  };
};

export default function LigalSakhiAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const [language, setLanguage] = useState(detectDefaultLanguage()); // en, hi, mr
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState(GET_FOLLOW_UPS(detectDefaultLanguage()).default);
  const QUICK_ACTIONS = GET_QUICK_ACTIONS(language);
  const languageStrings = TRANSLATIONS[language];
  const [pulse, setPulse] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Handle language changes: translate greeting and update UI texts instantly
  useEffect(() => {
    setMessages((prev) => 
      prev.map((msg) => {
        if (msg.isWelcome) {
          return {
            ...msg,
            text: TRANSLATIONS[language].welcome
          };
        }
        return msg;
      })
    );
    
    // Update active suggested questions based on the new language
    const currentFollowUps = GET_FOLLOW_UPS(language);
    setSuggestedQuestions(currentFollowUps.default);
  }, [language]);

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    // Scroll to bottom
    scrollToBottom();
    
    // Load chat history or set initial messages
    const saved = localStorage.getItem("ligalsakhi_ai_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          loadInitialWelcome();
        }
      } catch (e) {
        loadInitialWelcome();
      }
    } else {
      loadInitialWelcome();
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN"; // Supports English and Indian accents
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? prev + " " + text : text));
        checkEmergencyKeywords(text);
      };
      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }

    // Initialize Synthesis
    synthesisRef.current = window.speechSynthesis;

    // Tooltip timer loop to grab attention
    const tooltipInterval = setInterval(() => {
      if (!isOpen) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 20000);

    return () => {
      clearInterval(tooltipInterval);
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ligalsakhi_ai_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Handle auto scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadInitialWelcome = () => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: TRANSLATIONS[language].welcome,
        timestamp: getCurrentTime(),
        isWelcome: true
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    checkEmergencyKeywords(val);
  };

  const checkEmergencyKeywords = (text) => {
    const lowerText = text.toLowerCase();
    const hasEmergency = EMERGENCY_KEYWORDS.some((keyword) => lowerText.includes(keyword));
    if (hasEmergency) {
      setShowEmergencyBanner(true);
    }
  };

  // Web Speech synthesis
  const speakText = (text, messageId) => {
    if (!synthesisRef.current) return;

    if (speakingMessageId === messageId) {
      synthesisRef.current.cancel();
      setSpeakingMessageId(null);
      return;
    }

    synthesisRef.current.cancel(); // Stop any current speech
    
    // Strip HTML/bullets tags for speech if any
    const cleanText = text.replace(/•/g, "").replace(/\n/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose voice based on language
    const voices = synthesisRef.current.getVoices();
    let selectedVoice = null;
    if (language === "hi") {
      selectedVoice = voices.find(v => v.lang.startsWith("hi"));
    } else if (language === "mr") {
      selectedVoice = voices.find(v => v.lang.startsWith("mr") || v.lang.startsWith("hi"));
    }
    
    if (selectedVoice) utterance.voice = selectedVoice;
    else {
      // Find female voice as fallback
      const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("google"));
      if (femaleVoice) utterance.voice = femaleVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    
    setSpeakingMessageId(messageId);
    synthesisRef.current.speak(utterance);
  };

  // Toggle Voice Input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // File Upload Simulation
  const triggerAttachment = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActiveAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.type
      });
      // Pre-populate input or notify user
      setInputValue((prev) => (prev ? prev : `Please analyze my uploaded document: ${file.name}`));
    }
  };

  const removeAttachment = () => {
    setActiveAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (textToSend = inputValue) => {
    if (!textToSend.trim() && !activeAttachment) return;

    const userText = textToSend;
    const currentAttachment = activeAttachment;
    
    // Clear input
    setInputValue("");
    setActiveAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Add user message
    const userMsgId = Date.now();
    const newUserMsg = {
      id: userMsgId,
      sender: "user",
      text: userText,
      timestamp: getCurrentTime(),
      attachment: currentAttachment
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    // Determine follow-up suggestions dynamically
    const lowerText = userText.toLowerCase();
    const currentFollowUps = GET_FOLLOW_UPS(language);
    let nextSuggestions = currentFollowUps.default;
    if (lowerText.includes("cyber") || lowerText.includes("online") || lowerText.includes("stalk") || lowerText.includes("photo") || lowerText.includes("सायबर") || lowerText.includes("अपराध") || lowerText.includes("उत्पीड़न")) {
      nextSuggestions = currentFollowUps.cyber;
    } else if (lowerText.includes("viol") || lowerText.includes("abus") || lowerText.includes("beat") || lowerText.includes("husband") || lowerText.includes("domestic") || lowerText.includes("हिंसा") || lowerText.includes("कौटुंबिक") || lowerText.includes("छळ")) {
      nextSuggestions = currentFollowUps.violence;
    } else if (lowerText.includes("fir") || lowerText.includes("police") || lowerText.includes("complain") || lowerText.includes("station") || lowerText.includes("एफआयआर") || lowerText.includes("तक्रार")) {
      nextSuggestions = currentFollowUps.fir;
    } else if (lowerText.includes("right") || lowerText.includes("work") || lowerText.includes("posh") || lowerText.includes("property") || lowerText.includes("अधिकार") || lowerText.includes("हक्क")) {
      nextSuggestions = currentFollowUps.rights;
    } else if (lowerText.includes("advoc") || lowerText.includes("lawy") || lowerText.includes("chat") || lowerText.includes("vaishnavi") || lowerText.includes("वकील")) {
      nextSuggestions = currentFollowUps.advocate;
    }

    setSuggestedQuestions(nextSuggestions);

    // Call API or local fallback
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      if (response.ok) {
        const data = await response.json();
        addAiResponse(data.reply);
      } else {
        // Fallback if status code not 200
        generateFallbackResponse(userText);
      }
    } catch (error) {
      console.warn("FastAPI backend is offline. Using premium client-side legal engine fallback.", error);
      generateFallbackResponse(userText);
    }
  };

  const addAiResponse = (replyText) => {
    setIsTyping(false);
    const newAiMsg = {
      id: Date.now() + 1,
      sender: "ai",
      text: replyText,
      timestamp: getCurrentTime()
    };
    setMessages((prev) => [...prev, newAiMsg]);
  };

  // Comprehensive client-side interactive legal fallback generator
  const generateFallbackResponse = (userText) => {
    setTimeout(() => {
      const text = userText.toLowerCase();
      let reply = "";

      if (text.includes("cyber") || text.includes("online") || text.includes("stalk") || text.includes("hack") || text.includes("photo") || text.includes("instagram") || text.includes("harass")) {
        reply = `**Cyber Crime & Online Harassment Protection:**

Under India's **Information Technology (IT) Act, 2000**, women are heavily protected from online threats, morphing, identity theft, and stalking:
• **Section 66E (Violation of Privacy):** Criminalizes capturing, publishing, or transmitting images of a private area of any person without consent. Punishable with up to 3 years imprisonment.
• **Section 67 (Obscenity):** Penalizes publishing obscene material in electronic form.
• **Section 354D of the Indian Penal Code (IPC):** Strictly covers physical and cyberstalking. Repeatedly contacting a woman online despite clear disinterest is a criminal offense.

**Immediate Recommended Actions:**
1. **Preserve Evidence:** Take screenshots of the offensive messages, comments, profiles, or emails immediately. Save URLs. Do not delete them.
2. **File an Online Complaint:** Visit the National Cyber Crime Reporting Portal at **[cybercrime.gov.in](https://cybercrime.gov.in)** or call their national helpline **1930** (active 24/7).
3. **Anonymity:** You can file cybercrime complaints related to obscene images anonymously on the portal.
4. **Platform Reporting:** Report the account on Instagram, Facebook, or the specific app to block them and prompt taking down content.`;
      } 
      
      else if (text.includes("domestic") || text.includes("violence") || text.includes("beat") || text.includes("abuse") || text.includes("husband") || text.includes("in-law") || text.includes("maar")) {
        reply = `**Domestic Violence & Women Safety Protection:**

The **Protection of Women from Domestic Violence Act, 2005 (PWDVA)** is a powerful law protecting women from abuse within domestic relationships (spouse, parents, siblings, or in-laws).

**Key Protection Features:**
• **Broad Coverage:** Covers physical, verbal, emotional, sexual, and economic abuse.
• **Right to Residence:** You cannot be thrown out of your shared household/home, regardless of whether you have legal ownership or share in it.
• **Protection Orders:** The Court can restrain the abuser from entering your workplace, contacting you, or committing any act of violence.
• **Monetary Relief & Compensation:** The court can order the husband to pay for medical expenses, loss of earnings, monthly maintenance, and damages.

**Support Channels Available:**
1. **Immediate Danger:** Dial **112** (Police Emergency) or the **1091** (National Women Helpline).
2. **Women's Helpline (Maharashtra):** Call **181** for counseling, rescue, and shelter assistance.
3. **Protection Officers:** Approach the District Protection Officer (appointed by government to record Domestic Incident Reports and secure quick magistrate orders).
4. **NGO Shelter Homes:** We can connect you to registered shelter homes (Swadhar Greh) if you need a safe environment.`;
      } 
      
      else if (text.includes("fir") || text.includes("police") || text.includes("station") || text.includes("complain") || text.includes("refus")) {
        reply = `**Guide on Filing a First Information Report (FIR):**

An FIR is registered under **Section 154 of the Criminal Procedure Code (CrPC)** and is the official starting point for any criminal investigation.

**Important Legal Rights of Women Regarding FIR:**
• **Zero FIR:** If a crime takes place outside a police station's jurisdiction, they **cannot** turn you away. They must register a **Zero FIR** and transfer it to the appropriate station.
• **Right to a Female Officer:** For sexual offenses (stalking, harassment, assault), your statement **must** be recorded by a female police officer at your residence or a place of your choice.
• **Free Copy:** You have a legal right to get a copy of the registered FIR completely free of charge.
• **If Police Refuse to Register FIR:** 
  1. Write a written complaint and send it to the **Superintendent of Police (SP)** or Commissioner via registered post under Section 154(3) CrPC.
  2. File a complaint under **Section 156(3) CrPC** before a Magistrate, who can direct the police to register the FIR and investigate.
  3. Refusing to file an FIR for crimes against women is a punishable offense for police officers under Section 166A of the IPC.`;
      } 
      
      else if (text.includes("right") || text.includes("work") || text.includes("posh") || text.includes("equal") || text.includes("law") || text.includes("property")) {
        reply = `**Key Legal Rights of Women in India:**

India's constitution and acts provide powerful statutory rights for women to ensure safety, equality, and dignity:
1. **Workplace Harassment (POSH Act, 2013):** Every organization with 10+ employees must have an **Internal Complaints Committee (ICC)**. Women have the right to file formal complaints against workplace sexual harassment, and the employer must complete inquiries within 90 days.
2. **Right to Free Legal Aid:** Under **Section 12 of the Legal Services Authorities Act, 1987**, all women, regardless of their financial status or income, are entitled to **100% free legal aid** from NALSA (National Legal Services Authority).
3. **Arrest Restrictions:** Under Section 46(4) of the CrPC, a woman **cannot be arrested after sunset and before sunrise**, except in extraordinary circumstances, and even then, only with prior permission from a Judicial Magistrate and by a female police officer.
4. **Equal Inheritance Rights:** Under the Hindu Succession (Amendment) Act 2005, daughters have equal coparcenary (birthrights) in ancestral property, identical to sons.`;
      } 
      
      else if (text.includes("advoc") || text.includes("lawy") || text.includes("chat") || text.includes("find") || text.includes("vaishnavi") || text.includes("contact")) {
        reply = `**Connecting with Verified Legal Advocates:**

LegalSakhi offers direct and confidential communication with verified female advocates who specialize in family law, criminal defense, cyber law, and workplace harassment:
• **Adv. Vaishnavi Shahane** (Family Law & Criminal Defense expert)
• **Adv. Mayuri Landage** (Cyber Law & Women's Rights specialist)
• **Adv. Shravani Pampatvar** (Property Law & Civil Litigation expert)

**How to connect:**
1. Navigate to the **"Find Advocates"** section in the website's top menu.
2. View detailed credentials, years of experience, ratings, and peer reviews.
3. Click the **"Chat"** button on the advocate's profile card to open a private message channel. All introductory consultations are pro-bono (free of charge) through our platform to support women.`;
      } 
      
      else if (text.includes("emergency") || text.includes("help") || text.includes("danger") || text.includes("safe") || text.includes("112") || text.includes("181")) {
        reply = `**🚨 Emergency Support & Direct Helplines:**

If you are in immediate danger or feel unsafe, please do not hesitate. Contact these official 24x7 Government emergency services right away:
• **National Emergency Helpline:** **112** (Direct Police Dispatch)
• **Women Helpline (All India):** **1091** (Confidential safety support & rescue)
• **Women Helpline (Maharashtra):** **181** (Counseling, emergency response, shelter)
• **Cyber Crime National Helpline:** **1930** (Financial fraud & cyber stalking)
• **National Commission for Women (NCW):** **7827170170** (Domestic abuse/harassment)

*Tip: Lock yourself in a safe room or call a trusted neighbour or family member immediately while you await police assistance.*`;
      } 
      
      else {
        reply = `Namaste. Thank you for reaching out. 

I understand that navigating legal issues can be challenging and stressful. I am trained to guide women on various rights and legal pathways. To help you better, could you specify which of these categories matches your issue?
• **Cyber Crime Complaints:** For online stalking, harassment, fake profiles, or privacy leaks.
• **Domestic Violence Support:** For abuse at home or shared housing rights.
• **FIR Guidance:** For filing police complaints, Zero FIRs, or handling police refusal.
• **Women's Rights:** For workplace safety (POSH), equal pay, property inheritance, or free legal aid.
• **Finding Advocates:** How to book free private chats with our verified legal panel.

Alternatively, feel free to describe your situation, and I will highlight relevant acts, legal sections, and immediate safety steps.`;
      }

      addAiResponse(reply);
    }, 1200);
  };

  const handleQuickAction = (action) => {
    setShowTooltip(false);
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    }
    if (action.type === "emergency") {
      setShowEmergencyBanner(true);
    }
    handleSendMessage(action.query);
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const clearChatHistory = () => {
    if (window.confirm(languageStrings.clearPrompt)) {
      localStorage.removeItem("ligalsakhi_ai_history");
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      setSpeakingMessageId(null);
      setShowEmergencyBanner(false);
      loadInitialWelcome();
    }
  };

  return (
    <div className="ligalsakhi-ai-widget" role="complementary" aria-label="LegalSakhi AI Legal Assistant">
      {/* 🔴 EMERGENCY BANNER */}
      {showEmergencyBanner && isOpen && !isMinimized && (
        <div className="emergency-banner-top animate-fade-in">
          <div className="emergency-banner-content">
            <FaExclamationTriangle className="emergency-warn-icon animate-pulse" />
            <div>
              <strong className="emergency-title">{languageStrings.emergencyTitle}</strong>
              <p className="emergency-desc">{languageStrings.emergencyDesc}</p>
              <div className="emergency-btn-row">
                <a href="tel:112" className="emergency-call-btn police">
                  <FaPhoneAlt size={11} /> {languageStrings.callPolice}
                </a>
                <a href="tel:1091" className="emergency-call-btn women">
                  <FaPhoneAlt size={11} /> {languageStrings.womenHelpline}
                </a>
                <a href="tel:181" className="emergency-call-btn maha">
                  <FaPhoneAlt size={11} /> {languageStrings.mahaHelpline}
                </a>
              </div>
            </div>
          </div>
          <button 
            className="emergency-close-btn" 
            onClick={() => setShowEmergencyBanner(false)}
            aria-label="Dismiss Emergency Banner"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* 🔵 FLOATING ACTION BUTTON */}
      {!isOpen && (
        <div className="fab-container">
          {showTooltip && (
            <div className="fab-tooltip animate-bounce">
              <span>Ask LigalSakhi AI ⚖️</span>
            </div>
          )}
          <button
            className={`floating-ai-fab ${pulse ? "pulse" : ""}`}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setPulse(false);
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="Open LigalSakhi AI Legal Assistant"
            title="Ask LigalSakhi AI"
          >
            <div className="fab-icon-wrapper">
              <FaBalanceScale className="fab-scales-icon" />
              <FaRobot className="fab-ai-icon" />
            </div>
          </button>
        </div>
      )}

      {/* 🔵 CHAT WINDOW */}
      {isOpen && (
        <div className={`chat-window-container ${isMinimized ? "minimized" : "maximized"} animate-scale-up`}>
          
          {/* HEADER */}
          <div className="chat-window-header">
            <div className="header-brand-info">
              <div className="avatar-wrapper">
                <img src="/LigalSakhiLogo.png" alt="LigalSakhi" className="assistant-logo" onError={(e) => { e.target.src = "https://i.pravatar.cc/100?img=1" }} />
                <span className="online-indicator" aria-label="Online"></span>
              </div>
              <div className="title-text-group">
                <h3 className="widget-main-title">
                  LigalSakhi AI <FaCheckCircle className="verified-badge-icon" title="Government Inspired & Verified" />
                </h3>
                <span className="widget-subtitle">Women's Rights & Legal Guidance</span>
              </div>
            </div>

            <div className="header-control-buttons">
              <select 
                className="widget-language-select" 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select AI Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
              
              <button 
                className="header-control-btn min" 
                onClick={() => setIsMinimized(!isMinimized)} 
                title={isMinimized ? "Restore Chat" : "Minimize Chat"}
                aria-label={isMinimized ? "Restore Chat" : "Minimize Chat"}
              >
                {isMinimized ? <FaChevronUp /> : <FaMinus />}
              </button>
              
              <button 
                className="header-control-btn close" 
                onClick={() => {
                  setIsOpen(false);
                  if (synthesisRef.current) {
                    synthesisRef.current.cancel();
                  }
                  setSpeakingMessageId(null);
                }} 
                title="Close Chat"
                aria-label="Close Chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* CHAT BODY & INPUT (HIDDEN WHEN MINIMIZED) */}
          {!isMinimized && (
            <React.Fragment>
              {/* CHAT MESSAGES PANEL */}
              <div className="chat-messages-panel">
                
                {/* Scrollable messages area */}
                <div className="scrollable-messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message-bubble-wrapper ${msg.sender === "user" ? "user-msg-align" : "ai-msg-align"} animate-fade-in`}>
                      
                      {/* Avatar for AI */}
                      {msg.sender === "ai" && (
                        <div className="chat-avatar-column">
                          <div className="msg-ai-avatar">
                            <FaBalanceScale size={13} color="white" />
                          </div>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="chat-bubble-content-block">
                        <div className={`message-bubble ${msg.sender === "user" ? "user-bubble-theme" : "ai-bubble-theme"}`}>
                          
                          {/* Welcome Items Custom Format */}
                          {msg.isWelcome ? (
                            <div>
                              <p className="welcome-greet-text">{msg.text}</p>
                              <div className="welcome-services-card">
                                <span className="welcome-card-header">{languageStrings.welcomeHeader}</span>
                                <ul className="welcome-services-list">
                                  <li><span>⚖️</span> <strong>{languageStrings.welcome1}</strong></li>
                                  <li><span>💻</span> <strong>{languageStrings.welcome2}</strong></li>
                                  <li><span>🏠</span> <strong>{languageStrings.welcome3}</strong></li>
                                  <li><span>📋</span> <strong>{languageStrings.welcome4}</strong></li>
                                  <li><span>👩‍⚖️</span> <strong>{languageStrings.welcome5}</strong></li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            /* Support basic markdown bullet formatting in mock responses */
                            <div className="message-formatted-text">
                              {msg.text.split("\n").map((line, lIdx) => {
                                if (line.startsWith("• ")) {
                                  return <li key={lIdx} className="msg-bullet">{line.substring(2)}</li>;
                                }
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  return <h4 key={lIdx} className="msg-section-header">{line.replace(/\*\*/g, "")}</h4>;
                                }
                                if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
                                  return <p key={lIdx} className="msg-numbered-step"><strong>{line.substring(0, 3)}</strong>{line.substring(3)}</p>;
                                }
                                return <p key={lIdx} className="msg-paragraph">{line}</p>;
                              })}
                            </div>
                          )}

                          {/* Render attachment metadata inside user message */}
                          {msg.attachment && (
                            <div className="msg-attachment-tag">
                              <FaFolderOpen className="attach-tag-icon" />
                              <div className="attach-tag-info">
                                <span className="attach-tag-name">{msg.attachment.name}</span>
                                <span className="attach-tag-size">{msg.attachment.size}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer area inside speech bubbles for action buttons and timestamps */}
                        <div className="msg-meta-row">
                          <span className="msg-timestamp">{msg.timestamp}</span>
                          {msg.sender === "ai" && (
                            <button
                              className={`msg-audio-speak-btn ${speakingMessageId === msg.id ? "speaking" : ""}`}
                              onClick={() => speakText(msg.text, msg.id)}
                              title={speakingMessageId === msg.id ? languageStrings.stopBtn : languageStrings.listenBtn}
                              aria-label={speakingMessageId === msg.id ? languageStrings.stopBtn : languageStrings.listenBtn}
                            >
                              {speakingMessageId === msg.id ? <FaVolumeMute size={11} /> : <FaVolumeUp size={11} />}
                              <span>{speakingMessageId === msg.id ? languageStrings.stopBtn : languageStrings.listenBtn}</span>
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  ))}

                  {/* TYPING INDICATOR */}
                  {isTyping && (
                    <div className="chat-message-bubble-wrapper ai-msg-align animate-fade-in">
                      <div className="chat-avatar-column">
                        <div className="msg-ai-avatar">
                          <FaBalanceScale size={13} color="white" />
                        </div>
                      </div>
                      <div className="chat-bubble-content-block">
                        <div className="message-bubble ai-bubble-theme typing-indicator-bubble">
                          <span className="typing-dot animate-bounce"></span>
                          <span className="typing-dot animate-bounce delay-100"></span>
                          <span className="typing-dot animate-bounce delay-200"></span>
                          <span className="typing-indicator-text">{languageStrings.typingIndicator}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ref marker for auto-scroll */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* QUICK ACTION CHIPS */}
              <div className="quick-action-chips-scroller">
                <div className="chips-wrapper">
                  {QUICK_ACTIONS.map((action, index) => (
                    <button
                      key={index}
                      className={`quick-action-chip-btn ${action.type === "emergency" ? "emergency" : ""}`}
                      onClick={() => handleQuickAction(action)}
                      title={action.query}
                    >
                      {action.type === "emergency" && <span className="chip-badge">🚨</span>}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUGGESTED FOLLOW-UPS SECTION */}
              {suggestedQuestions && suggestedQuestions.length > 0 && (
                <div className="suggested-questions-tray">
                  <span className="tray-label">{languageStrings.suggestedTray}</span>
                  <div className="suggested-questions-list">
                    {suggestedQuestions.map((q, idx) => (
                      <button 
                        key={idx} 
                        className="suggested-question-btn" 
                        onClick={() => handleSuggestedQuestion(q)}
                      >
                        <span>{q}</span>
                        <FaArrowRight size={8} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIVE FILE ATTACHMENT CARD */}
              {activeAttachment && (
                <div className="active-attachment-preview-card animate-slide-in">
                  <div className="preview-info-block">
                    <FaFolderOpen size={16} className="preview-folder-icon" />
                    <div>
                      <span className="preview-filename">{activeAttachment.name}</span>
                      <span className="preview-filesize">{activeAttachment.size}</span>
                    </div>
                  </div>
                  <button className="preview-remove-btn" onClick={removeAttachment} title="Remove Document">
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {/* INPUT REGION */}
              <div className="chat-input-toolbar-block">
                <div className="input-row-controls">
                  <button 
                    className="toolbar-action-btn attach" 
                    onClick={triggerAttachment}
                    title="Upload legal document, FIR draft, or screenshot"
                    aria-label="Upload document"
                  >
                    <FaPaperclip />
                  </button>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />

                  <textarea
                    className="chat-textarea-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={languageStrings.placeholder}
                    aria-label={languageStrings.placeholder}
                    rows={1}
                  />

                  <button 
                    className={`toolbar-action-btn mic-record ${isListening ? "recording active" : ""}`} 
                    onClick={toggleListening}
                    title={isListening ? languageStrings.stopBtn : languageStrings.listenBtn}
                    aria-label={isListening ? languageStrings.stopBtn : languageStrings.listenBtn}
                  >
                    <FaMicrophone />
                    {isListening && <span className="mic-pulse-ring"></span>}
                  </button>

                  <button 
                    className="toolbar-send-action-btn"
                    onClick={() => handleSendMessage()}
                    title="Send Message"
                    aria-label="Send Message"
                    disabled={!inputValue.trim() && !activeAttachment}
                  >
                    <FaPaperPlane />
                  </button>
                </div>

                <div className="toolbar-bottom-disclaimer">
                  <span>{languageStrings.disclaimer}</span>
                  <button className="clear-history-button" onClick={clearChatHistory} title={languageStrings.clearChat}>
                    {languageStrings.clearChat}
                  </button>
                </div>
              </div>
            </React.Fragment>
          )}

        </div>
      )}
    </div>
  );
}
