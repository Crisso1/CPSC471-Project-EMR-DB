package com.example.emr.dao;

import com.example.emr.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public class PatientDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private EncounterDao encounterDao;

    public Patient addPatient(Patient patient) {
        String sql = "INSERT INTO patients (fname, lname, dob, address, contact) VALUES (?, ?, ?, ?, ?) RETURNING *";
        return jdbcTemplate.queryForObject(sql, new Object[] {
                patient.getFname(),
                patient.getLname(),
                Date.valueOf(patient.getDob()),
                patient.getAddress(),
                patient.getContact()
        }, (rs, rowNum) -> {
            Patient p = new Patient();
            p.setId(rs.getLong("id"));
            p.setFname(rs.getString("fname"));
            p.setLname(rs.getString("lname"));
            p.setDob(rs.getDate("dob").toLocalDate());
            p.setAddress(rs.getString("address"));
            p.setContact(rs.getString("contact"));
            return p;
        });
    }

    public int deletePatientById(long id) {
        // Delete all encounters related to the patient first
        encounterDao.deleteEncountersByPatientId(id);

        // Now delete the patient
        String sql = "DELETE FROM patients WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }


    public Patient getPatientById(long id) {
        String sql = "SELECT * FROM patients WHERE id = ?";
        List<Patient> list = jdbcTemplate.query(sql, new Object[]{id}, (rs, rowNum) -> {
            Patient patient = new Patient();
            patient.setId(rs.getLong("id"));
            patient.setFname(rs.getString("fname"));
            patient.setLname(rs.getString("lname"));
            patient.setDob(rs.getDate("dob").toLocalDate());
            patient.setAddress(rs.getString("address"));
            patient.setContact(rs.getString("contact"));
            return patient;
        });
        return list.isEmpty() ? null : list.get(0);
    }

    public List<Patient> getAllPatients() {
        String sql = "SELECT * FROM patients";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Patient patient = new Patient();
            patient.setId(rs.getLong("id"));
            patient.setFname(rs.getString("fname"));
            patient.setLname(rs.getString("lname"));
            patient.setDob(rs.getDate("dob").toLocalDate());
            patient.setAddress(rs.getString("address"));
            patient.setContact(rs.getString("contact"));
            return patient;
        });
    }

    public int updatePatient(Patient patient) {
        String sql = "UPDATE patients SET fname = ?, lname = ?, dob = ?, address = ?, contact = ? WHERE id = ?";
        return jdbcTemplate.update(
                sql,
                patient.getFname(),
                patient.getLname(),
                Date.valueOf(patient.getDob()),
                patient.getAddress(),
                patient.getContact(),
                patient.getId()
        );
    }
}