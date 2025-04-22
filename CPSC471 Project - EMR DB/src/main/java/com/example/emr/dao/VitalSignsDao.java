// src/main/java/com/example/emr/dao/VitalSignsDao.java
package com.example.emr.dao;

import com.example.emr.model.VitalSigns;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class VitalSignsDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /** Inserts a new vital signs record */
    public int addVitalSigns(VitalSigns v) {
        String sql = """
    INSERT INTO vitalsigns
      (encounter_id, measured_at, temperature, blood_pressure,
       heart_rate, respiratory_rate, weight, height,
       oxygen_saturation, blood_glucose)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""";

        return jdbcTemplate.update(sql,
                v.getEncounterId(),
                Timestamp.valueOf(v.getMeasuredAt()),
                v.getTemperature(),
                v.getBloodPressure(),
                v.getHeartRate(),
                v.getRespiratoryRate(),
                v.getWeight(),
                v.getHeight(),
                v.getOxygenSaturation(),
                v.getBloodGlucose()
        );
    }

    /** Retrieves all vital signs for a given encounter */
    public List<VitalSigns> getByEncounter(int encounterId) {
        String sql = "SELECT * FROM VitalSigns WHERE encounter_id = ?";
        return jdbcTemplate.query(sql, new Object[]{encounterId}, (rs, rn) -> {
            VitalSigns v = new VitalSigns();
            v.setEncounterId(rs.getInt("encounter_id"));
            v.setMeasuredAt(rs.getTimestamp("measured_at").toLocalDateTime());
            v.setTemperature(rs.getDouble("temperature"));
            v.setBloodPressure(rs.getString("blood_pressure"));
            v.setHeartRate(rs.getInt("heart_rate"));
            v.setRespiratoryRate(rs.getInt("respiratory_rate"));
            v.setWeight(rs.getDouble("weight"));
            v.setHeight(rs.getDouble("height"));
            v.setOxygenSaturation(rs.getInt("oxygen_saturation"));
            v.setBloodGlucose(rs.getDouble("blood_glucose"));
            return v;
        });
    }

    /** Retrieves all vital signs entries */
    public List<VitalSigns> getAll() {
        String sql = "SELECT * FROM VitalSigns";
        return jdbcTemplate.query(sql, (rs, rn) -> {
            VitalSigns v = new VitalSigns();
            v.setEncounterId(rs.getInt("encounter_id"));
            v.setMeasuredAt(rs.getTimestamp("measured_at").toLocalDateTime());
            v.setTemperature(rs.getDouble("temperature"));
            v.setBloodPressure(rs.getString("blood_pressure"));
            v.setHeartRate(rs.getInt("heart_rate"));
            v.setRespiratoryRate(rs.getInt("respiratory_rate"));
            v.setWeight(rs.getDouble("weight"));
            v.setHeight(rs.getDouble("height"));
            v.setOxygenSaturation(rs.getInt("oxygen_saturation"));
            v.setBloodGlucose(rs.getDouble("blood_glucose"));
            return v;
        });
    }
}