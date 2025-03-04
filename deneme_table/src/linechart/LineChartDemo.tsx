import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { ApolloError } from '@apollo/client';
import './linechart.css';
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

    if (!loading && tasks.length > 0) {
      const data = {
        labels: tasks.map((task) => task.Task_Name),
        datasets: [
          {
            label: 'Task IDs',
            data: tasks.map((task) => task.Task_Id),
            fill: false,
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            tension: 0.4,
          },
          {
            label: 'Task No',
            data: tasks.map((task) => task.Task_No),
            fill: false,
            borderColor: documentStyle.getPropertyValue('--pink-500'),
            tension: 0.4,
          },
        ],
      };

      const options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [loading, tasks]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="card">
      <Card>
        <div className="chardHeight">
          <Chart
            type="line"
            data={chartData}
            options={chartOptions}
            style={{ height: '300px', width: '100%' }}
          />
        </div>
      </Card>
    </div>
  );
}
