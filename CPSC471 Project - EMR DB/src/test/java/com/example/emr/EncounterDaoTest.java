// src/test/java/com/example/emr/dao/EncounterDaoTest.java
package com.example.emr.dao;

import com.example.emr.model.Encounter;
import com.example.emr.model.Doctor;
import com.example.emr.model.Patient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional  // roll back after each test
public class EncounterDaoTest {

    @Autowired
    private EncounterDao encounterDao;

    @Autowired
    private PatientDao patientDao;

    @Autowired
    private DoctorDao doctorDao;

    private Patient samplePatient() {
        Patient p = new Patient();
        p.setSsn(111222333);
        p.setFirstName("Alice");
        p.setLastName("Smith");
        p.setAge(30);
        p.setWeightKg(65.5);
        p.setHeightCm(170.2);
        return p;
    }

    private Doctor sampleDoctor() {
        Doctor d = new Doctor();
        d.setSsn(444555666);
        d.setFName("DrJohn");
        d.setLName("Doe");
        d.setWorkStart(Date.valueOf("2020-01-01"));
        return d;
    }

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

    @BeforeEach
    void setupForeignKeys() {
        // Ensure patient and doctor exist before any encounter is inserted
        patientDao.addPatient(samplePatient());
        doctorDao.addDoctor(sampleDoctor());
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