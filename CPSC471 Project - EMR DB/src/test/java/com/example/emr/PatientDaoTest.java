package com.example.emr;

import com.example.emr.dao.PatientDao;
import com.example.emr.model.Patient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional  // roll back after each test
public class PatientDaoTest {

    @Autowired
    private PatientDao patientDao;

    private Patient samplePatient() {
        Patient p = new Patient();
        p.setFname("Alice");
        p.setLname("Smith");
        p.setDob(LocalDate.of(1990, 1, 1));
        p.setAddress("123 Main Street");
        p.setContact("alice@example.com");
        return p;
    }

    @Test
    void testAddAndGetPatient() {
        // Insert the patient and verify it was returned
        Patient inserted = patientDao.addPatient(samplePatient());
        assertNotNull(inserted, "Inserted patient should not be null");

        // Retrieve the patient by ID (preferred for precision)
        Patient retrieved = patientDao.getPatientById(inserted.getId());
        assertNotNull(retrieved, "Retrieved patient should not be null");

        // Validate fields
        assertEquals("Alice", retrieved.getFname());
        assertEquals("Smith", retrieved.getLname());
        assertEquals(LocalDate.of(1990, 1, 1), retrieved.getDob());
        assertEquals("123 Main Street", retrieved.getAddress());
        assertEquals("alice@example.com", retrieved.getContact());
    }

    @Test
    void testGetAllPatients() {
        patientDao.addPatient(samplePatient());
        List<Patient> all = patientDao.getAllPatients();

        assertNotNull(all, "The list of all patients should not be null");
        assertTrue(all.size() >= 1, "There should be at least one patient record");
    }

    @Test
    void testDeletePatient() {
        int startSize = patientDao.getAllPatients().size();

        patientDao.addPatient(samplePatient());
        List<Patient> all = patientDao.getAllPatients();
        Patient added = all.get(all.size() - 1);

        int rowsDeleted = patientDao.deletePatientById(added.getId());
        assertEquals(1, rowsDeleted, "Expected one row to be deleted");

        int endSize = patientDao.getAllPatients().size();
        assertEquals(startSize, endSize, "There should be the same number of patients now as we started with.");
    }
}