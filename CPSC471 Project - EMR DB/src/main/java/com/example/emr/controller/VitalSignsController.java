// src/main/java/com/example/emr/controller/VitalSignsController.java
package com.example.emr.controller;

import com.example.emr.dao.VitalSignsDao;
import com.example.emr.model.VitalSigns;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/vitalsigns")
public class VitalSignsController {

    @Autowired
    private VitalSignsDao vitalSignsDao;

    /** Create a new vital signs entry */
    @PostMapping
    public ResponseEntity<String> addVitalSigns(@RequestBody VitalSigns vs) {
        int rows = vitalSignsDao.addVitalSigns(vs);
        if (rows > 0) {
            return ResponseEntity.ok("Vital signs added successfully");
        } else {
            return ResponseEntity.status(500).body("Error adding vital signs");
        }
    }

    /** List vital signs for a specific encounter */
    @GetMapping("/encounter/{id}")
    public ResponseEntity<List<VitalSigns>> getByEncounter(@PathVariable("id") int encounterId) {
        List<VitalSigns> list = vitalSignsDao.getByEncounter(encounterId);
        return ResponseEntity.ok(list);
    }

    /** List all vital signs entries */
    @GetMapping
    public ResponseEntity<List<VitalSigns>> getAll() {
        return ResponseEntity.ok(vitalSignsDao.getAll());
    }
}