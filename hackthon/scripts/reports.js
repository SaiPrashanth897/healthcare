import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import html2pdf from "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";

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

// Load today's data
async function loadSummary() {
  const container = document.getElementById("summaryContainer");
  const today = new Date().toISOString().split("T")[0];

  const q = query(collection(db, "roundNotes"), where("date", "==", today));
  const snapshot = await getDocs(q);

  let html = `<table><thead>
    <tr><th>Patient</th><th>Vitals</th><th>Symptoms</th><th>Notes</th></tr>
  </thead><tbody>`;

  snapshot.forEach(doc => {
    const d = doc.data();
    html += `<tr>
      <td>${d.patientName}</td>
      <td>${d.bp || "-"} / ${d.hr || "-"} / ${d.spo2 || "-"}</td>
      <td>${d.symptoms || "—"}</td>
      <td>${d.noteText || "—"}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

document.getElementById("generatePDF").addEventListener("click", () => {
  const element = document.getElementById("summaryContainer");
  html2pdf().from(element).save("EndOfDaySummary.pdf");
});

loadSummary();
