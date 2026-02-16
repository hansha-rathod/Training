
CREATE TABLE company ( 
    id UUID PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 


CREATE TABLE department ( 
    id UUID PRIMARY KEY, 
    company_id UUID REFERENCES company(id) ON DELETE CASCADE, 
    name VARCHAR(100) NOT NULL, 
    budget NUMERIC(12,2) NOT NULL 
); 


CREATE TABLE employee ( 
    id UUID PRIMARY KEY, 
    company_id UUID REFERENCES company(id) ON DELETE CASCADE, 
    department_id UUID REFERENCES department(id) ON DELETE SET NULL, 
    first_name VARCHAR(50), 
    last_name VARCHAR(50), 
    salary NUMERIC(10,2), 
    joining_date DATE, 
    is_active BOOLEAN DEFAULT TRUE 
); 


------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-----------------

INSERT INTO company (id, name)
VALUES
    (gen_random_uuid(), 'TechNova'),
    (gen_random_uuid(), 'FinEdge');

-- TechNova Departments
INSERT INTO department (id, company_id, name, budget)
SELECT gen_random_uuid(), id, 'Engineering', 500000
FROM company WHERE name = 'TechNova';

INSERT INTO department (id, company_id, name, budget)
SELECT gen_random_uuid(), id, 'HR', 150000
FROM company WHERE name = 'TechNova';

-- FinEdge Departments
INSERT INTO department (id, company_id, name, budget)
SELECT gen_random_uuid(), id, 'Finance', 400000
FROM company WHERE name = 'FinEdge';



-- Employees in TechNova → Engineering
INSERT INTO employee (id, company_id, department_id, first_name, last_name, salary, joining_date)
SELECT 
    gen_random_uuid(),
    c.id,
    d.id,
    'Alice',
    'Sharma',
    80000,
    '2023-06-15'
FROM company c
JOIN department d ON c.id = d.company_id
WHERE c.name = 'TechNova' AND d.name = 'Engineering';

INSERT INTO employee (id, company_id, department_id, first_name, last_name, salary, joining_date)
SELECT 
    gen_random_uuid(),
    c.id,
    d.id,
    'Rahul',
    'Verma',
    60000,
    '2024-01-10'
FROM company c
JOIN department d ON c.id = d.company_id
WHERE c.name = 'TechNova' AND d.name = 'Engineering';

-- Employee in TechNova → HR
INSERT INTO employee (id, company_id, department_id, first_name, last_name, salary, joining_date)
SELECT 
    gen_random_uuid(),
    c.id,
    d.id,
    'Neha',
    'Iyer',
    50000,
    '2022-09-01'
FROM company c
JOIN department d ON c.id = d.company_id
WHERE c.name = 'TechNova' AND d.name = 'HR';

-- Employee in FinEdge → Finance
INSERT INTO employee (id, company_id, department_id, first_name, last_name, salary, joining_date)
SELECT 
    gen_random_uuid(),
    c.id,
    d.id,
    'Arjun',
    'Mehta',
    90000,
    '2021-03-20'
FROM company c
JOIN department d ON c.id = d.company_id
WHERE c.name = 'FinEdge' AND d.name = 'Finance';


-----------------------------------------------------------------------
-----------------------------------------------------------------------

-- Task 1: Department Salary Summary Function 

CREATE OR REPLACE FUNCTION fn_active_employee_info( dep_id UUID )
RETURNS TABLE(
	active_emp INT,
	salary_active_emp NUMERIC(12, 2),
	avg_salary_active_emp NUMERIC(12, 2)
)
AS $$
	BEGIN
		RETURN QUERY
		SELECT 
			COUNT(*)::INT,
			COALESCE(SUM(salary), 0),
			COALESCE(AVG(salary), 0)
		
		FROM employee
		WHERE department_id = dep_id
			AND is_active = TRUE;
	END;
$$
LANGUAGE plpgsql;

SELECT * FROM employee;

SELECT * FROM 
fn_active_employee_info('fbc40552-efff-4eaf-a1e8-205f40ab8645'::uuid);


----------------------------------------------------------------
----------------------------------------------------------------


-- Task 2: Employee Transfer Procedure 
CREATE OR REPLACE PROCEDURE transfer_employee(
    p_employee_id UUID,
    p_new_department_id UUID
)
AS $$
DECLARE
    v_employee_company UUID;
    v_department_company UUID;
BEGIN
    -- Check employee
    SELECT company_id
    INTO v_employee_company
    FROM employee
    WHERE id = p_employee_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Employee does not exist';
    END IF;

    -- Check department
    SELECT company_id
    INTO v_department_company
    FROM department
    WHERE id = p_new_department_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Department does not exist';
    END IF;

    -- Company match validation
    IF v_employee_company <> v_department_company THEN
        RAISE EXCEPTION 'Department belongs to a different company';
    END IF;

    -- Transfer
    UPDATE employee
    SET department_id = p_new_department_id
    WHERE id = p_employee_id;

END;
$$ LANGUAGE plpgsql;
-------------------------------------------------
-- (emp_id, dept_id)
CALL transfer_employee('d9603c8b-05fb-4563-9593-2c86041dc8d6', '1c474b3e-e7f2-40a1-8f68-dee67038c362');


---

SELECT 
	d.id AS department_id,
	e.id AS employee_id,
	c.name AS company_name,
	d.name AS department_name,
	e.first_name AS Employee_name,
	e.salary AS Salary
FROM department d
JOIN employee e
ON 
	d.id = e.department_id
JOIN company c
	ON c.id = d.company_id;

----
SELECT * FROM company;
SELECT * FROM department;

------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------

-- Task 3: Increase Salary by Employee Function 


CREATE OR REPLACE FUNCTION fn_salary_increase(emp_id UUID, percentage NUMERIC(12, 2))
RETURNS NUMERIC(12, 2)
AS 
$$
DECLARE updated_salary NUMERIC(12, 2);
BEGIN
	IF percentage <= 0 THEN
		RAISE EXCEPTION 'Percentage must be greater than zero';
	END IF;

	
	SELECT salary
	INTO updated_salary
	FROM employee
	WHERE id = emp_id
		AND is_active = TRUE;

	
	IF NOT FOUND THEN
        RAISE EXCEPTION 'Employee does not exist or is inactive';
    END IF;

	
	UPDATE employee
	SET salary = salary + (salary * percentage / 100)
	WHERE id = emp_id
	RETURNING salary INTO updated_salary;

	RETURN updated_salary;
	
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------

SELECT fn_salary_increase('d9603c8b-05fb-4563-9593-2c86041dc8d6'::uuid, 10);

SELECT * FROM employee;




-------------------------------------------------
-- Budget validation in salary increment

CREATE OR REPLACE FUNCTION fn_budget_validation(
	emp_id UUID,
	percentage NUMERIC(12, 2)
)
RETURNS NUMERIC(12, 2)
AS
$$
DECLARE 
	v_current_salary NUMERIC(12, 2);
	v_new_salary NUMERIC(12, 2);
	v_department_id UUID;
	v_budget NUMERIC(12, 2);
	v_total_salary NUMERIC(12, 2);

BEGIN
	IF percentage <= 0 THEN
	RAISE EXCEPTION 'Percentage must be greater than zero';
	END IF;

	SELECT salary, department_id
	INTO v_current_salary, v_department_id
	FROM employee
	WHERE id = emp_id AND
	is_active = TRUE;


	IF NOT FOUND THEN
        RAISE EXCEPTION 'Employee does not exist or is inactive';
    END IF;



	v_new_salary := v_current_salary + (v_current_salary * percentage / 100);
	

	SELECT budget
    INTO v_budget
    FROM department
    WHERE id = v_department_id;

    IF v_budget IS NULL THEN
        RAISE EXCEPTION 'Employee is not assigned to a valid department';
    END IF;

    
    SELECT COALESCE(SUM(salary), 0)
    INTO v_total_salary
    FROM employee
    WHERE department_id = v_department_id
      AND is_active = TRUE;

    
    IF (v_total_salary - v_current_salary + v_new_salary) > v_budget THEN
        RAISE EXCEPTION 
        'Salary increase exceeds department budget.';
    END IF;

 
    UPDATE employee
    SET salary = v_new_salary
    WHERE id = emp_id;

    RETURN v_new_salary;

END;
$$ LANGUAGE plpgsql;


SELECT fn_budget_validation(
    (SELECT id FROM employee WHERE first_name = 'Alice'),
    1500
);




SELECT * FROM employee;

 