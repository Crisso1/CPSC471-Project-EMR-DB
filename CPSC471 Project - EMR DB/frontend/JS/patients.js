// File: JS/patients.js

document.addEventListener("DOMContentLoaded", () => {
    const tableBody   = document.getElementById("patientsTable");
    const searchInput = document.querySelector('input[type="text"]');
    const addForm     = document.getElementById("addPatientForm");
    const main        = document.querySelector(".main-content");

    // Helper: append a single patient row
    function renderTableRow(p) {
      const tr = document.createElement("tr");
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
    }

    // Render full list
    function renderTable(data) {
      tableBody.innerHTML = "";
      data.forEach(renderTableRow);
    }

    // Fetch existing patients
    fetch("/api/patients")
      .then(r => r.json())
      .then(renderTable)
      .catch(() => {
        console.warn("Fetch failed, using sample data");
        renderTable([
          { id:101, name:"Alice Wong",    dob:"1990-02-28", address:"42 Sunset Blvd", contact:"(403) 555-2345" },
          { id:102, name:"Brandon Lee",   dob:"1985-08-12", address:"18 Foothill Dr",  contact:"(587) 555-7890" },
          { id:103, name:"Catherine Rivera", dob:"1999-11-07", address:"905 Prairie St", contact:"(403) 555-9876" }
        ]);
      });

    // Live search
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      Array.from(tableBody.rows).forEach(row => {
        const [id, name] = row.querySelectorAll("td");
        row.style.display = (id.textContent + name.textContent).toLowerCase().includes(q)
          ? "" : "none";
      });
    });

    // Delete handler
    tableBody.addEventListener("click", e => {
      if (e.target.matches(".btn-outline-danger")) {
        const row       = e.target.closest("tr");
        const patientId = row.children[0].textContent;
        if (!confirm(`Delete patient ${patientId}?`)) return;
        row.remove();
        fetch(`/api/patients/${patientId}`, { method: "DELETE" })
          .catch(console.error);
      }
    });

    // Edit handler (prompt)
    tableBody.addEventListener("click", e => {
      if (e.target.matches(".btn-outline-info")) {
        const row       = e.target.closest("tr");
        const cells     = row.children;
        const id        = cells[0].textContent;
        const newName    = prompt("Name:", cells[1].textContent);
        if (newName===null) return;
        const newDob     = prompt("DOB:", cells[2].textContent);
        if (newDob===null) return;
        const newAddr    = prompt("Address:", cells[3].textContent);
        if (newAddr===null) return;
        const newContact = prompt("Contact:", cells[4].textContent);
        if (newContact===null) return;
        cells[1].textContent = newName;
        cells[2].textContent = newDob;
        cells[3].textContent = newAddr;
        cells[4].textContent = newContact;

        fetch(`/api/patients/${id}`, {
          method: "PUT",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ id:+id, name:newName, dob:newDob, address:newAddr, contact:newContact })
        })
        .then(r => { if (!r.ok) alert("Update failed on server"); })
        .catch(()=>alert("Error updating on server"));
      }
    });

    // View handler (stub)
    tableBody.addEventListener("click", e => {
      if (e.target.matches(".btn-outline-secondary")) {
        const id = e.target.closest("tr").children[0].textContent;
        alert(`View details for patient ${id}`);
      }
    });

    // Add Patient form submit
    addForm.addEventListener("submit", e => {
      e.preventDefault();
      const name    = addForm.addName.value;
      const dob     = addForm.addDob.value;
      const address = addForm.addAddress.value;
      const contact = addForm.addContact.value;

      // POST to backend
      fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ name, dob, address, contact })
      })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(p => {
        renderTableRow(p);
        addForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("addPatientModal")).hide();
      })
      .catch(err => {
        console.warn("Add failed, adding locally:", err);
        renderTableRow({ id:Date.now(), name, dob, address, contact });
        addForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("addPatientModal")).hide();
      });
    });

    // Reveal content
    main.style.visibility = "visible";
  });
