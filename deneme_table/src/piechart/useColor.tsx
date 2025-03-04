import { useQuery, gql } from '@apollo/client';

interface Task {
  Task_Id: number;
  Task_Name: string;
}

interface TasksData {
  analytical_All_Task_View: Task[];
}

const GET_TASKS = gql`
  query GetColorTasks {
    analytical_All_Task_View(limit: 6, order_by: { Task_Id: asc }) {
      Task_Id
      Task_Name
    }
  }
`;

export const useColorTasks = () => {
  const { loading, error, data } = useQuery<TasksData>(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  const tasks = data?.analytical_All_Task_View || [];
  return {
    tasks,
    loading,
    error,
  };
};
