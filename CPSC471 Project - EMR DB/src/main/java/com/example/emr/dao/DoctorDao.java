package com.example.emr.dao;

import com.example.emr.model.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DoctorDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Inserts a new Doctor record into the Doctor table.
     *
     * @param doctor the Doctor object to add
     * @return number of rows affected (should be 1 if successful)
     */
    public int addDoctor(Doctor doctor) {
        String sql = "INSERT INTO Doctor (Ssn, FName, LName, WorkStart) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                doctor.getSsn(),
                doctor.getFName(),
                doctor.getLName(),
                doctor.getWorkStart());
    }

    /**
     * Retrieves a Doctor record by SSN.
     *
     * @param ssn the SSN of the Doctor to find
     * @return a Doctor object if found; otherwise, null
     */
    public Doctor getDoctorBySsn(int ssn) {
        String sql = "SELECT * FROM Doctor WHERE Ssn = ?";
        List<Doctor> doctors = jdbcTemplate.query(
                sql,
                new Object[]{ssn},
                (rs, rowNum) -> {
                    Doctor doctor = new Doctor();
                    doctor.setSsn(rs.getInt("Ssn"));
                    doctor.setFName(rs.getString("FName"));
                    doctor.setLName(rs.getString("LName"));
                    doctor.setWorkStart(rs.getDate("WorkStart"));
                    return doctor;
                }
        );
        return doctors.isEmpty() ? null : doctors.get(0);
    }

    /**
     * Retrieves all Doctor records from the database.
     *
     * @return a list of Doctor objects
     */
    public List<Doctor> getAllDoctors() {
        String sql = "SELECT * FROM Doctor";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Doctor doctor = new Doctor();
            doctor.setSsn(rs.getInt("Ssn"));
            doctor.setFName(rs.getString("FName"));
            doctor.setLName(rs.getString("LName"));
            doctor.setWorkStart(rs.getDate("WorkStart"));
            return doctor;
        });
    }
}
