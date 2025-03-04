import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTasks } from './usePosts';
import { useState, useMemo } from 'react';
import FilterTableForm, { FilterValues } from './filterFormDemo';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import './table.css';
import { Card } from 'primereact/card';

interface TaskFilters {
  Task_Id?: {
    value: string;
    matchMode: string;
  };
  Task_No?: {
    value: string;
    matchMode: string;
  };
  Task_Name?: {
    value: string;
    matchMode: string;
  };
  Task_Description?: {
    value: string;
    matchMode: string;
  };
  global?: {
    value: string;
    matchMode: string;
  };
  searchValue?: {
    value: string;
    matchMode: string;
  };
}

const initialTableFilters = {
  global: {
    value: undefined as string | undefined,
    matchMode: FilterMatchMode.EQUALS,
  },
  Task_Id: {
    value: undefined as string | undefined,
    matchMode: FilterMatchMode.EQUALS,
  },
  Task_No: {
    value: undefined as string | undefined,
    matchMode: FilterMatchMode.EQUALS,
  },
  Task_Name: {
    value: undefined as string | undefined,
    matchMode: FilterMatchMode.EQUALS,
  },
  Task_Description: {
    value: undefined as string | undefined,
    matchMode: FilterMatchMode.EQUALS,
  },
};

const filterTasks = (
  tasks: any[],
  tableFilters: any,
  sortField: string | undefined,
  sortOrder: 1 | -1 | undefined,
) => {
  let result = [...tasks];

  if (tableFilters.global.value) {
    const searchText = tableFilters.global.value;
    result = result.filter(
      (item) =>
        String(item.Task_Id) === searchText ||
        String(item.Task_No) === searchText ||
        String(item.Task_Name) === searchText ||
        String(item.Task_Description) === searchText,
    );
  }

  if (tableFilters.Task_Id.value) {
    result = result.filter(
      (item) => String(item.Task_Id) === tableFilters.Task_Id.value,
    );
  }

  if (tableFilters.Task_No.value) {
    result = result.filter(
      (item) => String(item.Task_No) === tableFilters.Task_No.value,
    );
  }

  if (tableFilters.Task_Name.value) {
    result = result.filter(
      (item) => item.Task_Name === tableFilters.Task_Name.value,
    );
  }

  if (tableFilters.Task_Description.value) {
    result = result.filter((item) => {
      if (!item.Task_Description || !tableFilters.Task_Description.value)
        return false;

      const itemDescription = item.Task_Description.toString()
        .toLowerCase()
        .trim();
      const filterValue = tableFilters.Task_Description.value
        .toString()
        .toLowerCase()
        .trim();

      return itemDescription === filterValue;
    });
  }

  if (sortField && sortOrder) {
    result.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      return sortOrder * (valueA > valueB ? 1 : -1);
    });
  }

  return result;
};

export default function BasicFilterDemo() {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<1 | -1 | undefined>(undefined);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [tempFilters, setTempFilters] = useState({
    Task_Id: '',
    Task_No: '',
    Task_Name: '',
    Task_Description: '',
  });

  const [tableFilters, setTableFilters] = useState(initialTableFilters);
  const [serverFilters, setServerFilters] = useState<TaskFilters>({});

  const { tasks, loading, totalRecords } = useTasks(rows, first, serverFilters);

  const filteredPageData = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    return filterTasks(tasks, tableFilters, sortField, sortOrder);
  }, [tasks, tableFilters, sortField, sortOrder]);

  const onPage = (event: DataTablePageEvent) => {
    setTableFilters({ ...initialTableFilters });
    setGlobalFilterValue('');
    setTempFilters({
      Task_Id: '',
      Task_No: '',
      Task_Name: '',
      Task_Description: '',
    });

    setFirst(event.first);
    setRows(event.rows);
  };

  const handleFormFilterChange = (newFilters: FilterValues) => {
    const updatedFilters: TaskFilters = {};

    if (newFilters.category) {
      updatedFilters.Task_Id = {
        value: newFilters.category,
        matchMode: 'eq',
      };
    }

    if (newFilters.idRange.start && newFilters.idRange.end) {
      updatedFilters.Task_Id = {
        value: `${newFilters.idRange.start}-${newFilters.idRange.end}`,
        matchMode: 'between',
      };
    }

    if (newFilters.searchText) {
      updatedFilters.searchValue = {
        value: newFilters.searchText,
        matchMode: 'eq',
      };
    }

    setTableFilters({ ...initialTableFilters });
    setGlobalFilterValue('');
    setTempFilters({
      Task_Id: '',
      Task_No: '',
      Task_Name: '',
      Task_Description: '',
    });

    setServerFilters(updatedFilters);
    setFirst(0);
  };

  const renderHeader = () => {
    return (
      <div>
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
          <span className="text-xl text-900 font-bold">Tasks</span>
        </div>
        <div className="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              placeholder="Keyword Search"
              onChange={(e) => {
                const value = e.target.value;
                setGlobalFilterValue(value);
                const updatedFilters = { ...tableFilters };
                updatedFilters.global = {
                  value: value,
                  matchMode: FilterMatchMode.EQUALS,
                };
                setTableFilters(updatedFilters);
              }}
            />
          </IconField>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string,
  ) => {
    if (e.key === 'Enter') {
      const updatedFilters = { ...tableFilters };
      updatedFilters[field as keyof typeof tableFilters] = {
        value: tempFilters[field as keyof typeof tempFilters],
        matchMode: FilterMatchMode.EQUALS,
      };
      setTableFilters(updatedFilters);
    }
  };

  const customFilterElement = (field: string) => {
    return (
      <InputText
        value={tempFilters[field as keyof typeof tempFilters]}
        onChange={(e) =>
          setTempFilters({ ...tempFilters, [field]: e.target.value })
        }
        onKeyDown={(e) => handleKeyDown(e, field)}
        placeholder={`Press Enter to search...`}
      />
    );
  };

  return (
    <div className="card">
      <FilterTableForm onFilterChange={handleFormFilterChange} />
      <Card>
        <div className="table">
          <DataTable
            value={filteredPageData}
            paginator
            rows={rows}
            first={first}
            onPage={onPage}
            dataKey="Task_Id"
            loading={loading}
            header={header}
            globalFilterFields={['Task_No', 'Task_Name', 'Task_Description']}
            emptyMessage={loading ? 'Loading...' : 'No tasks found.'}
            totalRecords={totalRecords}
            lazy={true}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(e) => {
              setSortField(e.sortField);
              setSortOrder(
                e.sortOrder === 1 || e.sortOrder === -1
                  ? e.sortOrder
                  : undefined,
              );
            }}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
            rowsPerPageOptions={[5, 10, 20, 50]}
            filters={tableFilters}
            filterDisplay="row"
            showGridlines
            stripedRows
            className="p-datatable-sm pagination-visible"
            style={{ width: '100%' }}
          >
            <Column
              field="Task_Id"
              header="Task ID"
              filter
              filterElement={() => customFilterElement('Task_Id')}
              showFilterMenu={false}
              sortable
            />
            <Column
              field="Task_No"
              header="Task No"
              filter
              filterElement={() => customFilterElement('Task_No')}
              showFilterMenu={false}
              sortable
            />
            <Column
              field="Task_Name"
              header="Task Name"
              filter
              filterElement={() => customFilterElement('Task_Name')}
              showFilterMenu={false}
              sortable
            />
            <Column
              field="Task_Description"
              header="Task Description"
              filter
              filterElement={() => customFilterElement('Task_Description')}
              showFilterMenu={false}
              sortable
            />
          </DataTable>
        </div>
      </Card>
    </div>
  );
}
