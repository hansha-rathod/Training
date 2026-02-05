CREATE DATABASE AssetManagement;
GO

USE AssetManagement;
GO

CREATE TABLE Employees(
	employee_id INT IDENTITY PRIMARY KEY,
	employee_name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	department VARCHAR(50) NOT NULL,
	created_at DATETIME DEFAULT GETDATE()
);


CREATE TABLE Devices (
	device_id INT IDENTITY PRIMARY KEY,
	device_name VARCHAR(50) NOT NULL,
	serial_number VARCHAR(50) UNIQUE NOT NULL,
	status VARCHAR(20) CHECK (status IN ('Available', 'Assigned', 'Repair')),
	created_at DATETIME DEFAULT GETDATE()
);


CREATE TABLE Applications (
    application_id INT IDENTITY PRIMARY KEY,
    application_name VARCHAR(100) NOT NULL,
    license_key VARCHAR(50) UNIQUE NOT NULL,
    expiry_date DATE NOT NULL
);


INSERT INTO Employees (employee_name, email, department)
VALUES ('Maya Rathod', 'maya@satvasolutions.com', 'IT'), ('Virat Kohli', 'virat@satvasolutions.com', 'HR');


INSERT INTO Devices (device_name, serial_number, status)
VALUES ('Laptop', 'ABC12345', 'Available'), ('Mobile', 'RCB54321', 'Assigned');

INSERT INTO Applications (application_name, license_key, expiry_date)
VALUES ('MS Office', 'OFF-2026-XYZ', '2026-12-31');


SELECT * FROM Devices 
WHERE status = 'Available';


SELECT application_name, expiry_date
FROM Applications
WHERE expiry_date < '2027-05-01';


UPDATE Devices SET status = 'Repair'
WHERE serial_number = 'RCB54321';


DELETE FROM Applications
WHERE application_name = 'MS Office';


SELECT * FROM Employees;


CREATE TABLE EmployeeDevices (
    emp_device_id INT IDENTITY PRIMARY KEY,
    employee_id INT NOT NULL,
    device_id INT NOT NULL,
    assigned_date DATE DEFAULT GETDATE(),

    CONSTRAINT FK_EmployeeDevices_Employee
        FOREIGN KEY (employee_id)
        REFERENCES Employees(employee_id)
        ON DELETE CASCADE,

    CONSTRAINT FK_EmployeeDevices_Device
        FOREIGN KEY (device_id)
        REFERENCES Devices(device_id)
);

INSERT INTO EmployeeDevices (employee_id, device_id)
VALUES (1, 1);

SELECT * FROM EmployeeDevices;




