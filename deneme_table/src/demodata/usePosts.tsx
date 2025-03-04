import { useQuery, gql } from '@apollo/client';

interface Task {
  Task_Id: number;
  Task_No: string;
  Task_Name: string;
  Task_Description: string;
}

interface FilterValue {
  value: string | number | undefined;
  matchMode?: string;
}

interface TaskFilters {
  global?: FilterValue;
  Task_Id?: FilterValue;
  Task_No?: FilterValue;
  Task_Name?: FilterValue;
  Task_Description?: FilterValue;
}

interface TasksData {
  analytical_All_Task: Task[];
  analytical_All_Task_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

const GET_TASKS = gql`
  query GetTasks(
    $limit: Int
    $offset: Int
    $where: analytical_All_Task_bool_exp
  ) {
    analytical_All_Task(limit: $limit, offset: $offset, where: $where) {
      Task_Id
      Task_No
      Task_Name
      Task_Description
    }

    analytical_All_Task_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const useTasks = (
  limit: number,
  offset: number,
  filters: TaskFilters,
) => {
  const { loading, error, data } = useQuery<TasksData>(GET_TASKS, {
    variables: {
      limit,
      offset,
      where: {
        _and: [
          filters?.Task_Id?.value
            ? typeof filters.Task_Id.value === 'string' &&
              filters.Task_Id.value.includes('-')
              ? {
                  _and: [
                    {
                      Task_Id: {
                        _gte: Number(filters.Task_Id.value.split('-')[0]),
                      },
                    },
                    {
                      Task_Id: {
                        _lte: Number(filters.Task_Id.value.split('-')[1]),
                      },
                    },
                  ],
                }
              : { Task_Id: { _eq: Number(filters.Task_Id.value) } }
            : null,

          filters?.Task_No?.value
            ? { Task_No: { _eq: filters.Task_No.value } }
            : null,

          filters?.Task_Name?.value
            ? { Task_Name: { _eq: filters.Task_Name.value } }
            : null,

          filters?.Task_Description?.value
            ? { Task_Description: { _eq: filters.Task_Description.value } }
            : null,

          filters?.global?.value
            ? {
                _or: [
                  // Text fields
                  { Task_Name: { _eq: filters.global.value } },
                  { Task_Description: { _eq: filters.global.value } },

                  // Numeric fields - only include if the value can be a number
                  ...(!isNaN(Number(filters.global.value))
                    ? [
                        { Task_Id: { _eq: Number(filters.global.value) } },
                        { Task_No: { _eq: filters.global.value } },
                      ]
                    : []),
                ],
              }
            : {},
        ].filter(Boolean),
      },
    },
    fetchPolicy: 'network-only',
  });

  return {
    tasks: data?.analytical_All_Task || [],
    loading,
    error,
    totalRecords: data?.analytical_All_Task_aggregate?.aggregate?.count || 0,
  };
};
