# Employee Management System - Part 2

A web application for viewing and managing employee data with sorting, searching, and pagination capabilities.

## Technology Stack

- **HTML5** - Structure
- **Bootstrap 4.6** - CSS Framework
- **jQuery 3.6** - DOM manipulation
- **JavaScript (ES6)** - Application logic
- **Ajax** - Asynchronous data fetching

## Features

✅ Display employee list in table format
✅ Sort by Name, Email, and Department
✅ Real-time search across all fields
✅ Pagination with customizable page size (5, 10, 20, 50)
✅ Employee detail modal (click eye icon or row)
✅ Department color coding (matching C# enum)
✅ Date formatting (dd-MMM-yyyy format)
✅ Gender display (F/M)
✅ Responsive design
✅ Exception handling with user-friendly error messages

## Project Structure

```
Part2-WebApp/
├── index.html              # Main HTML file
├── README.md               # This file
├── css/
│   └── custom.css          # Custom styling & department colors
└── js/
    ├── app.js              # Main application logic
    ├── date-formatter.js   # Date formatting module
    ├── employee-service.js # Ajax service module
    └── validators.js       # Validation & sanitization module
```

## Setup Instructions

### Prerequisites

1. **Part 1 Console Application**
   - Ensure Part 1 console application has been executed
   - Verify that `EmployeeData_MMddyyyy.json` file exists
   - The JSON file should be in the parent directory or at the configured path

2. **Local Web Server**
   - This application requires a web server to avoid CORS issues
   - **Do not** open `index.html` directly in browser (file:// protocol)

### Installation Steps

1. **Extract/Clone the Project**

   ```bash
   cd Task2/Part2-WebApp
   ```

2. **Verify JSON File Location**
   - Default path: `../EmployeeData_03132026.json` (parent directory)
   - If your file is elsewhere, update the path in `js/employee-service.js`
   - Look for: `jsonFilePath: '../EmployeeData_03132026.json'`

3. **Start a Local Web Server**

   **Option A: Using Python**

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option B: Using Node.js (http-server)**

   ```bash
   npx http-server -p 8000
   ```

   **Option C: Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

   **Option D: Using IIS Express**

   ```bash
   iisexpress.exe /path:"C:\Hansha\Projects\Training1\Training\Training\C#\ExamTasks\Task2\Part2-WebApp" /port:8000
   ```

4. **Access the Application**
   - Open browser and navigate to: `http://localhost:8000`
   - The application will automatically load employee data from the JSON file

## Usage

### View Employee List

- The table displays employee data with columns:
  - #
  - Name (sortable)
  - Gender
  - Department (sortable, color-coded)
  - Email (sortable)
  - Phone
  - Actions

### Search Employees

- Type in the search box to filter employees
- Search works across: Name, Email, Department, Phone, City, State, Designation
- Results update automatically as you type (debounced)
- Click "Clear" to reset search

### Sort Columns

- Click column headers (Name, Email, Department) to sort
- Click again to toggle ascending/dending order
- Sort indicators (arrows) show current sort state

### View Employee Details

- Click the **eye icon** button in Actions column
- OR click anywhere on the employee row
- Modal displays all employee information

### Change Page Size

- Use the dropdown to select: 5, 10, 20, or 50 records per page
- Table automatically adjusts

### Navigate Pages

- Use **Previous** and **Next** buttons
- Click specific page numbers
- Current page is highlighted

## Department Colors

The department badges use colors matching the C# enum:

| Department  | Color  |
| ----------- | ------ |
| Sales       | Red    |
| Marketing   | Green  |
| Development | Black  |
| QA          | Blue   |
| HR          | Orange |
| SEO         | Pink   |

## Date Formatting

All dates are displayed in `dd-MMM-yyyy` format (e.g., 04-Mar-2022)

## File Locations

- **HTML**: `index.html`
- **CSS**: `css/custom.css`
- **JavaScript**: `js/app.js`, `js/date-formatter.js`, `js/employee-service.js`, `js/validators.js`
- **Data**: `../EmployeeData_03132026.json` (configurable)

## Troubleshooting

### Issue: "Failed to fetch employee data"

**Solution:**

1. Verify JSON file exists in the correct location
2. Ensure you're using a web server (not file:// protocol)
3. Check browser console for detailed error messages
4. Verify JSON file path in `js/employee-service.js`

### Issue: "CORS restriction" error

**Solution:**

- You must use a web server (see Setup Instructions above)
- Direct file access (file://) won't work due to browser security

### Issue: "Invalid JSON format"

**Solution:**

1. Validate JSON file structure using JSON validator
2. Ensure JSON file is an array of employee objects
3. Check for syntax errors in JSON file

### Issue: Table shows "No employees found"

**Solution:**

1. Clear search filters
2. Verify JSON file contains employee data
3. Check browser console for JavaScript errors

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

## Development Guidelines

This application follows best practices:

- **Modular Code**: Separated concerns (service, validators, formatters)
- **IIFE Pattern**: Encapsulated modules to avoid global scope pollution
- **jQuery Best Practices**: Cached selectors, event delegation, proper Ajax usage
- **Exception Handling**: Comprehensive error handling with user-friendly messages
- **Security**: Input sanitization to prevent XSS attacks
- **Responsive Design**: Mobile-friendly layout
- **Performance**: Debounced search, efficient DOM manipulation

## Module Descriptions

### app.js

Main application logic with event handlers, UI rendering, pagination, and modal management.

### date-formatter.js

Date formatting utilities for `dd-MMM-yyyy` format and experience calculation.

### employee-service.js

Ajax service for fetching employee data, filtering, sorting, and pagination logic.

### validators.js

Input validation, sanitization, and data integrity checks.

### custom.css

Department color coding, table styling, responsive design, and UI enhancements.

## Testing Checklist

- [ ] Load employee list from JSON
- [ ] Display all records in table
- [ ] Search by name
- [ ] Search by email
- [ ] Search by department
- [ ] Sort by Name (ascending/descending)
- [ ] Sort by Email (ascending/descending)
- [ ] Sort by Department (ascending/descending)
- [ ] Pagination - Previous/Next buttons
- [ ] Pagination - Direct page click
- [ ] Change page size
- [ ] View employee details modal
- [ ] Display correct gender (F/M)
- [ ] Department colors match enum values
- [ ] Date format is correct (dd-MMM-yyyy)
- [ ] Clear search functionality
- [ ] Responsive design on mobile

## Support

For issues or questions:

1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Verify all prerequisites are met
4. Consult the development plan: `Part2-DevelopmentPlan.md`

## License

Educational project for training purposes.

---

**Version:** 1.0.0
**Last Updated:** March 13, 2026
**Part:** 2 of 2 - Employee Management System
