import { useState, useEffect, useCallback } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';

interface Task {
  Task_Id: number;
  Task_Name: string;
}

interface ColorChartProps {
  tasks: Task[];
  loading: boolean;
}

export default function ColorChart({ tasks, loading }: ColorChartProps) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const initChart = useCallback(() => {
    if (!loading && tasks.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const data = {
        labels: tasks.map((task) => task.Task_Name),
        datasets: [
          {
            data: tasks.map((task) => task.Task_Id),
            backgroundColor: (() => {
              const color = [
                '--blue-500',
                '--yellow-500',
                '--green-500',
                '--red-500',
                '--blue-700',
                '--green-700',
              ];
              const arr = [];
              for (let i = 0; i < tasks.length; i++) {
                arr.push(documentStyle.getPropertyValue(color[i]));
              }
              return arr;
            })(),
            hoverBackgroundColor: (() => {
              const hoverColor = [
                '--white-500',
                '--white-500',
                '--white-500',
                '--white-500',
                '--white-500',
                '--white-500',
              ];
              const arr = [];
              for (let i = 0; i < tasks.length; i++) {
                arr.push(documentStyle.getPropertyValue(hoverColor[i]));
              }
              return arr;
            })(),
          },
        ],
      };

      const options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [loading, tasks]);

  useEffect(() => {
    initChart();
  }, [initChart]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card flex justify-content-center cart">
      <Card>
        <Chart
          type="pie"
          data={chartData}
          options={chartOptions}
          style={{ height: '300px', width: '100%' }}
        />
      </Card>
    </div>
  );
}
