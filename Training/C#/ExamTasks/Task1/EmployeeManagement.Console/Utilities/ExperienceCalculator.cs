using System;

namespace EmployeeManagement.Console.Utilities
{
    /// <summary>
    /// Provides methods to calculate employee work experience
    /// </summary>
    public static class ExperienceCalculator
    {
        /// <summary>
        /// Calculates the total experience from the date of joining
        /// </summary>
        /// <param name="dateOfJoining">The date when the employee joined</param>
        /// <returns>Experience in the format "X Years Y Months"</returns>
        public static string CalculateExperience(DateTime dateOfJoining)
        {
            // Handle future dates
            if (dateOfJoining > DateTime.Today)
                return "0 Years 0 Months";

            // Calculate total months difference
            var totalMonths = (DateTime.Today.Year - dateOfJoining.Year) * 12 +
                              DateTime.Today.Month - dateOfJoining.Month;

            // Adjust if the day of the month hasn't occurred yet
            if (DateTime.Today.Day < dateOfJoining.Day)
                totalMonths--;

            // Calculate years and months
            var years = totalMonths / 12;
            var months = totalMonths % 12;

            // Handle negative months (edge case)
            if (months < 0)
            {
                years--;
                months += 12;
            }

            return $"{years} Years {months} Months";
        }
    }
}
