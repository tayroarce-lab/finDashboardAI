import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportDashboardPDF = (kpis: any[], topTreatments: any[]) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241); // #6366f1
  doc.text('DentalFlow AI — Reporte Financiero', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${dateStr}`, 14, 30);
  doc.text('Clínica Dental Sonrisa', 14, 35);

  // KPIs Section
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Resumen de KPIs', 14, 50);

  const kpiRows = kpis.map(kpi => [kpi.label, kpi.value, kpi.trend]);
  autoTable(doc, {
    startY: 55,
    head: [['Indicador', 'Valor Actual', 'Tendencia']],
    body: kpiRows,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] }
  });

  // Top Treatments
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('Top Tratamientos por Rentabilidad', 14, finalY);

  const treatmentRows = topTreatments.map(t => [t.name, `${t.avgMargin}%`, `$${t.totalContribution.toLocaleString()}`]);
  autoTable(doc, {
    startY: finalY + 5,
    head: [['Tratamiento', 'Margen Promedio', 'Contribución Total']],
    body: treatmentRows,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] }
  });

  // Save the PDF
  doc.save(`Reporte_DentalFlow_${dateStr.replace(/\//g, '-')}.pdf`);
};
