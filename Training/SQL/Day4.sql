CREATE DATABASE DAY4DB

USE DAY4DB


--TABLE SCHEMAS STORAGE

CREATE TABLE Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    City VARCHAR(50) NULL,
    Phone VARCHAR(20) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);


CREATE TABLE Product (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Description VARCHAR(MAX) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);


CREATE TABLE [Order] (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    Qty INT NOT NULL CHECK (Qty > 0),
    Rate DECIMAL(10,2) NOT NULL CHECK (Rate >= 0),
    TotalAmount DECIMAL(10,2) NOT NULL CHECK (TotalAmount >= 0),
    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Order_Customer
        FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),

    CONSTRAINT FK_Order_Product
        FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);



CREATE TABLE Payment (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount >= 0),
    PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Payment_Order
        FOREIGN KEY (OrderID) REFERENCES [Order](OrderID)
);
GO
------------------------------------------------------
--dbo types for bulk data insertions
------------------------------------------------------
CREATE TYPE dbo.CustomerType AS TABLE
(
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    City VARCHAR(50),
    Phone VARCHAR(20)
);

GO

CREATE TYPE dbo.ProductType AS TABLE
(
    Name VARCHAR(100),
    Price DECIMAL(10,2),
    Description VARCHAR(MAX)
);

CREATE TYPE dbo.OrderType AS TABLE
(
    
    CustomerID INT,
    ProductID INT,
    OrderDate DATETIME ,
    Qty INT ,
    Rate DECIMAL(10,2),
    TotalAmount DECIMAL(10,2) ,
    CreatedAt DATETIME
    
);

CREATE TYPE dbo.PaymentType AS TABLE 
(
  
    OrderID INT ,
    Amount DECIMAL(10,2) ,
    PaymentDate DATETIME

);
-----------------------------------------------------
-- store procedures for bulk insertions
-----------------------------------------------------

CREATE PROCEDURE sp_BulkInsertCustomers
    @Customers dbo.CustomerType READONLY

AS
BEGIN 
    INSERT INTO Customer (FirstName, LastName, Email,City, Phone)
    SELECT FirstName, LastName, Email,City, Phone
    FROM @Customers;

END;

--BULK INSERTIONS FOR CUSTOMERS

DECLARE @Customers dbo.CustomerType;

INSERT INTO @Customers (FirstName, LastName, Email, City, Phone)
VALUES
('Amit', 'Sharma', 'amit@mail.com', 'Mumbai', '9991112222'),
('Neha', 'Verma', 'neha@mail.com', 'Delhi', '8881112222'),
('Ravi', 'Patel', 'ravi@mail.com', 'Ahmedabad', '7771112222'),
('Priya', 'Singh', 'priya@mail.com', 'Mumbai', '6661112222'),
('Karan', 'Mehta', 'karan@mail.com', 'Delhi', '5551112222');

EXEC sp_BulkInsertCustomers @Customers;

---------------------------------------------------------
---------------------------------------------------------
CREATE PROCEDURE sp_BulkInsertProducts
    @Products dbo.ProductType READONLY

AS
BEGIN
    INSERT INTO Product (Name,Price, Description)
    SELECT Name, Price, Description
    FROM @Products;

END

--BULK INSERTIONS FOR PRODUCTS

DECLARE @Products dbo.ProductType;


INSERT INTO @Products (Name, Price, Description)
VALUES
('Laptop', 60000, 'Electronics'),
('Mobile', 30000, 'Electronics'),
('Headphones', 2000, 'Accessories'),
('Keyboard', 1500, 'Accessories');


EXEC sp_BulkInsertProducts @Products;


---------------------------------------------
---------------------------------------------
CREATE PROCEDURE sp_BulkInsertOrders
    @Orders dbo.OrderType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [Order]
    (
        CustomerID,
        ProductID,
        OrderDate,
        Qty,
        Rate,
        TotalAmount,
        CreatedAt
    )
    SELECT
        CustomerID,
        ProductID,
        OrderDate,
        Qty,
        Rate,
        TotalAmount,
        ISNULL(CreatedAt, GETDATE())
    FROM @Orders;
END;
GO


DECLARE @Orders dbo.OrderType;

INSERT INTO @Orders
(
    CustomerID,
    ProductID,
    OrderDate,
    Qty,
    Rate,
    TotalAmount,
    CreatedAt
)
VALUES
(1, 1, GETDATE(), 1, 60000, 60000, GETDATE()),
(2, 2, GETDATE(), 2, 30000, 60000, GETDATE()),
(3, 3, GETDATE(), 3, 2000, 6000, GETDATE()),
(4, 4, GETDATE(), 2, 1500, 3000, GETDATE());

EXEC sp_BulkInsertOrders @Orders;

------------------------------------------------------
------------------------------------------------------

CREATE PROCEDURE sp_BulkInsertPayments
    @Payments dbo.PaymentType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Payment
    (
        OrderID,
        Amount,
        PaymentDate
    )
    SELECT
        OrderID,
        Amount,
        ISNULL(PaymentDate, GETDATE())
    FROM @Payments;
END;
GO


DECLARE @Payments dbo.PaymentType;

INSERT INTO @Payments
(
    OrderID,
    Amount,
    PaymentDate
)
VALUES
(1, 60000, GETDATE()),
(2, 60000, GETDATE()),
(3, 6000, GETDATE()),
(4, 3000, GETDATE());

EXEC sp_BulkInsertPayments @Payments;

--------------------------------------------------
--QUERY-2 : Write query which give top 10 customers order by city
--------------------------------------------------

SELECT TOP 10 *
FROM Customer
ORDER BY City;

------------------------------------------------------
--3. Write a query which gives the result using the’ Like.’ keyword.
------------------------------------------------------
SELECT * FROM Customer
WHERE Email LIKE '%@mail.com';

-- names starting with A
SELECT *
FROM Customer
WHERE FirstName LIKE 'A%';

----------------------------------------
-- 4. Write a query using ‘In’ Key world on the City column of the Customer table.
----------------------------------------
SELECT * FROM Customer
WHERE City IN ('Delhi','Ahmedabad');

----------------------------------------
-- 5. Use the MERGE statement to update existing product details or insert new products into the products table based on incoming data.
----------------------------------------

SELECT * FROM Product;

DECLARE @NewProducts TABLE(
    Name VARCHAR(100),
    Price DECIMAL(10,2),
    Description VARCHAR(MAX)
);


INSERT INTO @NewProducts (Name, Price, Description)
VALUES
('Laptop', 100000, 'Electronics'),
('Mobile', 20000, 'Electronics'),
('Tablet', 2000, 'Accessories');


MERGE INTO Product AS target
USING @NewProducts AS source
ON target.Name = source.Name

WHEN MATCHED THEN
    UPDATE SET
        target.Price = source.Price,
        target.Description = source.Description

WHEN NOT MATCHED THEN
    INSERT (Name, Price, Description)
    VALUES (source.Name, source.Price, source.Description);



-------------------------------------------------
-- 6. Use the MERGE statement to update existing customer details or insert new customers into the customers table based on incoming data.
-------------------------------------------------
SELECT * FROM Customer;

DECLARE @NewCustomer TABLE (
    CustomerID INT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    Phone VARCHAR(20)
);

INSERT INTO @NewCustomer (CustomerID,FirstName, LastName, Email, Phone)
VALUES 
    (3,'Rajiv', 'Patel', 'rpatel@gmail.com', '1234567890'),
    (7, 'Nisha', 'Mehta', 'nishi@gmail.com' , '9876543210');


MERGE INTO Customer AS target
USING @NewCustomer AS source
ON target.CustomerID = source.CustomerID

    WHEN MATCHED THEN
        UPDATE SET 
            target.FirstName = source.FirstName,
            target.LastName = source.LastName,
            target.Email = source.Email,
            target.Phone = source.Phone

    WHEN NOT MATCHED THEN 
        INSERT (FirstName, LastName, Email, Phone)
        VALUES (source.FirstName, source.LastName, source.Email, source.Phone);



-------------------------------------------------
-- 7. Procedure to Insert a new order into the Orders table and retrieve the generated OrderID. Update the order, Add or Update Payment table accordingly. Make sure to consider partial payment.
-------------------------------------------------
SELECT* FROM [Order];
SELECT * FROM Payment;

CREATE PROCEDURE sp_CreateOrderWithPayment(
    @CustomerID INT,
    @ProductID INT,
    @Qty INT,
    @Rate DECIMAL(10,2),
    @PaymentAmount DECIMAL(10,2)
)
AS 
BEGIN 
    DECLARE @OrderID INT;
    DECLARE @TotalAmount DECIMAL(10,2);

    SET @TotalAmount = @Qty * @Rate;

    --INSERTIONS IN ORDER TABLE
    INSERT INTO [Order] (CustomerID, ProductID, OrderDate, Qty, Rate, TotalAmount)
    VALUES 
         (@CustomerID, @ProductID, GETDATE(),@Qty, @Rate, @TotalAmount);
    SET @OrderID = SCOPE_IDENTITY();

    --INSERTIONS IN PAYMENT TABLE
    INSERT INTO Payment (OrderID, Amount)
    VALUES 
        (@OrderID, @TotalAmount);

END;


EXEC sp_CreateOrderWithPayment 
    @CustomerID = 1,
    @ProductID = 1,
    @Qty = 2,
    @Rate = 60000,
    @PaymentAmount = 110000;

----------------------------------------------------------
-- 8. Implement a stored procedure to delete customers from the Customers table, handling cascading deletes for related orders.
----------------------------------------------------------

SELECT * FROM Customer;
SELECT * FROM [Order];
SELECT * FROM Payment;


CREATE PROCEDURE sp_DeleteCustomer
    @CustomerID INT
AS
BEGIN
    DELETE FROM Payment
    WHERE OrderID IN (SELECT OrderID FROM [Order] WHERE CustomerID = @CustomerID);
  
        
    DELETE FROM [Order]
    WHERE CustomerID = @CustomerID;

    DELETE FROM Customer
    WHERE CustomerID = @CustomerID;

END;
    

EXEC sp_DeleteCustomer 
    @CustomerID = 2;

----------------------------------------------------------------------
--  ADVANCED QUEYING
----------------------------------------------------------------------


----------------------------------------------------------------------
-- 1. Calculate Total Sales Revenue per Product Join the Orders, Payment, and Products tables to calculate the total sales revenue for each product. Display the product name along with the total revenue.
----------------------------------------------------------------------

SELECT * FROM Customer;
SELECT * FROM Product;
SELECT * FROM [Order];
SELECT * FROM Payment;

SELECT 
    p.Name AS ProductName,
    SUM(pay.Amount) AS TotalRevenue

FROM Product p
LEFT JOIN [Order] o ON p.ProductID = o.ProductID
LEFT JOIN Payment pay ON pay.OrderID = o.OrderID

GROUP BY p.Name ;


------------------------------------------------------------------------
-- 2. Identify Customers with High Order Frequency Create a query using CTEs to identify customers who have placed orders more than 5 times in the last six months. Display customer information such as name and email along with their order frequency.
------------------------------------------------------------------------

WITH CustomerOrderFrequency AS
(
    SELECT
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        COUNT(o.OrderID) AS OrderCount
    FROM Customer c
    JOIN [Order] o
        ON c.CustomerID = o.CustomerID
    WHERE o.OrderDate >= DATEADD(MONTH, -6, GETDATE())
    GROUP BY
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email
)
SELECT
    FirstName,
    LastName,
    Email,
    OrderCount
FROM CustomerOrderFrequency
WHERE OrderCount > 5;

--------------------------------------------------------------
-- 3. Calculate Average Order Value per Customer Utilize temporary tables, 
--table variables, or CTEs to calculate the average order value for each customer.
--Orders table to calculate the total amount spent by each customer.
--Divide the total amount by the number of orders placed by each customer to determine the average order value.
--Display customer information along with their average order value.


WITH CustomerOrderSummary AS
(
    SELECT
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        COUNT(o.OrderID) AS TotalOrders,
        ISNULL(SUM(o.TotalAmount), 0) AS TotalSpent
    FROM Customer c
    LEFT JOIN [Order] o
        ON c.CustomerID = o.CustomerID
    GROUP BY
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email
)
SELECT
    FirstName,
    LastName,
    Email,
    TotalOrders,
    TotalSpent,
    TotalSpent / NULLIF(TotalOrders, 0) AS AverageOrderValue
FROM CustomerOrderSummary;


-------------------------------------------------
-- 4. Find Best-Selling Products
--Use temporary tables, table variables, or CTEs to find the top 10 best-selling products based on the total quantity sold.
--Join the Products and Order tables to calculate the total quantity sold for each product.
--Display product information for the best-selling products, including product name and total quantity sold.


WITH ProductSales AS
(
    SELECT
        p.ProductID,
        p.Name AS ProductName,
        SUM(o.Qty) AS TotalQuantitySold
    FROM Product p
    JOIN [Order] o
        ON p.ProductID = o.ProductID
    GROUP BY
        p.ProductID,
        p.Name
)
SELECT TOP 10
    ProductName,
    TotalQuantitySold
FROM ProductSales
ORDER BY TotalQuantitySold DESC;


---------------------------------------------------
-- 5.  Write query based on customer & Customer Products table as per output result 
---------------------------------------------------


CREATE TABLE Customers
(
    CustomerId INT PRIMARY KEY,
    Name VARCHAR(50),
    Address VARCHAR(100)
);

CREATE TABLE CustomerProducts
(
    ProductId INT PRIMARY KEY,
    ProductName VARCHAR(50),
    CustomerIDs VARCHAR(50)   
);


INSERT INTO Customers (CustomerId, Name, Address)
VALUES
(1, 'Jeshal', 'Amreli'),
(2, 'Jigna', 'Ahmedabad'),
(3, 'Rajesh', 'Baroda');


INSERT INTO CustomerProducts (ProductId, ProductName, CustomerIDs)
VALUES
(1, 'Nokia', '1,2,3'),
(2, 'iPhone', '2,3'),
(3, 'Samsung', '1');

SELECT * FROM Customers;
SELECT * FROM CustomerProducts;

SELECT
    c.CustomerId,
    c.Name AS CustomerName,
    c.Address,
    STUFF
    (
        (
            SELECT ',' + cp.ProductName
            FROM CustomerProducts cp
            WHERE ',' + cp.CustomerIDs + ',' 
                  LIKE '%,' + CAST(c.CustomerId AS VARCHAR(10)) + ',%'
            FOR XML PATH(''), TYPE
        ).value('.', 'VARCHAR(MAX)'),
        1, 1, ''
    ) AS Products
FROM Customers c
ORDER BY c.CustomerId;






