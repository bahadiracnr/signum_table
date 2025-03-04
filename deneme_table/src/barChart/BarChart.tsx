import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { ApolloError } from '@apollo/client';
import { Card } from 'primereact/card';

interface Task {
  Task_Name: string;
  Task_Id: number;
  Task_No: number;
}

interface Prop {
  tasks: Task[];
  loading: boolean;
  error?: ApolloError;
}

export default function LineChartDemo({ tasks, loading, error }: Prop) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: tasks.map((task) => task.Task_Name),
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: tasks.map((task) => task.Task_Id),
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [loading, tasks]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="card ">
      <Card>
        <Chart
          type="bar"
          data={chartData}
          options={chartOptions}
          style={{ height: '300px', width: '100%' }}
        />
      </Card>
    </div>
  );
}
