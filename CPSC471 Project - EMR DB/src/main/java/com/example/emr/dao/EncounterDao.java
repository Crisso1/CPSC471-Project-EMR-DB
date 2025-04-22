package com.example.emr.dao;

import com.example.emr.model.Encounter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Repository
public class EncounterDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /** Inserts a new encounter */
    public int addEncounter(Encounter e) {
        String sql = """
            INSERT INTO encounter
              (patient_id, doctor_ssn, visit_date, visit_time,
               visit_type, chief_complaint, diagnosis,
               treatment_plan, notes, follow_up_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                e.getPatientId(),
                e.getDoctorSsn(),
                Date.valueOf(e.getVisitDate()),
                e.getVisitTime() != null ? Time.valueOf(e.getVisitTime()) : null,
                e.getVisitType(),
                e.getChiefComplaint(),
                e.getDiagnosis(),
                e.getTreatmentPlan(),
                e.getNotes(),
                e.getFollowUpDate() != null ? Date.valueOf(e.getFollowUpDate()) : null
        );
    }

    /** Retrieve one encounter by its ID */
    public Encounter getEncounterById(long id) {
        String sql = "SELECT * FROM encounter WHERE encounter.encounter_id = ?";
        List<Encounter> list = jdbcTemplate.query(sql, new Object[]{id}, (rs, rn) -> {
            Encounter en = new Encounter();
            en.setEncounterId(rs.getLong("encounter_id"));
            en.setPatientId(rs.getLong("patient_id"));
            en.setDoctorSsn(rs.getInt("doctor_ssn"));
            en.setVisitDate(rs.getDate("visit_date").toLocalDate());
            Time t = rs.getTime("visit_time");
            en.setVisitTime(t != null ? t.toLocalTime() : null);
            en.setVisitType(rs.getString("visit_type"));
            en.setChiefComplaint(rs.getString("chief_complaint"));
            en.setDiagnosis(rs.getString("diagnosis"));
            en.setTreatmentPlan(rs.getString("treatment_plan"));
            en.setNotes(rs.getString("notes"));
            Date fu = rs.getDate("follow_up_date");
            en.setFollowUpDate(fu != null ? fu.toLocalDate() : null);
            return en;
        });
        return list.isEmpty() ? null : list.get(0);
    }

    /** Retrieve all encounters for a given patient */
    public List<Encounter> getEncountersByPatientId(long patientId) {
        String sql = "SELECT * FROM encounter WHERE patient_id = ?";
        return jdbcTemplate.query(sql, new Object[]{patientId}, (rs, rn) -> {
            Encounter en = new Encounter();
            en.setEncounterId(rs.getLong("encounter_id"));
            en.setPatientId(rs.getLong("patient_id"));
            en.setDoctorSsn(rs.getInt("doctor_ssn"));
            en.setVisitDate(rs.getDate("visit_date").toLocalDate());
            Time t = rs.getTime("visit_time");
            en.setVisitTime(t != null ? t.toLocalTime() : null);
            en.setVisitType(rs.getString("visit_type"));
            en.setChiefComplaint(rs.getString("chief_complaint"));
            en.setDiagnosis(rs.getString("diagnosis"));
            en.setTreatmentPlan(rs.getString("treatment_plan"));
            en.setNotes(rs.getString("notes"));
            Date fu = rs.getDate("follow_up_date");
            en.setFollowUpDate(fu != null ? fu.toLocalDate() : null);
            return en;
        });
    }

    /** Retrieve all encounters in the system */
    public List<Encounter> getAllEncounters() {
        String sql = "SELECT * FROM encounter";
        return jdbcTemplate.query(sql, (rs, rn) -> {
            Encounter en = new Encounter();
            en.setEncounterId(rs.getLong("encounter_id"));
            en.setPatientId(rs.getLong("patient_id"));
            en.setDoctorSsn(rs.getInt("doctor_ssn"));
            en.setVisitDate(rs.getDate("visit_date").toLocalDate());
            Time t = rs.getTime("visit_time");
            en.setVisitTime(t != null ? t.toLocalTime() : null);
            en.setVisitType(rs.getString("visit_type"));
            en.setChiefComplaint(rs.getString("chief_complaint"));
            en.setDiagnosis(rs.getString("diagnosis"));
            en.setTreatmentPlan(rs.getString("treatment_plan"));
            en.setNotes(rs.getString("notes"));
            Date fu = rs.getDate("follow_up_date");
            en.setFollowUpDate(fu != null ? fu.toLocalDate() : null);
            return en;
        });
    }
}