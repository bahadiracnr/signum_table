import { useQuery, gql } from '@apollo/client';

interface Task {
  Task_Id: number;
  Task_Name: string;
  Task_No: number;
}

interface TasksData {
  analytical_All_Task_View: Task[];
}

const GET_TASKS = gql`
  query GetColorTasks {
    analytical_All_Task_View(limit: 6, order_by: { Task_Id: asc }) {
      Task_Id
      Task_Name
      Task_No
    }
  }
`;

export const useBarChart = () => {
  const {
    loading: loading2,
    error: error2,
    data,
  } = useQuery<TasksData>(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  const tasks2 = data?.analytical_All_Task_View || [];
  return {
    tasks2,
    loading2,
    error2,
  };
};
