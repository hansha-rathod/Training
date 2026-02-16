
CREATE TYPE staff_role_enum AS ENUM (
    'chef',
    'waiter',
    'manager'
);

--STAFF

CREATE TABLE staff (
    staff_id       BIGSERIAL PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    phone          VARCHAR(15) UNIQUE,
    role           staff_role_enum NOT NULL,
    salary         NUMERIC(10,2) NOT NULL CHECK (salary >= 0),
    hired_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active      BOOLEAN DEFAULT TRUE
);

INSERT INTO staff (full_name, phone, role, salary)
VALUES
('Arjun Mehta', '9000000001', 'manager', 60000),
('Ravi Sharma', '9000000002', 'chef', 40000),
('Karan Patel', '9000000003', 'chef', 42000),
('Neha Singh', '9000000004', 'waiter', 25000),
('Priya Joshi', '9000000005', 'waiter', 26000);


--CUSTOMERS

CREATE TABLE customers (
    customer_id   BIGSERIAL PRIMARY KEY,
    full_name     VARCHAR(100),
    phone         VARCHAR(15) UNIQUE,
    email         VARCHAR(100) UNIQUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active     BOOLEAN DEFAULT TRUE
);

INSERT INTO customers (full_name, phone, email)
VALUES
('Amit Verma', '9100000001', 'amit@email.com'),
('Sneha Kapoor', '9100000002', 'sneha@email.com'),
('Rahul Desai', '9100000003', 'rahul@email.com'),
('Pooja Shah', '9100000004', 'pooja@email.com'),
('Walk-in Customer', NULL, NULL);

--SUPPLIERS

CREATE TABLE suppliers (
    supplier_id   BIGSERIAL PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    contact_name  VARCHAR(100),
    phone         VARCHAR(15),
    email         VARCHAR(100),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active     BOOLEAN DEFAULT TRUE
);

INSERT INTO suppliers (supplier_name, contact_name, phone, email)
VALUES
('Fresh Farms Ltd', 'Mr. Iyer', '9200000001', 'contact@freshfarms.com'),
('Dairy Best', 'Ms. Ritu', '9200000002', 'sales@dairybest.com'),
('Spice World', 'Mr. Khan', '9200000003', 'info@spiceworld.com'),
('Beverage Hub', 'Mr. Thomas', '9200000004', 'orders@bevhub.com'),
('Grain Suppliers Co', 'Mr. Roy', '9200000005', 'support@grainco.com');

--DISHES

CREATE TABLE dishes (
    dish_id       BIGSERIAL PRIMARY KEY,
    dish_name     VARCHAR(150) NOT NULL,
    current_price NUMERIC(10,2) NOT NULL CHECK (current_price >= 0),
    is_available  BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO dishes (dish_name, current_price)
VALUES
('Margherita Pizza', 300),
('Veg Burger', 150),
('Pasta Alfredo', 280),
('Cold Coffee', 120),
('Masala Dosa', 180);

--ORDERS OF CUSTOMERS

CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'served',
    'completed',
    'cancelled'
);


CREATE TABLE orders (
    order_id      BIGSERIAL PRIMARY KEY,
    customer_id   BIGINT REFERENCES customers(customer_id) ON DELETE SET NULL,
    staff_id      BIGINT NOT NULL REFERENCES staff(staff_id),
    order_status  order_status_enum DEFAULT 'pending',
    order_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount  NUMERIC(12,2) DEFAULT 0 CHECK (total_amount >= 0)
);

INSERT INTO orders (customer_id, staff_id, order_status, total_amount)
VALUES
(1, 4, 'completed', 0),
(2, 5, 'completed', 0),
(3, 4, 'completed', 0),
(5, 5, 'completed', 0),
(1, 4, 'completed', 0);

--ORDER ITEMS IN AN ORDER FOR CUSTOMER

CREATE TABLE order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id      BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    dish_id       BIGINT NOT NULL REFERENCES dishes(dish_id),
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal      NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

INSERT INTO order_items (order_id, dish_id, quantity, unit_price)
VALUES
(1, 1, 2, 300),  -- 2 pizzas
(1, 4, 1, 120),  -- 1 cold coffee

(2, 2, 3, 150),  -- 3 burgers
(2, 4, 2, 120),

(3, 5, 2, 180),

(4, 3, 1, 280),

(5, 1, 1, 300),
(5, 2, 1, 150);


--CUSTOMER PAYMENTS

CREATE TYPE payment_method_enum AS ENUM (
    'cash',
    'card',
    'upi',
    'bank_transfer'
);


CREATE TABLE customer_payments (
    payment_id    BIGSERIAL PRIMARY KEY,
    order_id      BIGINT NOT NULL REFERENCES orders(order_id),
    amount_paid   NUMERIC(12,2) NOT NULL CHECK (amount_paid > 0),
    payment_method payment_method_enum NOT NULL,
    paid_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customer_payments (order_id, amount_paid, payment_method)
VALUES
(1, 720, 'card'),

(2, 300, 'cash'),
(2, 390, 'upi'),

(3, 360, 'cash'),
(4, 280, 'card'),
(5, 450, 'upi');

--SUPPLY ORDERS

CREATE TYPE supply_status_enum AS ENUM (
    'ordered',
    'received',
    'cancelled'
);

CREATE TABLE supply_orders (
    supply_order_id BIGSERIAL PRIMARY KEY,
    supplier_id     BIGINT NOT NULL REFERENCES suppliers(supplier_id),
    status          supply_status_enum DEFAULT 'ordered',
    order_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount    NUMERIC(12,2) DEFAULT 0 CHECK (total_amount >= 0)
);

INSERT INTO supply_orders (supplier_id, status, total_amount)
VALUES
(1, 'received', 0),
(2, 'received', 0),
(3, 'ordered', 0),
(4, 'received', 0),
(5, 'ordered', 0);

--SUPPLY ORDERS ITEMS FOR AN ORDER TO SUPPLIER

CREATE TABLE supply_order_items (
    supply_item_id  BIGSERIAL PRIMARY KEY,
    supply_order_id BIGINT NOT NULL REFERENCES supply_orders(supply_order_id) ON DELETE CASCADE,
    item_name       VARCHAR(150) NOT NULL,
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost       NUMERIC(10,2) NOT NULL CHECK (unit_cost >= 0),
    subtotal        NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED
);

INSERT INTO supply_order_items (supply_order_id, item_name, quantity, unit_cost)
VALUES
(1, 'Tomatoes (kg)', 50, 40),
(1, 'Onions (kg)', 30, 35),

(2, 'Cheese Blocks', 20, 250),

(3, 'Spice Mix Packets', 100, 15),

(4, 'Cold Drink Bottles', 200, 30),

(5, 'Wheat Flour (kg)', 100, 45);

--SUPPLY PAYMENTS

CREATE TABLE supply_payments (
    payment_id      BIGSERIAL PRIMARY KEY,
    supply_order_id BIGINT NOT NULL REFERENCES supply_orders(supply_order_id),
    amount_paid     NUMERIC(12,2) NOT NULL CHECK (amount_paid > 0),
    payment_method  payment_method_enum NOT NULL,
    paid_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO supply_payments (supply_order_id, amount_paid, payment_method)
VALUES
(1, 3050, 'bank_transfer'),
(2, 5000, 'bank_transfer'),
(4, 6000, 'upi');


------------------------------------------------------------------------------
-- TASK 1 -- INNER JOIN — Completed Orders with Customer & Staff

SELECT 
    o.order_id,
    c.full_name AS customer,
    s.full_name AS handled_by,
    o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN staff s ON o.staff_id = s.staff_id
WHERE o.order_status = 'completed';

------------------------------------------------------------------------------
-- 2 -- LEFT JOIN — Customers & Their Orders (including no orders)

SELECT 
    c.full_name,
    o.order_id,
    o.order_status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.full_name;


------------------------------------------------------------------------------
-- 3 -- RIGHT JOIN — Orders & Payments (including unpaid orders)

SELECT 
    o.order_id,
    o.order_status,
    p.amount_paid,
    p.payment_method
FROM orders o
RIGHT JOIN customer_payments p 
    ON o.order_id = p.order_id;



------------------------------------------------------------------------------
-- 4 -- FULL OUTER JOIN — Orders vs Payments Audit

SELECT 
    o.order_id,
    p.payment_id,
    o.total_amount,
    p.amount_paid
FROM orders o
FULL OUTER JOIN customer_payments p
    ON o.order_id = p.order_id;

------------------------------------------------------------------------------
-- 5 -- VIEW — Frequently Used Sales Report

CREATE VIEW v_order_summary AS
SELECT 
    o.order_id,
    c.full_name AS customer,
    s.full_name AS staff,
    o.total_amount,
    o.order_status
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
JOIN staff s ON o.staff_id = s.staff_id;


SELECT * FROM v_order_summary WHERE order_status = 'completed';


------------------------------------------------------------------------------
-- 6 -- ENUM — Count Orders by Status

SELECT 
    order_status,
    COUNT(*) AS total_orders
FROM orders
GROUP BY order_status;

-------------------------------------------------------------------------------
-- 7 -- INDEXING — Speed Up Order Searches

CREATE INDEX idx_orders_status 
ON orders(order_status);

CREATE INDEX idx_orders_time 
ON orders(order_time);



-------------------------------------------------------------------------------
-- 8 -- TRANSACTION — Safe Payment Entry


DO $$
BEGIN
    BEGIN
        --  Start transaction (implicit inside DO block)

        UPDATE orders
        SET order_status = 'cancelled'
        WHERE order_id = 2
        AND order_status IN ('pending', 'confirmed');

        --  If no rows updated → trigger rollback
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Order cannot be cancelled';
        END IF;

        DELETE FROM order_items
        WHERE order_id = 2;

        --  Commit happens automatically if no error

    EXCEPTION
        WHEN OTHERS THEN
            --  Explicit rollback behaviour
            RAISE NOTICE 'Transaction rolled back: %', SQLERRM;
            RAISE;  -- rethrow error (forces rollback)
    END;
END $$;





-------------------------------------------------------------------------------
-- 9 -- FUNCTION — Calculate Order Total

CREATE OR REPLACE FUNCTION calculate_order_total(p_order_id BIGINT)
RETURNS NUMERIC 
AS $$
DECLARE
    total NUMERIC;
BEGIN
    SELECT COALESCE(SUM(subtotal), 0)
    INTO total
    FROM order_items
    WHERE order_id = p_order_id;

    RETURN total;
END;
$$ LANGUAGE plpgsql;


-------------------------------------------------------------------------------
-- 10 -- STORED PROCEDURE — Update Order Total


CREATE OR REPLACE PROCEDURE update_order_total(p_order_id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE orders
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM order_items
        WHERE order_id = p_order_id
    )
    WHERE order_id = p_order_id;
END;
$$;











