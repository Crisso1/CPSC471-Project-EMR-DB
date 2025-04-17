package com.example.emr.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;

public class Encounter {
    private int encounterId;
    private int patientSsn;
    private int doctorSsn;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate visitDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime visitTime;

    private String visitType;        // e.g., "Routine", "Emergency"
    private String chiefComplaint;
    private String diagnosis;
    private String treatmentPlan;
    private String notes;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate followUpDate;

    public Encounter() { }

    // Getters & setters
    public int getEncounterId() { return encounterId; }
    public void setEncounterId(int encounterId) { this.encounterId = encounterId; }

    public int getPatientSsn() { return patientSsn; }
    public void setPatientSsn(int patientSsn) { this.patientSsn = patientSsn; }

    public int getDoctorSsn() { return doctorSsn; }
    public void setDoctorSsn(int doctorSsn) { this.doctorSsn = doctorSsn; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public LocalTime getVisitTime() { return visitTime; }
    public void setVisitTime(LocalTime visitTime) { this.visitTime = visitTime; }

    public String getVisitType() { return visitType; }
    public void setVisitType(String visitType) { this.visitType = visitType; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getTreatmentPlan() { return treatmentPlan; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
}