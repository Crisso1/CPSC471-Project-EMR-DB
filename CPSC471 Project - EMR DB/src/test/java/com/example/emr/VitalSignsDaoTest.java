// src/test/java/com/example/emr/dao/VitalSignsDaoTest.java
package com.example.emr.dao;

import com.example.emr.model.Encounter;
import com.example.emr.model.Doctor;
import com.example.emr.model.Patient;
import com.example.emr.model.VitalSigns;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional  // roll back after each test
public class VitalSignsDaoTest {

    @Autowired
    private VitalSignsDao vitalSignsDao;

    @Autowired
    private EncounterDao encounterDao;

    @Autowired
    private PatientDao patientDao;

    @Autowired
    private DoctorDao doctorDao;

    private int encounterId;

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

    private VitalSigns sampleVital(int encId) {
        VitalSigns v = new VitalSigns();
        v.setEncounterId(encId);
        v.setMeasuredAt(LocalDateTime.of(2025, 4, 17, 9, 0));
        v.setTemperature(37.2);
        v.setBloodPressure("120/80");
        v.setHeartRate(72);
        v.setRespiratoryRate(16);
        return v;
    }

    @BeforeEach
    void setupForeignKeysAndEncounter() {
        // ensure patient and doctor exist
        patientDao.addPatient(samplePatient());
        doctorDao.addDoctor(sampleDoctor());
        // insert encounter and capture its generated ID
        encounterDao.addEncounter(sampleEncounter());
        List<Encounter> encounters = encounterDao.getEncountersByPatient(111222333);
        assertFalse(encounters.isEmpty(), "Encounter should have been inserted");
        encounterId = encounters.get(0).getEncounterId();
    }

    @Test
    void testAddAndGetByEncounter() {
        // insert the vital signs record linked to our new encounter
        int rows = vitalSignsDao.addVitalSigns(sampleVital(encounterId));
        assertEquals(1, rows, "Expected one row to be inserted");

        // retrieve by encounter
        List<VitalSigns> list = vitalSignsDao.getByEncounter(encounterId);
        assertFalse(list.isEmpty(), "Should find at least one vital-signs record");

        VitalSigns inserted = list.get(0);
        assertEquals(encounterId, inserted.getEncounterId());
        assertEquals(37.2, inserted.getTemperature());
        assertEquals("120/80", inserted.getBloodPressure());
        assertEquals(72, inserted.getHeartRate());
        assertEquals(16, inserted.getRespiratoryRate());
        assertEquals(LocalDateTime.of(2025, 4, 17, 9, 0), inserted.getMeasuredAt());
    }

    @Test
    void testGetAll() {
        // insert one sample record
        vitalSignsDao.addVitalSigns(sampleVital(encounterId));

        // should return a non-null, non-empty list
        List<VitalSigns> all = vitalSignsDao.getAll();
        assertNotNull(all, "The list of all vital-signs entries should not be null");
        assertTrue(all.size() >= 1, "There should be at least one entry in the database");
    }
}