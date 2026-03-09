import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ======================================================
   PREMIUM PDF GENERATOR (Error Free Version)
====================================================== */

export const generatePDF = ({
    title = "Report",
    columns = [],
    rows = [],
    fileName = "report.pdf"
}) => {
    try {
        const doc = new jsPDF("landscape", "mm", "a4");

        /* ================= HEADER ================= */

        // Full Purple Background
        doc.setFillColor(109, 40, 217); // #6D28D9
        doc.rect(0, 0, 297, 40, "F");

        // Optional subtle top accent strip (lighter purple)
        doc.setFillColor(139, 92, 246); // #8B5CF6
        doc.rect(0, 0, 297, 6, "F");

        // White Text
        doc.setTextColor(255, 255, 255);

        // Main Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Trainings Report", 14, 22);

        // Sub Title
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(
            `Generated on: ${new Date().toLocaleDateString("en-GB")}`,
            14,
            30
        );

        /* ================= SUMMARY ================= */

        const total = rows.length;
        const completed = rows.filter(r => r.status === "Completed").length;
        const scheduled = rows.filter(r => r.status === "Scheduled").length;
        const cancelled = rows.filter(r => r.status === "Cancelled").length;

        doc.setFillColor(248, 250, 252);
        doc.rect(15, 48, 267, 18, "F");

        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);

        doc.text(`Total: ${total}`, 20, 60);
        doc.text(`Completed: ${completed}`, 90, 60);
        doc.text(`Scheduled: ${scheduled}`, 160, 60);
        doc.text(`Cancelled: ${cancelled}`, 230, 60);

        /* ================= TABLE ================= */

        autoTable(doc, {
            columns,
            body: rows,
            startY: 75,
            theme: "grid",
            headStyles: {
                fillColor: [67, 56, 202], // #4338CA
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 10,
                halign: "center"
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [30, 41, 59], // #1E293B
                cellPadding: 5
            },
            alternateRowStyles: {
                fillColor: [241, 245, 249] // #F1F5F9
            },
            styles: {
                lineWidth: 0.2,
                lineColor: [226, 232, 240] // #E2E8F0
            },
            didParseCell: function (data) {
                if (
                    data.column &&
                    data.column.dataKey === "status" &&
                    data.section === "body"
                ) {
                    const status = data.cell.raw;

                    if (status === "Completed") {
                        data.cell.styles.textColor = [22, 163, 74]; // #16A34A
                        data.cell.styles.fontStyle = "bold";
                    }

                    if (status === "Scheduled") {
                        data.cell.styles.textColor = [37, 99, 235]; // #2563EB
                        data.cell.styles.fontStyle = "bold";
                    }

                    if (status === "Cancelled") {
                        data.cell.styles.textColor = [220, 38, 38]; // #DC2626
                        data.cell.styles.fontStyle = "bold";
                    }
                }
            }
        });

        /* ================= FOOTER ================= */

        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            doc.setDrawColor(226, 232, 240);
            doc.line(15, 195, 282, 195);

            doc.setFontSize(8);
            doc.setTextColor(120);
            doc.text("Confidential • Internal Use Only", 15, 200);

            doc.text(`Page ${i} of ${pageCount}`, 280, 200, {
                align: "right"
            });
        }

        doc.save(fileName);
    } catch (error) {
        console.error("PDF Generation Error:", error);
    }
};

// /* ======================================================
//    EXCEL GENERATOR (Clean Version)
// ====================================================== */

export const generateExcel = ({
    data = [],
    fileName = "report.csv"
}) => {
    try {

        // convert JSON → sheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // convert sheet → CSV
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        saveAs(blob, fileName);

    } catch (error) {
        console.error("CSV Generation Error:", error);
    }
};
