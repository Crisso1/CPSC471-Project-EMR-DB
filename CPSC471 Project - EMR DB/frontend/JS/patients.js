document.addEventListener("DOMContentLoaded", () => {
  // Table & search
  const tableBody      = document.getElementById("patientsTable");
  const searchInput    = document.querySelector('input[type="text"]');
  const main           = document.querySelector(".main-content");

  // Modals
  const viewModal      = new bootstrap.Modal(document.getElementById("viewPatientModal"));
  const addAssessModal = new bootstrap.Modal(document.getElementById("addAssessmentModal"));
  const addModal       = new bootstrap.Modal(document.getElementById("addPatientModal"))
  const editModal      = new bootstrap.Modal(document.getElementById("editPatientModal"));
  const deleteModal    = new bootstrap.Modal(document.getElementById("deletePatientModal"));

  // View‑modal spans
  const vpFName        = document.getElementById("vpFName");
  const vpLName        = document.getElementById("vpLName")
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

  // Add-modal fields
  const addPatientForm  = document.getElementById("addPatientForm");
  const addFName        = document.getElementById("addFName");
  const addLName        = document.getElementById("addLName");
  const addDob          = document.getElementById("addDob");
  const addAddress      = document.getElementById("addAddress");
  const addContact      = document.getElementById("addContact");

  // Edit‑modal fields
  const editForm       = document.getElementById("editPatientForm");
  const editFName      = document.getElementById("editFName");
  const editLName      = document.getElementById("editLName");
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
    addLabel.textContent = `New Assessment – ${vpFName.textContent}`;
    addLabel.textContent = `New AssessmentNBSP-NBSP${vpLName.textContent}`;
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
      <td>${p.fname}</td>
      <td>${p.lname}</td>
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
  fetch("http://localhost:8080/api/patients")
    .then(res => res.json())
    .then(renderTable)
    .catch(() => renderTable([
      { id:101, fname:"FName", lname:"LName", dob:"1999-12-31", address:"471 DBProject Blvd", contact:"(403) 555-2345", assessments:[] }
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
      editFName.value   = cells[1].textContent;
      editLName.value   = cells[2].textContent;
      editDob.value     = cells[3].textContent;
      editAddress.value = cells[4].textContent;
      editContact.value = cells[5].textContent;
      editModal.show();
      return;
    }

    // — View button → populate view modal
    if (e.target.matches(".btn-outline-secondary")) {
      currentPatientId = id;

      assessmentList.innerHTML = "";

      fetch(`http://localhost:8080/api/encounters/patients/${parseInt(currentPatientId, 10)}`)
          .then(response => {
            if (!response.ok) throw new Error("Failed to load encounters");
            return response.json();
          })
          .then(encounters => {
            // Now you can loop through the encounters and show them how you want
            assessmentsMap[currentPatientId] = encounters;
            encounters.forEach(enc => {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "list-group-item list-group-item-action";
              btn.textContent = `${enc.visitDate} Patient Assessment Report`;
              btn.dataset.id = enc.id; // or whatever data you want to store
              btn.dataset.idx = encounters.indexOf(enc);
              assessmentList.appendChild(btn);
            });
          })
          .catch(err => {
            console.error("Error fetching encounters:", err);
          });

      // clear all view spans
      [
        vpFName, vpLName, vpAge, vpWeight, vpHeight,
        vpHeartRate, vpBloodPressure, vpOxygen,
        vpRespiration, vpTemperature, vpBloodGlucose,
        vpAllergies,
        detailComplaint, detailHistory, detailNotes,
        detailDiagnosis, detailPlan, detailMedications
      ].forEach(el => el.textContent = "");

      // basic info
      vpFName.textContent = cells[1].textContent;
      vpLName.textContent = cells[2].textContent;
      vpAge.textContent  = String(
        new Date().getFullYear() - new Date(cells[3].textContent).getFullYear()
      );

      viewModal.show();
    }
  });

  // Handle Add Patient Form Submission
  addPatientForm.addEventListener("submit", e => {
    e.preventDefault();

    // Collect values from the form
    const newPatient = {
      fname: addFName.value.trim(),
      lname: addLName.value.trim(),
      dob: addDob.value,
      address: addAddress.value.trim(),
      contact: addContact.value.trim()
    };

    // POST to backend API
    fetch("http://localhost:8080/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPatient)
    })
        .then(res => {
          if (!res.ok) throw new Error("Failed to add patient");
          return res.json();
        })
        .then(addedPatient => {
          // Render the new patient row
          renderTableRow(addedPatient);

          // Reset form and close modal
          addPatientForm.reset();
          addModal.hide();
        })
        .catch(err => {
          console.error(err);
          alert("There was an error adding the patient.");
        });
  });


  // Confirm delete in modal
  confirmDeleteBtn.addEventListener("click", () => {
    if (!currentDeleteRow) return;
    const pid = parseInt(currentDeleteRow.dataset.id, 10);
    currentDeleteRow.remove();
    delete assessmentsMap[pid];
    deleteModal.hide();
    fetch(`http://localhost:8080/api/patients/${pid}`, { method: "DELETE" }).catch(console.error);
    currentDeleteRow = null;
    console.log("Deleting patient with ID:", pid, typeof pid);
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
    const newFName   = editFName.value.trim();
    const newLName   = editLName.value.trim();
    const newDob     = editDob.value;
    const newAddr    = editAddress.value.trim();
    const newContact = editContact.value.trim();

    // update table cells
    cells[1].textContent = newFName;
    cells[2].textContent = newLName;
    cells[3].textContent = newDob;
    cells[4].textContent = newAddr;
    cells[5].textContent = newContact;

    editModal.hide();
    fetch(`http://localhost:8080/api/patients/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id:+pid, fname:newFName, lname:newLName, dob:newDob, address:newAddr, contact:newContact })
    }).catch(() => alert("Error saving edits."));
  });

  // Pick an assessment to view
  assessmentList.addEventListener("click", e => {
    if (!e.target.matches(".list-group-item")) return;
    const a = assessmentsMap[currentPatientId][e.target.dataset.idx];

    detailComplaint.textContent   = a.chiefComplaint   || "";
    detailHistory.textContent     = a.history     || "";
    //detailMedications.textContent = a.medications || "";
    detailNotes.textContent       = a.notes       || "";
    detailDiagnosis.textContent   = a.diagnosis   || "";
    detailPlan.textContent        = a.treatmentPlan        || "";

    // FETCH VITAL SIGNS by encounter ID!
    fetch(`http://localhost:8080/api/vitalsigns/encounter/${a.encounterId}`)
        .then(res => res.json())
        .then(vsList => {
          const v = vsList[0] || {}; // take first one
          vpHeartRate.textContent     = v.heartRate || "";
          vpBloodPressure.textContent = v.bloodPressure || "";
          vpOxygen.textContent        = v.oxygenSat || "";
          vpRespiration.textContent   = v.respiratoryRate || "";
          vpTemperature.textContent   = v.temperature || "";
          vpBloodGlucose.textContent  = v.bloodGlucose || "";
          vpWeight.textContent        = v.weight || "";
          vpHeight.textContent        = v.height || "";
        })
        .catch(err => {
          console.error("Could not fetch vitals", err);
        });
  });

  // Save new assessment
  document.getElementById("addAssessmentForm")
      .addEventListener("submit", e => {
        e.preventDefault();
        const id = currentPatientId;

        const newA = {
          patientId:     id,
          doctorSsn:     "123456",
          visitDate:     document.getElementById("assessmentDate").value,
          visitTime:     "09:00:00",
          visitType:     "unknown",
          chiefComplaint:document.getElementById("assessmentComplaint").value,
          diagnosis:     document.getElementById("assessmentDiagnosis").value,
          treatmentPlan: document.getElementById("assessmentPlan").value,
          notes:         document.getElementById("assessmentNotes").value,
          followUpDate:  "2024-04-01"
        };

        // First, create the encounter
        fetch("http://localhost:8080/api/encounters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newA)
        })
            .then(res => {
              if (!res.ok) throw new Error("Failed to save encounter");
              return res.text(); // Now returns the encounter ID as a string
            })
            .then(encounterIdStr => {
              const encounterId = parseInt(encounterIdStr, 10);
              newA.encounterId = encounterId;
              console.log("Saved encounter ID:", encounterId);

              // Now create the vital signs and link it to the encounter
              const newVS = {
                encounterId:      encounterId,
                measuredAt:       document.getElementById("assessmentDate").value + "T09:00:00",
                temperature:      document.getElementById("assessTemperature").value,
                bloodPressure:    document.getElementById("assessBloodPressure").value,
                heartRate:        document.getElementById("assessHeartRate").value,
                respiratoryRate:  document.getElementById("assessRespiration").value,
                weight:           document.getElementById("assessWeight").value,
                height:           document.getElementById("assessHeight").value,
                oxygenSat:        document.getElementById("assessOxygenSat").value,
                bloodGlucose:     document.getElementById("assessBloodGlucose").value
              };

              return fetch("http://localhost:8080/api/vitalsigns", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(newVS)
              }).then(vsRes => {
                if (!vsRes.ok) throw new Error("Failed to save vital signs");
                return vsRes.text();
              }).then(vsMsg => {

                // Update UI
                assessmentsMap[id] = assessmentsMap[id] || [];
                assessmentsMap[id].push(newA);

                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "list-group-item list-group-item-action";
                btn.textContent = `${newA.visitDate} Patient Assessment Report`;
                btn.dataset.idx = assessmentsMap[id].length - 1;
                assessmentList.appendChild(btn);

                addAssessModal.hide();
                viewModal.show();
                e.target.reset();
              });
            })
            .catch(err => {
              console.error("Error saving assessment or vital signs:", err);
              alert("Failed to save assessment or vital signs.");
            });
      });

});
