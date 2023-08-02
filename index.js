import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js"; // Importa también la función getStorage para trabajar con Firebase Storage
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvzNwa9IjumO0NCrpxkWSpgysXrrrFQ3M",
  authDomain: "cuentas-claras-acb79.firebaseapp.com",
  projectId: "cuentas-claras-acb79",
  storageBucket: "cuentas-claras-acb79.appspot.com",
  messagingSenderId: "43230082429",
  appId: "1:43230082429:web:655280415f81e273b90814",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Función para subir el archivo a Firebase Storage y guardar en Firestore
function uploadToFirebaseStorage(nombre, file) {
  const storage = firebase.storage();
  const storageRef = storage.ref("files/" + file.name);
  const uploadTask = storageRef.put(file);

  uploadTask
    .then((snapshot) => {
      // Subida completada con éxito
      console.log("Archivo subido exitosamente");

      // Obtén la URL de descarga del archivo subido
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        // Guardar la información en Firestore
        const data = {
          nombre: nombre,
          archivo: file.name,
          url: downloadURL,
          fecha: new Date().toISOString(),
        };

        // Agrega el objeto a la colección "files" en Firestore
        addDoc(collection(db, "files"), data)
          .then(() => {
            console.log("Datos guardados en Firestore.");
          })
          .catch((error) => {
            console.error("Error al guardar los datos:", error);
          });
      });
    })
    .catch((error) => {
      // Manejo de errores durante la subida
      console.error("Error al subir el archivo:", error);
    });
}

// Obtén el formulario y añade un listener para enviar los datos
const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que el formulario se envíe por defecto

  const nombreInput = document.getElementById("nombre");
  const nombre = nombreInput.value;
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0]; // Obtenemos el primer archivo seleccionado

  if (nombre && file) {
    uploadToFirebaseStorage(nombre, file);
    // Opcional: Puedes mostrar un mensaje de éxito o limpiar los campos del formulario aquí
    nombreInput.value = "";
    fileInput.value = null;
  } else {
    console.log("Por favor, ingresa un nombre y selecciona un archivo.");
  }
});
