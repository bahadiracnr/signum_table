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
  searchValue?: FilterValue; // New field for multi-field search
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
  // Create where clause
  const buildWhereClause = () => {
    const conditions: any[] = [];

    // Handle ID filters (range or exact)
    if (filters?.Task_Id?.value) {
      if (
        typeof filters.Task_Id.value === 'string' &&
        filters.Task_Id.value.includes('-')
      ) {
        conditions.push({
          _and: [
            { Task_Id: { _gte: Number(filters.Task_Id.value.split('-')[0]) } },
            { Task_Id: { _lte: Number(filters.Task_Id.value.split('-')[1]) } },
          ],
        });
      } else {
        conditions.push({ Task_Id: { _eq: Number(filters.Task_Id.value) } });
      }
    }

    // Handle exact field filters
    if (filters?.Task_No?.value) {
      conditions.push({ Task_No: { _eq: filters.Task_No.value } });
    }
    if (filters?.Task_Name?.value) {
      conditions.push({ Task_Name: { _eq: filters.Task_Name.value } });
    }
    if (filters?.Task_Description?.value) {
      conditions.push({
        Task_Description: { _eq: filters.Task_Description.value },
      });
    }

    // Handle search across all fields
    if (filters?.searchValue?.value) {
      const searchText = String(filters.searchValue.value);
      conditions.push({
        _or: [
          {
            Task_Id: {
              _eq: !isNaN(Number(searchText))
                ? Number(searchText)
                : {
                    Task_Name: {
                      _eq: searchText,
                    },
                  },
            },
          },
          // {
          //   Task_No: {
          //     _eq: !isNaN(Number(searchText)) ? searchText : '0',
          //   },
          // },

          {
            Task_Name: {
              _eq: searchText,
            },
          },
          {
            Task_Description: {
              _eq: searchText,
            },
          },
        ],
      });
    }

    return conditions.length ? { _and: conditions.filter(Boolean) } : {};
  };

  const { loading, error, data } = useQuery<TasksData>(GET_TASKS, {
    variables: {
      limit,
      offset,
      where: buildWhereClause(),
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
