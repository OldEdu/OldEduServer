// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTQKhds9sizU067bYTM9Db_yJ-XnZx91o",
  authDomain: "oldedu-c93f3.firebaseapp.com",
  projectId: "oldedu-c93f3",
  storageBucket: "oldedu-c93f3.appspot.com",
  messagingSenderId: "521662709176",
  appId: "1:521662709176:web:265307731de0460693e34d",
  measurementId: "G-PBTH6K72EL"
};

const id = document.querySelector("#id"),
      sendAuthNum = document.querySelector("#send-authNum"),
      authNum = document.querySelector("#authNum"),
      checkAuthNum = document.querySelector("#check-authNum"),
      name = document.querySelector("#name"),
      psword = document.querySelector("#psword"),
      checkPsword = document.querySelector("#check-psword"),
      registerBtn = document.querySelector("#sign-in");
      
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();
auth.languageCode = 'ko';

const authCheckBool = new Boolean(false);

window.recaptchaVerifier = new RecaptchaVerifier('send-authNum ', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
  }, auth);


// '인증번호 전송'버튼 클릭
sendAuthNum.addEventListener('click', sendingAuthNumber );

function sendingAuthNumber() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const appVerifier = window.recaptchaVerifier; 
    
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          console.log(confirmationResult);
          // ...
        }).catch((error) => {
          // Error; SMS not sent
          // ...
        });
};

// '인증번호 확인'버튼 클릭
checkAuthNum.addEventListener('click', checkingAuthNumber);

function checkingAuthNumber() {
     
};

registerBtn.addEventListener("click", register);

function register() {
    if (!id.value) return alert("Please enter your Phone Number.");
    if (psword.value !== checkPsword.value) return alert("Passwords do not match.");
    if (authCheckBool === false) return alert("You don't check your Phone Number.");

    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
    };

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                location.href = "/login";
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("회원가입 중 에러발생");
        });
};