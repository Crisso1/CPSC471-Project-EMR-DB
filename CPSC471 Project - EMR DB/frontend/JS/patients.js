document.addEventListener("DOMContentLoaded", () => {
  // Table & search
  const tableBody      = document.getElementById("patientsTable");
  const searchInput    = document.querySelector('input[type="text"]');
  const main           = document.querySelector(".main-content");

  // Modals
  const viewModal      = new bootstrap.Modal(document.getElementById("viewPatientModal"));
  const addAssessModal = new bootstrap.Modal(document.getElementById("addAssessmentModal"));
  const editModal      = new bootstrap.Modal(document.getElementById("editPatientModal"));
  const deleteModal    = new bootstrap.Modal(document.getElementById("deletePatientModal"));

  // View‑modal spans
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

  // Edit‑modal fields
  const editForm       = document.getElementById("editPatientForm");
  const editName       = document.getElementById("editName");
  const editDob        = document.getElementById("editDob");
  const editAddress    = document.getElementById("editAddress");
  const editContact    = document.getElementById("editContact");

  // Delete modal buttons
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn  = document.getElementById("cancelDeleteBtn");

  // Dynamic “New Assessment – [Name]” title
  const createBtn = document.getElementById("createAssessmentBtn");
  const addLabel  = document.getElementById("addAssessmentModalLabel");
  createBtn.addEventListener("click", () => {
    addLabel.textContent = `New Assessment – ${vpName.textContent}`;
  });

  let currentPatientId = null;
  let currentEditRow   = null;
  let currentDeleteRow = null;
  const assessmentsMap = {};

  // Helper: render a single row
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

  // Render all rows
  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(renderTableRow);
  }

  // Fetch patients or fallback
  fetch("/api/patients")
    .then(res => res.json())
    .then(renderTable)
    .catch(() => renderTable([
      { id:101, name:"FName LName 1", dob:"1999-12-31", address:"471 DBProject Blvd", contact:"(403) 555-2345", assessments:[] }
      // … more sample …
    ]));

  // Show main content
  main.style.visibility = "visible";

  // Search filter
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    Array.from(tableBody.rows).forEach(row => {
      const [idCell, nameCell] = row.querySelectorAll("td");
      row.style.display = (idCell.textContent + nameCell.textContent)
        .toLowerCase().includes(q) ? "" : "none";
    });
  });

  // Table click handler
  tableBody.addEventListener("click", e => {
    const row = e.target.closest("tr");
    if (!row) return;
    const id    = row.dataset.id;
    const cells = row.children;

    // — Delete button → open delete modal
    if (e.target.matches(".btn-outline-danger")) {
      currentDeleteRow = row;
      deleteModal.show();
      return;
    }

    // — Edit button → open edit modal
    if (e.target.matches(".btn-outline-info")) {
      currentEditRow = row;
      editName.value    = cells[1].textContent;
      editDob.value     = cells[2].textContent;
      editAddress.value = cells[3].textContent;
      editContact.value = cells[4].textContent;
      editModal.show();
      return;
    }

    // — View button → populate view modal
    if (e.target.matches(".btn-outline-secondary")) {
      currentPatientId = id;
      // clear all view spans
      [
        vpName, vpAge, vpWeight, vpHeight,
        vpHeartRate, vpBloodPressure, vpOxygen,
        vpRespiration, vpTemperature, vpBloodGlucose,
        vpAllergies,
        detailComplaint, detailHistory, detailNotes,
        detailDiagnosis, detailPlan, detailMedications
      ].forEach(el => el.textContent = "");

      // basic info
      vpName.textContent = cells[1].textContent;
      vpAge.textContent  = String(
        new Date().getFullYear() - new Date(cells[2].textContent).getFullYear()
      );

      // list existing assessments
      assessmentList.innerHTML = "";
      (assessmentsMap[id] || []).forEach((a, idx) => {
        const btn = document.createElement("button");
        btn.type      = "button";
        btn.className = "list-group-item list-group-item-action";
        btn.textContent = `${a.date} Patient Assessment Report`;
        btn.dataset.idx = idx;
        assessmentList.appendChild(btn);
      });

      viewModal.show();
      return;
    }
  });

  // Confirm delete in modal
  confirmDeleteBtn.addEventListener("click", () => {
    if (!currentDeleteRow) return;
    const pid = currentDeleteRow.dataset.id;
    currentDeleteRow.remove();
    delete assessmentsMap[pid];
    deleteModal.hide();
    fetch(`/api/patients/${pid}`, { method: "DELETE" }).catch(console.error);
    currentDeleteRow = null;
  });

  // Cancel delete
  cancelDeleteBtn.addEventListener("click", () => {
    currentDeleteRow = null;
  });

  // Save edits from edit modal
  editForm.addEventListener("submit", e => {
    e.preventDefault();
    const row = currentEditRow;
    if (!row) return;
    const pid    = row.dataset.id;
    const cells  = row.children;
    const newName    = editName.value.trim();
    const newDob     = editDob.value;
    const newAddr    = editAddress.value.trim();
    const newContact = editContact.value.trim();

    // update table cells
    cells[1].textContent = newName;
    cells[2].textContent = newDob;
    cells[3].textContent = newAddr;
    cells[4].textContent = newContact;

    editModal.hide();
    fetch(`/api/patients/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id:+pid, name:newName, dob:newDob, address:newAddr, contact:newContact })
    }).catch(() => alert("Error saving edits."));
  });

  // Pick an assessment to view
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
    vpHeartRate.textContent     = a.heartRate    || "";
    vpBloodPressure.textContent = a.bloodPressure|| "";
    vpOxygen.textContent        = a.oxygenSat    || "";
    vpRespiration.textContent   = a.respiration  || "";
    vpTemperature.textContent   = a.temperature  || "";
    vpBloodGlucose.textContent  = a.bloodGlucose || "";

    // allergies
    vpAllergies.textContent     = a.allergies    || "";

    // weight/height
    vpWeight.textContent = a.weight || "";
    vpHeight.textContent = a.height || "";
  });

  // Save new assessment
  document.getElementById("addAssessmentForm")
    .addEventListener("submit", e => {
      e.preventDefault();
      const id = currentPatientId;
      const newA = {
        weight:       document.getElementById("assessWeight").value,
        height:       document.getElementById("assessHeight").value,
        heartRate:    document.getElementById("assessHeartRate").value,
        bloodPressure:document.getElementById("assessBloodPressure").value,
        oxygenSat:    document.getElementById("assessOxygenSat").value,
        respiration:  document.getElementById("assessRespiration").value,
        temperature:  document.getElementById("assessTemperature").value,
        bloodGlucose: document.getElementById("assessBloodGlucose").value,
        date:         document.getElementById("assessmentDate").value,
        complaint:    document.getElementById("assessmentComplaint").value,
        history:      document.getElementById("assessmentHistory").value,
        medications:  document.getElementById("assessmentMedications").value,
        notes:        document.getElementById("assessmentNotes").value,
        diagnosis:    document.getElementById("assessmentDiagnosis").value,
        plan:         document.getElementById("assessmentPlan").value,
        allergies:    document.getElementById("assessmentAllergies").value
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
