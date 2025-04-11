import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbuYEkjKDbA0MhJiBkByaFJVTS44ieNSY",
  authDomain: "heathcare-ab5aa.firebaseapp.com",
  projectId: "heathcare-ab5aa",
  storageBucket: "heathcare-ab5aa.appspot.com",
  messagingSenderId: "160649667093",
  appId: "1:160649667093:web:ad42dbaa790d9c0cc2641c",
  measurementId: "G-M3ZSFT8XQH"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Chart reference
let chart;

// Load patients
const patientSelect = document.getElementById("patientSelect");
async function loadPatients() {
  const snapshot = await getDocs(collection(db, "patients"));
  patientSelect.innerHTML = `<option value="">Select Patient</option>`;
  snapshot.forEach(doc => {
    const data = doc.data();
    patientSelect.innerHTML += `<option value="${doc.id}">${data.name}</option>`;
  });
}
loadPatients();

// Fetch symptoms on patient change
patientSelect.addEventListener("change", async () => {
  const patientId = patientSelect.value;
  if (!patientId) return;

  const roundsRef = collection(db, "roundNotes");
  const q = query(roundsRef, where("patientId", "==", patientId));
  const snapshot = await getDocs(q);

  const labels = [];
  const symptoms = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    labels.push(data.createdAt?.toDate?.().toLocaleDateString() || "Unknown");
    symptoms.push(data.symptoms?.length || 0); // count of symptoms
  });

  renderChart(labels, symptoms);
});

// Render chart
function renderChart(labels, dataPoints) {
  const ctx = document.getElementById("symptomChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Symptom Count Over Time",
        data: dataPoints,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "#4bc0c0",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
