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
     * Deletes a patient from the database by SSN.
     * Returns the number of rows affected (should be 1 if successful, 0 if no patient found).
     */
    public int deletePatientBySsn(int ssn) {
        String sql = "DELETE FROM Patient WHERE Ssn = ?";
        return jdbcTemplate.update(sql, ssn);
    }

    /**
     * Retrieves a patient by SSN.
     * Returns the Patient object if found, otherwise null.
     */
    public Patient getPatientBySsn(int ssn) {
        String sql = "SELECT * FROM Patient WHERE Ssn = ?";
        List<Patient> list = jdbcTemplate.query(
                sql,
                new Object[]{ ssn },
                (rs, rowNum) -> {
                    Patient patient = new Patient();
                    patient.setSsn(rs.getInt("Ssn"));
                    patient.setFirstName(rs.getString("FName"));
                    patient.setLastName(rs.getString("LName"));
                    patient.setAge(rs.getInt("Age"));
                    patient.setWeightKg(rs.getDouble("Weight_kg"));
                    patient.setHeightCm(rs.getDouble("Height_cm"));
                    return patient;
                }
        );
        return list.isEmpty() ? null : list.get(0);
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
