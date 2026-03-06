// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAqjiC5j9I7ldo7K-_UrMsfL0ZtwGvuU-Y",
  authDomain: "phinex-d4094.firebaseapp.com",
  projectId: "phinex-d4094",
  storageBucket: "phinex-d4094.firebasestorage.app",
  messagingSenderId: "235704197564",
  appId: "1:235704197564:web:4fc3fc19586c936f760bb9",
  measurementId: "G-YPMHH1344X"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// API Base URL (Your Node.js backend)
const API_BASE_URL = 'http://localhost:3000/api'; // Change in production

// Authentication utilities
const auth = firebase.auth();
const db = firebase.firestore();

// Social Providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
// Configure providers (optional)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

facebookProvider.setCustomParameters({
  'display': 'popup'
});

// Utility function to show messages
function showMessage(message, type = 'error') {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

// ===== AUTH STATE OBSERVER =====
auth.onAuthStateChanged((user) => {
  const loginNav = document.getElementById("loginNav");
  const logoutBtn = document.getElementById("logoutBtn");
  
  if (user) {
    // User is signed in
    if (loginNav) loginNav.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    console.log("User is signed in:", user.email);
  } else {
    // User is signed out
    if (loginNav) loginNav.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    console.log("User is signed out");
  }
});

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginBtn = document.getElementById("loginBtn");
    
    try {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      showMessage("Login successful! Redirecting...", 'success');
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
      
    } catch(error) {
      console.error("Login error:", error);
      showMessage("Login failed: " + error.message);
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
  });
}

// ===== SIGNUP =====
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const robotCheck = document.getElementById("robotCheck").checked;
    const signupBtn = document.getElementById("signupBtn");
    
    if (!robotCheck) {
      showMessage("Please confirm you're not a robot!");
      return;
    }
    
    if (password.length < 6) {
      showMessage("Password should be at least 6 characters");
      return;
    }
    
    try {
      signupBtn.disabled = true;
      signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Save user data to Firestore
      await db.collection("users").doc(user.uid).set({
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: "student"
      });
      
      showMessage("Account created successfully! Redirecting to login...", 'success');
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
      
    } catch(error) {
      console.error("Signup error:", error);
      showMessage("Signup failed: " + error.message);
    } finally {
      signupBtn.disabled = false;
      signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
  });
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
      showMessage("Logged out successfully!", 'success');
      window.location.href = "index.html";
    } catch(error) {
      console.error("Logout error:", error);
      showMessage("Logout failed: " + error.message);
    }
  });
}

// ===== GOOGLE LOGIN =====
function setupGoogleLogin() {
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const googleSignupBtn = document.getElementById('googleSignupBtn');
  
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', signInWithGoogle);
  }
  
  if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', signInWithGoogle);
  }
}

async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create a record
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'google',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: 'student'
      });
    }
    
    showMessage('Google login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    
  } catch (error) {
    console.error('Google login error:', error);
    showMessage('Google login failed: ' + error.message);
  }
}

// ===== FACEBOOK LOGIN =====
function setupFacebookLogin() {
  const facebookLoginBtn = document.getElementById('facebookLoginBtn');
  const facebookSignupBtn = document.getElementById('facebookSignupBtn');
  
  if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener('click', signInWithFacebook);
  }
  
  if (facebookSignupBtn) {
    facebookSignupBtn.addEventListener('click', signInWithFacebook);
  }
}

async function signInWithFacebook() {
  try {
    // Add additional scopes if needed
    facebookProvider.addScope('email');
    facebookProvider.addScope('public_profile');
    
    const result = await auth.signInWithPopup(facebookProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create a record
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'facebook',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: 'student'
      });
    }
    
    showMessage('Facebook login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    
  } catch (error) {
    console.error('Facebook login error:', error);
    showMessage('Facebook login failed: ' + error.message);
  }
}

// ===== JOIN X-ACADEMY =====
const joinAcademyBtns = document.querySelectorAll("#joinAcademyBtn");
joinAcademyBtns.forEach(btn => {
  if (btn) {
    btn.addEventListener("click", () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          window.location.href = "test.html";
        } else {
          window.location.href = "login.html";
        }
      });
    });
  }
});

// ===== TEST QUESTIONS =====
if (document.getElementById("questions")) {
  const questions = [
    {
      q: "Why do you want to learn programming?",
      a: ["Want to gain money", "Just for fun", "I need a nice job", "I want to try"]
    },
    {
      q: "Do you have an app on Google Play or a website?",
      a: ["No, beginner", "Yes, AI made", "Yes, self-made", "No, making projects only"]
    },
    {
      q: "Who are you working for now?",
      a: ["Programming company", "Community with friends", "Freelancer", "Never worked before"]
    },
    {
      q: "Arrange languages (descending):",
      a: ["Python", "Java", "C++", "JavaScript", "C#", "None, here to start my journey"]
    },
    {
      q: "Which apps/websites you want to make?",
      a: ["Games apps", "Learning apps", "Games on Roblox/Unity", "Websites for gaming or programming"]
    },
    {
      q: "How many hours per week can you learn?",
      a: ["1-3", "4-6", "7-10", "10+"]
    },
    {
      q: "What platform do you prefer?",
      a: ["Mobile", "PC", "Web", "All of them"]
    },
    {
      q: "Do you like team projects?",
      a: ["Yes", "No", "Maybe", "Not sure yet"]
    },
    {
      q: "Do you know Git/GitHub?",
      a: ["No", "A bit", "Yes, I use it often", "I'm expert"]
    },
    {
      q: "What do you expect from X-Academy?",
      a: ["Learning", "Collaboration", "Certification", "Fun challenges"]
    }
  ];

  const qDiv = document.getElementById("questions");
  
  questions.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${i + 1}. ${item.q}</strong></p>
      ${item.a.map(opt => `
        <label>
          <input type='radio' name='q${i}' value='${opt}' required> 
          ${opt}
        </label>
      `).join("")}
    `;
    qDiv.appendChild(div);
  });

  document.getElementById("testForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Collect answers
    const answers = {};
    let allAnswered = true;
    
    questions.forEach((_, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected) {
        answers[`q${i + 1}`] = selected.value;
      } else {
        allAnswered = false;
      }
    });
    
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    // In a real app, you would save these answers to Firebase
    console.log("Test answers:", answers);
    
    // Show thank you message
    document.getElementById("testForm").classList.add("hidden");
    document.getElementById("thankYou").classList.remove("hidden");
  });
}



// Initialize social login buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setupGoogleLogin();
  setupFacebookLogin();
});

// Add message styles to CSS
const style = document.createElement('style');
style.textContent = `
  .message {
    padding: 12px;
    border-radius: var(--border-radius);
    margin: 15px 0;
    text-align: center;
    display: none;
  }
  
  .message.error {
    background: rgba(255, 101, 132, 0.2);
    border: 1px solid var(--secondary);
    color: #ff6584;
  }
  
  .message.success {
    background: rgba(40, 167, 69, 0.2);
    border: 1px solid var(--success);
    color: #28a745;
  }
  
  .nav-menu.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--darker);
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
    
    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;
document.head.appendChild(style);

function checkCode() {
    const correctCode = "FAMILY.PHINEX";
    const userInput = document.getElementById('code-input').value.toUpperCase();
    const successMessage = document.getElementById('message-success');
    const errorMessage = document.getElementById('message-error');
    const discordInvite = document.getElementById('discord-invite'); // Get the new element

    // Hide previous messages and link
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    discordInvite.style.display = 'none';

    if (userInput === correctCode) {
        // Code is correct: show success message and discord link
        successMessage.style.display = 'block';
        discordInvite.style.display = 'block';
    } else {
        // Code is incorrect: show error message
        errorMessage.style.display = 'block';
    }
}
// ===== NODE.JS API INTEGRATION =====

// Register with Node.js backend
async function registerWithBackend(email, password, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: userData.username || email.split('@')[0],
        firstName: userData.firstName,
        lastName: userData.lastName
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Login with Node.js backend
async function loginWithBackend(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    // Store JWT token
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Get user profile from backend
async function getUserProfile() {
  const token = localStorage.getItem('jwt_token');
  
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    
    return data.user;
  } catch (error) {
    throw error;
  }
}

// Update signup handler in app.js
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const robotCheck = document.getElementById("robotCheck").checked;
    const signupBtn = document.getElementById("signupBtn");
    
    if (!robotCheck) {
      showMessage("Please confirm you're not a robot!");
      return;
    }
    
    if (password.length < 6) {
      showMessage("Password should be at least 6 characters");
      return;
    }
    
    try {
      signupBtn.disabled = true;
      signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      
      // Register with Node.js backend
      const result = await registerWithBackend(email, password, {
        firstName: '',
        lastName: ''
      });
      
      // Optional: Also create Firebase account for Firebase features
      const firebaseUser = await auth.createUserWithEmailAndPassword(email, password);
      
      // Save to Firestore for Firebase-specific features
      await db.collection("users").doc(firebaseUser.user.uid).set({
        email: email,
        nodejsUserId: result.user.id, // Link to Node.js user ID
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: "student"
      });
      
      showMessage("Account created successfully! Redirecting to login...", 'success');
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
      
    } catch(error) {
      console.error("Signup error:", error);
      showMessage("Signup failed: " + error.message);
    } finally {
      signupBtn.disabled = false;
      signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
  });
}

// Update login handler in app.js
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginBtn = document.getElementById("loginBtn");
    
    try {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      // Login with Node.js backend
      const result = await loginWithBackend(email, password);
      
      showMessage("Login successful! Redirecting...", 'success');
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
      
    } catch(error) {
      console.error("Login error:", error);
      showMessage("Login failed: " + error.message);
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
  });
}

// Add logout handler for Node.js
function logoutFromBackend() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
}

// Update existing logout button handler
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      // Logout from Firebase
      await auth.signOut();
      
      // Logout from Node.js backend
      logoutFromBackend();
      
      showMessage("Logged out successfully!", 'success');
      window.location.href = "index.html";
    } catch(error) {
      console.error("Logout error:", error);
      showMessage("Logout failed: " + error.message);
    }
  });
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('jwt_token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (token && user) {
    // User is logged in via Node.js
    const loginNav = document.getElementById("loginNav");
    const logoutBtn = document.getElementById("logoutBtn");
    
    if (loginNav) loginNav.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    
    console.log("User logged in via Node.js:", user.email);
  }
});
// Loading animation control
document.addEventListener('DOMContentLoaded', function() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // Hide loading animation after page is fully loaded
  window.addEventListener('load', function() {
    setTimeout(function() {
      loadingOverlay.classList.add('hidden');
      
      // Remove from DOM after animation completes
      setTimeout(function() {
        loadingOverlay.style.display = 'none';
      }, 500);
    }, 0); // Adjust timing as needed (1500ms = 1.5 seconds)
  });
  
  // Fallback in case load event doesn't fire
  setTimeout(function() {
    if (!loadingOverlay.classList.contains('hidden')) {
      loadingOverlay.classList.add('hidden');
      setTimeout(function() {
        loadingOverlay.style.display = 'none';
      }, 5000);
    }
  }, 8000); // Maximum 5 seconds loading time
});
async function fetchGitHubProjects() {
    const username = 'ahmedelgoharymessi-dot'; 
    const container = document.getElementById('github-projects');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        container.innerHTML = '';

        repos.forEach(repo => {
            if (repo.fork) return;
            const projectHTML = `
                <div class="project-item" style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: #667eea; margin-bottom: 10px;">${repo.name.replace(/-/g, ' ')}</h4>
                    <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 15px;">${repo.description || 'Innovation in progress...'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; font-weight: bold; color: #764ba2;">${repo.language || 'Project'}</span>
                        <a href="${repo.html_url}" target="_blank" style="color: white;"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            `;
            container.innerHTML += projectHTML;
        });
    } catch (e) {
        container.innerHTML = '<p>Offline: Unable to load projects.</p>';
    }
}
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);
function loadMoreNews() {
  const hiddenCards = document.querySelectorAll('.hidden-news');
  const btn = document.getElementById('loadMoreBtn');
  
  hiddenCards.forEach((card, index) => {
    // Reveal with a slight delay for a staggered effect
    setTimeout(() => {
      card.classList.add('show-news');
    }, index * 150);
  });

  // Hide the button after all news is shown
  btn.style.display = 'none';
}
// Database for predictions
const searchDatabase = [
    "X-Academy Registration", "Hiring Application", "Portfolio Project", 
    "PhineX News", "PhineX", "EG portfolio", 
    "JavaScript","News", "lastest projects", "Contact", "About",
    "Test","Facebook","social links","Discord","login","register",
    "HTML","CSS","Java",
    // Sections from all pages
    "(#file:index.html#hero)", "(#file:index.html#news)", "(#file:index.html#features)", "(#file:index.html#projects)",
    "(#file:x-academy.html#hero)", "(#file:x-academy.html#paths)", "(#file:x-academy.html#curriculum)", "(#file:x-academy.html#testimonials)", "(#file:x-academy.html#cta)",
    "(#file:hiring.html#hero)", "(#file:hiring.html#steps-section)", "(#file:hiring.html#benefits-section)", "(#file:hiring.html#terms-section)", "(#file:hiring.html#cta-section)",
    "(#file:aboutus.html#hero)", "(#file:aboutus.html#mission)", "(#file:aboutus.html#culture)", "(#file:aboutus.html#numbers)", "(#file:aboutus.html#social)",
    "(#file:bugreport.html#hero)", "(#file:bugreport.html#form-section)",
    "(#file:redeemcode.html#hero)", "(#file:redeemcode.html#how-section)",
    "(#file:bg3d.html#hero)"
];
const searchInput = document.getElementById('mainSearch');
const predictionList = document.getElementById('predictionList');

// 1. Prediction Logic
searchInput.addEventListener('input', () => {
    const val = searchInput.value.toLowerCase();
    predictionList.innerHTML = '';
    
    if (val.length > 0) {
        const matches = searchDatabase.filter(item => item.toLowerCase().includes(val));
        if (matches.length > 0) {
            predictionList.style.display = 'block';
            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'prediction-item';
                div.textContent = match;
                div.onclick = () => {
                    searchInput.value = match;
                    predictionList.style.display = 'none';
                    if (match.startsWith('(#file:')) {
                        // Extract file and section from (#file:page.html#section)
                        const matchResult = match.match(/\(#file:([^#]+)#([^)]+)\)/);
                        if (matchResult) {
                            const page = matchResult[1];
                            const section = matchResult[2];
                            window.location.href = `${page}#${section}`;
                        }
                    } else {
                        highlightContent(match);
                    }
                };
                predictionList.appendChild(div);
            });
        }
    } else {
        predictionList.style.display = 'none';
    }
});

// 2. Highlighting Logic
function highlightContent(text) {
    if (!text) return;
    
    // Remove previous highlights
    const content = document.body;
    const instance = new Mark(content); // Using Mark.js logic for safety
    instance.unmark();
    
    // Highlight new matches
    instance.mark(text, {
        "className": "highlight",
        "separateWordSearch": false
    });
}

// 3. Recommended Click Handler
function fillSearch(val) {
    searchInput.value = val;
    highlightContent(val);
}

// Close predictions on click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) predictionList.style.display = 'none';
});

// Create a single instance of Mark.js for the entire body (or a specific container)
const instance = new Mark(document.querySelector('body'));

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();

    // 1. Clear previous highlights first
    instance.unmark();

    // 2. Only highlight if there are at least 1-2 characters to avoid lag
    if (searchTerm.length >= 1) {
        instance.mark(searchTerm, {
            "className": "highlight",
            "separateWordSearch": false, // Set to true if you want to highlight individual words in a phrase
            "diacritics": true,
            "acrossElements": true
        });
    }
});
let timeout = null;

searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const searchTerm = searchInput.value.trim();
        instance.unmark();
        if (searchTerm) {
            instance.mark(searchTerm, { "className": "highlight" });
        }
    }, 100); // 100ms delay
});

const searchSubmit = document.getElementById('searchSubmit');

// Function to handle the scroll logic
function performSearchAndScroll() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        if (searchTerm.startsWith('(#file:')) {
            // Extract file and section from (#file:page.html#section)
            const matchResult = searchTerm.match(/\(#file:([^#]+)#([^)]+)\)/);
            if (matchResult) {
                const page = matchResult[1];
                const section = matchResult[2];
                window.location.href = `${page}#${section}`;
            }
        } else {
            // 1. Perform the highlighting
            instance.unmark({
                done: () => {
                    instance.mark(searchTerm, {
                        "className": "highlight",
                        "separateWordSearch": false,
                        "acrossElements": true,
                        "done": () => {
                            // 2. Find the first highlighted element
                            const firstMatch = document.querySelector('.highlight');
                            
                            // 3. Scroll to it smoothly
                            if (firstMatch) {
                                firstMatch.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'center' 
                                });
                            }
                        }
                    });
                }
            });
        }
    }
}

// Trigger on Search Icon Click
searchSubmit.addEventListener('click', performSearchAndScroll);

// Trigger on "Enter" key press inside the input
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearchAndScroll();
        predictionList.style.display = 'none'; // Close predictions
    }
});
/*===== THEMES & TRANSLATIONS =====
const themesData = {
  // --- DARK THEMES (Full White Text/Icons) ---
  'light-contrast-dark': {
    '--bg-color': '#1a1a2e',
    '--card-bg': '#24243e',
    '--text-color': '#ffffff', // Full White
    '--text-muted': '#ffffff', // Full White
    '--primary': '#818cf8',    // Brighter Indigo
    '--nav-bg': '#161625',
    '--border-color': '#4a4a6a'
  },
  'mid-contrast-dark': {
    '--bg-color': '#0f0f1a',
    '--card-bg': '#161625',
    '--text-color': '#ffffff', // Full White
    '--text-muted': '#ffffff', // Full White
    '--primary': '#6366f1',
    '--nav-bg': '#0a0a12',
    '--border-color': '#ffffff' // White borders for visibility
  },
  'high-contrast-dark': {
    '--bg-color': '#000000',
    '--card-bg': '#000000',
    '--text-color': '#ffffff', // Full White
    '--text-muted': '#ffffff', // Full White
    '--primary': '#ffff00',    // Neon Yellow
    '--nav-bg': '#000000',
    '--border-color': '#ffffff'
  },

  // --- LIGHT THEMES (Full Black Text/Icons) ---
  'low-contrast-light': {
    '--bg-color': '#e5e7eb !important',      // Distinguishable Greyish-White
    '--card-bg': '#d1d5db !important',      // Slightly darker cards for depth
    '--text-color': '#000000 !important',    // Absolute Black Text
    '--text-muted': '#000000ff !important',    // Very Dark Grey for secondary text
    '--primary': '#00008b !important',       // Deep Dark Blue Icons
    '--nav-bg': '#f3f4f6  !important;',       // Light Grey Nav
    '--border-color': '#9ca3af !important'   // Visible Grey Borders
  },
  'mid-contrast-light': {
    '--bg-color': '#f9fafb',      // Soft Off-White
    '--card-bg': '#ffffff',      // Pure White Cards
    '--text-color': '#000000',    // Absolute Black Text
    '--text-muted': '#000000',    // Absolute Black Muted Text
    '--primary': '#00008b',       // Deep Dark Blue Icons
    '--nav-bg': '#f9fafb',
    '--border-color': '#4b5563'   // Stronger Borders
  },
  'full-contrast-light': {
    '--bg-color': '#ffffff',      // Pure White Background
    '--card-bg': '#ffffff',      // Pure White Cards
    '--text-color': '#000000',    // Absolute Black Text
    '--text-muted': '#000000',    // Absolute Black Muted Text
    '--primary': '#00008b',       // Deep Dark Blue Icons
    '--nav-bg': '#ffffff',
    '--border-color': '#000000'   // Sharp Black Borders
  }
};
*/
const translations = {
  
  // --- ENGLISH ---
  'en': {
    'search_placeholder': 'Search PhineX projects...',
    'nav_join': 'Join Us', 'nav_academy': 'X-Academy', 'nav_bug': 'Report Bug', 'nav_redeem': 'Redeem Code', 'nav_settings': 'Settings', 'nav_about': 'About Us', 'nav_logout': 'Logout',
    'slide1_title': 'EG Portfolio', 'slide1_desc': 'PhineX has deployed a new web-site showcase with advanced UI/UX designs.', 'slide1_btn': 'View Live',
    'slide2_title': 'Join X-Developers', 'slide2_desc': 'Collaborate with senior devs and earn money on global projects.', 'slide2_btn1': 'Join Team', 'slide2_btn2': 'Redeem Code',
    'slide3_title': 'X-Academy', 'slide3_desc': 'Randomized testing and live timers are now active for all students.', 'slide3_btn': 'Start Learning',
    'slide4_title': 'Found a Bug?', 'slide4_desc': 'Help us improve the PhineX ecosystem by reporting errors to our dev team.', 'slide4_btn': 'Report Error',
    'slide5_title': 'Who we are', 'slide5_desc': 'Discover the vision behind PhineX and our mission for 2026.', 'slide5_btn': 'About Us',
    'feat_head': 'Why Choose PhineX?', 'feat1_title': 'Develop in-groups', 'feat1_desc': 'Instead of programming alone, join our group to collaborate and build amazing projects together in less time!',
    'feat2_title': 'Learn more', 'feat2_desc': 'If you are still learning, join our community to grow your skills and knowledge.',
    'feat3_title': 'Opportunities', 'feat3_desc': 'More projects to participate in and earn from.',
    'innov_head': 'Featured Innovation', 'innov_tag': 'Live Production', 'innov_title': 'EG Portfolio', 'innov_desc': 'A professional digital showcase featuring advanced UI/UX designs, interactive elements, and personal project highlights.', 'innov_btn': 'Explore Project',
    'footer_desc': 'Group of senior programmers',
    'footer_links': 'Quick Links', 'footer_home': 'Home', 'footer_login': 'Login', 'footer_signup': 'Signup',
    'footer_connect': 'Connect',
    'footer_copy': 'All rights reserved.',
    'footer_made': 'Made with',
    'coming_soon': 'Coming Soon!',
    'coming_soon_desc': 'This feature is coming soon.',
    'coming_soon_btn': 'Check Back Later',
    'modal_title': 'Up Coming Update',
    'modal_intro': 'New features are coming soon!',
    'modal_huge': '<strong>Huge improvements</strong> are on the way on our <strong>largest update ever!</strong>',
    'modal_include': 'The New feautures include:',
    'li_settings': 'settings section :',
    'li_themes': 'themes list (light and dark)',
    'li_new_lang': 'New languages list',
    'li_lang_names': 'English - Arabic - Spanish - French - German - Italian - Portuguese',
    'li_search': 'Improvements in the search engine',
    'li_news': 'Lastest news section',
    'li_projects': 'Projects section previews all project we have made',
    'li_more': 'And much more...',
    'modal_date': 'The update will come out about <strong>May 2026 - July 2026.</strong>',
    'modal_check': 'Check out our',
    'btn_facebook': 'Facebook Page',
    'modal_or': 'Or',
    'btn_discord': 'Our Discord Server',
    'modal_info': 'for more information.',
    'modal_read_confirm': 'I have read this message'
  },
  // --- ARABIC ---
  'ar': {
    'search_placeholder': 'ابحث في مشاريع PhineX...',
    'nav_join': 'انضم إلينا', 'nav_academy': 'أكاديمية X', 'nav_bug': 'إبلاغ عن خطأ', 'nav_redeem': 'استرداد كود', 'nav_settings': 'الإعدادات', 'nav_about': 'من نحن', 'nav_logout': 'خروج',
    'slide1_title': 'معرض أعمال EG', 'slide1_desc': 'قامت PhineX بنشر موقع جديد لاستعراض الأعمال بتصاميم UI/UX متقدمة.', 'slide1_btn': 'عرض مباشر',
    'slide2_title': 'انضم للمطورين', 'slide2_desc': 'تعاون مع كبار المطورين واكسب المال من المشاريع العالمية.', 'slide2_btn1': 'انضم للفريق', 'slide2_btn2': 'استرداد كود',
    'slide3_title': 'أكاديمية X', 'slide3_desc': 'الاختبارات العشوائية والمؤقتات الحية نشطة الآن لجميع الطلاب.', 'slide3_btn': 'ابدأ التعلم',
    'slide4_title': 'وجدت خطأ؟', 'slide4_desc': 'ساعدنا في تحسين PhineX من خلال الإبلاغ عن الأخطاء لفريق التطوير.', 'slide4_btn': 'إبلاغ عن خطأ',
    'slide5_title': 'من نحن', 'slide5_desc': 'اكتشف الرؤية وراء PhineX ومهمتنا لعام 2026.', 'slide5_btn': 'عن الفريق',
    'feat_head': 'لماذا تختار PhineX؟', 'feat1_title': 'التطوير الجماعي', 'feat1_desc': 'بدلاً من البرمجة بمفردك، انضم لمجموعتنا للتعاون وبناء مشاريع مذهلة في وقت أقل!',
    'feat2_title': 'تعلم أكثر', 'feat2_desc': 'إذا كنت لا تزال تتعلم، انضم إلى مجتمعنا لتطوير مهاراتك ومعرفتك.',
    'feat3_title': 'فرص العمل', 'feat3_desc': 'المزيد من المشاريع للمشاركة فيها والربح منها.',
    'innov_head': 'ابتكار مميز', 'innov_tag': 'إنتاج مباشر', 'innov_title': 'معرض أعمال EG', 'innov_desc': 'واجهة رقمية احترافية تتميز بتصاميم متطورة وعناصر تفاعلية لإبراز المشاريع الشخصية.', 'innov_btn': 'استكشف المشروع',
    'footer_desc': 'مجموعة من كبار المبرمجين', 'footer_links': 'روابط سريعة', 'footer_home': 'الرئيسية', 'footer_login': 'تسجيل الدخول', 'footer_signup': 'إنشاء حساب', 'footer_connect': 'تواصل معنا',
    'footer_copy': 'جميع الحقوق محفوظة.', 'footer_made': 'صنع بـ','coming_soon': 'قريباً!', 'coming_soon_desc': 'هذه الميزة قيد الإعداد حالياً.', 'coming_soon_btn': 'تحقق لاحقاً',
    'modal_title': 'تحديث قادم',
    'modal_intro': 'ميزات جديدة قادمة قريباً!',
    'modal_huge': '<strong>تحسينات ضخمة</strong> في طريقها إليكم في <strong>أكبر تحديث لنا على الإطلاق!</strong>',
    'modal_include': 'تشمل الميزات الجديدة:',
    'li_settings': 'قسم الإعدادات :',
    'li_themes': 'قائمة السمات (فاتح وداكن)',
    'li_new_lang': 'قائمة لغات جديدة',
    'li_lang_names': 'الإنجليزية - العربية - الإسبانية - الفرنسية - الألمانية - الإيطالية - البرتغالية',
    'li_search': 'تحسينات في محرك البحث',
    'li_news': 'قسم آخر الأخبار',
    'li_projects': 'قسم المشاريع يعرض جميع المشاريع التي قمنا بها',
    'li_more': 'وأكثر من ذلك بكثير...',
    'modal_date': 'سيصدر التحديث حوالي <strong>مايو 2026 - يوليو 2026.</strong>',
    'modal_check': 'تحقق من',
    'btn_facebook': 'صفحة الفيسبوك',
    'modal_or': 'أو',
    'btn_discord': 'سيرفر الديسكورد',
    'modal_info': 'لمزيد من المعلومات.',
    'modal_read_confirm': 'لقد قرأت هذه الرسالة'
  },
  // --- SPANISH ---
  'es': {
    'modal_title': 'Próxima Actualización',
    'modal_intro': '¡Nuevas características llegarán pronto!',
    'modal_huge': '¡<strong>Mejoras enormes</strong> están en camino en nuestra <strong>actualización más grande!</strong>',
    'modal_include': 'Las nuevas características incluyen:',
    'li_settings': 'sección de ajustes :',
    'li_themes': 'lista de temas (claro y oscuro)',
    'li_new_lang': 'Nueva lista de idiomas',
    'li_lang_names': 'Inglés - Árabe - Español - Francés - Alemán - Italiano - Portugués',
    'li_search': 'Mejoras en el motor de búsqueda',
    'li_news': 'Sección de últimas noticias',
    'li_projects': 'La sección de proyectos muestra todo lo que hemos creado',
    'li_more': 'Y mucho más...',
    'modal_date': 'La actualización saldrá alrededor de <strong>Mayo 2026 - Julio 2026.</strong>',
    'modal_check': 'Visita nuestra',
    'btn_facebook': 'Página de Facebook',
    'modal_or': 'O',
    'btn_discord': 'Nuestro Servidor de Discord',
    'modal_info': 'para más información.',
    'modal_read_confirm': 'He leído este mensaje'
  },

  // --- FRENCH ---
  'fr': {
    'modal_title': 'Mise à jour à venir',
    'modal_intro': 'De nouvelles fonctionnalités arrivent bientôt !',
    'modal_huge': 'D\'énormes améliorations sont en route pour notre plus grande mise à jour !',
    'modal_include': 'Les nouvelles fonctionnalités incluent :',
    'li_settings': 'section paramètres :',
    'li_themes': 'liste des thèmes (clair et sombre)',
    'li_new_lang': 'Nouvelle liste de langues',
    'li_lang_names': 'Anglais - Arabe - Espagnol - Français - Allemand - Italien - Portugais',
    'li_search': 'Améliorations du moteur de recherche',
    'li_news': 'Section des dernières nouvelles',
    'li_projects': 'La section projets présente tout ce que nous avons réalisé',
    'li_more': 'Et bien plus encore...',
    'modal_date': 'La mise à jour sortira vers Mai 2026 - Juillet 2026.',
    'modal_check': 'Consultez notre',
    'btn_facebook': 'Page Facebook',
    'modal_or': 'Ou',
    'btn_discord': 'Notre Serveur Discord',
    'modal_info': 'pour plus d\'informations.',
    'modal_read_confirm': 'J\'ai lu ce message'
  },

  // --- GERMAN ---
  'de': {
    'modal_title': 'Kommendes Update',
    'modal_intro': 'Neue Funktionen kommen bald!',
    'modal_huge': 'Riesige Verbesserungen sind auf dem Weg in unserem größten Update aller Zeiten!',
    'modal_include': 'Die neuen Funktionen beinhalten:',
    'li_settings': 'Einstellungsbereich :',
    'li_themes': 'Themenliste (hell und dunkel)',
    'li_new_lang': 'Neue Sprachenliste',
    'li_lang_names': 'Englisch - Arabisch - Spanisch - Französisch - Deutsch - Italienisch - Portugiesisch',
    'li_search': 'Verbesserungen der Suchmaschine',
    'li_news': 'Bereich für aktuelle Nachrichten',
    'li_projects': 'Projektbereich zeigt alle unsere Projekte',
    'li_more': 'Und vieles mehr...',
    'modal_date': 'Das Update erscheint etwa <strong>Mai 2026 - Juli 2026.',
    'modal_check': 'Besuchen Sie unsere',
    'btn_facebook': 'Facebook Seite',
    'modal_or': 'Oder',
    'btn_discord': 'Unser Discord Server',
    'modal_info': 'für weitere Informationen.',
    'modal_read_confirm': 'Ich habe diese Nachricht gelesen'
  },

  // --- ITALIAN ---
  'it': {
    'modal_title': 'Prossimo Aggiornamento',
    'modal_intro': 'Nuove funzionalità in arrivo!',
    'modal_huge': '<strong>Enormi miglioramenti</strong> sono in arrivo nel nostro <strong>più grande aggiornamento di sempre!</strong>',
    'modal_include': 'Le nuove funzionalità includono:',
    'li_settings': 'sezione impostazioni :',
    'li_themes': 'elenco temi (chiaro e scuro)',
    'li_new_lang': 'Nuovo elenco lingue',
    'li_lang_names': 'Inglese - Arabo - Spagnolo - Francese - Tedesco - Italiano - Portoghese',
    'li_search': 'Miglioramenti nel motore di ricerca',
    'li_news': 'Sezione ultime notizie',
    'li_projects': 'La sezione progetti mostra tutto ciò che abbiamo creato',
    'li_more': 'E molto altro...',
    'modal_date': 'L\'aggiornamento uscirà circa a <strong>Maggio 2026 - Luglio 2026.</strong>',
    'modal_check': 'Dai un\'occhiata alla nostra',
    'btn_facebook': 'Pagina Facebook',
    'modal_or': 'O',
    'btn_discord': 'Nostro Server Discord',
    'modal_info': 'per maggiori informazioni.',
    'modal_read_confirm': 'Ho letto questo messaggio'
  },

  // --- PORTUGUESE ---
  'pt': {
    'modal_title': 'Próxima Atualização',
    'modal_intro': 'Novos recursos em breve!',
    'modal_huge': '<strong>Enormes melhorias</strong> estão a caminho na nossa <strong>maior atualização de sempre!</strong>',
    'modal_include': 'Os novos recursos incluem:',
    'li_settings': 'seção de configurações :',
    'li_themes': 'lista de temas (claro e escuro)',
    'li_new_lang': 'Nova lista de idiomas',
    'li_lang_names': 'Inglês - Árabe - Espanhol - Francês - Alemão - Italiano - Português',
    'li_search': 'Melhorias no motor de busca',
    'li_news': 'Seção de últimas notícias',
    'li_projects': 'A seção de projetos mostra tudo o que criamos',
    'li_more': 'E muito mais...',
    'modal_date': 'A atualização sairá por volta de <strong>Maio 2026 - Julho 2026.</strong>',
    'modal_check': 'Confira nossa',
    'btn_facebook': 'Página do Facebook',
    'modal_or': 'Ou',
    'btn_discord': 'Nosso Servidor Discord',
    'modal_info': 'para mais informações.',
    'modal_read_confirm': 'Eu li esta mensagem'
  }
};

function applySettings() {
  const lang = localStorage.getItem('phinex-lang') || 'en';
  const theme = localStorage.getItem('phinex-theme') || 'default-dark';

  // Apply Theme
  const root = document.documentElement;
  if(globalThemes[theme]) {
    Object.entries(globalThemes[theme]).forEach(([prop, val]) => root.style.setProperty(prop, val));
  }

  // Apply Language
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  const dict = translations[lang];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.textContent = dict[key];
  });

  // Special case for Placeholder
  const searchInput = document.getElementById('mainSearch');
  if(searchInput && dict['search_placeholder']) searchInput.placeholder = dict['search_placeholder'];
}

window.addEventListener('DOMContentLoaded', applySettings);

