package com.example.emr.dao;

import com.example.emr.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class PatientDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Inserts a new patient record into the Patient table.
     * Returns the number of rows affected.
     */
    public int addPatient(Patient patient) {
        String sql = "INSERT INTO Patient (ssn, FName, LName, Age, Weight_kg, Height_cm) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                patient.getSsn(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getAge(),
                patient.getWeightKg(),
                patient.getHeightCm()
        );
    }

    /**
     * Retrieves all patient records.
     */
    public List<Patient> getAllPatients() {
        String sql = "SELECT * FROM Patient";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Patient patient = new Patient();
            patient.setSsn(rs.getInt("Ssn"));
            patient.setFirstName(rs.getString("FName"));
            patient.setLastName(rs.getString("LName"));
            patient.setAge(rs.getInt("Age"));
            patient.setWeightKg(rs.getDouble("Weight_kg"));
            patient.setHeightCm(rs.getDouble("Height_cm"));
            return patient;
        });
    }
}
