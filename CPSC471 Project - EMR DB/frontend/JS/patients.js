// File: JS/patients.js

document.addEventListener("DOMContentLoaded", () => {
    const tableBody      = document.getElementById("patientsTable");
    const searchInput    = document.querySelector('input[type="text"]');
    const addForm        = document.getElementById("addPatientForm");
    const main           = document.querySelector(".main-content");
    const viewModalEl    = document.getElementById("viewPatientModal");
    const viewModal      = new bootstrap.Modal(viewModalEl);
    const addAssessModal = new bootstrap.Modal(document.getElementById("addAssessmentModal"));

    // View modal fields
    const vpName          = document.getElementById("vpName");
    const vpAge           = document.getElementById("vpAge");
    const vpWeight        = document.getElementById("vpWeight");
    const vpHeight        = document.getElementById("vpHeight");
    const assessmentList  = document.getElementById("assessmentList");
    const detailComplaint = document.getElementById("detailComplaint");
    const detailHistory   = document.getElementById("detailHistory");
    const detailNotes     = document.getElementById("detailNotes");
    const detailDiagnosis = document.getElementById("detailDiagnosis");
    const detailPlan      = document.getElementById("detailPlan");

    // Create Assessment button
    const createBtn = document.getElementById("createAssessmentBtn");
    createBtn.addEventListener("click", () => {
      // Pre-fill basic info into new assessment form
      document.getElementById("assessName").value   = vpName.textContent.replace(/^Name: /,"");
      document.getElementById("assessAge").value    = vpAge.textContent.replace(/^Age: /,"");
      document.getElementById("assessWeight").value = vpWeight.textContent.replace(/^Weight: /,"");
      document.getElementById("assessHeight").value = vpHeight.textContent.replace(/^Height: /,"");
    });

    // Track current patient
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
        </td>
      `;
      tableBody.appendChild(tr);
      assessmentsMap[p.id] = p.assessments || [];
    }

    function renderTable(data) {
      tableBody.innerHTML = "";
      data.forEach(renderTableRow);
    }

    fetch("/api/patients")
      .then(r => r.json())
      .then(renderTable)
      .catch(() => {
        console.warn("Fetch failed, using sample data");
        renderTable([
          { id:101, name:"FName LName 1", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555-2345", assessments:[] },
          { id:102, name:"FName LName 2", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555-2345", assessments:[] },
          { id:103, name:"FName LName 3", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555-2345", assessments:[] },
          { id:104, name:"FName LName 4", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555-2345", assessments:[] },
          { id:105, name:"FName LName 5", dob:"1999-12-31", address:"471 DBProject Blvd, NW", contact:"(403) 555-2345", assessments:[] }
        ]);
      });

    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      Array.from(tableBody.rows).forEach(row => {
        const [idCell, nameCell] = row.querySelectorAll("td");
        row.style.display = (idCell.textContent + nameCell.textContent).toLowerCase().includes(q) ? "" : "none";
      });
    });

    tableBody.addEventListener("click", e => {
      const row = e.target.closest("tr");
      const id  = row.dataset.id;
      const cells = row.children;

      if (e.target.matches(".btn-outline-danger")) {
        if (!confirm(`Delete patient ${id}?`)) return;
        row.remove();
        delete assessmentsMap[id];
        fetch(`/api/patients/${id}`, { method:"DELETE" }).catch(console.error);
        return;
      }
      if (e.target.matches(".btn-outline-info")) {
        const pid = cells[0].textContent.trim();
        const newName    = prompt("Name:", cells[1].textContent); if (!newName) return;
        const newDob     = prompt("DOB:", cells[2].textContent); if (!newDob) return;
        const newAddr    = prompt("Address:", cells[3].textContent); if (!newAddr) return;
        const newContact = prompt("Contact:", cells[4].textContent); if (!newContact) return;
        cells[1].textContent = newName;
        cells[2].textContent = newDob;
        cells[3].textContent = newAddr;
        cells[4].textContent = newContact;
        fetch(`/api/patients/${pid}`, {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:+pid,name:newName,dob:newDob,address:newAddr,contact:newContact})})
          .then(r=>{ if(!r.ok) alert("Update failed on server."); })
          .catch(()=>alert("Error updating on server."));
        return;
      }
      if (e.target.matches(".btn-outline-secondary")) {
        currentPatientId = id;
        vpName.textContent   = `Name: ${cells[1].textContent}`;
        vpAge.textContent    = `Age: ${new Date().getFullYear() - new Date(cells[2].textContent).getFullYear()}`;
        vpWeight.textContent = `Weight: N/A`;
        vpHeight.textContent = `Height: N/A`;
        assessmentList.innerHTML = "";
        (assessmentsMap[id]||[]).forEach((a,idx)=>{
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "list-group-item list-group-item-action";
          btn.textContent = `${a.date} Patient Assessment Report`;
          btn.dataset.idx = idx;
          assessmentList.appendChild(btn);
        });
        detailComplaint.textContent = "";
        detailHistory.textContent   = "";
        detailNotes.textContent     = "";
        detailDiagnosis.textContent = "";
        detailPlan.textContent      = "";
        viewModal.show();
        return;
      }
    });

    assessmentList.addEventListener("click", e => {
      if (!e.target.matches(".list-group-item")) return;
      const idx = e.target.dataset.idx;
      const a   = assessmentsMap[currentPatientId][idx];
      detailComplaint.textContent = a.complaint;
      detailHistory.textContent   = a.history;
      detailNotes.textContent     = a.notes;
      detailDiagnosis.textContent = a.diagnosis;
      detailPlan.textContent      = a.plan;
      // update basic info if present in assessment
      if (a.name) {
        vpName.textContent   = `Name: ${a.name}`;
        vpAge.textContent    = `Age: ${a.age}`;
        vpWeight.textContent = `Weight: ${a.weight}`;
        vpHeight.textContent = `Height: ${a.height}`;
      }
    });

    document.getElementById("addAssessmentForm").addEventListener("submit", e => {
      e.preventDefault();
      const id        = currentPatientId;
      const date      = document.getElementById("assessmentDate").value;
      const complaint = document.getElementById("assessmentComplaint").value;
      const history   = document.getElementById("assessmentHistory").value;
      const notes     = document.getElementById("assessmentNotes").value;
      const diagnosis = document.getElementById("assessmentDiagnosis").value;
      const plan      = document.getElementById("assessmentPlan").value;
      const name      = document.getElementById("assessName").value;
      const age       = document.getElementById("assessAge").value;
      const weight    = document.getElementById("assessWeight").value;
      const height    = document.getElementById("assessHeight").value;

      const newA = { date, complaint, history, notes, diagnosis, plan, name, age, weight, height };
      assessmentsMap[id] = assessmentsMap[id] || [];
      assessmentsMap[id].push(newA);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "list-group-item list-group-item-action";
      btn.textContent = `${date} Patient Assessment Report`;
      btn.dataset.idx = assessmentsMap[id].length - 1;
      assessmentList.appendChild(btn);

      addAssessModal.hide();
      viewModal.show();
      document.getElementById("addAssessmentForm").reset();
    });

    main.style.visibility = "visible";
  });
