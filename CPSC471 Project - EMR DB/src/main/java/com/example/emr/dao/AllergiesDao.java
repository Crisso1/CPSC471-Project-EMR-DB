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
            INSERT INTO allergy
              (patient_id, allergen, reaction, severity)
            VALUES (?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                a.getPatientId(),
                a.getAllergen(),
                a.getReaction(),
                a.getSeverity()
        );
    }

    /** Retrieves all allergies for a given patient */
    public List<Allergies> getAllergiesByPatientId(long patientId) {
        String sql = "SELECT * FROM allergy WHERE patient_id = ?";
        return jdbcTemplate.query(sql, new Object[]{patientId}, (rs, rn) -> {
            Allergies a = new Allergies();
            a.setPatientId(rs.getLong("patient_id"));
            a.setAllergen(rs.getString("allergen"));
            a.setReaction(rs.getString("reaction"));
            a.setSeverity(rs.getString("severity"));
            return a;
        });
    }

    /** Retrieves all allergies in the system */
    public List<Allergies> getAllAllergies() {
        String sql = "SELECT * FROM allergy";
        return jdbcTemplate.query(sql, (rs, rn) -> {
            Allergies a = new Allergies();
            a.setPatientId(rs.getLong("patient_id"));
            a.setAllergen(rs.getString("allergen"));
            a.setReaction(rs.getString("reaction"));
            a.setSeverity(rs.getString("severity"));
            return a;
        });
    }
}