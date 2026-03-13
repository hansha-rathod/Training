using System;

namespace EmployeeManagement.Console.Utilities
{
    /// <summary>
    /// Extension methods for DateTime operations
    /// </summary>
    public static class DateExtensions
    {
        /// <summary>
        /// Formats a date in the specified format (dd-MMM-yyyy)
        /// </summary>
        /// <param name="date">The date to format</param>
        /// <returns>Formatted date string</returns>
        public static string ToFormattedDate(this DateTime date)
        {
            return date.ToString("dd-MMM-yyyy");
        }

        /// <summary>
        /// Calculates the age based on date of birth
        /// </summary>
        /// <param name="dob">Date of birth</param>
        /// <returns>Age in years</returns>
        public static int CalculateAge(this DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (today < dob.AddYears(age)) age--;
            return age;
        }
    }
}
