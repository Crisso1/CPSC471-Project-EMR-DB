package com.example.emr.model;

import java.time.LocalDate;

public class Patient {

    private Long id;
    private String fname;
    private String lname;
    private LocalDate dob;
    private String address;
    private String contact;

    // === Constructors ===
    public Patient() {}

    public Patient(Long id, String fname, String lname, LocalDate dob, String address, String contact) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.dob = dob;
        this.address = address;
        this.contact = contact;
    }

    // === Getters and Setters ===
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }
}