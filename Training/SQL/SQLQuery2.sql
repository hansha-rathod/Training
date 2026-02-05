-- SQL Training Task 2 - Complete Solutions
-- Database tables: Customers, Orders, Departments
CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100)
);

GO

-- ============================================================================
-- Create Customers Table
-- ============================================================================
CREATE TABLE Customers (
    CustomerId INT PRIMARY KEY,
    CustomerName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    DepartmentId INT,
    CONSTRAINT FK_Customers_Departments FOREIGN KEY (DepartmentId) 
        REFERENCES Departments(DepartmentId)
);

GO

-- ============================================================================
-- Create Orders Table
-- ============================================================================
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY,
    CustomerId INT,
    OrderDate DATE,
    TotalAmount DECIMAL(10, 2),
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerId) 
        REFERENCES Customers(CustomerId)
);

GO

-- ============================================================================
-- Insert Sample Data into Departments Table
-- ============================================================================
INSERT INTO Departments (DepartmentId, DepartmentName, Location) VALUES
(1, 'Sales', 'New York'),
(2, 'Marketing', 'Los Angeles'),
(3, 'Finance', 'Chicago'),
(4, 'IT', 'San Francisco'),
(5, 'HR', 'Boston');

GO

-- ============================================================================
-- Insert Sample Data into Customers Table
-- ============================================================================
INSERT INTO Customers (CustomerId, CustomerName, Email, Phone, DepartmentId) VALUES
(1, 'John Doe', 'john@example.com', '1234567890', 1),
(2, 'Jane Smith', 'jane@example.com', '9876543210', 2),
(3, 'Michael Johnson', 'michael@example.com', '5551234567', 3),
(4, 'Bob Brown', 'bob@example.com', '1234567890', 4);

GO

-- ============================================================================
-- Insert Sample Data into Orders Table
-- ============================================================================
-- Orders by existing customers
INSERT INTO Orders (OrderId, CustomerId, OrderDate, TotalAmount) VALUES
(101, 1, '2024-02-15', 100.00),
(102, 2, '2024-02-16', 200.00),
(103, NULL, '2024-02-17', 150.00);  -- Order without a registered customer

-- Additional orders for 2024 to match expected outputs
INSERT INTO Orders (OrderId, CustomerId, OrderDate, TotalAmount) VALUES
(104, 2, '2024-03-10', 200.00),  -- Jane Smith's second order
(105, 1, '2024-04-05', 150.00);  -- John Doe's second order

-- Orders for 2023 (for Task 13 - customers who ordered in both 2023 and 2024)
INSERT INTO Orders (OrderId, CustomerId, OrderDate, TotalAmount) VALUES
(106, 1, '2023-05-20', 180.00);  -- John Doe ordered in 2023

GO

-- ============================================================================
-- Additional data to support all task requirements
-- ============================================================================

-- Add more customers to departments for Task 12 (departments with at least 2 employees)
INSERT INTO Customers (CustomerId, CustomerName, Email, Phone, DepartmentId) VALUES
(5, 'Alice Cooper', 'alice@example.com', '5559876543', 1),  -- Second person in Sales
(6, 'Charlie Davis', 'charlie@example.com', '5556543210', 2); -- Second person in Marketing

-- Add orders for these customers
INSERT INTO Orders (OrderId, CustomerId, OrderDate, TotalAmount) VALUES
(107, 5, '2024-05-15', 120.00),
(108, 5, '2024-06-20', 130.00),
(109, 6, '2024-07-10', 100.00);

GO

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- View all departments
SELECT * FROM Departments;

-- View all customers
SELECT * FROM Customers;

-- View all orders
SELECT * FROM Orders;

-- Summary statistics
SELECT 
    'Departments' AS TableName, 
    COUNT(*) AS RecordCount 
FROM Departments
UNION ALL
SELECT 
    'Customers', 
    COUNT(*) 
FROM Customers
UNION ALL
SELECT 
    'Orders', 
    COUNT(*) 
FROM Orders;

GO


-- ============================================================================
-- Task 1: Retrieve a list of orders along with the names of customers who 
-- placed those orders. Include only orders placed by existing customers.
-- ============================================================================
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
INNER JOIN Customers c ON o.CustomerId = c.CustomerId;

-- ============================================================================
-- Task 2: Retrieve a list of all orders along with the names of customers who 
-- placed those orders. Include orders placed by customers who are not 
-- registered in the system.
-- ============================================================================
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
LEFT JOIN Customers c ON o.CustomerId = c.CustomerId;

-- ============================================================================
-- Task 3: Retrieve a list of all customers who placed orders, even those 
-- without any orders. Include the details of orders they placed, if any.
-- ============================================================================
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId;

-- ============================================================================
-- Task 4: Retrieve a comprehensive list of all orders and customers, including 
-- those without any orders and customers who haven't placed any orders.
-- ============================================================================
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
FULL OUTER JOIN Customers c ON o.CustomerId = c.CustomerId;

-- ============================================================================
-- Task 5: Generate a list of all possible combinations of orders and customers.
-- ============================================================================
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
CROSS JOIN Customers c;

-- ============================================================================
-- Task 6: Retrieve the top 3 customers who have spent the highest total amount.
-- ============================================================================
SELECT TOP 3
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    COUNT(o.OrderId) AS [Total Orders],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY c.CustomerId, c.CustomerName
ORDER BY SUM(o.TotalAmount) DESC;

-- ============================================================================
-- Task 7: Retrieve the details of customers who have not placed any orders.
-- ============================================================================
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    c.Email,
    c.Phone
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE o.OrderId IS NULL;

-- ============================================================================
-- Task 8: Retrieve the total number of orders and total amount spent by each 
-- customer for orders placed in 2024.
-- ============================================================================
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    COUNT(o.OrderId) AS [Total Orders],
    ISNULL(SUM(o.TotalAmount), 0) AS [Total Amount Spent]
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId 
    AND YEAR(o.OrderDate) = 2024
GROUP BY c.CustomerId, c.CustomerName;

-- ============================================================================
-- Task 9: Retrieve the top 5 departments with the highest average total 
-- amount spent by customers in orders.
-- ============================================================================
SELECT TOP 5
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    AVG(o.TotalAmount) AS [Average Total Amount Spent]
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY AVG(o.TotalAmount) DESC;

-- ============================================================================
-- Task 10: Retrieve the department with the highest total number of orders.
-- ============================================================================
SELECT TOP 1
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    COUNT(o.OrderId) AS [Total Orders]
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY COUNT(o.OrderId) DESC;

-- ============================================================================
-- Task 11: Retrieve the top 3 customers who have the highest total amount 
-- spent on orders in 2024.
-- ============================================================================
SELECT TOP 3
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) = 2024
GROUP BY c.CustomerId, c.CustomerName
ORDER BY SUM(o.TotalAmount) DESC;

-- ============================================================================
-- Task 12: Retrieve the details of departments with at least 2 employees and 
-- the total number of orders placed by those employees.
-- ============================================================================
-- Note: Assuming employees are represented by customers in departments
SELECT 
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    COUNT(DISTINCT o.OrderId) AS [Total Orders]
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
HAVING COUNT(DISTINCT c.CustomerId) >= 2;

-- ============================================================================
-- Task 13: Retrieve the customers who have placed orders both in 2023 and 2024.
-- ============================================================================
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    c.Email,
    c.Phone
FROM Customers c
WHERE EXISTS (
    SELECT 1 FROM Orders o 
    WHERE o.CustomerId = c.CustomerId 
    AND YEAR(o.OrderDate) = 2023
)
AND EXISTS (
    SELECT 1 FROM Orders o 
    WHERE o.CustomerId = c.CustomerId 
    AND YEAR(o.OrderDate) = 2024
);

-- Alternative solution using INTERSECT
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    c.Email,
    c.Phone
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) = 2023
INTERSECT
SELECT 
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    c.Email,
    c.Phone
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) = 2024;