import app from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/firebase-auth'

const config = {
   apiKey: "AIzaSyD9OROK-C2UtpVHwhlaf-wxkbX_yrykTSI",
   authDomain: "automatizacionei.firebaseapp.com",
   databaseURL: "https://automatizacionei.firebaseio.com",
   projectId: "automatizacionei",
   storageBucket: "automatizacionei.appspot.com",
   messagingSenderId: "590392271479",
   appId: "1:590392271479:web:48261c7c7572377b2b9c72",
   measurementId: "G-3581DT00ME"
};

class firebaseConfig {

   constructor() {
      app.initializeApp(config);
      this.db = app.firestore();
      this.auth = app.auth();
   }

   isStarted(){
      return new Promise(resolve => {
         this.auth.onAuthStateChanged(resolve)
      })
   }
   
}

export default firebaseConfig;