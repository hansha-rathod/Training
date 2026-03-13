# Employee Management System - Development Plan

## Overview
This project consists of two parts:
1. **C# Console Application** - Employee data management with JSON storage
2. **Web Application** - Employee listing with sorting, searching, and paging

---

## Part #1: C# Console Application

### Architecture & Components

#### 1. Project Structure
```
EmployeeManagement.Console/
├── Models/
│   ├── Employee.cs              # Employee entity model
│   └── Department.cs            # Department enum with colors
├── Services/
│   ├── IEmployeeService.cs      # Interface for employee operations
│   ├── EmployeeService.cs       # Implementation of CRUD operations
│   ├── IJsonFileService.cs      # Interface for JSON file operations
│   └── JsonFileService.cs       # JSON read/write operations
├── Validators/
│   └── EmployeeValidator.cs     # Input validation logic
├── Utilities/
│   └── DateExtensions.cs        # Extension method for date formatting
├── App.config                   # Configuration for file path
└── Program.cs                   # Main entry point & UI
```

#### 2. Data Model Specifications

**Employee.cs Properties:**
| Property | Type | Description |
|----------|------|-------------|
| EmployeeID | string | Unique identifier (GUID or auto-increment) |
| Name | string | Full name |
| DOB | DateTime | Date of Birth |
| Gender | char | 'F' or 'M' |
| Designation | string | Job designation |
| City | string | City name |
| State | string | State name |
| Postcode | string | Postal code |
| Phone | string | Contact number |
| Email | string | Email address |
| DateOfJoining | DateTime | Joining date |
| TotalExperience | string | Calculated from joining date |
| Remarks | string | Additional notes |
| Department | Department | Enum value |
| MonthlySalary | decimal | Monthly salary amount |

**Department.cs Enum:**
```csharp
public enum Department
{
    [Description("Sales")]
    Sales,      // Red
    [Description("Marketing")]
    Marketing,  // Green
    [Description("Development")]
    Development, // Black
    [Description("QA")]
    QA,         // Blue
    [Description("HR")]
    HR,         // Orange
    [Description("SEO")]
    SEO         // Pink
}
```

#### 3. Core Features Implementation Plan

##### 3.1 Menu System
- **Option 1**: Add new Employee
- **Option 2**: Delete Employee by ID
- **Option 3**: Exit application
- Loop menu after each operation (except exit)

##### 3.2 Input Validation
Required validations:
- **EmployeeID**: Must be unique (check existing records)
- **Name**: Not empty, minimum 2 characters
- **DOB**: Valid date, not in future, age >= 18
- **Gender**: Only 'F' or 'M' accepted
- **Email**: Valid email format
- **Phone**: Valid phone number format
- **Postcode**: Numeric only, specific length
- **MonthlySalary**: Positive decimal value
- **DateOfJoining**: Valid date, not in future

##### 3.3 Business Logic
- **Total Experience Calculation**:
  ```csharp
  experience = CurrentDate - DateOfJoining
  Format: "X Years Y Months"
  ```
- **Duplicate Prevention**: Check EmployeeID + Email combination
- **Salary Sorting**: Descending order before saving to JSON
- **Auto EmployeeID**: Generate GUID if not provided

##### 3.4 JSON Storage
- **File Naming**: `EmployeeData_MMddyyyy.json`
- **File Path**: Read from App.config
- **Structure**: Array of employee objects
- **Error Handling**: Try-catch with proper error messages

#### 4. App.config Configuration
```xml
<configuration>
  <appSettings>
    <add key="JsonFilePath" value="C:\EmployeeData" />
    <add key="JsonFileName" value="EmployeeData" />
  </appSettings>
</configuration>
```

---

## Part #2: Web Application (HTML/Bootstrap/jQuery/Ajax)

### Architecture & Components

#### 1. Project Structure
```
EmployeeManagement.Web/
├── index.html                   # Main page
├── css/
│   └── styles.css              # Custom styles
├── js/
│   ├── app.js                  # Main application logic
│   ├── employee.service.js     # Ajax calls
│   └── utils.js                # Helper functions
└── data/                       # JSON file from console app
    └── EmployeeData_MMddyyyy.json
```

#### 2. UI Design Specifications

##### 2.1 Main Layout (Bootstrap)
- **Navbar**: Title "Employee Management System"
- **Search Section**: Input field with search icon
- **Table Section**:
  - Columns: Name, Gender, Department, Email, Phone, Actions
  - Sortable headers: Name, Email, Department
  - Department colored as per enum
- **Pagination**: Bottom of table
- **Modal**: Employee detail popup

##### 2.2 Table Column Specifications
| Column | Width | Sorting | Styling |
|--------|-------|---------|---------|
| Name | 20% | Yes | Bold |
| Gender | 10% | No | Center aligned |
| Department | 15% | Yes | Colored badge |
| Email | 25% | Yes | Link style |
| Phone | 15% | No | - |
| Actions | 15% | No | Eye icon button |

##### 2.3 Detail Modal
- **Fields**: All employee details
- **Date Format**: `04-Mar-2022` (DD-MMM-YYYY)
- **Layout**: Grid or form style

#### 3. JavaScript Features Implementation

##### 3.1 Employee Service (Ajax)
```javascript
class EmployeeService {
    async getEmployees() { /* Fetch all employees */ }
    async getEmployeeById(id) { /* Fetch single employee */ }
}
```

##### 3.2 Main Application Logic
```javascript
class EmployeeApp {
    // Pagination
    pageSize = 10
    currentPage = 1

    // State
    allEmployees = []
    filteredEmployees = []
    currentSort = { field: 'Name', direction: 'asc' }

    // Methods
    loadEmployees()
    renderTable()
    sortEmployees(field, direction)
    searchEmployees(query)
    showDetails(employeeId)
    paginate()
}
```

##### 3.3 Utility Functions
- Date formatting extension: `formatDate(date)`
- Department color mapping
- Input sanitization
- Error handling

#### 4. Key Features

##### 4.1 Sorting
- **Sortable Fields**: Name, Email, Department
- **Default**: Name ascending
- **Indicators**: Arrow icons in headers
- **Toggle**: Click to reverse direction

##### 4.2 Searching
- **Real-time**: Filter on keyup
- **Fields**: Name, Email, Department
- **Case-insensitive**: Partial matches allowed

##### 4.3 Pagination
- **Page Size**: 10 records per page
- **Controls**: Previous, Next, Page numbers
- **Info**: "Showing X-Y of Z records"

##### 4.4 Department Colors
| Department | Color | Hex Code |
|------------|-------|----------|
| Sales | Red | #dc3545 |
| Marketing | Green | #28a745 |
| Development | Black | #343a40 |
| QA | Blue | #007bff |
| HR | Orange | #fd7e14 |
| SEO | Pink | #e83e8c |

---

## Development Phases

### Phase 1: Setup & Foundation
- [ ] Create C# console project structure
- [ ] Set up App.config with file path
- [ ] Create HTML page with Bootstrap
- [ ] Set up project references (Newtonsoft.Json for C#)

### Phase 2: C# Backend Development
- [ ] Implement Employee model
- [ ] Create Department enum
- [ ] Implement JSON file service
- [ ] Create employee service with CRUD
- [ ] Add validation logic
- [ ] Implement menu system
- [ ] Add experience calculation
- [ ] Implement sorting by salary
- [ ] Test JSON persistence

### Phase 3: Web Frontend Development
- [ ] Create HTML layout with Bootstrap
- [ ] Implement Ajax service layer
- [ ] Create employee table rendering
- [ ] Add sorting functionality
- [ ] Implement search/filter
- [ ] Add pagination
- [ ] Create detail modal
- [ ] Apply department colors
- [ ] Format dates using extension method

### Phase 4: Integration & Testing
- [ ] Test C# app CRUD operations
- [ ] Verify JSON file structure
- [ ] Test web app with sample data
- [ ] Verify sorting functionality
- [ ] Test search functionality
- [ ] Verify pagination
- [ ] Test detail modal
- [ ] Exception handling testing

### Phase 5: Code Quality & Standards
- [ ] Add XML comments to C# code
- [ ] Follow C# naming conventions
- [ ] Apply JavaScript best practices
- [ ] Ensure OOPS principles are used
- [ ] Code review and refactoring
- [ ] Final testing

---

## Technical Requirements

### C# Console Application
- **.NET Framework**: 4.7.2 or higher
- **Dependencies**:
  - `Newtonsoft.Json` (for JSON serialization)
  - `System.Configuration` (for App.config)
- **Exception Handling**: Try-catch with meaningful messages
- **OOPS**: Encapsulation, inheritance, abstraction where applicable

### Web Application
- **HTML5**: Semantic markup
- **Bootstrap**: 4.6 or 5.x
- **jQuery**: 3.6+
- **Browser Support**: Chrome, Firefox, Edge

---

## Common Rules Applied to Both Parts

1. **Exception Handling**:
   - Try-catch blocks with specific error messages
   - Log errors to console/file
   - User-friendly error display

2. **OOPS Concepts**:
   - Use interfaces for services
   - Implement dependency injection (simple constructor)
   - Use classes/objects for related functionality
   - Apply inheritance where beneficial

3. **Coding Standards**:
   - Meaningful variable/function names
   - Proper indentation and spacing
   - Comments for complex logic
   - Separation of concerns

---

## Success Criteria

- [ ] C# app successfully creates JSON file with employee data
- [ ] JSON file is sorted by salary (descending)
- [ ] No duplicate employees can be added
- [ ] All validations work correctly
- [ ] Web app displays employee list correctly
- [ ] Sorting works on Name, Email, Department
- [ ] Search filters employees in real-time
- [ ] Pagination displays correct number of records
- [ ] Detail modal shows all employee information
- [ ] Department colors match the enum specification
- [ ] Date format is DD-MMM-YYYY
- [ ] Gender displays as F/M
- [ ] No runtime errors or unhandled exceptions

---

## Estimated Timeline

| Phase | Duration |
|-------|----------|
| Phase 1: Setup | 2 hours |
| Phase 2: C# Backend | 6-8 hours |
| Phase 3: Web Frontend | 6-8 hours |
| Phase 4: Integration & Testing | 3-4 hours |
| Phase 5: Code Quality | 2-3 hours |
| **Total** | **19-25 hours** |

---

## Notes & Considerations

1. **File Path Handling**: Ensure the JSON file path is accessible to both console and web applications
2. **Date Calculation**: Account for leap years and exact month/day differences
3. **Unique ID Generation**: Use GUID or timestamp-based IDs to prevent duplicates
4. **Web Server**: Web app needs to run on a local server (IIS Express or similar) for Ajax to work
5. **Cross-Origin**: If using different ports, ensure CORS is configured
6. **Error Messages**: Provide actionable feedback to users
7. **Sample Data**: Create test data with all departments for thorough testing

---

**Document Version**: 1.0
**Created**: March 13, 2026
**Status**: Ready for Development
