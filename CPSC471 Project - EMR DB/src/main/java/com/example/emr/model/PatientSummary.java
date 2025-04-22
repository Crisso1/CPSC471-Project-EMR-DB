package com.example.emr.dto;

import com.example.emr.model.Patient;
import com.example.emr.model.VitalSigns;
import com.example.emr.model.Allergies;
import com.example.emr.model.Encounter;

import java.util.List;

public class PatientSummary {
    private Patient patient;
    private List<VitalSigns> vitalSigns;
    private List<Allergies> allergies;
    private List<Encounter> encounters;

    // Constructors
    public PatientSummary() {}

    public PatientSummary(Patient patient, List<VitalSigns> vitalSigns, List<Allergies> allergies, List<Encounter> encounters) {
        this.patient = patient;
        this.vitalSigns = vitalSigns;
        this.allergies = allergies;
        this.encounters = encounters;
    }

    // Getters and Setters
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public List<VitalSigns> getVitalSigns() { return vitalSigns; }
    public void setVitalSigns(List<VitalSigns> vitalSigns) { this.vitalSigns = vitalSigns; }

    public List<Allergies> getAllergies() { return allergies; }
    public void setAllergies(List<Allergies> allergies) { this.allergies = allergies; }

    public List<Encounter> getEncounters() { return encounters; }
    public void setEncounters(List<Encounter> encounters) { this.encounters = encounters; }
}