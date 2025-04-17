package com.example.emr.dao;

import com.example.emr.model.Encounter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional  // roll back after each test
public class EncounterDaoTest {

    @Autowired
    private EncounterDao encounterDao;

    private Encounter sampleEncounter() {
        Encounter e = new Encounter();
        e.setPatientSsn(111222333);
        e.setDoctorSsn(444555666);
        e.setVisitDate(LocalDate.of(2025, 4, 17));
        e.setVisitTime(LocalTime.of(14, 30));
        e.setVisitType("Routine");
        e.setChiefComplaint("Annual check-up");
        e.setDiagnosis("Healthy");
        e.setTreatmentPlan("Continue current regimen");
        e.setNotes("Patient in good health");
        e.setFollowUpDate(LocalDate.of(2026, 4, 17));
        return e;
    }

    @Test
    void testAddAndGetEncounter() {
        // Insert the encounter
        int rows = encounterDao.addEncounter(sampleEncounter());
        assertEquals(1, rows, "Expected one row to be inserted");

        // Retrieve by patient SSN
        List<Encounter> list = encounterDao.getEncountersByPatient(111222333);
        assertFalse(list.isEmpty(), "Should find at least one encounter for the patient");

        Encounter inserted = list.get(0);
        assertEquals(111222333, inserted.getPatientSsn());
        assertEquals(444555666, inserted.getDoctorSsn());
        assertEquals(LocalDate.of(2025, 4, 17), inserted.getVisitDate());
        assertEquals(LocalTime.of(14, 30), inserted.getVisitTime());
        assertEquals("Routine", inserted.getVisitType());
        assertEquals("Annual check-up", inserted.getChiefComplaint());
        assertEquals("Healthy", inserted.getDiagnosis());
        assertEquals("Continue current regimen", inserted.getTreatmentPlan());
        assertEquals("Patient in good health", inserted.getNotes());
        assertEquals(LocalDate.of(2026, 4, 17), inserted.getFollowUpDate());

        // Now retrieve by encounter ID
        int id = inserted.getEncounterId();
        Encounter byId = encounterDao.getEncounterById(id);
        assertNotNull(byId, "Should retrieve encounter by its ID");
        assertEquals(inserted.getEncounterId(), byId.getEncounterId());
    }

    @Test
    void testGetAllEncounters() {
        // Insert one sample encounter
        encounterDao.addEncounter(sampleEncounter());

        // Should return a non-null list (possibly non-empty)
        List<Encounter> all = encounterDao.getAllEncounters();
        assertNotNull(all, "The list of all encounters should not be null");
        assertTrue(all.size() >= 1, "There should be at least one encounter in the database");
    }
}