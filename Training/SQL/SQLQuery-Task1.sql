CREATE DATABASE Company;
GO 

USE Company;
GO


CREATE TABLE Company (
    company_id INT IDENTITY PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Users (
    user_id INT IDENTITY PRIMARY KEY,
    company_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,

    CONSTRAINT FK_Users_Company
        FOREIGN KEY (company_id)
        REFERENCES Company(company_id)
);


CREATE TABLE Marketing (
    marketing_id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    campaign_name VARCHAR(100) NOT NULL,

    CONSTRAINT FK_Marketing_Users
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
);


CREATE TABLE Personal (
    personal_id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    personal_email VARCHAR(100) NOT NULL UNIQUE,

    CONSTRAINT FK_Personal_Users
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
);


CREATE TABLE Devices (
    device_id INT IDENTITY PRIMARY KEY,
    company_id INT NOT NULL,
    device_name VARCHAR(100) NOT NULL,

    CONSTRAINT FK_Devices_Company
        FOREIGN KEY (company_id)
        REFERENCES Company(company_id)
);


CREATE TABLE Applications (
    application_id INT IDENTITY PRIMARY KEY,
    company_id INT NOT NULL,
    application_name VARCHAR(100) NOT NULL,

    CONSTRAINT FK_Applications_Company
        FOREIGN KEY (company_id)
        REFERENCES Company(company_id)
);


INSERT INTO Company (company_name)
VALUES ('TechCorp');

INSERT INTO Users (company_id, user_name)
VALUES (1, 'Maya'), (1, 'Virat');

INSERT INTO Marketing (user_id, campaign_name)
VALUES (1, 'SEO Campaign'), (2, 'Email Marketing');

INSERT INTO Personal (user_id, personal_email)
VALUES (1, 'maya@gmail.com'), (2, 'virat@gmail.com');

INSERT INTO Devices (company_id, device_name)
VALUES (1, 'Laptop'), (1, 'PC');

INSERT INTO Applications (company_id, application_name)
VALUES (1, 'MySQL'), (1, 'Chrome');


SELECT * FROM Company;
SELECT * FROM Users;
SELECT * FROM Marketing;
SELECT * FROM Personal;
SELECT * FROM Devices;
SELECT * FROM Applications;


