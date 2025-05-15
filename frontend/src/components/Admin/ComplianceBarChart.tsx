/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { ApexOptions } from 'apexcharts';

const ComplianceBarChart = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [colorMap, setColorMap] = useState<string[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Helper to generate random hex color
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/bar_chart_compliants_month`)
      .then((res) => {
        const data = res.data;

        if (Array.isArray(data)) {
          const randomColors = data.map(() => getRandomColor());
          setColorMap(randomColors);

      setSeries([
  {
    name: 'Compliants for Month',
    data: data.map((item: any, index: number) => ({
      x: item.month,
      y: item.total_complaints, // ✅ FIXED: was total_compliants
      name: item.compliant_category,
      fillColor: randomColors[index],
    })),
  },
]);

        } else {
          console.error('API Response is not an array:', data);
        }
      })
      .catch((err) => {
        console.error('Error loading bar chart data:', err);
      });
  }, [apiUrl]);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        distributed: true, // This allows individual colors per bar
      },
    },
    xaxis: {
      title: {
        text: 'Month',
      },
    },
    yaxis: {
      title: {
        text: 'Total Compliants',
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: colorMap, // Apply random colors
    tooltip: {
  y: {
    formatter: function (val: number, { dataPointIndex, w }) {
      const complaintType = w.globals.initialSeries[0].data[dataPointIndex].name;
      return `${val} complaints - ${complaintType}`;
    },
  },
},

  };

  return <Chart options={options} series={series} type="bar" height={500} />;
};

export default ComplianceBarChart;
