package com.example.emr.dao;

import com.example.emr.model.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Repository
public class AppointmentDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int addAppointment(Appointment a) {
        String sql = """
            INSERT INTO Appointment (DoctorSsn, Patientid, Date, Time)
            VALUES (?, ?, ?, ?)
        """;

        return jdbcTemplate.update(sql,
                a.getDoctorSsn(),
                a.getPatientId(),
                Date.valueOf(a.getDate()),
                Time.valueOf(a.getTime()));
    }

    public List<Appointment> getAppointmentsByPatient(int patientId) {
        String sql = "SELECT * FROM Appointment WHERE Patientid = ? ORDER BY Date, Time";
        return jdbcTemplate.query(sql, new Object[]{patientId}, (rs, rn) -> {
            Appointment a = new Appointment();
            a.setDoctorSsn(rs.getInt("DoctorSsn"));
            a.setPatientId(rs.getInt("Patientid"));
            a.setDate(rs.getDate("Date").toLocalDate());
            a.setTime(rs.getTime("Time").toLocalTime());
            return a;
        });
    }

    public List<Appointment> getAppointmentsByDoctor(int doctorSsn) {
        String sql = "SELECT * FROM Appointment WHERE DoctorSsn = ? ORDER BY Date, Time";
        return jdbcTemplate.query(sql, new Object[]{doctorSsn}, (rs, rn) -> {
            Appointment a = new Appointment();
            a.setDoctorSsn(rs.getInt("DoctorSsn"));
            a.setPatientId(rs.getInt("Patientid"));
            a.setDate(rs.getDate("Date").toLocalDate());
            a.setTime(rs.getTime("Time").toLocalTime());
            return a;
        });
    }

    public List<Appointment> getAllAppointments() {
        String sql = "SELECT * FROM Appointment ORDER BY Date, Time";
        return jdbcTemplate.query(sql, (rs, rn) -> {
            Appointment a = new Appointment();
            a.setDoctorSsn(rs.getInt("DoctorSsn"));
            a.setPatientId(rs.getInt("Patientid"));
            a.setDate(rs.getDate("Date").toLocalDate());
            a.setTime(rs.getTime("Time").toLocalTime());
            return a;
        });
    }
}