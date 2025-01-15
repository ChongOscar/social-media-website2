/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
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
const viewLoggedIn = document.getElementById("posts-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

const userGreetingEl = document.getElementById("user-greeting")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")

const pastPosts = document.getElementById("past-posts")
/* == UI - Event Listeners == */

/* === Main Code === */
onAuthStateChanged(auth, (user) => {

    if (user) {
      showProfilePicture(userProfilePictureEl, user)
      showUserGreeting(userGreetingEl, user)
      showPosts(pastPosts, user)

    } 
  });

/*
const { user1 } = require('./index.js');
console.log(user1)
showLoggedInView()
showProfilePicture(userProfilePictureEl, user1)
showUserGreeting(userGreetingEl, user1)
showPosts(pastPosts, user1)
*/
/* === Functions === */

async function showPosts(pastPosts, user){
  const querySnapshot = await getDocs(collection(db, "Posts"));
    querySnapshot.forEach((doc) => {
    console.log(doc.data().uid);
    if (doc.data().uid == user.uid){
      console.log("working")
      pastPosts.innerHTML+=`<div>` + doc.data().body + `</div>`
    }
  });
}

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
            element.textContent = `Hi ${user.displayName}`;
        } else {
            element.textContent = "Hi, how are you?";
        }
    }
 }

 function clearInputField(inputField) {
    inputField.value = ""
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


 
 async function addPostToDB(postBody, user) {

  try {
    const docRef = await addDoc(collection(db, "Posts"), {
      body: postBody,
      uid: user.uid,
      createdAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


/* == Functions - UI Functions == */
function postButtonPressed() {
  const postBody = textareaEl.value
  const user = auth.currentUser
  
  if (postBody) {
      addPostToDB(postBody, user)
      clearInputField(textareaEl)
  }

}
 

//credit: coursera