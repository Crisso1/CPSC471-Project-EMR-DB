// JS/patients.js

document.addEventListener("DOMContentLoaded", () => {
    const tableBody  = document.getElementById("patientsTable");
    const searchInput = document.querySelector('input[type="text"]');

    // 1) Fetch data from backend
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => renderTable(data))
      .catch(err => {
        console.error("Error fetching patients:", err);
        // Fallback sample data
        renderTable([
          { id: 101, name: "Alice Wong",      dob: "1990-02-28", address: "42 Sunset Blvd", contact: "(403) 555-2345" },
          { id: 102, name: "Brandon Lee",      dob: "1985-08-12", address: "18 Foothill Dr", contact: "(587) 555-7890" },
          { id: 103, name: "Catherine Rivera", dob: "1999-11-07", address: "905 Prairie St", contact: "(403) 555-9876" },
          { id: 101, name: "Alice Wong",      dob: "1990-02-28", address: "42 Sunset Blvd", contact: "(403) 555-2345" },
          { id: 102, name: "Brandon Lee",      dob: "1985-08-12", address: "18 Foothill Dr", contact: "(587) 555-7890" },
          { id: 103, name: "Catherine Rivera", dob: "1999-11-07", address: "905 Prairie St", contact: "(403) 555-9876" },
          { id: 101, name: "Alice Wong",      dob: "1990-02-28", address: "42 Sunset Blvd", contact: "(403) 555-2345" },
          { id: 102, name: "Brandon Lee",      dob: "1985-08-12", address: "18 Foothill Dr", contact: "(587) 555-7890" },
          { id: 103, name: "Catherine Rivera", dob: "1999-11-07", address: "905 Prairie St", contact: "(403) 555-9876" },
          { id: 101, name: "Alice Wong",      dob: "1990-02-28", address: "42 Sunset Blvd", contact: "(403) 555-2345" },
          { id: 102, name: "Brandon Lee",      dob: "1985-08-12", address: "18 Foothill Dr", contact: "(587) 555-7890" },
          { id: 103, name: "Catherine Rivera", dob: "1999-11-07", address: "905 Prairie St", contact: "(403) 555-9876" },
        ]);
      });

    // 2) Search/filter functionality
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      Array.from(tableBody.rows).forEach(row => {
        const [idCell, nameCell] = row.querySelectorAll("td");
        const text = (idCell.textContent + nameCell.textContent).toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    });

    // 3) Render table rows
    function renderTable(patients) {
      tableBody.innerHTML = "";
      patients.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.dob}</td>
          <td>${p.address}</td>
          <td>${p.contact}</td>
          <td>
            <button class="btn btn-sm btn-outline-info me-2">Edit</button>
            <button class="btn btn-sm btn-outline-secondary me-2">View Patient</button>
            <button class="btn btn-sm btn-outline-danger">Delete</button>
          </td>
        `;
        tableBody.appendChild(tr);

        // Attach handlers (customize these functions as needed)
        tr.querySelector('.btn-outline-info').addEventListener('click', () => editPatient(p.id));
        tr.querySelector('.btn-outline-secondary').addEventListener('click', () => viewPatient(p.id));
        tr.querySelector('.btn-outline-danger').addEventListener('click', () => deletePatient(p.id));
      });
    }

    // 4) Action handlers
    function editPatient(id) {
      window.location.href = `edit_patient.html?id=${id}`;
    }

    function viewPatient(id) {
      window.location.href = `view_patient.html?id=${id}`;
    }

    function deletePatient(id) {
      // TODO: implement delete logic (e.g., fetch DELETE /api/patients/:id)
      console.log(`Delete patient ${id}`);
    }

    // 5) Ensure content is visible if previously hidden
    document.querySelector('.main-content').style.visibility = 'visible';
});
