// src/main/java/com/example/emr/controller/PatientController.java
package com.example.emr.controller;

import com.example.emr.dao.PatientDao;
import com.example.emr.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientDao patientDao;

    /** Create a new patient */
    @PostMapping
    public ResponseEntity<String> addPatient(@RequestBody Patient patient) {
        int rows = patientDao.addPatient(patient);
        if (rows > 0) {
            return ResponseEntity.ok("Patient added successfully");
        } else {
            return ResponseEntity.status(500).body("Error adding patient");
        }
    }

    /** Retrieve a patient by SSN */
    @GetMapping("/{ssn}")
    public ResponseEntity<Patient> getPatientBySsn(@PathVariable int ssn) {
        Patient patient = patientDao.getPatientBySsn(ssn);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{ssn}")
    public ResponseEntity<List<Patient>> deletePatientsBySsn(@PathVariable int ssn) {
        Patient patient = patientDao.getPatientBySsn(ssn);
        if (patient != null) {
            patientDao.deletePatientBySsn(ssn);
            return ResponseEntity.ok(patientDao.getAllPatients());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /** List all patients */
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> list = patientDao.getAllPatients();
        return ResponseEntity.ok(list);
    }
}