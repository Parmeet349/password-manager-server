const colors = require('colors');
const firebase = require('firebase-admin');
const firebaseConfig = require('./key.json');
let firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(firebaseConfig),
    databaseURL: "https://password-manager-46cf9-default-rtdb.asia-southeast1.firebasedatabase.app/"
})
const firebaseDb = firebaseApp.firestore();
// const firebaseAuth = firebaseApp.auth();
// const firebaseStorage = firebaseApp.storage();
// var defaultDatabase = firebaseApp.database();

if(firebaseDb){
    console.log(colors.green("Connected to Firebase Database"));
} else {
    console.log(colors.red("Failed to Conntect to Firebase Database"));
}

module.exports = firebaseDb;