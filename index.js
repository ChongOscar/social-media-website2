/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyBkpnZ5dDrSVpVzAjRxOR0ftgWm1kg6UuM",
    authDomain: "hot-and-cold-b02cc.firebaseapp.com",
    projectId: "hot-and-cold-b02cc",
    storageBucket: "hot-and-cold-b02cc.firebasestorage.app",
    messagingSenderId: "147130792942",
    appId: "1:147130792942:web:d3c7d2cdaa13a67d966cff"
  };
const app = initializeApp(firebaseConfig);
console.log(app.options.projectId);
const auth = getAuth(app)
console.log(auth)
const db = getFirestore(app);
console.log(db)
/* === UI === */

/* == UI - Elements == */
const userProfilePictureEl = document.getElementById("user-profile-picture")

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

const userGreetingEl = document.getElementById("user-greeting")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-button")
/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)
postButtonEl.addEventListener("click", goToPostPage)

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
    if (user) {
      showLoggedInView()
      showProfilePicture(userProfilePictureEl, user)
      showUserGreeting(userGreetingEl, user)
      showPosts()
    } else {
      showLoggedOutView()
    }
  });

  
/* === Functions === */

function showProfilePicture(imgElement, user) {
    if (user !== null) {
        if (user.photoURL != null) {
            imgElement.src = user.photoURL;
        } else {
            imgElement.src = "assets/images/defaultPic.jpg";
        }
    }
 }
 

 function showUserGreeting(element, user) {

    if (user !== null) {
        if (user.displayName != null) {
            element.textContent = `Welcome ${user.displayName}`;
        } else {
            element.textContent = "Welcome";
        }
    }
 }

function goToPostPage() {
  window.location.href = "post.html"
}
 
/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    console.log("Sign in with Google")
}

function authSignInWithEmail() {
    console.log("Sign in with email and password")

   const email = emailInputEl.value;
   const password = passwordInputEl.value;
   signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    showLoggedInView()
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
  });
}


function authCreateAccountWithEmail() {
    console.log("Sign up with email and password")

   const email = emailInputEl.value;
   const password = passwordInputEl.value;
   createUserWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
    showLoggedInView()
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode)
    console.log(errorMessage)
  });
}

function authSignOut() {
    signOut(auth).then(() => {
        showLoggedOutView();
      }).catch((error) => {
        console.log(error.message)
      });
 }
 

/* == Functions - UI Functions == */

async function showPosts() {
  const querySnapshot = await getDocs(collection(db, "Posts"));
  querySnapshot.forEach((doc) => {
    
});
}

function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
 }
 
 
 function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
 }
 
 
 function showView(view) {
    view.style.display = "flex"
 }
 
 
 function hideView(view) {
    view.style.display = "none"
 }
 

//credit: coursera