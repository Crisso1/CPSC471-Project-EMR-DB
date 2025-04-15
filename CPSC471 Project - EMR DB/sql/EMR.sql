-- Create the Doctor table
CREATE TABLE Doctor (
                        Ssn INT NOT NULL,
                        FName VARCHAR(15) NOT NULL,
                        LName VARCHAR(15) NOT NULL,
                        WorkStart DATE,
                        PRIMARY KEY (Ssn)
);

-- Create the Certifications table
CREATE TABLE Certifications (
                                DoctorSsn INT NOT NULL,
                                Certification VARCHAR(30) NOT NULL,
                                PRIMARY KEY (DoctorSsn, Certification),
                                FOREIGN KEY (DoctorSsn) REFERENCES Doctor(Ssn)
);

-- Create the Patient table
CREATE TABLE Patient (
                         Ssn INT NOT NULL,
                         FName VARCHAR(15) NOT NULL,
                         LName VARCHAR(15) NOT NULL,
                         Age INT,
                         Weight_kg DECIMAL(5,2),
                         Height_cm DECIMAL(5,2),
                         PRIMARY KEY (Ssn)
);

-- Create the MedicalRecord table
CREATE TABLE MedicalRecord (
                               PatientSsn INT NOT NULL,
                               ProcedureCondition VARCHAR(30) NOT NULL,
                               Date DATE,
                               FOREIGN KEY (PatientSsn) REFERENCES Patient(Ssn)
);

-- Create the Appointment table
CREATE TABLE Appointment (
                             DoctorSsn INT NOT NULL,
                             PatientSsn INT NOT NULL,
                             Date DATE NOT NULL,
                             Time TIME NOT NULL,
                             FOREIGN KEY (DoctorSsn) REFERENCES Doctor(ssn),
                             FOREIGN KEY (PatientSsn) REFERENCES Patient(ssn)
);

-- Create the Medication table
CREATE TABLE Medication (
                            DrugName VARCHAR(15) NOT NULL,
                            ChemicalName VARCHAR(30) NOT NULL,
                            PRIMARY KEY (DrugName),
                            UNIQUE (ChemicalName)
);

-- Create the AvailableDosage table
CREATE TABLE AvailableDosage (
                                 DrugName VARCHAR(15) NOT NULL,
                                 Dosage INT NOT NULL,
                                 PRIMARY KEY (DrugName, Dosage),
                                 FOREIGN KEY (DrugName) REFERENCES Medication(DrugName)
);

-- Create the Prescription table
CREATE TABLE Prescription (
                              PatientSsn INT NOT NULL,
                              DoctorSsn INT NOT NULL,
                              PrescriptionNum INT NOT NULL,
                              DateGiven DATE,
                              PRIMARY KEY (PrescriptionNum),
                              FOREIGN KEY (PatientSsn) REFERENCES Patient(Ssn),
                              FOREIGN KEY (DoctorSsn) REFERENCES Doctor(Ssn)
);

-- Create the Prescribes table
CREATE TABLE Prescribes (
                            Amount INT NOT NULL,
                            Frequency VARCHAR(30) NOT NULL,
                            Dosage_mg INT NOT NULL,
                            PrescriptionNum INT NOT NULL,
                            Medication VARCHAR(15) NOT NULL,
                            PRIMARY KEY (PrescriptionNum, Medication),
                            FOREIGN KEY (PrescriptionNum) REFERENCES Prescription(PrescriptionNum),
                            FOREIGN KEY (Medication) REFERENCES Medication(DrugName)
);