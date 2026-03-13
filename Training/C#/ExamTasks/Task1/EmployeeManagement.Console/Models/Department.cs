using System.ComponentModel;

namespace EmployeeManagement.Console.Models
{
    /// <summary>
    /// Represents the department an employee belongs to
    /// </summary>
    public enum Department
    {
        [Description("Sales")]
        Sales = 1,

        [Description("Marketing")]
        Marketing = 2,

        [Description("Development")]
        Development = 3,

        [Description("QA")]
        QA = 4,

        [Description("HR")]
        HR = 5,

        [Description("SEO")]
        SEO = 6
    }

    /// <summary>
    /// Extension methods for Department enum
    /// </summary>
    public static class DepartmentExtensions
    {
        /// <summary>
        /// Gets the color associated with each department
        /// </summary>
        /// <param name="dept">The department enum value</param>
        /// <returns>The color name as a string</returns>
        public static string GetColor(this Department dept)
        {
            return dept switch
            {
                Department.Sales => "Red",
                Department.Marketing => "Green",
                Department.Development => "Black",
                Department.QA => "Blue",
                Department.HR => "Orange",
                Department.SEO => "Pink",
                _ => "Gray"
            };
        }
    }
}
