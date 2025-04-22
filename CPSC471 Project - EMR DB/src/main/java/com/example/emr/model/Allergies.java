package com.example.emr.model;

public class Allergies {
    private Long patientId;
    private String allergen;
    private String reaction;
    private String severity;

    public Allergies() {
    }

    public Allergies(Long patientId, String allergen, String reaction, String severity) {
        this.patientId = patientId;
        this.allergen = allergen;
        this.reaction = reaction;
        this.severity = severity;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
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