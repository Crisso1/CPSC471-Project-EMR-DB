package com.example.emr;

import com.example.emr.dao.DoctorDao;
import com.example.emr.dao.EncounterDao;
import com.example.emr.dao.PatientDao;
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
@Transactional
public class EncounterDaoTest {

    @Autowired
    private EncounterDao encounterDao;

    @Autowired
    private PatientDao patientDao;

    @Autowired
    private DoctorDao doctorDao;

    private Long testPatientId;

    @BeforeEach
    void setupForeignKeys() {
        // Insert a test patient
        Patient p = new Patient();
        p.setFname("Alice");
        p.setLname("Smith");
        p.setDob(LocalDate.of(1995, 3, 20));
        p.setAddress("123 Main St");
        p.setContact("alice.smith@email.com");
        patientDao.addPatient(p);

        // Get patient ID (assumes auto-increment)
        List<Patient> patients = patientDao.getAllPatients();
        testPatientId = patients.get(patients.size() - 1).getId();

        // Insert test doctor (still using SSN here)
        Doctor d = new Doctor();
        d.setSsn(444555666);
        d.setFName("DrJohn");
        d.setLName("Doe");
        d.setWorkStart(Date.valueOf("2020-01-01"));
        doctorDao.addDoctor(d);
    }

    private Encounter sampleEncounter() {
        Encounter e = new Encounter();
        e.setPatientId(testPatientId);
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

        // Retrieve by patient ID
        List<Encounter> list = encounterDao.getEncountersByPatientId(testPatientId);
        assertFalse(list.isEmpty(), "Should find at least one encounter for the patient");

        Encounter inserted = list.get(0);
        assertEquals(testPatientId, inserted.getPatientId());
        assertEquals(444555666, inserted.getDoctorSsn());
        assertEquals(LocalDate.of(2025, 4, 17), inserted.getVisitDate());
        assertEquals(LocalTime.of(14, 30), inserted.getVisitTime());
        assertEquals("Routine", inserted.getVisitType());
        assertEquals("Annual check-up", inserted.getChiefComplaint());
        assertEquals("Healthy", inserted.getDiagnosis());
        assertEquals("Continue current regimen", inserted.getTreatmentPlan());
        assertEquals("Patient in good health", inserted.getNotes());
        assertEquals(LocalDate.of(2026, 4, 17), inserted.getFollowUpDate());

        // Retrieve by encounter ID
        Long id = inserted.getEncounterId();
        Encounter byId = encounterDao.getEncounterById(id);
        assertNotNull(byId, "Should retrieve encounter by its ID");
        assertEquals(inserted.getEncounterId(), byId.getEncounterId());
    }

    @Test
    void testGetAllEncounters() {
        encounterDao.addEncounter(sampleEncounter());

        List<Encounter> all = encounterDao.getAllEncounters();
        assertNotNull(all, "The list of all encounters should not be null");
        assertTrue(all.size() >= 1, "There should be at least one encounter in the database");
    }
}