import { useState } from 'react';
import './form.css';

export interface FilterValues {
  category: string;
  searchText: string;
  idRange: {
    start: string;
    end: string;
  };
}

interface FormProps {
  onFilterChange: (filters: FilterValues) => void;
}

export default function FilterForm({ onFilterChange }: FormProps) {
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    searchText: '',
    idRange: {
      start: '',
      end: '',
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (e.target.name === 'searchText') {
      const newFilters = {
        ...filters,
        [e.target.name]: e.target.value,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else if (e.target.name === 'start' || e.target.name === 'end') {
      const newFilters = {
        ...filters,
        idRange: {
          ...filters.idRange,
          [e.target.name]: e.target.value,
        },
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = { ...filters, [e.target.name]: e.target.value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!e.target.value) {
      const newFilters = { ...filters };

      if (e.target.name === 'start' || e.target.name === 'end') {
        newFilters.idRange = {
          ...filters.idRange,
          [e.target.name]: '',
        };
        // If both start and end are empty, trigger filter update
        if (!newFilters.idRange.start && !newFilters.idRange.end) {
          setFilters(newFilters);
          onFilterChange(newFilters);
        }
      } else {
        const propName = e.target.name as 'category' | 'searchText';
        newFilters[propName] = '';
        setFilters(newFilters);
        onFilterChange(newFilters);
      }
    }
  };

  return (
    <div className="form">
      <div className="container mt-4">
        <form className="bg-light p-4 rounded shadow-sm">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="category" className="form-label">
                User Filter
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={filters.category}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">All Users</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    User {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="searchText" className="form-label">
                Search All Fields
              </label>
              <input
                type="text"
                name="searchText"
                className="form-control"
                placeholder="Search across all task fields..."
                value={filters.searchText}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <small className="form-text text-muted">
                Searches ID, No, Name, Description
              </small>
            </div>

            <div className="col-md-4">
              <label className="form-label">ID Range</label>
              <div className="d-flex gap-2">
                <div className="flex-grow-1">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Start ID"
                    name="start"
                    value={filters.idRange.start}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <span>-</span>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="End ID"
                    name="end"
                    value={filters.idRange.end}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
