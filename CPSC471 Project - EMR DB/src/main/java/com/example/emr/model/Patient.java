package com.example.emr.model;

public class Patient {
    private int ssn;
    private String firstName;
    private String lastName;
    private int age;
    private double weightKg;
    private double heightCm;

    // Default constructor
    public Patient() {}

    // Getters and Setters
    public int getSsn() {
        return ssn;
    }
    public void setSsn(int ssn) {
        this.ssn = ssn;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public double getWeightKg() {
        return weightKg;
    }
    public void setWeightKg(double weightKg) {
        this.weightKg = weightKg;
    }
    public double getHeightCm() {
        return heightCm;
    }
    public void setHeightCm(double heightCm) {
        this.heightCm = heightCm;
    }
}
