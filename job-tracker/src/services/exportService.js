import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportService = {
  async exportToPDF(elementId, filename = 'job-tracker-report') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297; // A4 width in mm
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
      
      return true;
    } catch (error) {
      console.error('PDF export error:', error);
      return false;
    }
  },
  
  exportToJSON(jobs) {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `job-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  
  exportToExcel(jobs) {
    const headers = ['Company', 'Position', 'Status', 'Date Applied', 'Deadline', 'Notes', 'Salary'];
    const csvRows = [headers];
    
    jobs.forEach(job => {
      csvRows.push([
        `"${job.company || ''}"`,
        `"${job.position || ''}"`,
        `"${job.status || ''}"`,
        `"${job.date || ''}"`,
        `"${job.deadline || ''}"`,
        `"${(job.notes || '').replace(/"/g, '""')}"`,
        `"${job.salary || ''}"`
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
