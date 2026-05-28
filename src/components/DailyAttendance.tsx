"use client";

import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/lib/types";

const GROUP_FILTERS = ["ALL", "OFFICE/ADMIN", "ADMIN", "CLEANER", "DRIVERS", "MECHANIC", "SALESMAN", "UMQ FACTORY", "FACTORY/PRODUCTION", "DUBAI FACTORY", "DUBAI FACTORY NIGHT"];

const SECTION_COLORS: Record<string, string> = {
  "ADMIN": "#4472C4",
  "SALES SUPERVISOR": "#4472C4",
  "PRODUCTION HEAD": "#C55A11",
  "HYGIENE DEPT": "#548235",
  "PRODUCTION": "#548235",
  "PROD - LUXURY ICE": "#BF8F00",
  "CLEANER": "#4472C4",
  "VEHICLE MAINTENANCE": "#4472C4",
  "ACCOMMODATION": "#4472C4",
  "HOUSE DRIVER": "#4472C4",
  "JELAT": "#2F5496",
  "DRIVER - DUBAI": "#4472C4",
  "DRIVER - ABU DHABI": "#4472C4",
  "DRIVER - OTHER EMIRATES": "#4472C4",
  "DRIVER - FUJAIRAH": "#C55A11",
  "DRIVERS": "#4472C4",
  "SALESMAN - DUBAI": "#4472C4",
  "SALESMAN - ABU DHABI": "#548235",
  "SALESMAN - OTHER EMIRATES": "#4472C4",
  "SALESMAN - FUJAIRAH": "#C55A11",
  "SALESMAN": "#4472C4",
  "NIGHT SHIFT - AL QUOZ": "#2F5496",
  "AL QUOZ TECHNICIAN": "#548235",
  "UMQ PRODUCTION": "#7030A0",
  "UMQ - TECHNICIAN": "#548235",
  "NIGHT SHIFT - UMQ": "#C55A11",
  "UMQ TECHNICIAN": "#548235",
  "FUJAIRAH FACTORY": "#C55A11",
  "PROD NIGHT - LUXURY ICE": "#BF8F00",
};

// Map groups to PDF column titles
const PDF_COLUMN_MAP: Record<string, string> = {
  "ADMIN": "ADMIN",
  "OFFICE/ADMIN": "ADMIN",
  "CLEANER": "ADMIN",
  "DRIVERS": "DRIVERS",
  "SALESMAN": "SALESMAN",
  "UMQ FACTORY": "UMQ FACTORY",
  "FACTORY/PRODUCTION": "UMQ FACTORY",
  "MECHANIC": "UMQ FACTORY",
  "DUBAI FACTORY": "DUBAI FACTORY",
  "DUBAI FACTORY NIGHT": "DUBAI FACTORY",
};

const PDF_COLUMN_ORDER = ["ADMIN", "DRIVERS", "SALESMAN", "UMQ FACTORY", "DUBAI FACTORY"];

function toggleStatus(current: string, clicked: string): string {
  if (clicked === "O" || clicked === "L" || clicked === "V") {
    return current === clicked ? "" : clicked;
  }
  // P and OT can be combined
  const statuses = current ? current.split(",") : [];
  if (clicked === "P") {
    if (statuses.includes("O") || statuses.includes("L") || statuses.includes("V")) {
      return "P";
    }
    if (statuses.includes("P")) {
      const remaining = statuses.filter((s) => s !== "P");
      return remaining.join(",");
    } else {
      return [...statuses, "P"].sort((a, b) => (a === "P" ? -1 : 1)).join(",");
    }
  }
  if (clicked === "OT") {
    if (statuses.includes("O") || statuses.includes("L") || statuses.includes("V")) {
      return "OT";
    }
    if (statuses.includes("OT")) {
      const remaining = statuses.filter((s) => s !== "OT");
      return remaining.join(",");
    } else {
      const newStatuses = [...statuses, "OT"];
      return newStatuses.sort((a, b) => (a === "P" ? -1 : b === "P" ? 1 : 0)).join(",");
    }
  }
  return current;
}

function formatDateForDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function DailyAttendance() {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [originalAttendance, setOriginalAttendance] = useState<Record<number, string>>({});
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${date}`);
      const data = await res.json();
      setEmployees(data.employees || []);
      setAttendance(data.attendance || {});
      setOriginalAttendance(data.attendance || {});
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusClick = (empId: number, status: string) => {
    const current = attendance[empId] || "";
    const newStatus = toggleStatus(current, status);
    setAttendance({ ...attendance, [empId]: newStatus });
  };

  const getFilteredEmployees = () => {
    let filtered = employees;
    if (groupFilter !== "ALL") {
      filtered = filtered.filter((e) => e.grp === groupFilter);
    }
    return filtered;
  };

  const markAllPresent = () => {
    const filtered = getFilteredEmployees();
    const updated = { ...attendance };
    filtered.forEach((emp) => {
      if (!updated[emp.id]) {
        updated[emp.id] = "P";
      }
    });
    setAttendance(updated);
  };

  const resetDay = async () => {
    try {
      const res = await fetch(`/api/attendance?date=${date}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAttendance({});
        setOriginalAttendance({});
        setSaveMessage("Day reset successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("Reset failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Reset failed:", error);
      setSaveMessage("Reset failed. Please try again.");
    }
    setConfirmReset(false);
  };

  const saveAttendance = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const records: { employee_id: number; date: string; status: string }[] = [];

      for (const emp of employees) {
        const current = attendance[emp.id] || "";
        const original = originalAttendance[emp.id] || "";
        if (current !== original) {
          records.push({ employee_id: emp.id, date, status: current });
        }
      }

      if (records.length === 0) {
        setSaveMessage("No changes to save.");
        setSaving(false);
        return;
      }

      for (let i = 0; i < records.length; i += 20) {
        const batch = records.slice(i, i + 20);
        await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ records: batch }),
        });
      }

      setOriginalAttendance({ ...attendance });
      setSaveMessage(`Saved ${records.length} records successfully!`);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveMessage("Save failed. Please try again.");
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const exportPDF = async () => {
    const pdfMake = (await import("pdfmake/build/pdfmake")).default;
    const pdfFonts = (await import("pdfmake/build/vfs_fonts")).default;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfMake.vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;

    const dateDisplay = formatDateForDisplay(date);

    // Column header colors
    const COLUMN_HEADER_COLORS: Record<string, string> = {
      "ADMIN": "#2E5090",
      "DRIVERS": "#4472C4",
      "SALESMAN": "#548235",
      "UMQ FACTORY": "#7030A0",
      "DUBAI FACTORY": "#C55A11",
    };

    // Dynamically build PDF columns from employee data
    const columnEmployees: Record<string, Employee[]> = {};
    for (const colTitle of PDF_COLUMN_ORDER) {
      columnEmployees[colTitle] = [];
    }

    for (const emp of employees) {
      const colTitle = PDF_COLUMN_MAP[emp.grp] || "ADMIN";
      if (!columnEmployees[colTitle]) columnEmployees[colTitle] = [];
      columnEmployees[colTitle].push(emp);
    }

    // Track global totals
    let totalPresent = 0, totalOff = 0, totalOT = 0, totalLeave = 0, totalVacation = 0;

    // Group employees by section within each column
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnTables: any[] = [];

    for (const colTitle of PDF_COLUMN_ORDER) {
      const colEmps = columnEmployees[colTitle] || [];

      // Group by section
      const sectionMap: Record<string, Employee[]> = {};
      for (const emp of colEmps) {
        if (!sectionMap[emp.section]) sectionMap[emp.section] = [];
        sectionMap[emp.section].push(emp);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableBody: any[] = [];

      const colColor = COLUMN_HEADER_COLORS[colTitle] || "#2E5090";

      // Group header with column-specific color
      tableBody.push([
        { text: colTitle, colSpan: 4, alignment: "center", bold: true, fillColor: colColor, color: "white", fontSize: 7, margin: [0, 1, 0, 1] },
        {}, {}, {}
      ]);

      // Column headers
      tableBody.push([
        { text: "SL", bold: true, fontSize: 6, alignment: "center", fillColor: "#D9E2F3" },
        { text: "NAME", bold: true, fontSize: 6, fillColor: "#D9E2F3" },
        { text: "LOC", bold: true, fontSize: 6, fillColor: "#D9E2F3" },
        { text: "ST", bold: true, fontSize: 6, alignment: "center", fillColor: "#D9E2F3" },
      ]);

      let sl = 1;

      if (colEmps.length === 0) {
        tableBody.push([
          { text: "No employees", colSpan: 4, fontSize: 6, italics: true, color: "#999999", alignment: "center" },
          {}, {}, {}
        ]);
      }

      for (const section of Object.keys(sectionMap)) {
        const sectionEmps = sectionMap[section];
        const sColor = SECTION_COLORS[section] || "#4472C4";

        // Section header
        tableBody.push([
          { text: section, colSpan: 4, bold: true, fontSize: 6, fillColor: sColor, color: "white", margin: [0, 1, 0, 1] },
          {}, {}, {}
        ]);

        for (const emp of sectionEmps) {
          const status = attendance[emp.id] || "";
          let statusText = status;
          let statusColor = "#000000";
          let statusBg: string | undefined = undefined;

          if (status === "P") { statusColor = "#00B050"; }
          else if (status === "OT") { statusColor = "#FFC000"; }
          else if (status === "P,OT") { statusColor = "#FFC000"; statusBg = "#E2EFDA"; statusText = "P,OT"; }
          else if (status === "O") { statusColor = "#FF0000"; }
          else if (status === "L") { statusColor = "#0070C0"; }
          else if (status === "V") { statusColor = "#7030A0"; }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const stCell: any = { text: statusText, fontSize: 6, alignment: "center", color: statusColor, bold: true };
          if (statusBg) stCell.fillColor = statusBg;

          tableBody.push([
            { text: sl.toString(), fontSize: 5.5, alignment: "center" },
            { text: emp.name, fontSize: 5.5 },
            { text: emp.location || "", fontSize: 5.5 },
            stCell,
          ]);

          if (status.includes("P")) totalPresent++;
          if (status.includes("OT")) totalOT++;
          if (status === "O") totalOff++;
          if (status === "L") totalLeave++;
          if (status === "V") totalVacation++;

          sl++;
        }
      }

      columnTables.push({
        table: {
          headerRows: 2,
          widths: [14, "*", 42, 22],
          body: tableBody,
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#CCCCCC",
          vLineColor: () => "#CCCCCC",
          paddingLeft: () => 2,
          paddingRight: () => 2,
          paddingTop: () => 1,
          paddingBottom: () => 1,
        },
      });
    }

    // Single combined total table at the bottom
    const grandTotal = totalPresent + totalOff + totalLeave + totalVacation;
    const totalTable = {
      table: {
        widths: ["*", 40, "*", 40, "*", 40, "*"],
        body: [
          [
            { text: "PRESENT:", fontSize: 8, bold: true, alignment: "right", border: [false, false, false, false] },
            { text: totalPresent.toString(), fontSize: 8, bold: true, alignment: "center", color: "#00B050", fillColor: "#E2EFDA", margin: [0, 2, 0, 2] },
            { text: "OFF:", fontSize: 8, bold: true, alignment: "right", border: [false, false, false, false] },
            { text: totalOff.toString(), fontSize: 8, bold: true, alignment: "center", color: "#C55A11", fillColor: "#FCE4CC", margin: [0, 2, 0, 2] },
            { text: "OVERTIME:", fontSize: 8, bold: true, alignment: "right", border: [false, false, false, false] },
            { text: totalOT.toString(), fontSize: 8, bold: true, alignment: "center", color: "#BF8F00", fillColor: "#FFF2CC", margin: [0, 2, 0, 2] },
            { text: "", border: [false, false, false, false] },
          ],
          [
            { text: "LEAVE:", fontSize: 8, bold: true, alignment: "right", border: [false, false, false, false] },
            { text: totalLeave.toString(), fontSize: 8, bold: true, alignment: "center", color: "#FF0000", fillColor: "#FFD9D9", margin: [0, 2, 0, 2] },
            { text: "VACATION:", fontSize: 8, bold: true, alignment: "right", border: [false, false, false, false] },
            { text: totalVacation.toString(), fontSize: 8, bold: true, alignment: "center", color: "#0070C0", fillColor: "#D6E4F0", margin: [0, 2, 0, 2] },
            { text: "GRAND TOTAL:", fontSize: 8, bold: true, alignment: "right", border: [false, false, false, false] },
            { text: grandTotal.toString(), fontSize: 8, bold: true, alignment: "center", color: "#2E5090", fillColor: "#D9E2F3", margin: [0, 2, 0, 2] },
            { text: "", border: [false, false, false, false] },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => "#CCCCCC",
        vLineColor: () => "#CCCCCC",
      },
    };

    const docDefinition = {
      pageSize: "A4" as const,
      pageOrientation: "landscape" as const,
      pageMargins: [15, 35, 15, 15] as [number, number, number, number],
      header: {
        text: dateDisplay,
        alignment: "center" as const,
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 0] as [number, number, number, number],
        color: "#2E5090",
      },
      content: [
        {
          columns: columnTables.map((t) => ({ width: "*", ...t })),
          columnGap: 5,
        },
        { text: "", margin: [0, 6, 0, 0] as [number, number, number, number] },
        {
          text: "TOTAL",
          fontSize: 9,
          bold: true,
          alignment: "center" as const,
          fillColor: "#2E5090",
          color: "#2E5090",
          margin: [0, 0, 0, 4] as [number, number, number, number],
        },
        totalTable,
      ],
    };

    pdfMake.createPdf(docDefinition).download(`attendance-${date}.pdf`);
  };

  const filteredEmployees = getFilteredEmployees();

  // Group employees by section for display
  const groupedEmployees: { section: string; employees: Employee[] }[] = [];
  let currentSection = "";
  for (const emp of filteredEmployees) {
    if (emp.section !== currentSection) {
      currentSection = emp.section;
      groupedEmployees.push({ section: currentSection, employees: [] });
    }
    groupedEmployees[groupedEmployees.length - 1].employees.push(emp);
  }

  let globalSl = 0;

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mr-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {GROUP_FILTERS.map((g) => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                groupFilter === g
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={markAllPresent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "💾 Save"}
          </button>
          <button
            onClick={exportPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
          >
            📄 Export PDF
          </button>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
            >
              🗑 Reset Day
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={resetDay}
                className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {saveMessage && (
        <div className={`mb-3 p-2 rounded-lg text-sm ${saveMessage.includes("failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {saveMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading attendance data...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 w-10">SL</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Name</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Section</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Location</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600 w-64">Status</th>
              </tr>
            </thead>
            <tbody>
              {groupedEmployees.map((group) => {
                const sColor = SECTION_COLORS[group.section] || "#4472C4";
                return [
                  <tr key={`section-${group.section}`}>
                    <td colSpan={5} className="px-3 py-1.5 font-bold text-white text-xs" style={{ backgroundColor: sColor }}>
                      {group.section} ({group.employees.length})
                    </td>
                  </tr>,
                  ...group.employees.map((emp) => {
                    globalSl++;
                    const status = attendance[emp.id] || "";
                    const statuses = status ? status.split(",") : [];
                    return (
                      <tr key={emp.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-1.5 text-gray-400 text-xs">{globalSl}</td>
                        <td className="px-3 py-1.5 font-medium text-sm">{emp.name}</td>
                        <td className="px-3 py-1.5 text-gray-500 text-xs">{emp.section}</td>
                        <td className="px-3 py-1.5 text-gray-500 text-xs">{emp.location || "—"}</td>
                        <td className="px-3 py-1.5">
                          <div className="flex justify-center gap-1">
                            {["P", "OT", "O", "L", "V"].map((s) => {
                              const isActive = statuses.includes(s);
                              let btnClass = "status-btn bg-gray-100 text-gray-600 border-gray-300";
                              if (isActive) {
                                btnClass = `status-btn active-${s}`;
                              }
                              return (
                                <button
                                  key={s}
                                  onClick={() => handleStatusClick(emp.id, s)}
                                  className={btnClass}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  }),
                ];
              })}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500 flex gap-6">
            <span>Total: {filteredEmployees.length}</span>
            <span className="text-green-600">P: {Object.values(attendance).filter((s) => s.includes("P")).length}</span>
            <span className="text-orange-600">OT: {Object.values(attendance).filter((s) => s.includes("OT")).length}</span>
            <span className="text-red-600">O: {Object.values(attendance).filter((s) => s === "O").length}</span>
            <span className="text-blue-600">L: {Object.values(attendance).filter((s) => s === "L").length}</span>
            <span className="text-purple-600">V: {Object.values(attendance).filter((s) => s === "V").length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
