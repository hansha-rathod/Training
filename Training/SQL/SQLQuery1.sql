-- =============================================
-- SQL STORED PROCEDURES - COMPLETE IMPLEMENTATION
-- Tables: Customer, Product, Order, Payment
-- =============================================
-- CREATE DATABASE SPDB
-- GO
USE SPDB
GO


CREATE TABLE Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(20) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);


CREATE TABLE Product (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Description TEXT NULL,
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



-- Order table indexes
CREATE INDEX IX_Order_CustomerID ON [Order](CustomerID);
CREATE INDEX IX_Order_ProductID ON [Order](ProductID);
CREATE INDEX IX_Order_OrderDate ON [Order](OrderDate);

-- Payment table index
CREATE INDEX IX_Payment_OrderID ON Payment(OrderID);
CREATE INDEX IX_Payment_PaymentDate ON Payment(PaymentDate);


SELECT * FROM Customer;
SELECT * FROM Product;
SELECT * FROM [Order];
SELECT * FROM Payment;




-- =============================================
-- 1. INSERT STORED PROCEDURES FOR ALL TABLES
-- =============================================

-- Insert Customer
CREATE PROCEDURE sp_InsertCustomer
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @Email VARCHAR(100),
    @Phone VARCHAR(20),
    @CustomerID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Customer (FirstName, LastName, Email, Phone)
        VALUES (@FirstName, @LastName, @Email, @Phone);
        
        SET @CustomerID = SCOPE_IDENTITY();
        
        SELECT @CustomerID AS CustomerID, 'Customer inserted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Insert Product
CREATE PROCEDURE sp_InsertProduct
    @Name VARCHAR(100),
    @Price DECIMAL(10,2),
    @Description TEXT,
    @ProductID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Product (Name, Price, Description)
        VALUES (@Name, @Price, @Description);
        
        SET @ProductID = SCOPE_IDENTITY();
        
        SELECT @ProductID AS ProductID, 'Product inserted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Insert Order
CREATE PROCEDURE sp_InsertOrder
    @CustomerID INT,
    @OrderDate DATETIME,
    @Qty INT,
    @Rate DECIMAL(10,2),
    @ProductID INT,
    @OrderID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @TotalAmount DECIMAL(10,2);
        SET @TotalAmount = @Qty * @Rate;
        
        INSERT INTO [Order] (CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID)
        VALUES (@CustomerID, @OrderDate, @Qty, @Rate, @TotalAmount, @ProductID);
        
        SET @OrderID = SCOPE_IDENTITY();
        
        SELECT @OrderID AS OrderID, @TotalAmount AS TotalAmount, 'Order inserted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Insert Payment
CREATE PROCEDURE sp_InsertPayment
    @OrderID INT,
    @Amount DECIMAL(10,2),
    @PaymentDate DATETIME,
    @PaymentID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Payment (OrderID, Amount, PaymentDate)
        VALUES (@OrderID, @Amount, @PaymentDate);
        
        SET @PaymentID = SCOPE_IDENTITY();
        
        SELECT @PaymentID AS PaymentID, 'Payment inserted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- =============================================
-- DEMO DATA INSERTIONS
-- =============================================

-- 1. Insert Customers
DECLARE @Cust1 INT, @Cust2 INT, @Cust3 INT;
EXEC sp_InsertCustomer 'John', 'Doe', 'john.doe@email.com', '1234567890', @Cust1 OUTPUT;
EXEC sp_InsertCustomer 'Jane', 'Smith', 'jane.smith@email.com', '9876543210', @Cust2 OUTPUT;
EXEC sp_InsertCustomer 'Bob', 'Wilson', 'bob.wilson@email.com', '5551234567', @Cust3 OUTPUT;

-- 2. Insert Products
DECLARE @Prod1 INT, @Prod2 INT, @Prod3 INT;
EXEC sp_InsertProduct 'Laptop', 999.99, 'High-performance laptop', @Prod1 OUTPUT;
EXEC sp_InsertProduct 'Wireless Mouse', 25.00, 'Ergonomic wireless mouse', @Prod2 OUTPUT;
EXEC sp_InsertProduct 'USB Keyboard', 45.50, 'Mechanical keyboard with RGB', @Prod3 OUTPUT;

-- 3. Insert Orders
DECLARE @Order1 INT, @Order2 INT, @Order3 INT, @Order4 INT, @Order5 INT;
EXEC sp_InsertOrder @Cust1, '2024-01-15', 2, 25.00, @Prod2, @Order1 OUTPUT;
EXEC sp_InsertOrder @Cust1, '2024-02-10', 1, 999.99, @Prod1, @Order2 OUTPUT;
EXEC sp_InsertOrder @Cust2, '2024-02-20', 3, 45.50, @Prod3, @Order3 OUTPUT;
EXEC sp_InsertOrder @Cust2, '2024-03-05', 1, 999.99, @Prod1, @Order4 OUTPUT;
EXEC sp_InsertOrder @Cust3, '2024-03-15', 5, 25.00, @Prod2, @Order5 OUTPUT;

-- 4. Insert Payments
DECLARE @Pay1 INT, @Pay2 INT, @Pay3 INT, @Pay4 INT;
EXEC sp_InsertPayment @Order1, 50.00, '2024-01-16', @Pay1 OUTPUT;
EXEC sp_InsertPayment @Order2, 999.99, '2024-02-11', @Pay2 OUTPUT;
EXEC sp_InsertPayment @Order3, 136.50, '2024-02-21', @Pay3 OUTPUT;
EXEC sp_InsertPayment @Order4, 999.99, '2024-03-06', @Pay4 OUTPUT;
-- Order5 is intentionally left unpaid for testing unpaid orders query


-- =============================================
-- 2. UPDATE STORED PROCEDURES FOR ALL TABLES
-- =============================================

-- Update Customer
CREATE PROCEDURE sp_UpdateCustomer
    @CustomerID INT,
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @Email VARCHAR(100),
    @Phone VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Customer
        SET FirstName = @FirstName,
            LastName = @LastName,
            Email = @Email,
            Phone = @Phone
        WHERE CustomerID = @CustomerID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Customer not found' AS Message;
        ELSE
            SELECT 'Customer updated successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Update Product
CREATE PROCEDURE sp_UpdateProduct
    @ProductID INT,
    @Name VARCHAR(100),
    @Price DECIMAL(10,2),
    @Description TEXT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Product
        SET Name = @Name,
            Price = @Price,
            Description = @Description
        WHERE ProductID = @ProductID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Product not found' AS Message;
        ELSE
            SELECT 'Product updated successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Update Order
CREATE PROCEDURE sp_UpdateOrder
    @OrderID INT,
    @CustomerID INT,
    @OrderDate DATETIME,
    @Qty INT,
    @Rate DECIMAL(10,2),
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @TotalAmount DECIMAL(10,2);
        SET @TotalAmount = @Qty * @Rate;
        
        UPDATE [Order]
        SET CustomerID = @CustomerID,
            OrderDate = @OrderDate,
            Qty = @Qty,
            Rate = @Rate,
            TotalAmount = @TotalAmount,
            ProductID = @ProductID
        WHERE OrderID = @OrderID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Order not found' AS Message;
        ELSE
            SELECT 'Order updated successfully' AS Message, @TotalAmount AS NewTotalAmount;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Update Payment
CREATE PROCEDURE sp_UpdatePayment
    @PaymentID INT,
    @OrderID INT,
    @Amount DECIMAL(10,2),
    @PaymentDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Payment
        SET OrderID = @OrderID,
            Amount = @Amount,
            PaymentDate = @PaymentDate
        WHERE PaymentID = @PaymentID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Payment not found' AS Message;
        ELSE
            SELECT 'Payment updated successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO



-- 2. Update Customer
EXEC sp_UpdateCustomer 1, 'John', 'Smith', 'john.smith@email.com', '0987654321';


-- =============================================
-- 3. GET/SELECT STORED PROCEDURES FOR ALL TABLES
-- =============================================

-- Get Customer
CREATE PROCEDURE sp_GetCustomer
    @CustomerID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @CustomerID IS NULL
            SELECT * FROM Customer ORDER BY CustomerID;
        ELSE
            SELECT * FROM Customer WHERE CustomerID = @CustomerID;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Get Product
CREATE PROCEDURE sp_GetProduct
    @ProductID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @ProductID IS NULL
            SELECT * FROM Product ORDER BY ProductID;
        ELSE
            SELECT * FROM Product WHERE ProductID = @ProductID;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Get Order
CREATE PROCEDURE sp_GetOrder
    @OrderID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @OrderID IS NULL
            SELECT * FROM [Order] ORDER BY OrderID DESC;
        ELSE
            SELECT * FROM [Order] WHERE OrderID = @OrderID;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Get Payment
CREATE PROCEDURE sp_GetPayment
    @PaymentID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @PaymentID IS NULL
            SELECT * FROM Payment ORDER BY PaymentID DESC;
        ELSE
            SELECT * FROM Payment WHERE PaymentID = @PaymentID;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO



-- 3. Get Customer (all or by ID)
EXEC sp_GetCustomer; -- Get all
EXEC sp_GetCustomer @CustomerID = 1; -- Get specific


-- =============================================
-- 4. DELETE STORED PROCEDURES FOR ALL TABLES
-- =============================================

-- Delete Customer
CREATE PROCEDURE sp_DeleteCustomer
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check for related orders before deleting
        IF EXISTS (SELECT 1 FROM [Order] WHERE CustomerID = @CustomerID)
        BEGIN
            SELECT 'Cannot delete customer with existing orders' AS Message;
            RETURN -1;
        END
        
        DELETE FROM Customer WHERE CustomerID = @CustomerID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Customer not found' AS Message;
        ELSE
            SELECT 'Customer deleted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Delete Product
CREATE PROCEDURE sp_DeleteProduct
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check for related orders before deleting
        IF EXISTS (SELECT 1 FROM [Order] WHERE ProductID = @ProductID)
        BEGIN
            SELECT 'Cannot delete product with existing orders' AS Message;
            RETURN -1;
        END
        
        DELETE FROM Product WHERE ProductID = @ProductID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Product not found' AS Message;
        ELSE
            SELECT 'Product deleted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Delete Order
CREATE PROCEDURE sp_DeleteOrder
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check for related payments before deleting
        IF EXISTS (SELECT 1 FROM Payment WHERE OrderID = @OrderID)
        BEGIN
            SELECT 'Cannot delete order with existing payments' AS Message;
            RETURN -1;
        END
        
        DELETE FROM [Order] WHERE OrderID = @OrderID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Order not found' AS Message;
        ELSE
            SELECT 'Order deleted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- Delete Payment
CREATE PROCEDURE sp_DeletePayment
    @PaymentID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Payment WHERE PaymentID = @PaymentID;
        
        IF @@ROWCOUNT = 0
            SELECT 'Payment not found' AS Message;
        ELSE
            SELECT 'Payment deleted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO



-- 4. Delete Customer
EXEC sp_DeleteCustomer 1;


-- =============================================
-- 5. UPDATE PRODUCT PRICE BY PRODUCTID
-- =============================================

CREATE PROCEDURE sp_UpdateProductPrice
    @ProductID INT,
    @NewPrice DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @OldPrice DECIMAL(10,2);
        
        SELECT @OldPrice = Price FROM Product WHERE ProductID = @ProductID;
        
        IF @OldPrice IS NULL
        BEGIN
            SELECT 'Product not found' AS Message;
            RETURN -1;
        END
        
        UPDATE Product
        SET Price = @NewPrice
        WHERE ProductID = @ProductID;
        
        SELECT 
            @ProductID AS ProductID,
            @OldPrice AS OldPrice,
            @NewPrice AS NewPrice,
            'Product price updated successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 5. Update Product Price
EXEC sp_UpdateProductPrice @ProductID = 1, @NewPrice = 29.99;


-- =============================================
-- 6. INSERT ORDER WITH CALCULATED TOTALAMOUNT
-- =============================================

CREATE PROCEDURE sp_InsertOrderWithCalculation
    @CustomerID INT,
    @OrderDate DATETIME,
    @ProductID INT,
    @Qty INT,
    @Rate DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @TotalAmount DECIMAL(10,2);
        DECLARE @OrderID INT;
        
        -- Calculate total amount
        SET @TotalAmount = @Qty * @Rate;
        
        -- Insert order
        INSERT INTO [Order] (CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID)
        VALUES (@CustomerID, @OrderDate, @Qty, @Rate, @TotalAmount, @ProductID);
        
        SET @OrderID = SCOPE_IDENTITY();
        
        SELECT 
            @OrderID AS OrderID,
            @TotalAmount AS TotalAmount,
            'Order inserted successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 6. Insert Order with Calculation
EXEC sp_InsertOrderWithCalculation 1, '2024-02-05', 1, 5, 25.00;


-- =============================================
-- 7. RECORD PAYMENT FOR ORDER
-- =============================================

CREATE PROCEDURE sp_RecordPayment
    @OrderID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @PaymentID INT;
        DECLARE @PaymentDate DATETIME = GETDATE();
        
        -- Verify order exists
        IF NOT EXISTS (SELECT 1 FROM [Order] WHERE OrderID = @OrderID)
        BEGIN
            SELECT 'Order not found' AS Message;
            RETURN -1;
        END
        
        -- Insert payment
        INSERT INTO Payment (OrderID, Amount, PaymentDate)
        VALUES (@OrderID, @Amount, @PaymentDate);
        
        SET @PaymentID = SCOPE_IDENTITY();
        
        SELECT 
            @PaymentID AS PaymentID,
            @OrderID AS OrderID,
            @Amount AS Amount,
            @PaymentDate AS PaymentDate,
            'Payment recorded successfully' AS Message;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 7. Record Payment
EXEC sp_RecordPayment @OrderID = 1, @Amount = 125.00;


-- =============================================
-- 8. GET TOTAL PAYMENTS BY CUSTOMER
-- =============================================

CREATE PROCEDURE sp_GetTotalPaymentsByCustomer
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            ISNULL(SUM(p.Amount), 0) AS TotalPayments,
            COUNT(DISTINCT p.PaymentID) AS PaymentCount
        FROM Customer c
        LEFT JOIN [Order] o ON c.CustomerID = o.CustomerID
        LEFT JOIN Payment p ON o.OrderID = p.OrderID
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
        ORDER BY TotalPayments DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 8. Get Total Payments by Customer
EXEC sp_GetTotalPaymentsByCustomer;

-- =============================================
-- 9. GET CUSTOMERS WITHOUT PAYMENTS
-- =============================================

CREATE PROCEDURE sp_GetCustomersWithoutPayments
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            c.Phone
        FROM Customer c
        WHERE NOT EXISTS (
            SELECT 1 
            FROM [Order] o
            INNER JOIN Payment p ON o.OrderID = p.OrderID
            WHERE o.CustomerID = c.CustomerID
        )
        ORDER BY c.CustomerID;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 9. Get Customers Without Payments
EXEC sp_GetCustomersWithoutPayments;


-- =============================================
-- 10. CALCULATE TOTAL REVENUE FOR PERIOD
-- =============================================

CREATE PROCEDURE sp_GetTotalRevenueByPeriod
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            @StartDate AS StartDate,
            @EndDate AS EndDate,
            COUNT(OrderID) AS TotalOrders,
            ISNULL(SUM(TotalAmount), 0) AS TotalRevenue
        FROM [Order]
        WHERE OrderDate BETWEEN @StartDate AND @EndDate;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 10. Get Total Revenue by Period
EXEC sp_GetTotalRevenueByPeriod '2024-01-01', '2024-12-31';


-- =============================================
-- 11. GET ALL ORDERS WITH CUSTOMER AND PRODUCT DETAILS
-- =============================================

CREATE PROCEDURE sp_GetOrdersWithDetails
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            o.OrderID,
            o.OrderDate,
            o.Qty,
            o.Rate,
            o.TotalAmount,
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            c.Phone,
            p.ProductID,
            p.Name AS ProductName,
            p.Price AS ProductPrice,
            p.Description AS ProductDescription
        FROM [Order] o
        INNER JOIN Customer c ON o.CustomerID = c.CustomerID
        INNER JOIN Product p ON o.ProductID = p.ProductID
        ORDER BY o.OrderDate DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 11. Get Orders with Details
EXEC sp_GetOrdersWithDetails;


-- =============================================
-- 12. GET TOP N CUSTOMERS BY TOTAL PAYMENTS
-- =============================================

CREATE PROCEDURE sp_GetTopCustomersByPayments
    @TopN INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT TOP (@TopN)
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            SUM(p.Amount) AS TotalPayments,
            COUNT(DISTINCT p.PaymentID) AS PaymentCount
        FROM Customer c
        INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
        INNER JOIN Payment p ON o.OrderID = p.OrderID
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
        ORDER BY TotalPayments DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 12. Get Top N Customers by Payments
EXEC sp_GetTopCustomersByPayments @TopN = 5;


-- =============================================
-- 13. GET ORDERS FROM CUSTOMERS WITH RECENT PAYMENTS
-- =============================================

CREATE PROCEDURE sp_GetOrdersFromRecentPayingCustomers
    @MonthsBack INT = 6
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @DateThreshold DATETIME = DATEADD(MONTH, -@MonthsBack, GETDATE());
        
        SELECT DISTINCT
            o.OrderID,
            o.OrderDate,
            o.CustomerID,
            c.FirstName,
            c.LastName,
            o.ProductID,
            p.Name AS ProductName,
            o.TotalAmount
        FROM [Order] o
        INNER JOIN Customer c ON o.CustomerID = c.CustomerID
        INNER JOIN Product p ON o.ProductID = p.ProductID
        WHERE o.CustomerID IN (
            SELECT DISTINCT o2.CustomerID
            FROM [Order] o2
            INNER JOIN Payment py ON o2.OrderID = py.OrderID
            WHERE py.PaymentDate >= @DateThreshold
        )
        ORDER BY o.OrderDate DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 13. Get Orders from Recent Paying Customers
EXEC sp_GetOrdersFromRecentPayingCustomers @MonthsBack = 6;


-- =============================================
-- 14. CALCULATE TOTAL REVENUE BY PRODUCT CATEGORY
-- Note: Since there's no Category column, grouping by Product
-- =============================================

CREATE PROCEDURE sp_GetRevenueByProduct
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            p.ProductID,
            p.Name AS ProductName,
            COUNT(o.OrderID) AS TotalOrders,
            SUM(o.Qty) AS TotalQuantitySold,
            SUM(o.TotalAmount) AS TotalRevenue
        FROM Product p
        LEFT JOIN [Order] o ON p.ProductID = o.ProductID
        GROUP BY p.ProductID, p.Name
        ORDER BY TotalRevenue DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO



-- 14. Get Revenue by Product
EXEC sp_GetRevenueByProduct;


-- =============================================
-- 15. GET MOST PROFITABLE PRODUCT
-- =============================================

CREATE PROCEDURE sp_GetMostProfitableProduct
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT TOP 1
            p.ProductID,
            p.Name AS ProductName,
            p.Price AS ProductPrice,
            COUNT(o.OrderID) AS TotalOrders,
            SUM(o.Qty) AS TotalQuantitySold,
            SUM(o.TotalAmount) AS TotalRevenue
        FROM Product p
        INNER JOIN [Order] o ON p.ProductID = o.ProductID
        GROUP BY p.ProductID, p.Name, p.Price
        ORDER BY TotalRevenue DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 15. Get Most Profitable Product
EXEC sp_GetMostProfitableProduct;


-- =============================================
-- 16. GET CUSTOMERS WHO PURCHASED SPECIFIC PRODUCT IN DATE RANGE
-- =============================================

CREATE PROCEDURE sp_GetCustomersByProductAndDateRange
    @ProductID INT,
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT DISTINCT
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            c.Phone,
            COUNT(o.OrderID) AS OrderCount,
            SUM(o.TotalAmount) AS TotalSpent
        FROM Customer c
        INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
        WHERE o.ProductID = @ProductID
        AND o.OrderDate BETWEEN @StartDate AND @EndDate
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email, c.Phone
        ORDER BY TotalSpent DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 16. Get Customers by Product and Date Range
EXEC sp_GetCustomersByProductAndDateRange 1, '2024-01-01', '2024-12-31';

-- =============================================
-- 17. CALCULATE AVERAGE ORDER VALUE PER CUSTOMER
-- =============================================

CREATE PROCEDURE sp_GetAverageOrderValueByCustomer
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            COUNT(o.OrderID) AS TotalOrders,
            SUM(o.TotalAmount) AS TotalSpent,
            AVG(o.TotalAmount) AS AverageOrderValue
        FROM Customer c
        INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
        ORDER BY AverageOrderValue DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 17. Get Average Order Value by Customer
EXEC sp_GetAverageOrderValueByCustomer;

-- =============================================
-- 18. GET ORDERS WITH HIGHEST TOTAL AMOUNTS PER CUSTOMER
-- =============================================

CREATE PROCEDURE sp_GetHighestOrderPerCustomer
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        WITH RankedOrders AS (
            SELECT 
                o.OrderID,
                o.CustomerID,
                c.FirstName,
                c.LastName,
                o.OrderDate,
                o.TotalAmount,
                p.Name AS ProductName,
                ROW_NUMBER() OVER (PARTITION BY o.CustomerID ORDER BY o.TotalAmount DESC) AS RowNum
            FROM [Order] o
            INNER JOIN Customer c ON o.CustomerID = c.CustomerID
            INNER JOIN Product p ON o.ProductID = p.ProductID
        )
        SELECT 
            OrderID,
            CustomerID,
            FirstName,
            LastName,
            OrderDate,
            TotalAmount,
            ProductName
        FROM RankedOrders
        WHERE RowNum = 1
        ORDER BY TotalAmount DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 18. Get Highest Order per Customer
EXEC sp_GetHighestOrderPerCustomer;


-- =============================================
-- 19. GET ORDERS AND REVENUE BY CUSTOMER FOR SPECIFIC YEAR
-- =============================================

CREATE PROCEDURE sp_GetCustomerOrderStatsByYear
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            COUNT(o.OrderID) AS TotalOrders,
            ISNULL(SUM(o.TotalAmount), 0) AS TotalRevenue
        FROM Customer c
        LEFT JOIN [Order] o ON c.CustomerID = o.CustomerID 
            AND YEAR(o.OrderDate) = @Year
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
        HAVING COUNT(o.OrderID) > 0
        ORDER BY TotalRevenue DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 19. Get Customer Order Stats by Year
EXEC sp_GetCustomerOrderStatsByYear @Year = 2024;


-- =============================================
-- 20. GET UNPAID ORDERS WITHIN CERTAIN PERIOD
-- =============================================

CREATE PROCEDURE sp_GetUnpaidOrders
    @DaysOverdue INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @DateThreshold DATETIME = DATEADD(DAY, -@DaysOverdue, GETDATE());
        
        SELECT 
            o.OrderID,
            o.OrderDate,
            o.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            o.TotalAmount,
            ISNULL(SUM(p.Amount), 0) AS TotalPaid,
            o.TotalAmount - ISNULL(SUM(p.Amount), 0) AS AmountDue,
            DATEDIFF(DAY, o.OrderDate, GETDATE()) AS DaysOverdue
        FROM [Order] o
        INNER JOIN Customer c ON o.CustomerID = c.CustomerID
        LEFT JOIN Payment p ON o.OrderID = p.OrderID
        WHERE o.OrderDate < @DateThreshold
        GROUP BY o.OrderID, o.OrderDate, o.CustomerID, c.FirstName, c.LastName, c.Email, o.TotalAmount
        HAVING o.TotalAmount > ISNULL(SUM(p.Amount), 0)
        ORDER BY DaysOverdue DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- 20. Get Unpaid Orders
EXEC sp_GetUnpaidOrders @DaysOverdue = 30;


-- =============================================
-- 21. IDENTIFY CUSTOMERS WITH CONSECUTIVE PURCHASES
-- =============================================

CREATE PROCEDURE sp_GetCustomersWithConsecutivePurchases
    @DaysWindow INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        WITH OrderDates AS (
            SELECT 
                CustomerID,
                OrderDate,
                LAG(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS PreviousOrderDate
            FROM [Order]
        )
        SELECT DISTINCT
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            COUNT(DISTINCT o.OrderID) AS TotalOrders
        FROM Customer c
        INNER JOIN OrderDates od ON c.CustomerID = od.CustomerID
        INNER JOIN [Order] o ON c.CustomerID = o.CustomerID
        WHERE DATEDIFF(DAY, od.PreviousOrderDate, od.OrderDate) <= @DaysWindow
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
        ORDER BY TotalOrders DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- 21. Get Customers with Consecutive Purchases
EXEC sp_GetCustomersWithConsecutivePurchases @DaysWindow = 30;

-- =============================================
-- 22. CALCULATE TOTAL REVENUE PER CUSTOMER IN LAST N MONTHS
-- =============================================

CREATE PROCEDURE sp_GetCustomerRevenueLastNMonths
    @MonthsBack INT = 6
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @DateThreshold DATETIME = DATEADD(MONTH, -@MonthsBack, GETDATE());
        
        SELECT 
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            COUNT(o.OrderID) AS TotalOrders,
            ISNULL(SUM(o.TotalAmount), 0) AS TotalRevenue,
            @MonthsBack AS MonthsPeriod
        FROM Customer c
        LEFT JOIN [Order] o ON c.CustomerID = o.CustomerID 
            AND o.OrderDate >= @DateThreshold
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
        HAVING COUNT(o.OrderID) > 0
        ORDER BY TotalRevenue DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO

-- 22. Get Customer Revenue Last N Months
EXEC sp_GetCustomerRevenueLastNMonths @MonthsBack = 6;


-- =============================================
-- 23. GET ORDERS WHERE PRODUCT PRICE > AVERAGE PRICE
-- =============================================

CREATE PROCEDURE sp_GetOrdersAboveAveragePrice
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @AvgPrice DECIMAL(10,2);
        
        SELECT @AvgPrice = AVG(Price) FROM Product;
        
        SELECT 
            o.OrderID,
            o.OrderDate,
            c.CustomerID,
            c.FirstName,
            c.LastName,
            p.ProductID,
            p.Name AS ProductName,
            p.Price AS ProductPrice,
            @AvgPrice AS AveragePrice,
            o.TotalAmount
        FROM [Order] o
        INNER JOIN Customer c ON o.CustomerID = c.CustomerID
        INNER JOIN Product p ON o.ProductID = p.ProductID
        WHERE p.Price > @AvgPrice
        ORDER BY p.Price DESC;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO


-- 23. Get Orders Above Average Price
EXEC sp_GetOrdersAboveAveragePrice;


-- =============================================
-- 24. CALCULATE AVERAGE TIME BETWEEN CONSECUTIVE ORDERS
-- =============================================

CREATE PROCEDURE sp_GetAvgTimeBetweenOrders
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        WITH OrderIntervals AS (
            SELECT 
                CustomerID,
                OrderDate,
                LAG(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS PreviousOrderDate,
                DATEDIFF(DAY, 
                    LAG(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate), 
                    OrderDate
                ) AS DaysBetweenOrders
            FROM [Order]
        )
        SELECT 
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            COUNT(oi.DaysBetweenOrders) AS IntervalCount,
            AVG(oi.DaysBetweenOrders) AS AvgDaysBetweenOrders,
            MIN(oi.DaysBetweenOrders) AS MinDaysBetweenOrders,
            MAX(oi.DaysBetweenOrders) AS MaxDaysBetweenOrders
        FROM Customer c
        INNER JOIN OrderIntervals oi ON c.CustomerID = oi.CustomerID
        WHERE oi.DaysBetweenOrders IS NOT NULL
        GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
        ORDER BY AvgDaysBetweenOrders;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO



-- 24. Get Average Time Between Orders
EXEC sp_GetAvgTimeBetweenOrders;


-- =============================================
-- 25. GET ORDERS WITH PAGINATION, SORTING, AND SEARCHING
-- =============================================

CREATE PROCEDURE sp_GetOrdersWithPaginationAndSearch
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SortColumn VARCHAR(50) = 'OrderDate',
    @SortDirection VARCHAR(4) = 'DESC',
    @SearchTerm VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
        
        -- Get total count for pagination
        DECLARE @TotalRecords INT;
        
        SELECT @TotalRecords = COUNT(*)
        FROM [Order] o
        INNER JOIN Customer c ON o.CustomerID = c.CustomerID
        INNER JOIN Product p ON o.ProductID = p.ProductID
        WHERE @SearchTerm IS NULL OR (
            c.FirstName LIKE '%' + @SearchTerm + '%' OR
            c.LastName LIKE '%' + @SearchTerm + '%' OR
            c.Email LIKE '%' + @SearchTerm + '%' OR
            p.Name LIKE '%' + @SearchTerm + '%'
        );
        
        -- Main query with dynamic sorting
        SELECT 
            o.OrderID,
            o.OrderDate,
            o.Qty,
            o.Rate,
            o.TotalAmount,
            c.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            p.ProductID,
            p.Name AS ProductName,
            p.Price AS ProductPrice,
            @TotalRecords AS TotalRecords,
            @PageNumber AS CurrentPage,
            CEILING(CAST(@TotalRecords AS FLOAT) / @PageSize) AS TotalPages
        FROM [Order] o
        INNER JOIN Customer c ON o.CustomerID = c.CustomerID
        INNER JOIN Product p ON o.ProductID = p.ProductID
        WHERE @SearchTerm IS NULL OR (
            c.FirstName LIKE '%' + @SearchTerm + '%' OR
            c.LastName LIKE '%' + @SearchTerm + '%' OR
            c.Email LIKE '%' + @SearchTerm + '%' OR
            p.Name LIKE '%' + @SearchTerm + '%'
        )
        ORDER BY 
            CASE WHEN @SortColumn = 'OrderDate' AND @SortDirection = 'ASC' THEN o.OrderDate END ASC,
            CASE WHEN @SortColumn = 'OrderDate' AND @SortDirection = 'DESC' THEN o.OrderDate END DESC,
            CASE WHEN @SortColumn = 'TotalAmount' AND @SortDirection = 'ASC' THEN o.TotalAmount END ASC,
            CASE WHEN @SortColumn = 'TotalAmount' AND @SortDirection = 'DESC' THEN o.TotalAmount END DESC,
            CASE WHEN @SortColumn = 'CustomerName' AND @SortDirection = 'ASC' THEN c.FirstName END ASC,
            CASE WHEN @SortColumn = 'CustomerName' AND @SortDirection = 'DESC' THEN c.FirstName END DESC,
            CASE WHEN @SortColumn = 'ProductName' AND @SortDirection = 'ASC' THEN p.Name END ASC,
            CASE WHEN @SortColumn = 'ProductName' AND @SortDirection = 'DESC' THEN p.Name END DESC,
            o.OrderDate DESC -- Default sort
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY;
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        RETURN -1;
    END CATCH
END
GO



-- 25. Get Orders with Pagination and Search
EXEC sp_GetOrdersWithPaginationAndSearch 
    @PageNumber = 1, 
    @PageSize = 10, 
    @SortColumn = 'OrderDate', 
    @SortDirection = 'DESC', 
    @SearchTerm = 'John';

