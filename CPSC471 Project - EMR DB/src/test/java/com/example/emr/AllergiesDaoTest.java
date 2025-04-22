package com.example.emr;

import com.example.emr.dao.AllergiesDao;
import com.example.emr.model.Allergies;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Rolls back DB changes after each test
public class AllergiesDaoTest {

    @Autowired
    private AllergiesDao allergiesDao;

    private Allergies sampleAllergy() {
        Allergies a = new Allergies();
        a.setPatientId(1L); // Assumes patient with ID 1 exists in test DB
        a.setAllergen("Peanuts");
        a.setReaction("Hives");
        a.setSeverity("Severe");
        return a;
    }

    @Test
    void testAddAndGetAllergy() {
        int rows = allergiesDao.addAllergy(sampleAllergy());
        assertEquals(1, rows, "Expected one row to be inserted");

        List<Allergies> list = allergiesDao.getAllergiesByPatientId(1L);
        assertFalse(list.isEmpty(), "Should find at least one allergy for the patient");

        Allergies inserted = list.get(0);
        assertEquals(1L, inserted.getPatientId());
        assertEquals("Peanuts", inserted.getAllergen());
        assertEquals("Hives", inserted.getReaction());
        assertEquals("Severe", inserted.getSeverity());
    }

    @Test
    void testGetAllAllergies() {
        allergiesDao.addAllergy(sampleAllergy());

        List<Allergies> all = allergiesDao.getAllAllergies();
        assertNotNull(all, "The list of all allergies should not be null");
        assertTrue(all.size() >= 1, "There should be at least one allergy in the database");
    }
}