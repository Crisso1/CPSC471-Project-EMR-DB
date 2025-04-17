// src/test/java/com/example/emr/dao/AllergyDaoTest.java
package com.example.emr.dao;

import com.example.emr.model.Allergies;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional  // roll back after each test
public class AllergiesDaoTest {

    @Autowired
    private AllergiesDao allergiesDao;

    private Allergies sampleAllergy() {
        Allergies a = new Allergies();
        a.setPatientSsn(111222333);
        a.setAllergen("Peanuts");
        a.setReaction("Hives");
        a.setSeverity("Severe");
        return a;
    }

    @Test
    void testAddAndGetAllergy() {
        // Insert the allergy
        int rows = allergiesDao.addAllergy(sampleAllergy());
        assertEquals(1, rows, "Expected one row to be inserted");

        // Retrieve by patient SSN
        List<Allergies> list = allergiesDao.getAllergiesByPatient(111222333);
        assertFalse(list.isEmpty(), "Should find at least one allergy for the patient");

        Allergies inserted = list.get(0);
        assertEquals(111222333, inserted.getPatientSsn());
        assertEquals("Peanuts", inserted.getAllergen());
        assertEquals("Hives", inserted.getReaction());
        assertEquals("Severe", inserted.getSeverity());
    }

    @Test
    void testGetAllAllergies() {
        // Insert one sample allergy
        allergiesDao.addAllergy(sampleAllergy());

        // Should return a non-null, non-empty list
        List<Allergies> all = allergiesDao.getAllAllergies();
        assertNotNull(all, "The list of all allergies should not be null");
        assertTrue(all.size() >= 1, "There should be at least one allergy in the database");
    }
}