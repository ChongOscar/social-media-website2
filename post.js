/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
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
/* === UI === */

/* == UI - Elements == */
const userProfilePictureEl = document.getElementById("user-profile-picture");

const userGreetingEl = document.getElementById("user-greeting");

const textareaEl = document.getElementById("post-input");
const postButtonEl = document.getElementById("post-btn");
const homeButtonEl = document.getElementById("home-button")

/* == UI - Event Listeners == */
postButtonEl.addEventListener("click", postButtonPressed)
homeButtonEl.addEventListener("click", goToHomePage)
/* === Main Code === */
onAuthStateChanged(auth, (user) => {
  if (user) {
    showProfilePicture(userProfilePictureEl, user);
    showUserGreeting(userGreetingEl, user);
    showPosts(user);
  } else {
    window.location.href = "index.html";
  }
});

/* === Functions === */

async function showPosts(user) {
  const q = query(
    collection(db, "Posts"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    const post = doc.data();
    let postName =
      post.uid.displayName == null ? "Anonymous" : post.uid.displayName;
    let postProfilePicture =
      post.uid.photoURL == null
        ? "assets/images/defaultPic.jpg"
        : post.uid.photoURL;
    let postTimestamp = post.createdAt.toDate();
    postTimestamp = formatDate(postTimestamp);
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
        <div class="post-header">
            <img id="post-profile-picture" src="${postProfilePicture}">
            <p class="post-username" id="post-name">${postName}</p>
            <p class="post-timestamp">${postTimestamp}</p>
        </div>
        <hr/>
        <div class="post-body">
            <p class="body-text">${post.body}</p>
        </div>
        `;
    document.querySelector(".post-section").appendChild(postElement);
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
  inputField.value = "";
}

function formatDate(date) {
  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`;
}

function goToHomePage() {
  window.location.href = "index.html";
}
/* = Functions - Firebase - Authentication = */

async function addPostToDB(postBody, user) {
  try {
    const docRef = await addDoc(collection(db, "Posts"), {
      body: postBody,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
    document.querySelector(".post-section").innerHTML = "";
    showPosts(user)
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

/* == Functions - UI Functions == */
function postButtonPressed() {
  const postBody = textareaEl.value;
  const user = auth.currentUser;

  if (postBody) {
    addPostToDB(postBody, user);
    clearInputField(textareaEl);
  }
}

//credit: coursera
