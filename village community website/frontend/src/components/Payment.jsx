import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, ShieldCheck } from 'lucide-react';

const Payment = () => {
  const loadRazorpay = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  React.useEffect(() => { loadRazorpay(); }, []);

  const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Enter the Key ID generated from the Dashboard
      amount: "10000", // Amount in paise (10000 = ₹100)
      currency: "INR",
      name: "Village Hub",
      description: "Community Contribution",
      handler: function (response) {
        alert("Payment Successful! Reference ID: " + response.razorpay_payment_id);
      },
      prefill: { name: "User", email: "user@example.com" },
      theme: { color: "#38b48b" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-dark/5 text-white flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="bg-brand-dark/5 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-brand-bright/20 rounded-full flex items-center justify-center text-brand-bright mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-4">Secure <span className="text-brand-bright">Payments</span></h2>
          <p className="text-gray-400 mb-8">Support local farmers and community projects directly through secure digital payments.</p>
          
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <Smartphone className="text-brand-bright" />
              <div className="text-left">
                <p className="font-bold text-sm">UPI / QR Codes</p>
                <p className="text-[10px] text-gray-500 uppercase">GPay, PhonePe, Paytm</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <CreditCard className="text-brand-bright" />
              <div className="text-left">
                <p className="font-bold text-sm">Cards & Netbanking</p>
                <p className="text-[10px] text-gray-500 uppercase">All Indian Banks Supported</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePayment}
            className="w-full bg-brand-bright text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-brand-medium transition-all uppercase tracking-widest"
          >
            Contribute Now
          </motion.button>
          
          <div className="mt-6 flex justify-center gap-4 opacity-40">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" className="h-4 invert" alt="GPay" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/PhonePe_Logo.svg" className="h-4 invert" alt="PhonePe" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;