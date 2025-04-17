package com.example.emr.model;

public class Allergies {
    private int patientSsn;
    private String allergen;
    private String reaction;
    private String severity;

    public Allergies() {
    }

    public int getPatientSsn() {
        return patientSsn;
    }
    public void setPatientSsn(int patientSsn) {
        this.patientSsn = patientSsn;
    }

    public String getAllergen() {
        return allergen;
    }
    public void setAllergen(String allergen) {
        this.allergen = allergen;
    }

    public String getReaction() {
        return reaction;
    }
    public void setReaction(String reaction) {
        this.reaction = reaction;
    }

    public String getSeverity() {
        return severity;
    }
    public void setSeverity(String severity) {
        this.severity = severity;
    }
}
