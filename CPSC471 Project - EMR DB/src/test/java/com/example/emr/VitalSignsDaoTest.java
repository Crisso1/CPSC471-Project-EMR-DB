// src/test/java/com/example/emr/dao/VitalSignsDaoTest.java
package com.example.emr.dao;

import com.example.emr.model.VitalSigns;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional  // roll back after each test
public class VitalSignsDaoTest {

    @Autowired
    private VitalSignsDao vitalSignsDao;

    private VitalSigns sampleVital() {
        VitalSigns v = new VitalSigns();
        v.setEncounterId(1);
        v.setMeasuredAt(LocalDateTime.of(2025, 4, 17, 9, 0));
        v.setTemperature(37.2);
        v.setBloodPressure("120/80");
        v.setHeartRate(72);
        v.setRespiratoryRate(16);
        return v;
    }

    @Test
    void testAddAndGetByEncounter() {
        // Insert the record
        int rows = vitalSignsDao.addVitalSigns(sampleVital());
        assertEquals(1, rows, "Expected one row to be inserted");

        // Retrieve by encounter
        List<VitalSigns> list = vitalSignsDao.getByEncounter(1);
        assertFalse(list.isEmpty(), "Should find at least one vital-signs record");

        VitalSigns inserted = list.get(0);
        assertEquals(1, inserted.getEncounterId());
        assertEquals(37.2, inserted.getTemperature());
        assertEquals("120/80", inserted.getBloodPressure());
        assertEquals(72, inserted.getHeartRate());
        assertEquals(16, inserted.getRespiratoryRate());
        assertEquals(sampleVital().getMeasuredAt(), inserted.getMeasuredAt());
    }

    @Test
    void testGetAll() {
        // Insert one sample record
        vitalSignsDao.addVitalSigns(sampleVital());

        // Should return a non-null, non-empty list
        List<VitalSigns> all = vitalSignsDao.getAll();
        assertNotNull(all, "The list of all vital-signs entries should not be null");
        assertTrue(all.size() >= 1, "There should be at least one entry in the database");
    }
}