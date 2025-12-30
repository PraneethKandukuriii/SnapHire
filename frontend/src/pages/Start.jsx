import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '⚡', title: 'Fast Booking', desc: 'Book photographers and reel makers in seconds with a smooth interface.' },
  { icon: '🎨', title: 'Skilled Creators', desc: 'Certified photographers and reel makers for high-quality content.' },
  { icon: '🚀', title: 'Instant Delivery', desc: 'Receive edited reels quickly after your event.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Seamless experience across all devices.' },
  { icon: '💡', title: 'Creative Shots', desc: 'Unique and creative ideas for memorable reels.' },
  { icon: '🕒', title: 'Flexible Timing', desc: 'Book creators according to your schedule.' },
  { icon: '💰', title: 'Affordable Plans', desc: 'High-quality content at competitive prices.' },
  { icon: '⭐', title: 'Trusted Professionals', desc: 'Join thousands of satisfied customers.' },
];

const plans = [
  {
    name: 'Hourly Plan',
    price: '₹1,299',
    desc: 'Perfect for anyone who wants a single, fast, high-quality reel.',
    features: ['1 Hour Shoot', '1 Edited Reel', 'Shot on Latest iPhone', 'Fast Delivery (10 mins)', 'Certified Reel Maker'],
  },
  {
    name: 'Half-Day Plan',
    price: '₹3,499',
    desc: 'Ideal for events needing more time and content.',
    features: ['Up to 3 Hours Shoot', '2 Edited Reels', 'Shot on Latest iPhone', 'Fast Delivery', 'Certified Reel Maker'],
  },
];

const reviews = [
  { name: 'Aarav Mehta', text: 'SnapHire made booking photographers seamless and professional.' },
  { name: 'Ananya Rao', text: 'High-quality reels delivered quickly. Excellent service!' },
  { name: 'Karan Verma', text: 'Smooth process, great results, perfect for events.' },
  { name: 'Diya Singh', text: 'Reliable reel makers with fast delivery. Highly recommended.' },
  { name: 'Rohan Kapoor', text: 'Affordable, professional, and efficient experience.' },
  { name: 'Isha Patel', text: 'Fast booking, great quality, hassle-free process.' },
];

const Start = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Inject a cleaner font (Poppins) into the page without changing backend
  useEffect(() => {
    const id = 'snaphire-poppins-font';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap';
      document.head.appendChild(link);
    }
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      // don't remove the font link — leaving it improves UX; if you want to clean up, uncomment next lines
      // const el = document.getElementById(id); if (el) el.remove();
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Smooth looping reviews (keeps original setInterval approach but smoother transition on hover)
  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    };
    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, []);

  // Helper to navigate and close mobile menu
  const go = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <div className="w-full font-sans" style={{ fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-50">
  <div className="w-full flex justify-center px-4 py-3">
    <div className="w-full max-w-7xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 sm:px-10 py-3 flex items-center justify-between shadow-[0_0_20px_rgba(255,255,255,0.08)]">

      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}> 
        <img
          src="/assets/SnapHire-6-2-removebg-preview.png"
          alt="SnapHire Logo"
          className="w-24 sm:w-32"
        />
        
      </div>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-8">
        <button onClick={() => navigate('/')} className="text-white/80 hover:text-white transition text-sm font-medium">Home</button>
        <button onClick={() => navigate('/captain-signup')} className="text-white/80 hover:text-white transition text-sm font-medium">Partner</button>
        <button onClick={() => navigate('/contact')} className="text-white/80 hover:text-white transition text-sm font-medium">Contact</button>
      </nav>

      {/* Right Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <button className="bg-white/10 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition" onClick={() => navigate('/login')}>Request a Demo</button>
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition" onClick={() => navigate('/login')}>Sign Up</button>
      </div>

      {/* Mobile Menu Button */}
      <button
        aria-label="Toggle menu"
        onClick={() => setMobileOpen((s) => !s)}
        className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  </div>

  {/* Mobile Dropdown */}
  {mobileOpen && (
    <div className="md:hidden bg-black/90 border-t border-white/10 px-6 py-4 space-y-4 rounded-b-2xl">
      <button onClick={() => go('/')} className="block text-white text-left text-sm py-2">Home</button>
      <button onClick={() => go('/captain-signup')} className="block text-white text-left text-sm py-2">Partner</button>
      <button onClick={() => go('/contact')} className="block text-white text-left text-sm py-2">Contact</button>
      <button onClick={() => go('/login')} className="bg-white text-black w-full py-2 rounded-full font-semibold">Sign Up</button>
    </div>
  )}
</header>

      {/* Hero Section */}
      <section className="relative h-screen w-full "> {/* space for fixed header */}
        <img
          src="/assets/pexels-photo-29180825-3-2.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-yellow-600/10 to-black/60 flex flex-col">
          <div className="flex flex-col items-center justify-center text-center mt-auto mb-auto px-6 sm:px-16 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">Book Photographers & Reel Makers Instantly</h1>
            <p className="text-xl sm:text-2xl text-white/90 drop-shadow-md">Snapped Your Moments in Seconds! - Capture. Create. Share. All in a blink.</p>
            <div className="flex gap-4 flex-wrap justify-center mt-6">
              <button onClick={() => navigate('/login')} className="bg-yellow-500 bg-opacity-90 text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-600 transition shadow-lg">Get Started</button>
              <button onClick={() => navigate('/captain-signup')} className="bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-full hover:bg-yellow-500 hover:text-black transition shadow-lg">Become Our Partner</button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SnapHire */}
      <section className="py-20 px-6 sm:px-16 bg-black text-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-yellow-400">✨ Discover Why Thousands Love SnapHire</h2>
        <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">High-quality content creation made easy with professional photographers and reel makers.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div key={i} className="relative rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transform transition hover:scale-105 hover:shadow-lg" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-yellow-400">{feature.title}</h3>
              <p className="text-white/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-6 sm:px-16 bg-black text-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-yellow-400">Quick, Creative, and Flexible Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className="relative rounded-xl p-6 flex flex-col shadow-lg transform transition hover:scale-105 cursor-pointer" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">{plan.name}</h3>
              <p className="text-white/80 mb-4">{plan.desc}</p>
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              <ul className="mb-4 list-disc list-inside text-white/80">{plan.features.map((f, idx) => <li key={idx}>{f}</li>)}</ul>
              <button onClick={() => navigate('/login')} className="mt-auto bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition shadow-lg">Book Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-6 sm:px-16 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">What Our Loving Customers Say</h2>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide py-4" onMouseEnter={() => { /* pause on hover */ }}>
          {reviews.concat(reviews).map((review, i) => (
            <div key={i} className="min-w-[280px] bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col justify-between">
              <p className="text-white/90 mb-4">"{review.text}"</p>
              <span className="font-bold text-yellow-400">{review.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-yellow-400 py-6 text-center">
        <p className="text-yellow-400 text-sm">&copy; SnapHire. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Start;
