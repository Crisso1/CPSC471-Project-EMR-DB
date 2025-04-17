// src/main/java/com/example/emr/model/VitalSigns.java
package com.example.emr.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class VitalSigns {
    private int encounterId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime measuredAt;

    private Double temperature;    // e.g., 37.2
    private String bloodPressure;  // e.g., "120/80"
    private Integer heartRate;     // bpm
    private Integer respiratoryRate; // breaths per minute

    public VitalSigns() { }

    public int getEncounterId() { return encounterId; }
    public void setEncounterId(int encounterId) { this.encounterId = encounterId; }

    public LocalDateTime getMeasuredAt() { return measuredAt; }
    public void setMeasuredAt(LocalDateTime measuredAt) { this.measuredAt = measuredAt; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public Integer getRespiratoryRate() { return respiratoryRate; }
    public void setRespiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; }
}