document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logoutBtn").addEventListener("click", () => {

      window.location.href = "login.html";
    });

    document.getElementById("patientsBtn").addEventListener("click", () => {
      window.location.href = "patients.html";
    });

    document.getElementById("doctorsBtn").addEventListener("click", () => {
      window.location.href = "doctors.html";
    });

    document.getElementById("encountersBtn").addEventListener("click", () => {
      window.location.href = "encounters.html";
    });

    document.getElementById("vitalsBtn").addEventListener("click", () => {
      window.location.href = "vitals.html";
    });

    document.getElementById("allergiesBtn").addEventListener("click", () => {
      window.location.href = "allergies.html";
    });
  });

