// src/test/java/com/example/emr/dao/PatientDaoTest.java
package com.example.emr;

import com.example.emr.dao.PatientDao;
import com.example.emr.model.Patient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional  // roll back after each test
public class PatientDaoTest {

    @Autowired
    private PatientDao patientDao;

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

    @Test
    void testAddAndGetPatient() {
        // Insert the patient
        int rows = patientDao.addPatient(samplePatient());
        assertEquals(1, rows, "Expected one row to be inserted");

        // Retrieve by SSN
        Patient retrieved = patientDao.getPatientBySsn(111222333);
        assertNotNull(retrieved, "Patient should be found by SSN");
        assertEquals(111222333, retrieved.getSsn());
        assertEquals("Alice", retrieved.getFirstName());
        assertEquals("Smith", retrieved.getLastName());
        assertEquals(30, retrieved.getAge());
        assertEquals(65.5, retrieved.getWeightKg());
        assertEquals(170.2, retrieved.getHeightCm());
    }

    @Test
    void testGetAllPatients() {
        // Ensure at least one patient in database
        patientDao.addPatient(samplePatient());

        List<Patient> all = patientDao.getAllPatients();
        assertNotNull(all, "The list of all patients should not be null");
        assertTrue(all.size() >= 1, "There should be at least one patient record");
    }

    @Test
    void testDeletePatient() {
        int startSize = (patientDao.getAllPatients() == null) ? 0 : patientDao.getAllPatients().size();

        int rows = patientDao.addPatient(samplePatient());
        assertEquals(1, rows, "Expected one row to be inserted");
        rows = patientDao.deletePatientBySsn(samplePatient().getSsn());
        assertEquals(1, rows, "Expected one row to be deleted");
        int endSize = (patientDao.getAllPatients() == null) ? 0 : patientDao.getAllPatients().size();

        assertEquals(endSize, startSize, "There should be the same number of patients now as we started with.");
    }
}