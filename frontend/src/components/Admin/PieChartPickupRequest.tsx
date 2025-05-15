/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { ApexOptions } from 'apexcharts'; // Import ApexOptions type

const PieChartPickupRequest = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const userId = localStorage.getItem('user_id') || '';

  useEffect(() => {
    axios.get(`${apiUrl}/pie_chart_request`)
      .then((res) => {
        const data = res.data;
        console.log('API Response:', data); // Log to check the structure
  
        if (Array.isArray(data) && data.length > 0) {
          const RequestCounts: Record<string, number> = {};
          data.forEach((item: any) => {
            const requestType = item.request_type; // Make sure category_name is correctly accessed
            RequestCounts[requestType] = (RequestCounts[requestType] || 0) + 1;
          });
  
          const newLabels = Object.keys(RequestCounts);
          const newSeries = Object.values(RequestCounts);
  
          setLabels(newLabels);
          setSeries(newSeries);
        } else {
          console.error('Invalid or empty data:', data);
        }
      })
      .catch((err) => {
        console.error('Error loading pie chart data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiUrl, userId]);
  

  // Define static colors for the pie chart
  const colors = ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#FF66FF', '#28C76F'];

  // Type the options object to be of type ApexOptions
  const options: ApexOptions = {
    labels,
    colors,  // Static color scheme
    chart: {
      type: 'pie', // 'pie' is one of the valid types
    },
    legend: {
      position: 'bottom',
    },
  };

  // If loading, show a loading message or spinner
  if (loading) {
    return <div>Loading data...</div>;
  }

  return <Chart options={options} series={series} type="pie" width="100%" />;
};

export default PieChartPickupRequest;
