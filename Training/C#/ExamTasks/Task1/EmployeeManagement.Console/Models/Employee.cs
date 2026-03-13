using System;
using Newtonsoft.Json;

namespace EmployeeManagement.Console.Models
{
    /// <summary>
    /// Represents an employee in the system
    /// </summary>
    public class Employee
    {
        /// <summary>
        /// Unique identifier for the employee
        /// </summary>
        [JsonProperty("employeeId")]
        public string EmployeeID { get; set; }

        /// <summary>
        /// Full name of the employee
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; }

        /// <summary>
        /// Date of birth of the employee
        /// </summary>
        [JsonProperty("dob")]
        public DateTime DOB { get; set; }

        /// <summary>
        /// Gender of the employee (F for Female, M for Male)
        /// </summary>
        [JsonProperty("gender")]
        public char Gender { get; set; }

        /// <summary>
        /// Job designation/title of the employee
        /// </summary>
        [JsonProperty("designation")]
        public string Designation { get; set; }

        /// <summary>
        /// City where the employee is located
        /// </summary>
        [JsonProperty("city")]
        public string City { get; set; }

        /// <summary>
        /// State where the employee is located
        /// </summary>
        [JsonProperty("state")]
        public string State { get; set; }

        /// <summary>
        /// Postal code for the employee's address
        /// </summary>
        [JsonProperty("postcode")]
        public string Postcode { get; set; }

        /// <summary>
        /// Contact phone number
        /// </summary>
        [JsonProperty("phone")]
        public string Phone { get; set; }

        /// <summary>
        /// Email address of the employee
        /// </summary>
        [JsonProperty("email")]
        public string Email { get; set; }

        /// <summary>
        /// Date when the employee joined the company
        /// </summary>
        [JsonProperty("dateOfJoining")]
        public DateTime DateOfJoining { get; set; }

        /// <summary>
        /// Calculated total experience (automatically computed)
        /// </summary>
        [JsonProperty("totalExperience")]
        public string TotalExperience { get; set; }

        /// <summary>
        /// Additional remarks or notes
        /// </summary>
        [JsonProperty("remarks")]
        public string Remarks { get; set; }

        /// <summary>
        /// Department the employee belongs to
        /// </summary>
        [JsonProperty("department")]
        public Department Department { get; set; }

        /// <summary>
        /// Monthly salary of the employee
        /// </summary>
        [JsonProperty("monthlySalary")]
        public decimal MonthlySalary { get; set; }
    }
}
