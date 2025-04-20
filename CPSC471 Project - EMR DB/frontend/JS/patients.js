document.addEventListener("DOMContentLoaded", () => {
    const tableBody      = document.getElementById("patientsTable");
    const searchInput    = document.querySelector('input[type="text"]');
    const main           = document.querySelector(".main-content");
    const viewModal      = new bootstrap.Modal(document.getElementById("viewPatientModal"));
    const addAssessModal = new bootstrap.Modal(document.getElementById("addAssessmentModal"));
  
    // View modal spans
    const vpName         = document.getElementById("vpName");
    const vpAge          = document.getElementById("vpAge");
    const vpWeight       = document.getElementById("vpWeight");
    const vpHeight       = document.getElementById("vpHeight");
    const vpHeartRate    = document.getElementById("vpHeartRate");
    const vpBloodPressure= document.getElementById("vpBloodPressure");
    const vpOxygen       = document.getElementById("vpOxygen");
    const vpRespiration  = document.getElementById("vpRespiration");
    const vpTemperature  = document.getElementById("vpTemperature");
    const vpBloodGlucose = document.getElementById("vpBloodGlucose");
    const vpAllergies    = document.getElementById("vpAllergies");
  
    const assessmentList    = document.getElementById("assessmentList");
    const detailComplaint   = document.getElementById("detailComplaint");
    const detailHistory     = document.getElementById("detailHistory");
    const detailNotes       = document.getElementById("detailNotes");
    const detailDiagnosis   = document.getElementById("detailDiagnosis");
    const detailPlan        = document.getElementById("detailPlan");
    const detailMedications = document.getElementById("detailMedications");
  
    // ——————— Dynamic “New Assessment – [Name]” title ———————
    const createBtn = document.getElementById("createAssessmentBtn");
    const addLabel  = document.getElementById("addAssessmentModalLabel");
    createBtn.addEventListener("click", () => {
      // vpName.textContent holds just the patient’s name
      addLabel.textContent = `New Assessment – ${vpName.textContent}`;
    });
    // ————————————————————————————————————————————————
  
    let currentPatientId = null;
    const assessmentsMap = {};
  
    function renderTableRow(p) {
      const tr = document.createElement("tr");
      tr.dataset.id = p.id;
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.dob}</td>
        <td>${p.address}</td>
        <td>${p.contact}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary me-1">View Patient</button>
          <button class="btn btn-sm btn-outline-info me-1">Edit</button>
          <button class="btn btn-sm btn-outline-danger">Delete</button>
        </td>`;
      tableBody.appendChild(tr);
      assessmentsMap[p.id] = p.assessments || [];
    }
  
    function renderTable(data) {
      tableBody.innerHTML = "";
      data.forEach(renderTableRow);
    }
  
    // load patients
    fetch("/api/patients")
      .then(r => r.json()).then(renderTable)
      .catch(() => renderTable([
        { id:101, name:"FName LName 1", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555‑2345", assessments:[] },
        { id:101, name:"Cristian Otalora", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555‑2345", assessments:[] },
        { id:101, name:"Amir Khan", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555‑2345", assessments:[] },
        { id:101, name:"Jesse Dirks", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555‑2345", assessments:[] },
        { id:101, name:"Hassan Alvi", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555‑2345", assessments:[] },



      ]));
  
    main.style.visibility = "visible";
  
    // search filter
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      Array.from(tableBody.rows).forEach(row => {
        const [idCell, nameCell] = row.querySelectorAll("td");
        row.style.display = (idCell.textContent + nameCell.textContent)
          .toLowerCase().includes(q) ? "" : "none";
      });
    });
  
    // table click
    tableBody.addEventListener("click", e => {
      const row = e.target.closest("tr");
      if (!row) return;
      const id = row.dataset.id;
      const cells = row.children;
  
      // Delete
      if (e.target.matches(".btn-outline-danger")) {
        if (!confirm(`Delete patient ${id}?`)) return;
        row.remove();
        delete assessmentsMap[id];
        fetch(`/api/patients/${id}`, { method:"DELETE" }).catch(console.error);
        return;
      }
  
      // Edit
      if (e.target.matches(".btn-outline-info")) {
        const pid = cells[0].textContent.trim();
        const newName    = prompt("Name:", cells[1].textContent);   if (!newName) return;
        const newDob     = prompt("DOB:", cells[2].textContent);    if (!newDob) return;
        const newAddr    = prompt("Address:", cells[3].textContent);if (!newAddr) return;
        const newContact = prompt("Contact:", cells[4].textContent);if (!newContact) return;
        [cells[1].textContent, cells[2].textContent, cells[3].textContent, cells[4].textContent] =
          [newName, newDob, newAddr, newContact];
        fetch(`/api/patients/${pid}`, {
          method: "PUT",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({id:+pid, name:newName, dob:newDob, address:newAddr, contact:newContact})
        }).then(r => { if(!r.ok) alert("Update failed."); })
          .catch(() => alert("Error updating on server."));
        return;
      }
  
      // View
      if (e.target.matches(".btn-outline-secondary")) {
        currentPatientId = id;
        // clear all spans
        [vpName, vpAge, vpWeight, vpHeight,
         vpHeartRate, vpBloodPressure, vpOxygen,
         vpRespiration, vpTemperature, vpBloodGlucose,
         vpAllergies,
         detailComplaint, detailHistory, detailNotes,
         detailDiagnosis, detailPlan, detailMedications
        ].forEach(el => el.textContent = "");
  
        // populate basic from table
        vpName.textContent = cells[1].textContent;
        vpAge.textContent  = String(
          new Date().getFullYear() - new Date(cells[2].textContent).getFullYear()
        );
  
        // list assessments
        assessmentList.innerHTML = "";
        (assessmentsMap[id] || []).forEach((a, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "list-group-item list-group-item-action";
          btn.textContent = `${a.date} Patient Assessment Report`;
          btn.dataset.idx = idx;
          assessmentList.appendChild(btn);
        });
  
        viewModal.show();
      }
    });
  
    // show details for chosen assessment
    assessmentList.addEventListener("click", e => {
      if (!e.target.matches(".list-group-item")) return;
      const a = assessmentsMap[currentPatientId][e.target.dataset.idx];
      detailComplaint.textContent   = a.complaint   || "";
      detailHistory.textContent     = a.history     || "";
      detailMedications.textContent = a.medications || "";
      detailNotes.textContent       = a.notes       || "";
      detailDiagnosis.textContent   = a.diagnosis   || "";
      detailPlan.textContent        = a.plan        || "";
  
      // vitals
      vpHeartRate.textContent    = a.heartRate    || "";
      vpBloodPressure.textContent= a.bloodPressure|| "";
      vpOxygen.textContent       = a.oxygenSat    || "";
      vpRespiration.textContent  = a.respiration  || "";
      vpTemperature.textContent  = a.temperature  || "";
      vpBloodGlucose.textContent = a.bloodGlucose || "";
  
      // allergies
      vpAllergies.textContent    = a.allergies    || "";
  
      // weight/height
      vpWeight.textContent = a.weight || "";
      vpHeight.textContent = a.height || "";
    });
  
    // save new assessment (including all tab fields)
    document.getElementById("addAssessmentForm")
      .addEventListener("submit", e => {
        e.preventDefault();
        const id = currentPatientId;
        const newA = {
          // Basic Info moved via dynamic title; we still capture name/age if you want:
          name:        document.getElementById("assessName")?.value || "",
          age:         document.getElementById("assessAge")?.value || "",
          weight:      document.getElementById("assessWeight").value,
          height:      document.getElementById("assessHeight").value,
          // Vitals
          heartRate:    document.getElementById("assessHeartRate").value,
          bloodPressure:document.getElementById("assessBloodPressure").value,
          oxygenSat:    document.getElementById("assessOxygenSat").value,
          respiration:  document.getElementById("assessRespiration").value,
          temperature:  document.getElementById("assessTemperature").value,
          bloodGlucose: document.getElementById("assessBloodGlucose").value,
          // date (pulled from footer)
          date:       document.getElementById("assessmentDate").value,
          // Assessment Details
          complaint:   document.getElementById("assessmentComplaint").value,
          history:     document.getElementById("assessmentHistory").value,
          medications: document.getElementById("assessmentMedications").value,
          notes:       document.getElementById("assessmentNotes").value,
          diagnosis:   document.getElementById("assessmentDiagnosis").value,
          plan:        document.getElementById("assessmentPlan").value,
          // Allergies
          allergies:   document.getElementById("assessmentAllergies").value
        };
  
        assessmentsMap[id] = assessmentsMap[id] || [];
        assessmentsMap[id].push(newA);
  
        const btn = document.createElement("button");
        btn.type      = "button";
        btn.className = "list-group-item list-group-item-action";
        btn.textContent = `${newA.date} Patient Assessment Report`;
        btn.dataset.idx = assessmentsMap[id].length - 1;
        assessmentList.appendChild(btn);
  
        addAssessModal.hide();
        viewModal.show();
        e.target.reset();
      });
  });
  