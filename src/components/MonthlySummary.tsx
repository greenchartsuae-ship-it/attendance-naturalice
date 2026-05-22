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

const SECTION_ORDER: Record<string, string[]> = {
  "OFFICE/ADMIN": ["ADMIN", "SALES SUPERVISOR", "PRODUCTION HEAD", "HYGIENE DEPT", "PRODUCTION", "PROD - LUXURY ICE", "CLEANER", "VEHICLE MAINTENANCE", "ACCOMMODATION", "HOUSE DRIVER"],
  "DRIVERS": ["DRIVER - DUBAI", "DRIVER - ABU DHABI", "DRIVER - OTHER EMIRATES", "DRIVER - FUJAIRAH"],
  "SALESMAN": ["SALESMAN - DUBAI", "SALESMAN - ABU DHABI", "SALESMAN - OTHER EMIRATES", "SALESMAN - FUJAIRAH"],
  "FACTORY/PRODUCTION": ["NIGHT SHIFT - AL QUOZ", "PROD - LUXURY ICE", "AL QUOZ TECHNICIAN", "UMQ PRODUCTION", "NIGHT SHIFT - UMQ", "UMQ TECHNICIAN", "FUJAIRAH FACTORY"],
};

const GRP_ORDER = ["OFFICE/ADMIN", "DRIVERS", "SALESMAN", "FACTORY/PRODUCTION"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getDayAbbrev(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day);
  return ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d.getDay()];
}

function isFriday(year: number, month: number, day: number): boolean {
  return new Date(year, month - 1, day).getDay() === 5;
}

function getStatusColor(status: string): string {
  if (status === "P") return "#16a34a";
  if (status === "OT") return "#ea580c";
  if (status === "P,OT") return "#16a34a";
  if (status === "O") return "#dc2626";
  if (status === "L") return "#2563eb";
  if (status === "V") return "#7c3aed";
  return "";
}

function getStatusBg(status: string): string {
  if (status === "P") return "bg-green-100";
  if (status === "OT") return "bg-orange-100";
  if (status === "P,OT") return "bg-gradient-to-r from-green-100 to-orange-100";
  if (status === "O") return "bg-red-100";
  if (status === "L") return "bg-blue-100";
  if (status === "V") return "bg-purple-100";
  return "";
}

export default function MonthlySummary() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Record<number, Record<string, string>>>({});
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const daysInMonth = getDaysInMonth(year, month);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?month=${monthStr}`);
      const data = await res.json();
      setEmployees(data.employees || []);
      setAttendance(data.attendance || {});
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  }, [monthStr]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getFilteredAndSorted = () => {
    let filtered = employees;
    if (groupFilter !== "ALL") {
      filtered = filtered.filter((e) => e.grp === groupFilter);
    }
    // Sort by group order, then section order, then name
    return [...filtered].sort((a, b) => {
      const grpA = GRP_ORDER.indexOf(a.grp);
      const grpB = GRP_ORDER.indexOf(b.grp);
      if (grpA !== grpB) return grpA - grpB;
      const secOrder = SECTION_ORDER[a.grp] || [];
      const secA = secOrder.indexOf(a.section);
      const secB = secOrder.indexOf(b.section);
      if (secA !== secB) return secA - secB;
      return a.name.localeCompare(b.name);
    });
  };

  const sortedEmployees = getFilteredAndSorted();

  // Group by section for display
  const sections: { section: string; grp: string; employees: Employee[] }[] = [];
  let lastSection = "";
  for (const emp of sortedEmployees) {
    if (emp.section !== lastSection) {
      sections.push({ section: emp.section, grp: emp.grp, employees: [] });
      lastSection = emp.section;
    }
    sections[sections.length - 1].employees.push(emp);
  }

  const getEmpStatus = (empId: number, day: number): string => {
    const dateStr = `${monthStr}-${String(day).padStart(2, "0")}`;
    return attendance[empId]?.[dateStr] || "";
  };

  const getEmpSummary = (empId: number) => {
    let p = 0, ot = 0, o = 0, l = 0, v = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const status = getEmpStatus(empId, d);
      if (status.includes("P")) p++;
      if (status.includes("OT")) ot++;
      if (status === "O") o++;
      if (status === "L") l++;
      if (status === "V") v++;
    }
    return { p, ot, o, l, v, total: p + o + l + v };
  };

  // Monthly totals
  const monthlyTotals = { p: 0, ot: 0, o: 0, l: 0, v: 0 };
  sortedEmployees.forEach((emp) => {
    const s = getEmpSummary(emp.id);
    monthlyTotals.p += s.p;
    monthlyTotals.ot += s.ot;
    monthlyTotals.o += s.o;
    monthlyTotals.l += s.l;
    monthlyTotals.v += s.v;
  });

  const exportPDF = async () => {
    const pdfMake = (await import("pdfmake/build/pdfmake")).default;
    const pdfFonts = (await import("pdfmake/build/vfs_fonts")).default;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfMake.vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;

    const title = `STAFF ATTENDANCE — ${monthNames[month - 1].toUpperCase()} ${year} | MONTHLY SUMMARY`;

    // Build table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tableBody: any[][] = [];

    // Header row
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headerRow: any[] = [
      { text: "SECTION", bold: true, fontSize: 5, fillColor: "#2E5090", color: "white" },
      { text: "EMPLOYEE", bold: true, fontSize: 5, fillColor: "#2E5090", color: "white" },
      { text: "LOC", bold: true, fontSize: 5, fillColor: "#2E5090", color: "white" },
    ];
    for (let d = 1; d <= daysInMonth; d++) {
      const abbrev = getDayAbbrev(year, month, d);
      const friday = isFriday(year, month, d);
      headerRow.push({
        text: `${d}\n${abbrev}`,
        bold: true,
        fontSize: 4,
        alignment: "center",
        fillColor: friday ? "#FFF3E0" : "#2E5090",
        color: friday ? "#E65100" : "white",
      });
    }
    headerRow.push({ text: "P", bold: true, fontSize: 5, alignment: "center", fillColor: "#00B050", color: "white" });
    headerRow.push({ text: "OT", bold: true, fontSize: 5, alignment: "center", fillColor: "#FFC000", color: "white" });
    headerRow.push({ text: "O", bold: true, fontSize: 5, alignment: "center", fillColor: "#FF0000", color: "white" });
    headerRow.push({ text: "L", bold: true, fontSize: 5, alignment: "center", fillColor: "#0070C0", color: "white" });
    headerRow.push({ text: "V", bold: true, fontSize: 5, alignment: "center", fillColor: "#7030A0", color: "white" });
    headerRow.push({ text: "TOT", bold: true, fontSize: 5, alignment: "center", fillColor: "#2E5090", color: "white" });
    tableBody.push(headerRow);

    // Data rows
    for (const sec of sections) {
      const sColor = SECTION_COLORS[sec.section] || "#4472C4";
      // Section separator row
      const sepRow = Array(3 + daysInMonth + 6).fill({});
      sepRow[0] = { text: sec.section, colSpan: 3 + daysInMonth + 6, bold: true, fontSize: 5, fillColor: sColor, color: "white", margin: [0, 1, 0, 1] };
      tableBody.push(sepRow);

      for (const emp of sec.employees) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row: any[] = [
          { text: sec.section, fontSize: 4, color: "#666666" },
          { text: emp.name, fontSize: 4.5 },
          { text: emp.location || "", fontSize: 4 },
        ];
        for (let d = 1; d <= daysInMonth; d++) {
          const status = getEmpStatus(emp.id, d);
          const friday = isFriday(year, month, d);
          let color = "#000000";
          if (status === "P") color = "#00B050";
          else if (status === "OT") color = "#FFC000";
          else if (status === "P,OT") color = "#00B050";
          else if (status === "O") color = "#FF0000";
          else if (status === "L") color = "#0070C0";
          else if (status === "V") color = "#7030A0";

          row.push({
            text: status || "",
            fontSize: 4,
            alignment: "center",
            color,
            bold: !!status,
            fillColor: friday ? "#FFF8E1" : undefined,
          });
        }
        const summary = getEmpSummary(emp.id);
        row.push({ text: summary.p.toString(), fontSize: 4.5, alignment: "center", bold: true, color: "#00B050" });
        row.push({ text: summary.ot.toString(), fontSize: 4.5, alignment: "center", bold: true, color: "#FFC000" });
        row.push({ text: summary.o.toString(), fontSize: 4.5, alignment: "center", bold: true, color: "#FF0000" });
        row.push({ text: summary.l.toString(), fontSize: 4.5, alignment: "center", bold: true, color: "#0070C0" });
        row.push({ text: summary.v.toString(), fontSize: 4.5, alignment: "center", bold: true, color: "#7030A0" });
        row.push({ text: summary.total.toString(), fontSize: 4.5, alignment: "center", bold: true });
        tableBody.push(row);
      }
    }

    // Monthly totals row
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalsRow: any[] = [
      { text: "MONTHLY TOTALS", colSpan: 3, bold: true, fontSize: 5, fillColor: "#D9E2F3" }, {}, {},
    ];
    // Daily totals per day
    for (let d = 1; d <= daysInMonth; d++) {
      let dayCount = 0;
      sortedEmployees.forEach((emp) => {
        const status = getEmpStatus(emp.id, d);
        if (status) dayCount++;
      });
      const friday = isFriday(year, month, d);
      totalsRow.push({ text: dayCount.toString(), fontSize: 4, alignment: "center", bold: true, fillColor: friday ? "#FFF3E0" : "#D9E2F3" });
    }
    totalsRow.push({ text: monthlyTotals.p.toString(), fontSize: 5, alignment: "center", bold: true, color: "#00B050", fillColor: "#D9E2F3" });
    totalsRow.push({ text: monthlyTotals.ot.toString(), fontSize: 5, alignment: "center", bold: true, color: "#FFC000", fillColor: "#D9E2F3" });
    totalsRow.push({ text: monthlyTotals.o.toString(), fontSize: 5, alignment: "center", bold: true, color: "#FF0000", fillColor: "#D9E2F3" });
    totalsRow.push({ text: monthlyTotals.l.toString(), fontSize: 5, alignment: "center", bold: true, color: "#0070C0", fillColor: "#D9E2F3" });
    totalsRow.push({ text: monthlyTotals.v.toString(), fontSize: 5, alignment: "center", bold: true, color: "#7030A0", fillColor: "#D9E2F3" });
    totalsRow.push({ text: (monthlyTotals.p + monthlyTotals.o + monthlyTotals.l + monthlyTotals.v).toString(), fontSize: 5, alignment: "center", bold: true, fillColor: "#D9E2F3" });
    tableBody.push(totalsRow);

    // Column widths
    const colWidths = [35, 55, 30];
    for (let d = 0; d < daysInMonth; d++) {
      colWidths.push(14);
    }
    colWidths.push(14, 14, 14, 14, 14, 16); // P, OT, O, L, V, TOTAL

    const docDefinition = {
      pageSize: "A4" as const,
      pageOrientation: "landscape" as const,
      pageMargins: [10, 35, 10, 10] as [number, number, number, number],
      header: {
        text: title,
        alignment: "center" as const,
        fontSize: 9,
        bold: true,
        margin: [0, 10, 0, 0] as [number, number, number, number],
        color: "#2E5090",
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: colWidths,
            body: tableBody,
          },
          layout: {
            hLineWidth: () => 0.3,
            vLineWidth: () => 0.3,
            hLineColor: () => "#CCCCCC",
            vLineColor: () => "#CCCCCC",
            paddingLeft: () => 1,
            paddingRight: () => 1,
            paddingTop: () => 1,
            paddingBottom: () => 1,
          },
        },
      ],
    };

    pdfMake.createPdf(docDefinition).download(`attendance-monthly-${monthStr}.pdf`);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
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
        <button
          onClick={exportPDF}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition ml-auto"
        >
          📄 Export PDF
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading monthly data...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <table className="text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-blue-900 text-white">
                <th className="px-2 py-1.5 text-left sticky left-0 bg-blue-900 z-20 min-w-[80px]">Section</th>
                <th className="px-2 py-1.5 text-left sticky left-[80px] bg-blue-900 z-20 min-w-[120px]">Employee</th>
                <th className="px-2 py-1.5 text-left min-w-[60px]">Loc</th>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const d = i + 1;
                  const abbrev = getDayAbbrev(year, month, d);
                  const friday = isFriday(year, month, d);
                  return (
                    <th
                      key={d}
                      className={`px-1 py-1.5 text-center min-w-[28px] ${friday ? "bg-orange-100 text-orange-800" : ""}`}
                    >
                      <div>{d}</div>
                      <div className="text-[9px] font-normal">{abbrev}</div>
                    </th>
                  );
                })}
                <th className="px-1.5 py-1.5 text-center bg-green-700 min-w-[28px]">P</th>
                <th className="px-1.5 py-1.5 text-center bg-orange-600 min-w-[28px]">OT</th>
                <th className="px-1.5 py-1.5 text-center bg-red-600 min-w-[28px]">O</th>
                <th className="px-1.5 py-1.5 text-center bg-blue-600 min-w-[28px]">L</th>
                <th className="px-1.5 py-1.5 text-center bg-purple-600 min-w-[28px]">V</th>
                <th className="px-1.5 py-1.5 text-center bg-blue-900 min-w-[32px]">TOT</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((sec) => {
                const sColor = SECTION_COLORS[sec.section] || "#4472C4";
                return [
                  <tr key={`sec-${sec.section}`}>
                    <td
                      colSpan={3 + daysInMonth + 6}
                      className="px-2 py-1 font-bold text-white text-xs"
                      style={{ backgroundColor: sColor }}
                    >
                      {sec.section}
                    </td>
                  </tr>,
                  ...sec.employees.map((emp) => {
                    const summary = getEmpSummary(emp.id);
                    return (
                      <tr key={emp.id} className="border-b hover:bg-gray-50">
                        <td className="px-2 py-1 text-gray-400 sticky left-0 bg-white text-[10px]">{emp.section}</td>
                        <td className="px-2 py-1 font-medium sticky left-[80px] bg-white">{emp.name}</td>
                        <td className="px-2 py-1 text-gray-500">{emp.location || ""}</td>
                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const d = i + 1;
                          const status = getEmpStatus(emp.id, d);
                          const friday = isFriday(year, month, d);
                          return (
                            <td
                              key={d}
                              className={`px-0.5 py-1 text-center font-bold ${friday ? "bg-orange-50" : ""} ${getStatusBg(status)}`}
                              style={{ color: getStatusColor(status) }}
                            >
                              {status || ""}
                            </td>
                          );
                        })}
                        <td className="px-1 py-1 text-center font-bold text-green-600">{summary.p || ""}</td>
                        <td className="px-1 py-1 text-center font-bold text-orange-600">{summary.ot || ""}</td>
                        <td className="px-1 py-1 text-center font-bold text-red-600">{summary.o || ""}</td>
                        <td className="px-1 py-1 text-center font-bold text-blue-600">{summary.l || ""}</td>
                        <td className="px-1 py-1 text-center font-bold text-purple-600">{summary.v || ""}</td>
                        <td className="px-1 py-1 text-center font-bold">{summary.total || ""}</td>
                      </tr>
                    );
                  }),
                ];
              })}
              <tr className="bg-blue-50 font-bold border-t-2 border-blue-300">
                <td colSpan={3} className="px-2 py-1.5 sticky left-0 bg-blue-50">MONTHLY TOTALS</td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const d = i + 1;
                  let dayCount = 0;
                  sortedEmployees.forEach((emp) => {
                    if (getEmpStatus(emp.id, d)) dayCount++;
                  });
                  const friday = isFriday(year, month, d);
                  return (
                    <td key={d} className={`px-0.5 py-1.5 text-center ${friday ? "bg-orange-100" : ""}`}>
                      {dayCount || ""}
                    </td>
                  );
                })}
                <td className="px-1 py-1.5 text-center text-green-600">{monthlyTotals.p}</td>
                <td className="px-1 py-1.5 text-center text-orange-600">{monthlyTotals.ot}</td>
                <td className="px-1 py-1.5 text-center text-red-600">{monthlyTotals.o}</td>
                <td className="px-1 py-1.5 text-center text-blue-600">{monthlyTotals.l}</td>
                <td className="px-1 py-1.5 text-center text-purple-600">{monthlyTotals.v}</td>
                <td className="px-1 py-1.5 text-center">{monthlyTotals.p + monthlyTotals.o + monthlyTotals.l + monthlyTotals.v}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
