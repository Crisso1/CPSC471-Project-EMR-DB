// src/main/java/com/example/emr/dao/AllergyDao.java
package com.example.emr.dao;

import com.example.emr.model.Allergies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class AllergiesDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /** Inserts a new allergy record */
    public int addAllergy(Allergies a) {
        String sql = """
            INSERT INTO Allergy
              (patient_ssn, allergen, reaction, severity)
            VALUES (?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                a.getPatientSsn(),
                a.getAllergen(),
                a.getReaction(),
                a.getSeverity()
        );
    }

    /** Retrieves all allergies for a given patient */
    public List<Allergies> getAllergiesByPatient(int patientSsn) {
        String sql = "SELECT * FROM Allergy WHERE patient_ssn = ?";
        return jdbcTemplate.query(sql, new Object[]{patientSsn}, (rs, rn) -> {
            Allergies a = new Allergies();
            a.setPatientSsn(rs.getInt("patient_ssn"));
            a.setAllergen(rs.getString("allergen"));
            a.setReaction(rs.getString("reaction"));
            a.setSeverity(rs.getString("severity"));
            return a;
        });
    }

    /** Retrieves all allergies in the system */
    public List<Allergies> getAllAllergies() {
        String sql = "SELECT * FROM Allergy";
        return jdbcTemplate.query(sql, (rs, rn) -> {
            Allergies a = new Allergies();
            a.setPatientSsn(rs.getInt("patient_ssn"));
            a.setAllergen(rs.getString("allergen"));
            a.setReaction(rs.getString("reaction"));
            a.setSeverity(rs.getString("severity"));
            return a;
        });
    }
}