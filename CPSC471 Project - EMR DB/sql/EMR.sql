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

-- Create the Users table for authentication
CREATE TABLE Users (
                       user_id SERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       password VARCHAR(100) NOT NULL
);

-- 1. Encounters (expanded MedicalRecord)
CREATE TABLE Encounter (
                           encounter_id    SERIAL      PRIMARY KEY,
                           patient_ssn     INT         NOT NULL,
                           doctor_ssn      INT         NOT NULL,
                           visit_date      DATE        NOT NULL,
                           visit_time      TIME,
                           visit_type      VARCHAR(50),               -- e.g., "Routine", "Follow‑up", "Emergency"
                           chief_complaint VARCHAR(255),              -- patient’s presenting problem
                           diagnosis       VARCHAR(255),              -- final diagnosis
                           treatment_plan  TEXT,                      -- what was done / prescribed
                           notes           TEXT,                      -- free‑text for any extra details
                           follow_up_date  DATE,                      -- recommended next visit
                           FOREIGN KEY (patient_ssn) REFERENCES Patient(Ssn),
                           FOREIGN KEY (doctor_ssn)  REFERENCES Doctor(Ssn)
);

-- 2. Allergies
CREATE TABLE Allergy (
                         patient_ssn INT         NOT NULL,
                         allergen    VARCHAR(100) NOT NULL,         -- e.g., "Penicillin", "Peanuts"
                         reaction    VARCHAR(255),                  -- e.g., "Hives", "Anaphylaxis"
                         severity    VARCHAR(50),                   -- e.g., "Mild", "Severe"
                         PRIMARY KEY (patient_ssn, allergen),
                         FOREIGN KEY (patient_ssn) REFERENCES Patient(Ssn)
);

-- 3. Medication List
CREATE TABLE MedicationList (
                                patient_ssn     INT         NOT NULL,
                                medication_name VARCHAR(100) NOT NULL,     -- name of the drug
                                dosage          VARCHAR(50),                -- e.g., "5 mg"
                                frequency       VARCHAR(50),                -- e.g., "Once daily"
                                start_date      DATE,
                                end_date        DATE,
                                PRIMARY KEY (patient_ssn, medication_name),
                                FOREIGN KEY (patient_ssn) REFERENCES Patient(Ssn)
);

-- 4. Vital Signs (per Encounter)
CREATE TABLE VitalSigns (
                            encounter_id     INT         NOT NULL,
                            measured_at      TIMESTAMP   NOT NULL,
                            temperature      DECIMAL(4,1),  -- e.g., 37.2
                            blood_pressure   VARCHAR(7),    -- e.g., "120/80"
                            heart_rate       INT,           -- bpm
                            respiratory_rate INT,           -- breaths per minute
                            PRIMARY KEY (encounter_id, measured_at),
                            FOREIGN KEY (encounter_id) REFERENCES Encounter(encounter_id)
);