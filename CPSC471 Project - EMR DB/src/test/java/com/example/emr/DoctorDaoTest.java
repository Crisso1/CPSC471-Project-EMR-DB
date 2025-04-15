package com.example.emr.dao;

import com.example.emr.model.Doctor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Date;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Ensures that changes made during the test are rolled back afterward.
public class DoctorDaoTest {

    @Autowired
    private DoctorDao doctorDao;

    @Test
    void testAddAndGetDoctor() {
        // Create a sample Doctor object.
        Doctor doc = new Doctor();
        doc.setSsn(123456789);
        doc.setFName("John");
        doc.setLName("Doe");
        doc.setWorkStart(Date.valueOf("2020-01-01"));

        // Insert the doctor record.
        int rowsAffected = doctorDao.addDoctor(doc);
        assertEquals(1, rowsAffected, "Expected one row to be inserted");

        // Retrieve the doctor by SSN.
        Doctor retrievedDoctor = doctorDao.getDoctorBySsn(123456789);
        assertNotNull(retrievedDoctor, "Doctor should be found by SSN");
        assertEquals("John", retrievedDoctor.getFName());
        assertEquals("Doe", retrievedDoctor.getLName());
        assertEquals(Date.valueOf("2020-01-01"), retrievedDoctor.getWorkStart());
    }

    @Test
    void testGetAllDoctors() {
        List<Doctor> doctors = doctorDao.getAllDoctors();
        assertNotNull(doctors, "The returned doctor list should not be null");
    }
}