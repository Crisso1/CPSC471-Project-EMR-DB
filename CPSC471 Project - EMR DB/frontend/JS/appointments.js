document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const addBtn = document.getElementById("addAppointmentBtn");
    const appointmentForm = document.getElementById("appointmentForm");
    const selectedDateText = document.getElementById("selectedDateText");
    const appointmentModalEl = document.getElementById("appointmentModal");
    const appointmentModal = new bootstrap.Modal(appointmentModalEl);

    appointmentModalEl.addEventListener("hidden.bs.modal", () => {
        appointmentForm.reset();
        selectedDateText.textContent = "";
    });

    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");

    let selectedCell = null;
    let selectedDate = null;

    document.getElementById("addAppointmentBtn").addEventListener("click", () => {
        if (selectedDate) {
            document.getElementById("selectedDateText").textContent = selectedDate;
            loadDropdowns();
            appointmentModal.show();
        }
    });

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

        // 🔥 Load appointments after the calendar has been rendered
        loadAppointments();
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

    document.getElementById("addAppointmentBtn").addEventListener("click", () => {
        if (selectedDate) {
            selectedDateText.textContent = selectedDate.toDateString();
            loadDropdowns();
            appointmentForm.reset(); // Optional: clears form if needed
            appointmentModal.show(); // ✅ Use your single initialized modal instance
        }
    });

    // allow add appointment button to be clicked
    addBtn.addEventListener("click", () => {
        appointmentForm.reset();
        appointmentModal.show();
    });

    async function loadDropdowns(patientSelectId = 'patient', doctorSelectId = 'doctor') {
        try {
            // Load Patients
            const patientResponse = await fetch('http://localhost:8080/api/patients');
            const patients = await patientResponse.json();
            const patientSelect = document.getElementById(patientSelectId);
            patientSelect.innerHTML = '<option value="">Select Patient</option>';
            patients.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = `${p.fname} ${p.lname}`;
                patientSelect.appendChild(option);
            });

            // Load Doctors
            const doctorResponse = await fetch('http://localhost:8080/api/doctors');
            const doctors = await doctorResponse.json();
            const doctorSelect = document.getElementById(doctorSelectId);
            doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
            doctors.forEach(d => {
                const option = document.createElement('option');
                option.value = d.ssn;
                option.textContent = `${d.fname} ${d.lname}`;
                doctorSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Failed to load dropdowns:', error);
        }
    }

    // submit new appointment
    appointmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const time = document.getElementById("time").value;
        const patientId = document.getElementById("patient").value;
        const doctorSsn = document.getElementById("doctor").value;

        if (!selectedDate || !time || !patientId || !doctorSsn) {
            alert("Please fill out all fields.");
            return;
        }

        const appointmentData = {
            doctorSsn: parseInt(doctorSsn),
            patientId: parseInt(patientId),
            date: selectedDate.toISOString().split("T")[0], // format: yyyy-MM-dd
            time: time // already in HH:mm
        };

        try {
            const response = await fetch("http://localhost:8080/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                const appointmentDiv = document.createElement("div");
                appointmentDiv.className = "appointment-entry small border rounded bg-light p-1 mb-1 text-start";
                appointmentDiv.dataset.time = time;
                appointmentDiv.dataset.patient = patientId;
                appointmentDiv.dataset.doctor = doctorSsn;
                appointmentDiv.dataset.date = selectedDate.toDateString();
                appointmentDiv.innerHTML = `<strong>${time}</strong> <small>${doctorSsn}</small>`;
                selectedCell.querySelector(".appointments").appendChild(appointmentDiv);

                appointmentModal.hide();
            } else {
                const errorText = await response.text();
                alert("Failed to add appointment: " + errorText);
            }
        } catch (err) {
            console.error("Error submitting appointment:", err);
            alert("An error occurred while adding the appointment.");
        }
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

        // Load dropdowns into edit modal
        loadDropdowns('editPatient', 'editDoctor').then(() => {
            document.getElementById("editTime").value = apptDiv.dataset.time;
            document.getElementById("editDate").value = new Date(apptDiv.dataset.date).toISOString().split('T')[0];

            const patientId = apptDiv.dataset.patient;
            const doctorSsn = apptDiv.dataset.doctor;

            const patient = patients.find(p => p.id == patientId);
            const doctor = doctors.find(d => d.ssn == doctorSsn);

            document.getElementById("editPatientText").textContent = patient ? `${patient.fname} ${patient.lname}` : patientId;
            document.getElementById("editDoctorText").textContent = doctor ? `${doctor.fname} ${doctor.lname}` : doctorSsn;

            document.getElementById("editPatient").value = patientId;
            document.getElementById("editDoctor").value = doctorSsn;


            viewModal.show();
        });
    });

    // Edit appointment
    document.getElementById("editAppointmentForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const newTime = document.getElementById("editTime").value;
        const newDoctor = document.getElementById("editDoctor").value;
        const newDate = document.getElementById("editDate").value;

        currentEditingDiv.dataset.time = newTime;
        currentEditingDiv.dataset.date = new Date(newDate).toDateString(); // update DOM date

        // patient and doctor remain the same because they are unchangeable
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

    async function loadAppointments() {
        try {
            const response = await fetch("http://localhost:8080/api/appointments");
            if (!response.ok) throw new Error("Failed to fetch appointments");
            const appointments = await response.json();

            appointments.forEach(a => {
                const apptDate = new Date(a.date);
                const day = apptDate.getDate();
                const month = apptDate.getMonth();
                const year = apptDate.getFullYear();

                // Only render if the calendar is currently showing this month/year
                if (month === parseInt(monthSelect.value) && year === parseInt(yearSelect.value)) {
                    const cell = [...calendar.querySelectorAll(".calendar-cell[data-day]")]
                        .find(c => parseInt(c.dataset.day) === day);

                    if (cell) {
                        const appointmentDiv = document.createElement("div");
                        appointmentDiv.className = "appointment-entry small border rounded bg-light p-1 mb-1 text-start";
                        appointmentDiv.dataset.time = a.time;
                        appointmentDiv.dataset.patient = a.patientId;
                        appointmentDiv.dataset.doctor = a.doctorSsn;
                        appointmentDiv.dataset.date = a.date;
                        appointmentDiv.innerHTML = `<strong>${a.time}</strong> <small>${a.doctorSsn}</small>`;
                        cell.querySelector(".appointments").appendChild(appointmentDiv);
                    }
                }
            });
        } catch (err) {
            console.error("Error loading appointments:", err);
        }
    }

});
