import { useState } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import Pagination from "../ui/Pagination";

const EmployeeTable = ({ employees, onEdit }) => {
  const { deleteEmployee } = useEmployees();
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(employees.length / employeesPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl2 shadow-md p-4">

      {/* Horizontal Scroll Wrapper */}
      <div className="w-full overflow-x-auto rounded-2xl">

        <table className="w-full md:min-w-[1200px] text-sm text-left whitespace-nowrap">
          {/* TABLE HEAD */}
          <thead className="bg-gray-100 dark:bg-gray-800 border-b dark:border-white-900">
            <tr className="text-gray-600 dark:text-gray-300">
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Job Title</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Manager</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
            {currentEmployees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-6 py-4">{emp.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp.phone}</td>
                <td className="px-6 py-4">{emp.department}</td>
                <td className="px-6 py-4">{emp.jobTitle}</td>
                <td className="px-6 py-4">{emp.employmentType}</td>
                <td className="px-6 py-4">{emp.reportingManager}</td>
                <td className="px-6 py-4">{emp.workLocation}</td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full
                      ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : ""
                      }
                      ${
                        emp.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                          : ""
                      }
                      ${
                        emp.status === "Probation"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                          : ""
                      }
                      ${
                        emp.status === "Terminated"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                          : ""
                      }
                    `}
                  >
                    {emp.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-center space-x-4">
                  <button
                    onClick={() => onEdit(emp)}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t dark:border-gray-700">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

    </div>
  );
};

export default EmployeeTable;