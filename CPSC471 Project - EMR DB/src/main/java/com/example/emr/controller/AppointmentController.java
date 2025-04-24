package com.example.emr.controller;

import com.example.emr.dao.AppointmentDao;
import com.example.emr.model.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentDao appointmentDao;

    @PostMapping
    public ResponseEntity<String> addAppointment(@RequestBody Appointment a) {
        int rows = appointmentDao.addAppointment(a);
        return (rows > 0)
                ? ResponseEntity.ok("Appointment added successfully")
                : ResponseEntity.status(500).body("Failed to add appointment");
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable int id) {
        return ResponseEntity.ok(appointmentDao.getAppointmentsByPatient(id));
    }

    @GetMapping("/doctor/{ssn}")
    public ResponseEntity<List<Appointment>> getByDoctor(@PathVariable int ssn) {
        return ResponseEntity.ok(appointmentDao.getAppointmentsByDoctor(ssn));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentDao.getAllAppointments());
    }

    @PutMapping
    public ResponseEntity<String> updateAppointment(@RequestBody Appointment a) {
        int rows = appointmentDao.updateAppointment(a);
        return (rows > 0)
                ? ResponseEntity.ok("Appointment updated successfully")
                : ResponseEntity.status(500).body("Failed to update appointment");
    }
}