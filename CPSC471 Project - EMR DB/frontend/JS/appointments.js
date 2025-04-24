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
    let patients = [];
    let doctors = [];

    document.getElementById("addAppointmentBtn").addEventListener("click", () => {
        if (selectedDate) {
            document.getElementById("selectedDateText").textContent = selectedDate;
            loadDropdowns();
            appointmentModal.show();
        }
    });

    async function preloadData() {
        try {
            const patientResponse = await fetch('http://localhost:8080/api/patients');
            patients = await patientResponse.json();

            const doctorResponse = await fetch('http://localhost:8080/api/doctors');
            doctors = await doctorResponse.json();
        } catch (err) {
            console.error("Error loading patient/doctor data:", err);
        }
    }

// Load all initial data when page loads
    preloadData();

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

        // 🔍 Check for duplicate appointment with same doctor & patient
        const allAppointments = document.querySelectorAll(".appointment-entry");
        const duplicate = Array.from(allAppointments).some(div =>
            div.dataset.patient === patientId &&
            div.dataset.doctor === doctorSsn
        );

        if (duplicate) {
            alert("This doctor and patient already have an appointment. Only one allowed.");
            return;
        }

        const appointmentData = {
            doctorSsn: parseInt(doctorSsn),
            patientId: parseInt(patientId),
            date: selectedDate.toISOString().split("T")[0],
            time: time
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

    // Clicking an existing appointment
    calendar.addEventListener("click", (e) => {
        const apptDiv = e.target.closest(".appointment-entry");
        if (!apptDiv) return;

        currentEditingDiv = apptDiv;

        document.getElementById("editTime").value = apptDiv.dataset.time;
        document.getElementById("editDate").value = new Date(apptDiv.dataset.date).toISOString().split('T')[0];

        const patientId = apptDiv.dataset.patient;
        const doctorSsn = apptDiv.dataset.doctor;

        // Use your previously fetched arrays of patients and doctors
        const patient = patients.find(p => p.id == patientId);
        const doctor = doctors.find(d => d.ssn == doctorSsn);

        document.getElementById("editPatientText").textContent = patient ? `${patient.fname} ${patient.lname}` : patientId;
        document.getElementById("editDoctorText").textContent = doctor ? `${doctor.fname} ${doctor.lname}` : doctorSsn;

        // Still store the hidden ID/SSN for form submission
        document.getElementById("editPatient").value = patientId;
        document.getElementById("editDoctor").value = doctorSsn;

        viewModal.show();
    });


    // Edit appointment
    document.getElementById("editAppointmentForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const newTime = document.getElementById("editTime").value;
        const newDate = document.getElementById("editDate").value;
        const newDoctor = document.getElementById("editDoctor").value;
        const newPatient = document.getElementById("editPatient").value;

        if (!newTime || !newDate || !newDoctor || !newPatient) {
            alert("All fields are required.");
            return;
        }

        const appointmentData = {
            doctorSsn: parseInt(newDoctor),
            patientId: parseInt(newPatient),
            date: newDate,
            time: newTime
        };

        try {
            const response = await fetch("http://localhost:8080/api/appointments", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                // Update DOM
                currentEditingDiv.dataset.time = newTime;
                currentEditingDiv.dataset.date = new Date(newDate).toDateString();
                currentEditingDiv.innerHTML = `<strong>${newTime}</strong> <small>${newDoctor}</small>`;
                viewModal.hide();

                // Re-render calendar to reflect changes
                const updatedDate = new Date(newDate);
                if (
                    updatedDate.getMonth() === parseInt(monthSelect.value) &&
                    updatedDate.getFullYear() === parseInt(yearSelect.value)
                ) {
                    renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
                } else {
                    // If the updated date is outside current view, switch to that month/year
                    monthSelect.value = updatedDate.getMonth();
                    yearSelect.value = updatedDate.getFullYear();
                    renderCalendar(updatedDate.getMonth(), updatedDate.getFullYear());
                }
            } else {
                const errorText = await response.text();
                alert("Failed to update appointment: " + errorText);
            }
        } catch (err) {
            console.error("Error updating appointment:", err);
            alert("An error occurred while updating the appointment.");
        }
    });


    // Delete appointment
    document.getElementById("deleteAppointmentBtn").addEventListener("click", async () => {
        if (!currentEditingDiv) return;

        if (!confirm("Are you sure you want to delete this appointment?")) return;

        const appointmentData = {
            doctorSsn: parseInt(currentEditingDiv.dataset.doctor),
            patientId: parseInt(currentEditingDiv.dataset.patient),
            date: new Date(currentEditingDiv.dataset.date).toISOString().split('T')[0],
            time: currentEditingDiv.dataset.time
        };

        try {
            const response = await fetch("http://localhost:8080/api/appointments", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                currentEditingDiv.remove();
                viewModal.hide();
            } else {
                const errorText = await response.text();
                alert("Failed to delete appointment: " + errorText);
            }
        } catch (err) {
            console.error("Error deleting appointment:", err);
            alert("An error occurred while deleting the appointment.");
        }
    });

    async function loadAppointments() {
        try {
            const [appointmentsRes, doctorsRes] = await Promise.all([
                fetch("http://localhost:8080/api/appointments"),
                fetch("http://localhost:8080/api/doctors")
            ]);

            if (!appointmentsRes.ok || !doctorsRes.ok) throw new Error("Failed to fetch data");

            const appointments = await appointmentsRes.json();
            const doctors = await doctorsRes.json();

            const doctorMap = {};
            doctors.forEach(d => {
                doctorMap[d.ssn] = d.lname; // map SSN to last name
            });

            appointments.forEach(a => {
                const [yearStr, monthStr, dayStr] = a.date.split("-");
                const apptDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
                const day = apptDate.getDate();
                const month = apptDate.getMonth();
                const year = apptDate.getFullYear();

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

                        const doctorName = doctorMap[a.doctorSsn] || a.doctorSsn; // fallback to SSN if not found
                        appointmentDiv.innerHTML = `<strong>${a.time}</strong> <small>${doctorName}</small>`;

                        cell.querySelector(".appointments").appendChild(appointmentDiv);
                    }
                }
            });
        } catch (err) {
            console.error("Error loading appointments:", err);
        }
    }

});
