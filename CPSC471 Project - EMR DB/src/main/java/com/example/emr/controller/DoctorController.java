package com.example.emr.controller;

import com.example.emr.dao.DoctorDao;
import com.example.emr.model.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController                  // Marks the class as a REST controller
@RequestMapping("/api/doctors")  // Base path for doctor-related endpoints
public class DoctorController {

    @Autowired
    private DoctorDao DoctorDao;

    /**
     * POST endpoint to add a new doctor.
     * Expects a JSON body with doctor information.
     */
    @PostMapping
    public ResponseEntity<String> addDoctor(@RequestBody Doctor doctor) {
        int rowsAffected = DoctorDao.addDoctor(doctor);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("Doctor added successfully");
        } else {
            return ResponseEntity.status(500).body("Error adding doctor");
        }
    }

    /**
     * GET endpoint to retrieve a doctor by SSN.
     * The SSN is supplied as a path variable.
     */
    @GetMapping("/{ssn}")
    public ResponseEntity<Doctor> getDoctorBySsn(@PathVariable int ssn) {
        Doctor doctor = DoctorDao.getDoctorBySsn(ssn);
        if (doctor != null) {
            return ResponseEntity.ok(doctor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}