"use client";

import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/lib/types";

const GROUP_FILTERS = ["ALL", "OFFICE/ADMIN", "DRIVERS", "SALESMAN", "FACTORY/PRODUCTION"];

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
  "DRIVER - DUBAI": "#4472C4",
  "DRIVER - ABU DHABI": "#4472C4",
  "DRIVER - OTHER EMIRATES": "#4472C4",
  "DRIVER - FUJAIRAH": "#C55A11",
  "SALESMAN - DUBAI": "#4472C4",
  "SALESMAN - ABU DHABI": "#548235",
  "SALESMAN - OTHER EMIRATES": "#4472C4",
  "SALESMAN - FUJAIRAH": "#C55A11",
  "NIGHT SHIFT - AL QUOZ": "#2F5496",
  "AL QUOZ TECHNICIAN": "#548235",
  "UMQ PRODUCTION": "#7030A0",
  "NIGHT SHIFT - UMQ": "#C55A11",
  "UMQ TECHNICIAN": "#548235",
  "FUJAIRAH FACTORY": "#C55A11",
};

// Column groups for PDF
const COLUMN_GROUPS = [
  {
    title: "ADMIN",
    sections: ["ADMIN", "SALES SUPERVISOR", "PRODUCTION HEAD", "HYGIENE DEPT", "PRODUCTION", "PROD - LUXURY ICE", "CLEANER", "VEHICLE MAINTENANCE", "ACCOMMODATION", "HOUSE DRIVER"],
    grp: "OFFICE/ADMIN",
  },
  {
    title: "DRIVERS",
    sections: ["DRIVER - DUBAI", "DRIVER - ABU DHABI", "DRIVER - OTHER EMIRATES", "DRIVER - FUJAIRAH"],
    grp: "DRIVERS",
  },
  {
    title: "SALESMAN",
    sections: ["SALESMAN - DUBAI", "SALESMAN - ABU DHABI", "SALESMAN - OTHER EMIRATES", "SALESMAN - FUJAIRAH"],
    grp: "SALESMAN",
  },
  {
    title: "DUBAI FACTORY / UMQ",
    sections: ["NIGHT SHIFT - AL QUOZ", "PROD - LUXURY ICE", "AL QUOZ TECHNICIAN", "UMQ PRODUCTION", "NIGHT SHIFT - UMQ", "UMQ TECHNICIAN", "FUJAIRAH FACTORY"],
    grp: "FACTORY/PRODUCTION",
  },
];

// Section display order within OFFICE/ADMIN group
const ADMIN_SECTION_ORDER = ["ADMIN", "SALES SUPERVISOR", "PRODUCTION HEAD", "HYGIENE DEPT", "PRODUCTION", "PROD - LUXURY ICE", "CLEANER", "VEHICLE MAINTENANCE", "ACCOMMODATION", "HOUSE DRIVER"];
const DRIVERS_SECTION_ORDER = ["DRIVER - DUBAI", "DRIVER - ABU DHABI", "DRIVER - OTHER EMIRATES", "DRIVER - FUJAIRAH"];
const SALESMAN_SECTION_ORDER = ["SALESMAN - DUBAI", "SALESMAN - ABU DHABI", "SALESMAN - OTHER EMIRATES", "SALESMAN - FUJAIRAH"];
const FACTORY_SECTION_ORDER = ["NIGHT SHIFT - AL QUOZ", "PROD - LUXURY ICE", "AL QUOZ TECHNICIAN", "UMQ PRODUCTION", "NIGHT SHIFT - UMQ", "UMQ TECHNICIAN", "FUJAIRAH FACTORY"];

function getSectionOrder(grp: string): string[] {
  switch (grp) {
    case "OFFICE/ADMIN": return ADMIN_SECTION_ORDER;
    case "DRIVERS": return DRIVERS_SECTION_ORDER;
    case "SALESMAN": return SALESMAN_SECTION_ORDER;
    case "FACTORY/PRODUCTION": return FACTORY_SECTION_ORDER;
    default: return [];
  }
}

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
      // Sort: P first, then OT
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
    // Sort by section order within group
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

  const saveAttendance = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      // Build records for changed items
      const records: { employee_id: number; date: string; status: string }[] = [];
      const allEmpIds = new Set(employees.map((e) => e.id));
      
      // Include all employees that have a status or had a status
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

      // Batch in groups of 20
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

    // Build column data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnTables: any[] = [];

    for (const colGroup of COLUMN_GROUPS) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableBody: any[] = [];

      // Group header
      tableBody.push([
        { text: colGroup.title, colSpan: 4, alignment: "center", bold: true, fillColor: "#2E5090", color: "white", fontSize: 7, margin: [0, 1, 0, 1] },
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
      let sectionPresent = 0, sectionOff = 0, sectionOT = 0, sectionLeave = 0, sectionVacation = 0;

      for (const section of colGroup.sections) {
        const sectionEmps = employees.filter((e) => e.grp === colGroup.grp && e.section === section);
        if (sectionEmps.length === 0) continue;

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

          // Count
          if (status.includes("P")) sectionPresent++;
          if (status.includes("OT")) sectionOT++;
          if (status === "O") sectionOff++;
          if (status === "L") sectionLeave++;
          if (status === "V") sectionVacation++;

          sl++;
        }
      }

      // Totals for this column
      const grandTotal = sectionPresent + sectionOff + sectionLeave + sectionVacation;
      tableBody.push([
        { text: "TOTAL", colSpan: 4, bold: true, fontSize: 6, fillColor: "#D9E2F3", alignment: "center", margin: [0, 1, 0, 1] },
        {}, {}, {}
      ]);
      tableBody.push([
        { text: "PRESENT:", colSpan: 3, fontSize: 6, bold: true }, {}, {},
        { text: sectionPresent.toString(), fontSize: 6, bold: true, alignment: "center", color: "#00B050" }
      ]);
      tableBody.push([
        { text: "OFF:", colSpan: 3, fontSize: 6, bold: true }, {}, {},
        { text: sectionOff.toString(), fontSize: 6, bold: true, alignment: "center", color: "#FF0000" }
      ]);
      tableBody.push([
        { text: "OVERTIME:", colSpan: 3, fontSize: 6, bold: true }, {}, {},
        { text: sectionOT.toString(), fontSize: 6, bold: true, alignment: "center", color: "#FFC000" }
      ]);
      tableBody.push([
        { text: "LEAVE:", colSpan: 3, fontSize: 6, bold: true }, {}, {},
        { text: sectionLeave.toString(), fontSize: 6, bold: true, alignment: "center", color: "#0070C0" }
      ]);
      tableBody.push([
        { text: "VACATION:", colSpan: 3, fontSize: 6, bold: true }, {}, {},
        { text: sectionVacation.toString(), fontSize: 6, bold: true, alignment: "center", color: "#7030A0" }
      ]);
      tableBody.push([
        { text: "GRAND TOTAL:", colSpan: 3, fontSize: 6, bold: true, fillColor: "#D9E2F3" }, {}, {},
        { text: grandTotal.toString(), fontSize: 6, bold: true, alignment: "center", fillColor: "#D9E2F3" }
      ]);

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

  // Sort sections by defined order
  const sortedGroups = groupedEmployees.sort((a, b) => {
    // Find which group each section belongs to
    for (const grp of ["OFFICE/ADMIN", "DRIVERS", "SALESMAN", "FACTORY/PRODUCTION"]) {
      const order = getSectionOrder(grp);
      const aIdx = order.indexOf(a.section);
      const bIdx = order.indexOf(b.section);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
    }
    return 0;
  });

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
              {sortedGroups.map((group) => {
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
