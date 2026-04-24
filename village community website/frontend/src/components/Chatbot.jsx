import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Namaste! I am your Village Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // API Integration Point: Replace this setTimeout with your actual fetch call
      setTimeout(() => {
        let botResponse = "";
        const input = inputValue.toLowerCase();

        // Friendly, short, and clear fallback logic
        if (input.includes('farm') || input.includes('crop')) {
          botResponse = language === 'en' 
            ? "Use organic manure for healthy soil. Rotate crops every season."
            : "मिट्टी के लिए जैविक खाद का प्रयोग करें। हर मौसम में फसल बदलें।";
        } else if (input.includes('weather')) {
          botResponse = language === 'en'
            ? "It might rain soon. Please cover your crops in the field."
            : "जल्द ही बारिश हो सकती है। कृपया अपनी कटी हुई फसलों को ढक दें।";
        } else if (input.includes('scheme') || input.includes('government') || input.includes('paisa')) {
          botResponse = language === 'en'
            ? "Check PM-Kisan portal for payments. Visit Panchayat office for help."
            : "किस्तों के लिए पीएम-किसान पोर्टल देखें। मदद के लिए पंचायत कार्यालय जाएं।";
        } else {
          botResponse = language === 'en'
            ? "I can help with farming, weather, and schemes. What do you need?"
            : "मैं खेती, मौसम और सरकारी योजनाओं में मदद कर सकता हूँ। आपको क्या चाहिए?";
        }

        setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: language === 'en' ? "The system is busy. Try again later." : "सिस्टम व्यस्त है। बाद में प्रयास करें।", 
        sender: 'bot' 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-dark-slate/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-natural-green/20 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-white font-heading font-bold text-sm">Village Assistant</h3>
                <span className="text-[10px] text-natural-green font-medium uppercase tracking-wider">Online</span>
              </div>
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="text-[10px] px-3 py-1 bg-white/10 rounded-full text-white border border-white/20 hover:bg-white/20 transition-all font-sans"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-sans leading-relaxed ${
                    msg.sender === 'user' 
                    ? 'bg-futuristic-blue text-white rounded-tr-none' 
                    : 'bg-white/10 text-gray-100 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/10 flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/20 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'en' ? "Ask me anything..." : "कुछ भी पूछें..."}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-futuristic-blue transition-all"
                />
                <button onClick={handleSend} disabled={!inputValue.trim()} className="absolute right-1.5 p-1.5 bg-futuristic-blue text-white rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-natural-green rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-natural-green/40 transition-all focus:outline-none"
      >
        {isOpen ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
      </motion.button>
    </div>
  );
};

export default Chatbot;