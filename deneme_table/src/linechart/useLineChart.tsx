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

export const useLineChart = () => {
  const {
    loading: loading1,
    error: error1,
    data,
  } = useQuery<TasksData>(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  const tasks1 = data?.analytical_All_Task_View || [];
  return {
    tasks1,
    loading1,
    error1,
  };
};
