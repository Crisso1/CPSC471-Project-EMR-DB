document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const addBtn = document.getElementById("addAppointmentBtn");
    const appointmentForm = document.getElementById("appointmentForm");
    const selectedDateText = document.getElementById("selectedDateText");
    const appointmentModal = new bootstrap.Modal(document.getElementById("appointmentModal"));

    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");

    let selectedCell = null;
    let selectedDate = null;

    const patients = ["Alice Smith", "Bob Johnson", "Charlie Rose"];
    const doctors = ["Dr. Grey", "Dr. House", "Dr. Watson"];

    // Populate dropdowns
    const populateDropdown = (elementId, list) => {
        const select = document.getElementById(elementId);
        list.forEach((item, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = item;
            select.appendChild(opt);
        });
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    // Populate dropdowns
    months.forEach((m, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = m;
        monthSelect.appendChild(opt);
    });
    years.forEach((y) => {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    });

    // Set current month/year
    monthSelect.value = new Date().getMonth();
    yearSelect.value = currentYear;

    // Fill patient/doctor dropdowns
    populateDropdown("patient", patients);
    populateDropdown("doctor", doctors);

    // Build the calendar for a given month/year
    function renderCalendar(month, year) {
        calendar.innerHTML = "";
        addBtn.disabled = true;
        selectedCell = null;
        selectedDate = null;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

        for (let i = 0; i < totalCells; i++) {
            const dayNum = i - firstDay + 1;
            const col = document.createElement("div");
            col.className = "col";
            if (i >= firstDay && dayNum <= daysInMonth) {
                col.innerHTML = `
          <div class="calendar-cell border rounded p-2" data-day="${dayNum}">
            <div class="day-label fw-bold">${dayNum}</div>
            <div class="appointments mt-2"></div>
          </div>`;
            } else {
                col.innerHTML = `<div class="calendar-cell p-2" style="visibility: hidden;"></div>`;
            }
            calendar.appendChild(col);
        }
    }

    renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));

    // Change calendar on dropdown change
    monthSelect.addEventListener("change", () => {
        renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });
    yearSelect.addEventListener("change", () => {
        renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });

    // Handle date selection
    calendar.addEventListener("click", (e) => {
        const cell = e.target.closest(".calendar-cell[data-day]");
        if (!cell) return;

        document.querySelectorAll(".calendar-cell").forEach(c => c.classList.remove("selected"));
        cell.classList.add("selected");
        selectedCell = cell;

        const day = parseInt(cell.dataset.day);
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);
        selectedDate = new Date(year, month, day);

        selectedDateText.textContent = selectedDate.toDateString();
        addBtn.disabled = false;
    });

    // allow add appointment button to be clicked
    addBtn.addEventListener("click", () => {
        appointmentForm.reset();
        appointmentModal.show();
    });

    // submit new appointment
    appointmentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const time = document.getElementById("time").value;
        const patient = document.getElementById("patient").value;
        const doctor = document.getElementById("doctor").value;

        const appointmentDiv = document.createElement("div");
        appointmentDiv.className = "appointment-entry small border rounded bg-light p-1 mb-1 text-start";
        appointmentDiv.dataset.time = time;
        appointmentDiv.dataset.patient = patient;
        appointmentDiv.dataset.doctor = doctor;
        appointmentDiv.dataset.date = selectedDate.toDateString();
        appointmentDiv.innerHTML = `<strong>${time}</strong> <small>${doctor}</small>`;
        selectedCell.querySelector(".appointments").appendChild(appointmentDiv);

        appointmentModal.hide();
    });

    const viewModal = new bootstrap.Modal(document.getElementById("viewAppointmentModal"));
    let currentEditingDiv = null;

// Populate dropdowns in edit form
    populateDropdown("editPatient", patients);
    populateDropdown("editDoctor", doctors);

// Clicking an existing appointment
    calendar.addEventListener("click", (e) => {
        const apptDiv = e.target.closest(".appointment-entry");
        if (!apptDiv) return;

        currentEditingDiv = apptDiv;
        document.getElementById("viewDate").textContent = apptDiv.dataset.date;
        document.getElementById("editTime").value = apptDiv.dataset.time;
        document.getElementById("editPatient").value = apptDiv.dataset.patient;
        document.getElementById("editDoctor").value = apptDiv.dataset.doctor;

        viewModal.show();
    });

    // Edit appointment
    document.getElementById("editAppointmentForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const newTime = document.getElementById("editTime").value;
        const newPatient = document.getElementById("editPatient").value;
        const newDoctor = document.getElementById("editDoctor").value;

        currentEditingDiv.dataset.time = newTime;
        currentEditingDiv.dataset.patient = newPatient;
        currentEditingDiv.dataset.doctor = newDoctor;
        currentEditingDiv.innerHTML = `<strong>${newTime}</strong> <small>${newDoctor}</small>`;

        viewModal.hide();
    });

    // Delete appointment
    document.getElementById("deleteAppointmentBtn").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this appointment?")) {
            currentEditingDiv.remove();
            viewModal.hide();
        }
    });

});
