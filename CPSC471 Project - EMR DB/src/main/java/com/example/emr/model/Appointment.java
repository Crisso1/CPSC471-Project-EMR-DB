package com.example.emr.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;

public class Appointment {
    private int doctorSsn;
    private int patientId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime time;

    public Appointment() {}

    public Appointment(int doctorSsn, int patientId, LocalDate date, LocalTime time) {
        this.doctorSsn = doctorSsn;
        this.patientId = patientId;
        this.date = date;
        this.time = time;
    }

    public int getDoctorSsn() { return doctorSsn; }
    public void setDoctorSsn(int doctorSsn) { this.doctorSsn = doctorSsn; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
}