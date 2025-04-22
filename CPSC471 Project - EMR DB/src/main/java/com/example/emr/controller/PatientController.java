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

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientDao.getAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Patient patient = patientDao.getPatientById(id);
        return (patient != null) ? ResponseEntity.ok(patient) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        Patient added = patientDao.addPatient(patient);
        return ResponseEntity.ok(added);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        Patient existing = patientDao.getPatientById(id);
        if (existing != null) {
            updatedPatient.setId(id); // set ID so it gets updated correctly
            int rows = patientDao.updatePatient(updatedPatient);
            return (rows > 0) ?
                    ResponseEntity.ok("Patient updated successfully") :
                    ResponseEntity.badRequest().body("Failed to update patient");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        Patient existing = patientDao.getPatientById(id);
        if (existing != null) {
            patientDao.deletePatientById(id);
            return ResponseEntity.ok("Patient deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}