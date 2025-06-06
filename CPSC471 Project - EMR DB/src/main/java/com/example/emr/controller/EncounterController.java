package com.example.emr.controller;

import com.example.emr.dao.EncounterDao;
import com.example.emr.model.Encounter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/encounters")
public class EncounterController {

    @Autowired
    private EncounterDao encounterDao;

    /** Create a new encounter */
    @PostMapping
    public ResponseEntity<String> addEncounter(@RequestBody Encounter encounter) {
        int rows = encounterDao.addEncounter(encounter);
        if (rows > 0) {
            return ResponseEntity.ok(String.valueOf(encounter.getEncounterId()));
        } else {
            return ResponseEntity.status(500).body("Error adding encounter");
        }
    }

    /** Get a specific encounter by its ID */
    @GetMapping("/{id}")
    public ResponseEntity<Encounter> getEncounter(@PathVariable int id) {
        Encounter en = encounterDao.getEncounterById(id);
        return (en != null)
                ? ResponseEntity.ok(en)
                : ResponseEntity.notFound().build();
    }

    /** List all encounters for a given patient */
    @GetMapping("/patients/{id}")
    public ResponseEntity<List<Encounter>> getByPatient(@PathVariable("id") int id) {
        List<Encounter> list = encounterDao.getEncountersByPatientId(id);
        return ResponseEntity.ok(list);
    }

    /** List all encounters */
    @GetMapping
    public ResponseEntity<List<Encounter>> getAll() {
        return ResponseEntity.ok(encounterDao.getAllEncounters());
    }
}