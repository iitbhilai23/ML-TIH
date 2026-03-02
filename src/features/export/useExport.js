import { toast } from 'sonner';
import { generatePDF, generateExcel } from './export.service';

export const useExport = (data) => {

  const exportPDF = ({ title, columns, mapper, fileName }) => {
    if (!data || data.length === 0) {
      toast.error('No data available to export');
      return;
    }

    const rows = data.map((item, index) =>
      mapper(item, index)
    );

    generatePDF({
      title,
      columns,
      rows,
      fileName
    });

    toast.success('PDF generated!');
  };

  const exportExcel = ({ mapper, fileName }) => {
    if (!data || data.length === 0) {
      toast.error('No data available to export');
      return;
    }

    const formattedData = data.map((item, index) =>
      mapper(item, index)
    );

    generateExcel({
      data: formattedData,
      fileName
    });

    toast.success('Excel generated!');
  };

  return { exportPDF, exportExcel };
};