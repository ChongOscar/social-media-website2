/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
/* === Firebase Setup === */
const firebaseConfig = {
  apiKey: "AIzaSyBkpnZ5dDrSVpVzAjRxOR0ftgWm1kg6UuM",
  authDomain: "hot-and-cold-b02cc.firebaseapp.com",
  projectId: "hot-and-cold-b02cc",
  storageBucket: "hot-and-cold-b02cc.firebasestorage.app",
  messagingSenderId: "147130792942",
  appId: "1:147130792942:web:d3c7d2cdaa13a67d966cff",
};
const app = initializeApp(firebaseConfig);
console.log(app.options.projectId);
const auth = getAuth(app);
console.log(auth);
const db = getFirestore(app);
console.log(db);
const provider = new GoogleAuthProvider();
/* === UI === */

/* == UI - Elements == */
const userProfilePictureEl = document.getElementById("user-profile-picture");

const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const signInWithGoogleButtonEl = document.getElementById(
  "sign-in-with-google-btn"
);

const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");

const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");

const signOutButtonEl = document.getElementById("sign-out-btn");

const userGreetingEl = document.getElementById("user-greeting");

const postButtonEl = document.getElementById("post-button");

const searchBarEl = document.getElementById("search-bar");

const errorEl = document.getElementById("error-message")
/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);

signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);

signOutButtonEl.addEventListener("click", authSignOut);
postButtonEl.addEventListener("click", goToPostPage);

searchBarEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    showPosts(searchBarEl.value);
  }
});
passwordInputEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    authSignInWithEmail()
  }
});

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView();
    showProfilePicture(userProfilePictureEl, user);
    showUserGreeting(userGreetingEl, user);
    showPosts();
  } else {
    showLoggedOutView();
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
  window.location.href = "post.html";
}

function formatDate(date) {
  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`;
}

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
  console.log("Sign in with Google");

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

function authSignInWithEmail() {
  console.log("Sign in with email and password");

  const email = emailInputEl.value;
  const password = passwordInputEl.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);

      errorEl.innerHTML = "Invalid Login"
      setTimeout(function() {
        errorEl.innerHTML = ""
      }, 2000)
    });
}

function authCreateAccountWithEmail() {
  console.log("Sign up with email and password");

  const email = emailInputEl.value;
  const password = passwordInputEl.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
}

function authSignOut() {
  signOut(auth)
    .then(() => {
      showLoggedOutView();
    })
    .catch((error) => {
      console.log(error.message);
    });
}

/* == Functions - UI Functions == */

async function showPosts(searchOption) {
  const q = query(collection(db, "Posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  document.querySelector(".post-section").innerHTML = "";
  querySnapshot.forEach((docs) => {
    const post = docs.data();
    let postName = post.displayName == null ? "Anonymous" : post.displayName;
    if (searchOption != null) {
      if (
        !post.body.toLowerCase().match(searchOption.toLowerCase()) &&
        !postName.toLowerCase().match(searchOption.toLowerCase())
      )
        return;
    }
    let postProfilePicture =
      post.photoURL == null ? "assets/images/defaultPic.jpg" : post.photoURL;
    let postTimestamp = post.createdAt.toDate();
    postTimestamp = formatDate(postTimestamp);
    let statusImgSrc = post.statusImg;
    
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
        <div class="post-header">
            <img id="post-profile-picture" src="${postProfilePicture}">
            <p class="post-username" id="post-name">${postName}</p>
            <p class="post-timestamp">${postTimestamp}</p>
            <img class="status-img" src="${statusImgSrc}"></img>
        </div>
        <hr/>
        <div class="post-body">
            <p class="body-text">${post.body}</p>
        </div>
        `;
    document.querySelector(".post-section").appendChild(postElement);
  });
}

function showLoggedOutView() {
  hideView(viewLoggedIn);
  showView(viewLoggedOut);
}

function showLoggedInView() {
  hideView(viewLoggedOut);
  showView(viewLoggedIn);
}

function showView(view) {
  view.style.display = "flex";
}

function hideView(view) {
  view.style.display = "none";
}

//credit: coursera
