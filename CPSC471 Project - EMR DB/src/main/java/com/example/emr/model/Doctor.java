package com.example.emr.model;

import java.util.Date;

public class Doctor {
    private int ssn;
    private String fName;
    private String lName;
    private Date workStart;

    // Default constructor
    public Doctor() {
    }

    // Parameterized constructor
    public Doctor(int ssn, String fName, String lName, Date workStart) {
        this.ssn = ssn;
        this.fName = fName;
        this.lName = lName;
        this.workStart = workStart;
    }

    // Getters and Setters
    public int getSsn() {
        return ssn;
    }
    public void setSsn(int ssn) {
        this.ssn = ssn;
    }

    public String getFName() {
        return fName;
    }
    public void setFName(String fName) {
        this.fName = fName;
    }

    public String getLName() {
        return lName;
    }
    public void setLName(String lName) {
        this.lName = lName;
    }

    public Date getWorkStart() {
        return workStart;
    }
    public void setWorkStart(Date workStart) {
        this.workStart = workStart;
    }
}
