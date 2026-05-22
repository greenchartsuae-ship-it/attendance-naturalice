"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/lib/types";

const SECTIONS = [
  "ADMIN", "SALES SUPERVISOR", "PRODUCTION HEAD", "HYGIENE DEPT", "PRODUCTION",
  "PROD - LUXURY ICE", "CLEANER", "VEHICLE MAINTENANCE", "ACCOMMODATION", "HOUSE DRIVER",
  "DRIVER - DUBAI", "DRIVER - ABU DHABI", "DRIVER - OTHER EMIRATES", "DRIVER - FUJAIRAH",
  "SALESMAN - DUBAI", "SALESMAN - ABU DHABI", "SALESMAN - OTHER EMIRATES", "SALESMAN - FUJAIRAH",
  "NIGHT SHIFT - AL QUOZ", "AL QUOZ TECHNICIAN", "UMQ PRODUCTION", "NIGHT SHIFT - UMQ",
  "UMQ TECHNICIAN", "FUJAIRAH FACTORY"
];

const GROUPS = ["OFFICE/ADMIN", "DRIVERS", "SALESMAN", "FACTORY/PRODUCTION"];

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", section: SECTIONS[0], grp: GROUPS[0], location: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
    setLoading(false);
  };

  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      const data = await res.json();
      if (data.employee) {
        setEmployees([...employees, data.employee]);
        setNewEmployee({ name: "", section: SECTIONS[0], grp: GROUPS[0], location: "" });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to remove this employee?")) return;
    try {
      await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
      setEmployees(employees.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.section.toLowerCase().includes(search.toLowerCase()) ||
      e.grp.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading employees...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Employee Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {showAddForm ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={addEmployee} className="bg-white rounded-lg shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Employee Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value.toUpperCase() })}
            className="border rounded-lg px-3 py-2 text-sm"
            required
          />
          <select
            value={newEmployee.section}
            onChange={(e) => setNewEmployee({ ...newEmployee, section: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {SECTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={newEmployee.grp}
            onChange={(e) => setNewEmployee({ ...newEmployee, grp: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Location"
            value={newEmployee.location}
            onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value.toUpperCase() })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium">
            Add
          </button>
        </form>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Section</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Group</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, idx) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
                <td className="px-4 py-2 font-medium">{emp.name}</td>
                <td className="px-4 py-2 text-gray-600">{emp.section}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{emp.grp}</span>
                </td>
                <td className="px-4 py-2 text-gray-600">{emp.location || "—"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
          Showing {filtered.length} of {employees.length} employees
        </div>
      </div>
    </div>
  );
}
