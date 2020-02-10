import app from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/firebase-auth';
import 'firebase/firebase-storage';

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
      this.storage = app.storage();
   }

   isStarted(){
      return new Promise(resolve => {
         this.auth.onAuthStateChanged(resolve)
      })
   }

   saveDocument = (nameDocument, document) => this.storage.ref().child(nameDocument).put(document);

   returnDocument = (documentUrl) => this.storage.ref().child(documentUrl).getDownloadURL();
   
}

export default firebaseConfig;