import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import toast, { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

import "./App.css"; 

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "<API_KEY>",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "<AUTH_DOMAIN>",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "<PROJECT_ID>",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "<STORAGE_BUCKET>",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "<SENDER_ID>",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "<APP_ID>",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SKILLS = [
  {
    skillId: 1,
    skillName: "Beginner Guitar Lessons",
    providerName: "Alex Martin",
    providerEmail: "alex@skillswap.com",
    price: 20,
    rating: 4.8,
    slotsAvailable: 3,
    description: "Acoustic guitar classes for complete beginners.",
    image:
      "https://i.postimg.cc/3xk3G0c0/guitar.jpg",
    category: "Music",
  },
  {
    skillId: 2,
    skillName: "Spoken English Practice",
    providerName: "Sara Hossain",
    providerEmail: "sara@skillswap.com",
    price: 10,
    rating: 4.6,
    slotsAvailable: 5,
    description: "Conversational English sessions for non-native speakers.",
    image:
      "https://i.postimg.cc/QC2r6Z6s/english.jpg",
    category: "Language",
  },
  {
    skillId: 3,
    skillName: "Intro to Web Development",
    providerName: "Rafi Khan",
    providerEmail: "rafi@skillswap.com",
    price: 25,
    rating: 4.9,
    slotsAvailable: 2,
    description: "HTML, CSS and basic JavaScript for total beginners.",
    image:
      "https://i.postimg.cc/0Q5m0VYD/webdev.jpg",
    category: "Tech",
  },
  {
    skillId: 4,
    skillName: "Yoga for Beginners",
    providerName: "Maya Roy",
    providerEmail: "maya@skillswap.com",
    price: 15,
    rating: 4.7,
    slotsAvailable: 6,
    description: "Gentle yoga sessions focusing on flexibility and breathing.",
    image:
      "https://i.postimg.cc/T3f9z3kB/yoga.jpg",
    category: "Wellness",
  },
  {
    skillId: 5,
    skillName: "Spanish Conversation",
    providerName: "Carlos Perez",
    providerEmail: "carlos@skillswap.com",
    price: 18,
    rating: 4.5,
    slotsAvailable: 4,
    description: "Practice speaking Spanish in a relaxed environment.",
    image:
      "https://i.postimg.cc/0j0L0P3f/spanish.jpg",
    category: "Language",
  },
  {
    skillId: 6,
    skillName: "Portrait Photography Basics",
    providerName: "Nina Bose",
    providerEmail: "nina@skillswap.com",
    price: 30,
    rating: 4.85,
    slotsAvailable: 1,
    description: "Understand light, composition, and posing for portraits.",
    image:
      "https://i.postimg.cc/XYzTgqG1/photo.jpg",
    category: "Art",
  },
];

const containerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "0 16px",
};

const navStyle = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 0",
};

const brandStyle = { fontWeight: 700, fontSize: 20 };

/* ----------------------------
   ProtectedRoute wrapper
-----------------------------*/
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(auth.currentUser);
  const location = useLocation();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (user) return children;

  // redirect to login and preserve where we came from
  return <Navigate to="/login" state={{ from: location }} replace />;
}

/* ----------------------------
   Main App Component
-----------------------------*/
export default function App() {
  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  return (
    <Router>
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Toaster position="top-right" />
        <AppNavbar />
        <main style={{ flex: 1 }}>
          <div style={containerStyle}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/skill/:id" element={<SkillDetailsWrapper />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/update-profile" element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              } />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

/* ----------------------------
   Navbar
-----------------------------*/
function AppNavbar() {
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav style={{ borderBottom: "1px solid #eee", background: "#fff" }}>
      <div style={{ ...containerStyle, ...navStyle }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={brandStyle}><Link to="/">🌻 SkillSwap</Link></div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/">Home</Link>
            <Link to="/#how-it-works">How it works</Link>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {user ? (
            <>
              <Link to="/profile" title={user.displayName || user.email}>
                <img
                  src={user.photoURL || "https://i.postimg.cc/Dz3T2h1b/avatar.png"}
                  alt="avatar"
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                />
              </Link>
              <button onClick={handleLogout} style={{ padding: "6px 10px", borderRadius: 6 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><button style={{ padding: "6px 10px", borderRadius: 6 }}>Login</button></Link>
              <Link to="/signup"><button style={{ padding: "6px 10px", borderRadius: 6 }}>Signup</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ----------------------------
   Footer
-----------------------------*/
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #eee", padding: "20px 0", marginTop: 24, background: "#fafafa" }}>
      <div style={containerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontWeight: 700 }}>SkillSwap</div>
          <div>Contact: hello@skillswap.example | +880 1234 567890</div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------
   Home Page
-----------------------------*/
function Home() {
  // top rated providers: static for demo
  const topProviders = [
    { name: "Rafi Khan", rating: 4.9 },
    { name: "Nina Bose", rating: 4.85 },
    { name: "Alex Martin", rating: 4.8 },
  ];

  return (
    <div>
      <Hero />
      <section style={{ marginTop: 28 }} data-aos="fade-up">
        <h2>Popular Skills</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 12 }}>
          {SKILLS.map((s) => (
            <SkillCard key={s.skillId} skill={s} />
          ))}
        </div>
      </section>

      <section id="top-rated" style={{ marginTop: 28 }} data-aos="fade-up">
        <h3>Top Rated Providers</h3>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {topProviders.map((p, idx) => (
            <div key={idx} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div>Rating: {p.rating}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ marginTop: 28 }} data-aos="fade-up">
        <h3>How It Works</h3>
        <ol>
          <li>Browse local skill listings.</li>
          <li>Create account & view details.</li>
          <li>Book a session (form) and connect.</li>
        </ol>
      </section>

      <section style={{ marginTop: 28 }} data-aos="fade-up">
        <h3>Extra Section: Community Events</h3>
        <p>Local weekly meetups where learners and providers can showcase and exchange skills. (Static demo content)</p>
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section style={{ marginTop: 16 }} data-aos="fade-right">
      <Swiper spaceBetween={20} slidesPerView={1} style={{ height: 220 }}>
        <SwiperSlide>
          <div style={{ padding: 20, background: "linear-gradient(90deg,#f6f9fc,#fff)", borderRadius: 8, height: "100%", display: "flex", alignItems: "center" }}>
            <div>
              <h1>Learn locally, teach locally</h1>
              <p>Offer, learn, or trade skills in your neighborhood.</p>
              <Link to="/"><button style={{ padding: "8px 12px", borderRadius: 6 }}>Get Started</button></Link>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div style={{ padding: 20, background: "linear-gradient(90deg,#fff6f6,#fff)", borderRadius: 8, height: "100%", display: "flex", alignItems: "center" }}>
            <div>
              <h1>Find top-rated providers</h1>
              <p>Read ratings and book sessions with confidence.</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

function SkillCard({ skill }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
      <img src={skill.image} alt={skill.skillName} style={{ width: "100%", height: 140, objectFit: "cover" }} />
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontWeight: 700 }}>{skill.skillName}</div>
        <div>By {skill.providerName} · {skill.category}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>⭐ {skill.rating}</div>
          <div style={{ fontWeight: 700 }}>${skill.price}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/skill/${skill.skillId}`}><button style={{ padding: "6px 8px", borderRadius: 6 }}>View Details</button></Link>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------
   Skill Details (Protected)
   - If not logged in, redirect to /login and return here after login.
-----------------------------*/
function SkillDetailsWrapper() {
  return (
    <ProtectedRoute>
      <SkillDetails />
    </ProtectedRoute>
  );
}

function SkillDetails() {
  const params = useParams();
  const id = parseInt(params.id, 10);
  const skill = SKILLS.find((s) => s.skillId === id);
  const [form, setForm] = useState({ name: "", email: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill name and email");
      return;
    }
    toast.success("Session booked successfully!");
    setForm({ name: "", email: "" });
  };

  if (!skill) return <div>Skill not found</div>;

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <img src={skill.image} alt={skill.skillName} style={{ width: 300, height: 200, objectFit: "cover", borderRadius: 8 }} />
          <div>
            <h2>{skill.skillName}</h2>
            <div style={{ marginBottom: 8 }}>
              <strong>Provider:</strong> {skill.providerName} ({skill.providerEmail})
            </div>
            <div><strong>Category:</strong> {skill.category}</div>
            <div><strong>Price:</strong> ${skill.price}</div>
            <div><strong>Rating:</strong> {skill.rating}</div>
            <div><strong>Slots:</strong> {skill.slotsAvailable}</div>
            <p style={{ marginTop: 12 }}>{skill.description}</p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 16 }}>
          <h3>Book Session</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexDirection: "column", maxWidth: 420 }}>
            <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <button type="submit" style={{ width: 120 }}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------
   Login Page
-----------------------------*/
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState(location.state?.prefilledEmail || "");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    // If user already logged in, navigate
    if (auth.currentUser) navigate(from, { replace: true });
  }, [navigate, from]);

  const loginWithEmail = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error("Login failed: " + err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div style={{ marginTop: 20, maxWidth: 520 }}>
      <h2>Login</h2>
      <form onSubmit={loginWithEmail} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ display: "flex" }}>
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ marginLeft: 8 }}>
            {showPass ? "Hide" : "Show"}
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/forgot-password" state={{ email }}>Forgot Password?</Link>
          <button type="submit">Login</button>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
          <button type="button" onClick={loginWithGoogle}>Continue with Google</button>
          <div style={{ marginTop: 8 }}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------
   Signup page with password validation
-----------------------------*/
function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const validatePassword = (pw) => {
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const len = pw.length >= 6;
    return { ok: hasUpper && hasLower && len, hasUpper, hasLower, len };
  };

  const signup = async (e) => {
    e.preventDefault();
    const v = validatePassword(password);
    if (!v.ok) {
      toast.error(
        `Password invalid. Uppercase: ${v.hasUpper}, Lowercase: ${v.hasLower}, Length >=6: ${v.len}`
      );
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // update profile
      await updateProfile(userCred.user, { displayName: name, photoURL });
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Signup failed: " + err.message);
    }
  };

  const signupWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed up with Google");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Google signup failed");
    }
  };

  return (
    <div style={{ marginTop: 20, maxWidth: 520 }}>
      <h2>Signup</h2>
      <form onSubmit={signup} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Photo URL" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ display: "flex" }}>
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ marginLeft: 8 }}>
            {showPass ? "Hide" : "Show"}
          </button>
        </div>
        <div>
          Password must have: Uppercase, Lowercase, and at least 6 characters.
        </div>
        <button type="submit">Register</button>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
          <button type="button" onClick={signupWithGoogle}>Continue with Google</button>
          <div style={{ marginTop: 8 }}>
            Already have account? <Link to="/login">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------
   Profile page
-----------------------------*/
function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return null;

  return (
    <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
      <div>
        <img src={user.photoURL || "https://i.postimg.cc/Dz3T2h1b/avatar.png"} alt="avatar" style={{ width: 160, height: 160, borderRadius: 12, objectFit: "cover" }} />
      </div>
      <div>
        <h2>{user.displayName || "No name set"}</h2>
        <div>{user.email}</div>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => navigate("/update-profile")}>Update Profile</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------
   Update Profile page (uses updateProfile)
-----------------------------*/
function UpdateProfile() {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setName(u?.displayName || "");
      setPhoto(u?.photoURL || "");
    });
    return () => unsub();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateProfile(user, { displayName: name, photoURL: photo });
      toast.success("Profile updated");
      navigate("/profile");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Photo URL" value={photo} onChange={(e) => setPhoto(e.target.value)} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

/* ----------------------------
   Forgot Password page
   - Pre-fills email if provided from login link
   - On reset, send reset email and redirect to Gmail (per assignment)
-----------------------------*/
function ForgotPassword() {
  const location = useLocation();
  const prefilled = location.state?.email || "";
  const [email, setEmail] = useState(prefilled);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter email");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent. Redirecting to Gmail...");
      // per assignment: redirect to Gmail
      setTimeout(() => {
        window.location.href = "https://mail.google.com";
      }, 1000);
    } catch (err) {
      toast.error("Reset failed: " + err.message);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleReset} style={{ display: "flex", gap: 8, flexDirection: "column", maxWidth: 480 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Reset & go to Gmail</button>
      </form>
    </div>
  );
}

/* ----------------------------
   Not Found
-----------------------------*/
function NotFound() {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>404 — Page not found</h2>
      <p><Link to="/">Go back home</Link></p>
    </div>
  );
}


