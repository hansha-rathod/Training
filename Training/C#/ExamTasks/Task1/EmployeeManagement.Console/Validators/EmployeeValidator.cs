using System;
using System.Text.RegularExpressions;
using EmployeeManagement.Console.Models;
using EmployeeManagement.Console.Utilities;

namespace EmployeeManagement.Console.Validators
{
    /// <summary>
    /// Validates employee data according to business rules
    /// </summary>
    public class EmployeeValidator
    {
        /// <summary>
        /// Result of a validation operation
        /// </summary>
        public class ValidationResult
        {
            public bool IsValid { get; set; }
            public string ErrorMessage { get; set; }
        }

        /// <summary>
        /// Validates all employee properties
        /// </summary>
        /// <param name="employee">The employee to validate</param>
        /// <param name="existingEmployees">Array of existing employees for duplicate checking</param>
        /// <returns>Validation result with success status and error message if applicable</returns>
        public ValidationResult ValidateEmployee(Employee employee, Employee[] existingEmployees)
        {
            // Check for duplicates (both EmployeeID and Email)
            if (IsDuplicateEmployee(employee, existingEmployees))
            {
                return new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = "Employee with this ID or Email already exists."
                };
            }

            // Validate Employee ID
            if (string.IsNullOrWhiteSpace(employee.EmployeeID))
            {
                return new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = "Employee ID cannot be empty."
                };
            }

            // Validate Name
            var nameResult = ValidateName(employee.Name);
            if (!nameResult.IsValid) return nameResult;

            // Validate DOB
            var dobResult = ValidateDOB(employee.DOB);
            if (!dobResult.IsValid) return dobResult;

            // Validate Gender
            var genderResult = ValidateGender(employee.Gender);
            if (!genderResult.IsValid) return genderResult;

            // Validate Email
            var emailResult = ValidateEmail(employee.Email);
            if (!emailResult.IsValid) return emailResult;

            // Validate Phone
            var phoneResult = ValidatePhone(employee.Phone);
            if (!phoneResult.IsValid) return phoneResult;

            // Validate Postcode
            var postcodeResult = ValidatePostcode(employee.Postcode);
            if (!postcodeResult.IsValid) return postcodeResult;

            // Validate Salary
            var salaryResult = ValidateSalary(employee.MonthlySalary);
            if (!salaryResult.IsValid) return salaryResult;

            // Validate Date of Joining
            var joiningResult = ValidateDateOfJoining(employee.DateOfJoining);
            if (!joiningResult.IsValid) return joiningResult;

            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Checks if an employee already exists based on ID or Email
        /// </summary>
        private bool IsDuplicateEmployee(Employee employee, Employee[] existingEmployees)
        {
            if (existingEmployees == null) return false;
            return Array.Exists(existingEmployees,
                e => e.EmployeeID == employee.EmployeeID || e.Email == employee.Email);
        }

        /// <summary>
        /// Validates employee name
        /// </summary>
        private ValidationResult ValidateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return new ValidationResult { IsValid = false, ErrorMessage = "Name cannot be empty." };
            if (name.Length < 2)
                return new ValidationResult { IsValid = false, ErrorMessage = "Name must be at least 2 characters." };
            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Validates date of birth
        /// </summary>
        private ValidationResult ValidateDOB(DateTime dob)
        {
            if (dob > DateTime.Today)
                return new ValidationResult { IsValid = false, ErrorMessage = "Date of Birth cannot be in the future." };

            var age = dob.CalculateAge();
            if (age < 18)
                return new ValidationResult { IsValid = false, ErrorMessage = "Employee must be at least 18 years old." };

            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Validates gender input
        /// </summary>
        private ValidationResult ValidateGender(char gender)
        {
            if (gender != 'F' && gender != 'M')
                return new ValidationResult { IsValid = false, ErrorMessage = "Gender must be 'F' or 'M'." };
            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Validates email format
        /// </summary>
        private ValidationResult ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return new ValidationResult { IsValid = false, ErrorMessage = "Email cannot be empty." };

            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(email, emailPattern))
                return new ValidationResult { IsValid = false, ErrorMessage = "Invalid email format." };

            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Validates phone number format
        /// </summary>
        private ValidationResult ValidatePhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return new ValidationResult { IsValid = false, ErrorMessage = "Phone cannot be empty." };

            var phonePattern = @"^\+?[\d\s\-\(\)]+$";
            if (!Regex.IsMatch(phone, phonePattern))
                return new ValidationResult { IsValid = false, ErrorMessage = "Invalid phone number format." };

            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Validates postal code
        /// </summary>
        private ValidationResult ValidatePostcode(string postcode)
        {
            if (string.IsNullOrWhiteSpace(postcode))
                return new ValidationResult { IsValid = false, ErrorMessage = "Postcode cannot be empty." };

            if (!Regex.IsMatch(postcode, @"^\d+$"))
                return new ValidationResult { IsValid = false, ErrorMessage = "Postcode must contain only numbers." };

            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Validates salary amount
        /// </summary>
        private ValidationResult ValidateSalary(decimal salary)
        {
            if (salary <= 0)
                return new ValidationResult { IsValid = false, ErrorMessage = "Salary must be a positive value." };
            return new ValidationResult { IsValid = true };
        }

        /// <summary>
        /// Validates date of joining
        /// </summary>
        private ValidationResult ValidateDateOfJoining(DateTime dateOfJoining)
        {
            if (dateOfJoining > DateTime.Today)
                return new ValidationResult { IsValid = false, ErrorMessage = "Date of Joining cannot be in the future." };
            return new ValidationResult { IsValid = true };
        }
    }
}
