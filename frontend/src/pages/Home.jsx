import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import socket from "../socket";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const eventTypes = [
  "Wedding Photography",
  "Birthday Photography",
  "Event Photography",
  "Fashion Shoot",
  "Reel Making",
  "Product Shoot",
  "Travel Shoot",
  "Concert Shoot",
  "Corporate Shoot",
];

const packages = [
  {
    name: "Wedding Bliss",
    price: "₹1,00,000",
    stripePriceId: "price_1SF80hAznHviGJspEkL7MEBc",
    desc: "Full wedding coverage including pre-wedding shoot, wedding day, and reception.",
    deliverables: [
      "10 Instagram/TikTok Reels (30–60 sec each)",
      "50 high-resolution aesthetic photos",
      "2 Highlight Videos (3–5 min each)",
      "Drone shots for aerial coverage",
    ],
    duration: "2–3 days (depending on event size)",
    teamSize: "3–7 members",
    teamDetails: [
      "Photographers: 2–4",
      "Videographers: 1–2",
      "Drone operator: 1",
      "Assistants: 1–2",
    ],
  },
  {
    name: "Corporate Spotlight",
    price: "₹30,000",
    stripePriceId: "price_1SF9SXAznHviGJsphttjQuvL",
    desc: "Ideal for corporate events with professional coverage and fast delivery.",
    deliverables: [
      "5 Instagram/TikTok Reels (30–60 sec each)",
      "30 high-resolution photos",
      "1 Highlight Video (2–3 min)",
    ],
    duration: "1–2 days",
    teamSize: "2–4 members",
    teamDetails: ["Photographers: 1–2", "Videographers: 1–2"],
  },
  {
    name: "Birthday Bash",
    price: "₹35,000",
    stripePriceId: "price_1SF9Z7AznHviGJspLOBYw4j3",
    desc: "Capture all fun birthday moments, from cake-cutting to candid smiles.",
    deliverables: [
      "3 Instagram/TikTok Reels (30–60 sec each)",
      "50 candid photos (some edited, some raw)",
      "Raw video clips for memories",
    ],
    duration: "1 day",
    teamSize: "1–3 members",
    teamDetails: ["Photographer: 1–2", "Videographer: 1"],
  },
  {
    name: "Creative Custom",
    price: " Custom range (₹10,000 advance)",
    stripePriceId: "price_1SF9bEAznHviGJspHZgyw8uQ",
    desc: "Fully customizable plan for personal, fashion, travel, or any shoot.",
    deliverables: [
      "Custom number of reels, photos, and videos as per client requirement",
    ],
    duration: "Flexible (based on project)",
    teamSize: "1–5 members",
    teamDetails: ["Photographers/Videographers as per requirement"],
    note: "Client pays ₹10,000 advance; our team will contact to finalize details.",
  },
];

const ads = [
  {
    title: "💠 Capture Moments That Last Forever",
    tagline:
      "Your story deserves elegance — crafted with cinematic softness and timeless beauty.",
  },
  {
    title: "💎 Premium Wedding Cinematics",
    tagline:
      "From teary smiles to grand lights — every moment preserved with luxury precision.",
  },
  {
    title: "🏛️ Elite Corporate Coverage",
    tagline:
      "Sharp, polished, and professional visuals tailored for brands and business events.",
  },
  {
    title: "📽️ High-End Creator Experience",
    tagline:
      "Work with verified photographers and filmmakers trusted by couples and companies.",
  },
  {
    title: "🌙 Every Frame, A Beautiful Story",
    tagline:
      "Soft tones. Real emotions. Cinematic artistry designed to evoke warmth and nostalgia.",
  },
  {
    title: "⚡ Ultra-Fast Delivery. Zero Compromise.",
    tagline:
      "Premium editing pipelines ensure world-class results delivered right when you need them.",
  },
  {
    title: "📸 Crafted With Masterful Precision",
    tagline:
      "From weddings to campaigns — expect clarity, depth, and stunning detail in every shot.",
  },
  {
    title: "🤍 Trusted by Thousands",
    tagline:
      "First-time users, families, and leading brands choose us for reliability and excellence.",
  },
];


const reviews = [
  {
    name: "Aarav Mehta",
    text: "SnapHire made booking photographers seamless and professional.",
  },
  {
    name: "Ananya Rao",
    text: "High-quality reels delivered quickly. Excellent service!",
  },
  {
    name: "Karan Verma",
    text: "Smooth process, great results, perfect for events.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [location, setLocation] = useState("");
  const [shootType, setShootType] = useState("");
  const [currentAd, setCurrentAd] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  // Inject font + smooth scroll (like Start)
  useEffect(() => {
    const id = "snaphire-poppins-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap";
      document.head.appendChild(link);
    }
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Initialize user & rotate ads
  useEffect(() => {
    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    setUser({
      fullname: {
        firstname: firstname || "User",
        lastname: lastname || "",
      },
    });

    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    navigate("/login");
  };

  // Navigate to available partners
  const handleSearch = (e) => {
    e.preventDefault();
    if (!location || !shootType) {
      toast.error("Please fill all fields");
      return;
    }
    navigate(
      `/available-partners?location=${encodeURIComponent(
        location
      )}&shootType=${encodeURIComponent(shootType)}`
    );
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "U";

  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/create-checkout-session`,
        {
          priceId,
          userId: localStorage.getItem("userId"),
        }
      );

      const { url } = response.data;
      window.location.href = url;
    } catch (err) {
      console.error("Checkout Error:", err?.response ?? err);
      toast.error("Payment failed. Try again!");
    }
  };

  // Fetch bookings for notifications (initial)
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/bookings/user/${userId}`
        );
        const pendingMessages = (res.data.bookings || [])
          .filter((b) => b.status === "Pending")
          .map((b) => `Booking for ${b.shootType} is pending.`);
        setNotifications(pendingMessages);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [userId]);

  // Socket notifications
  useEffect(() => {
    if (!userId) return;
    socket.emit("joinUserRoom", userId);

    socket.on("userNotification", (data) => {
      if (data?.message) {
        setNotifications((prev) => [...prev, data.message]);
      }
    });

    return () => {
      socket.off("userNotification");
    };
  }, [userId]);

  // Helper for mobile nav links
  const go = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <div
      className="w-full font-sans text-white bg-black"
      style={{
        fontFamily:
          "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="w-full flex justify-center px-4 py-3">
          <div className="w-full max-w-7xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 sm:px-10 py-3 flex items-center justify-between shadow-[0_0_20px_rgba(255,255,255,0.08)]">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="/assets/SnapHire-6-2-removebg-preview.png"
                alt="SnapHire Logo"
                className="w-24 sm:w-32"
              />
            </div>

            {/* Center Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate("/home")}
                className="text-white/80 hover:text-white transition text-sm font-medium"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/captain-signup")}
                className="text-white/80 hover:text-white transition text-sm font-medium"
              >
                Partner
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-white/80 hover:text-white transition text-sm font-medium"
              >
                Contact
              </button>
            </nav>

            {/* Right: Notifications + User dropdown (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <FaBell
                  className="text-yellow-400 text-xl cursor-pointer"
                  onClick={() => setNotifOpen((v) => !v)}
                />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 w-4 h-4 rounded-full border border-black text-[10px] flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
                {notifOpen && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-64 bg-black border border-yellow-400 rounded shadow-lg z-50">
                    <div className="p-3">
                      <span className="font-bold text-yellow-400">
                        Notifications
                      </span>
                      <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {notifications.map((msg, idx) => (
                          <li
                            key={idx}
                            className="text-white text-xs leading-snug"
                          >
                            {msg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar + dropdown */}
              <div
                className="flex items-center gap-3 relative"
                ref={dropdownRef}
              >
                <div
                  className="w-10 h-10 bg-yellow-500 text-black font-bold rounded-full flex items-center justify-center text-base cursor-pointer"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  {getInitial(user?.fullname?.firstname)}
                </div>
                {user && (
                  <span className="text-yellow-300 font-medium text-sm">
                    {user?.fullname?.firstname} {user?.fullname?.lastname}
                  </span>
                )}
                {dropdownOpen && (
                  <div className="absolute top-12 right-0 w-44 bg-black/90 backdrop-blur-md border border-yellow-400 rounded-lg p-3 flex flex-col gap-2 shadow-lg z-50">
                    <button
                      onClick={() => navigate("/profile")}
                      className="text-left text-white hover:text-yellow-400 text-sm"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="text-left text-white hover:text-yellow-400 text-sm"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => navigate("/my-bookings")}
                      className="text-left text-white hover:text-yellow-400 text-sm"
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-left text-red-400 hover:text-red-300 text-sm mt-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((s) => !s)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-black/90 border-t border-white/10 px-6 py-4 space-y-4 rounded-b-2xl">
            <button
              onClick={() => go("/home")}
              className="block text-white text-left text-sm py-2"
            >
              Home
            </button>
            <button
              onClick={() => go("/captain-signup")}
              className="block text-white text-left text-sm py-2"
            >
              Partner
            </button>
            <button
              onClick={() => go("/contact")}
              className="block text-white text-left text-sm py-2"
            >
              Contact
            </button>
            <button
              onClick={() => go("/my-bookings")}
              className="block text-white text-left text-sm py-2"
            >
              My Bookings
            </button>
            <button
              onClick={() => go("/profile")}
              className="block text-white text-left text-sm py-2"
            >
              Profile
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="block text-red-400 text-left text-sm py-2"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center bg-black px-6 text-center">
  <div className="text-yellow-400 transition-all duration-500 mt-20">
    <h1 className="text-5xl sm:text-7xl font-extrabold">
      {ads[currentAd].title}
    </h1>
    <p className="mt-4 text-2xl text-white sm:text-4xl ">
      {ads[currentAd].tagline}
    </p>
  </div>
</section>



      {/* Booking Search */}
      <section className="h-screen flex flex-col items-center justify-center px-5 bg-black">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-yellow-400 text-center leading-tight mb-4">
          Looking for Individual Photographer <br /> or Reel Makers?
        </h1>
        <h2 className="text-xl sm:text-2xl text-white font-semibold mb-2">
          Find the best near you!
        </h2>

        <form
          className="flex flex-col md:flex-row gap-3 w-full max-w-3xl"
          onSubmit={handleSearch}
        >
          <input
            className="bg-black/50 px-4 py-3 text-white rounded-lg border border-yellow-400 placeholder-yellow-300 focus:ring-2 focus:ring-yellow-500 outline-none flex-1"
            type="text"
            placeholder="Enter Location (e.g., Vadodara)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <select
            className="bg-black/50 px-4 py-3 text-white rounded-lg border border-yellow-400 focus:ring-2 focus:ring-yellow-500 outline-none flex-1"
            value={shootType}
            onChange={(e) => setShootType(e.target.value)}
            required
          >
            <option value="">Select Event Type</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button className="bg-yellow-500 text-black font-bold rounded-full px-6 py-3 hover:bg-yellow-600 transition">
            Search
          </button>
        </form>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-6 sm:px-16 bg-black text-white">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 text-yellow-400">
          Our Package Plans
        </h2>
        <p className="text-lg sm:text-xl text-center text-white/80 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan that fits your style — affordable, flexible,
          and designed for unforgettable moments.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-xl p-6 flex flex-col shadow-lg transform transition hover:scale-105 cursor-pointer"
              style={{
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">
                {plan.name}
              </h3>
              <p className="text-white/80 mb-2">{plan.desc}</p>
              <p className="text-3xl font-bold mb-4">{plan.price}</p>

              {plan.deliverables && (
                <>
                  <h4 className="font-semibold text-yellow-400 mb-1">
                    Deliverables:
                  </h4>
                  <ul className="mb-4 list-disc list-inside text-white/80">
                    {plan.deliverables.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {plan.duration && (
                <p className="text-white/80 mb-2">
                  <span className="font-semibold text-yellow-400">
                    Duration:
                  </span>{" "}
                  {plan.duration}
                </p>
              )}

              {plan.teamSize && (
                <p className="text-white/80 mb-2">
                  <span className="font-semibold text-yellow-400">
                    Team Size:
                  </span>{" "}
                  {plan.teamSize}
                </p>
              )}

              {plan.teamDetails && (
                <>
                  <h4 className="font-semibold text-yellow-400 mb-1">
                    Team Details:
                  </h4>
                  <ul className="mb-4 list-disc list-inside text-white/80">
                    {plan.teamDetails.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {plan.note && (
                <p className="text-white/80 mb-4">
                  <span className="font-semibold text-yellow-400">Note:</span>{" "}
                  {plan.note}
                </p>
              )}

              <button
                onClick={() => handleCheckout(plan.stripePriceId)}
                className="mt-auto bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition shadow-lg"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-6 sm:px-16 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">
          What Our Customers Say
        </h2>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-4"
        >
          {[...reviews, ...reviews].map((review, i) => (
            <div
              key={i}
              className="min-w-[280px] bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col justify-between"
            >
              <p className="text-white/90 mb-4">"{review.text}"</p>
              <span className="font-bold text-yellow-400">
                {review.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-black text-center border-t border-yellow-400">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4">
          Any problem or doubt?
        </h2>
        <p className="text-white/80 mb-6">
          Contact us and we’ll be happy to help you,{" "}
          {user?.fullname?.firstname} {user?.fullname?.lastname}.
        </p>
        <Link
          to="/contact"
          className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-600 transition"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
};

export default Home;
