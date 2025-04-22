// src/main/java/com/example/emr/controller/AllergyController.java
package com.example.emr.controller;

import com.example.emr.dao.AllergiesDao;
import com.example.emr.model.Allergies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/allergies")
public class AllergiesController {

    @Autowired
    private AllergiesDao allergiesDao;

    /** Create a new allergy entry */
    @PostMapping
    public ResponseEntity<String> addAllergy(@RequestBody Allergies allergy) {
        int rows = allergiesDao.addAllergy(allergy);
        if (rows > 0) {
            return ResponseEntity.ok("Allergy added successfully");
        } else {
            return ResponseEntity.status(500).body("Error adding allergy");
        }
    }

    /** List all allergies for a given patient */
    @GetMapping("/patients/{id}")
    public ResponseEntity<List<Allergies>> getByPatient(@PathVariable("id") int id) {
        List<Allergies> list = allergiesDao.getAllergiesByPatientId(id);
        return ResponseEntity.ok(list);
    }

    /** List all allergies in the system */
    @GetMapping
    public ResponseEntity<List<Allergies>> getAll() {
        return ResponseEntity.ok(allergiesDao.getAllAllergies());
    }
}