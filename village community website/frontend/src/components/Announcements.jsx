import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  AlertTriangle, 
  Droplets, 
  Zap, 
  Stethoscope, 
  Construction, 
  GraduationCap, 
  Sprout, 
  PartyPopper, 
  Trash2,
  Info
} from 'lucide-react';

const Announcements = () => {
  const [alerts] = useState([
    { id: 1, type: 'Emergency', text: "Urgent: Water supply disruption in North Sector due to main pipe burst.", date: "Just now", icon: 'Droplets' },
    { id: 2, type: 'Alert', text: "Electricity maintenance notice: Scheduled power cut this Wednesday (9 AM - 12 PM).", date: "1 hour ago", icon: 'Zap' },
    { id: 3, type: 'Event', text: "Free Medical Camp this Sunday at the Community Center. General checkups available.", date: "3 hours ago", icon: 'Stethoscope' },
    { id: 4, type: 'Info', text: "Road repair work starting next week on Main Street. Detours will be marked.", date: "5 hours ago", icon: 'Construction' },
    { id: 5, type: 'Info', text: "Village School Admissions for 2024-25 session are now open. Enrollment forms at office.", date: "Yesterday", icon: 'GraduationCap' },
    { id: 6, type: 'Event', text: "Farmer Training Program: Organic farming workshop this Friday at 10 AM.", date: "Yesterday", icon: 'Sprout' },
    { id: 7, type: 'Event', text: "Village Festival 2024: Volunteer registration now open at the Panchayat office.", date: "2 days ago", icon: 'PartyPopper' },
    { id: 8, type: 'Alert', text: "Cleanliness Drive: Let's keep our village green. Join us this Saturday at 7 AM.", date: "3 days ago", icon: 'Trash2' },
  ]);

  const getIcon = (iconName) => {
    const props = { size: 24 };
    switch (iconName) {
      case 'Droplets': return <Droplets {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Stethoscope': return <Stethoscope {...props} />;
      case 'Construction': return <Construction {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Sprout': return <Sprout {...props} />;
      case 'PartyPopper': return <PartyPopper {...props} />;
      case 'Trash2': return <Trash2 {...props} />;
      default: return <Info {...props} />;
    }
  };

  return (
    <section id="alerts" className="py-20 bg-brand-dark/5 font-sans">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-brand-bright/20 rounded-2xl text-brand-bright">
            <Megaphone size={28} />
          </div>
          <h2 className="font-heading text-3xl font-bold italic text-white uppercase tracking-wider">Village <span className="text-brand-bright">Broadcast</span></h2>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert) => {
              const isNew = alert.date.includes('now') || alert.date.includes('hour');
              const isEmergency = alert.type === 'Emergency';
              const isAlert = alert.type === 'Alert';
              
              let cardStyles = "bg-white border-gray-100 text-gray-800 shadow-sm";
              if (isEmergency) cardStyles = "bg-red-600 text-white border-red-700 shadow-xl shadow-red-200";
              else if (isAlert) cardStyles = "bg-red-50 border-red-100 text-red-800";
              else if (alert.type === 'Info') cardStyles = "bg-emerald-50 border-emerald-100 text-emerald-800";
              else if (alert.type === 'Event') cardStyles = "bg-blue-50 border-blue-100 text-blue-800";

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className={`p-6 rounded-[2rem] border flex items-center gap-5 transition-all ${cardStyles}`}
                >
                  <div className={`p-4 rounded-2xl flex-shrink-0 ${isEmergency ? 'bg-white/20' : 'bg-black/5'}`}>
                    {getIcon(alert.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest opacity-70`}>{alert.type}</span>
                      {isNew && (
                        <span className="bg-brand-bright text-white text-[8px] font-black px-2 py-0.5 rounded-full">NEW</span>
                      )}
                    </div>
                    <p className="font-heading text-lg font-bold leading-tight">{alert.text}</p>
                    <p className="text-xs opacity-60 mt-2 font-bold uppercase tracking-wider">{alert.date}</p>
                  </div>
                  {(isEmergency || isAlert) && (
                    <AlertTriangle size={20} className={isEmergency ? "text-white/80" : "text-red-500"} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Announcements;