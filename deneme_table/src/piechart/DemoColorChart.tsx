import { useState, useEffect, useCallback } from 'react';
import { Chart } from 'primereact/chart';
import { ApolloError } from '@apollo/client';

interface Task {
  Task_Name: string;
  Task_Id: number;
}

interface DataHookResult {
  tasks: Task[];
  loading: boolean;
  error: ApolloError | undefined;
}

interface DataHookResult {
  dataHook: () => { tasks: Task[]; loading: boolean; error?: ApolloError };
}

export default function ColorChart({
  dataHook,
}: {
  dataHook: () => DataHookResult;
}) {
  const { tasks, loading, error } = dataHook();
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  console.log(error);

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
                '--blue-500',
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
    return <div>...</div>;
  }

  return (
    <div className="card flex justify-content-center">
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-30rem"
        style={{ height: '300px' }}
      />
    </div>
  );
}
