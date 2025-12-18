import React, { useMemo, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
  Typography,
  TableSortLabel,
  Skeleton,
  Stack,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

/**
 * Column configuration for DataTable
 * @template T - Row data type
 */
export interface DataTableColumn<T> {
  /** Field name from row object */
  field: keyof T;
  /** Header label (from i18n) */
  headerName: string;
  /** Enable column sorting */
  sortable?: boolean;
  /** Enable column search */
  searchable?: boolean;
  /** Column width in pixels or percentage */
  width?: number | string;
  /** Custom render function for cell */
  render?: (row: T, index: number) => React.ReactNode;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

/**
 * DataTable component props
 * @template T - Row data type
 */
export interface DataTableProps<T> {
  /** Column configuration */
  columns: DataTableColumn<T>[];
  /** Table rows data */
  rows: T[];
  /** Show loading skeleton */
  loading?: boolean;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Default page size */
  defaultPageSize?: number;
  /** On row click callback */
  onRowClick?: (row: T, index: number) => void;
  /** Row ID getter (for key prop) */
  getRowId?: (row: T, index: number) => string | number;
}

type SortOrder = 'asc' | 'desc';

interface SortState<T> {
  field: keyof T | null;
  order: SortOrder;
}

/**
 * Production-ready DataTable component with sorting, searching, and pagination
 * @template T - Row data type
 */
const DataTable = React.forwardRef(function DataTableInner<T = any>(
  {
    columns,
    rows,
    loading = false,
    pageSizeOptions = [5, 10, 25, 50],
    defaultPageSize = 10,
    onRowClick,
    getRowId = (_, index) => index,
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [sort, setSort] = useState<SortState<T>>({
      field: null,
      order: 'asc',
    });
    const [searchFilters, setSearchFilters] = useState<Record<string, string>>(
      {}
    );

    // Handle sort header click
    const handleSort = (field: keyof T) => {
      if (!columns.find((col) => col.field === field && col.sortable)) return;

      setSort((prev) => ({
        field: prev.field === field ? field : field,
        order:
          prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
      }));
      setPage(0); // Reset to first page
    };

    // Handle search input change
    const handleSearchChange = (field: keyof T, value: string) => {
      setSearchFilters((prev) => ({
        ...prev,
        [String(field)]: value,
      }));
      setPage(0); // Reset to first page
    };

    // Filter rows based on search
    const filteredRows = useMemo(() => {
      return rows.filter((row) => {
        return columns.every((col) => {
          if (!col.searchable) return true;

          const searchValue = searchFilters[String(col.field)]?.toLowerCase() || '';
          if (!searchValue) return true;

          const cellValue = String(row[col.field] || '').toLowerCase();
          return cellValue.includes(searchValue);
        });
      });
    }, [rows, columns, searchFilters]);

    // Sort rows
    const sortedRows = useMemo(() => {
      if (!sort.field) return filteredRows;

      const column = columns.find((col) => col.field === sort.field);
      if (!column || !column.sortable) return filteredRows;

      return [...filteredRows].sort((a, b) => {
        const aVal = a[sort.field!];
        const bVal = b[sort.field!];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sort.order === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sort.order === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }, [filteredRows, sort, columns]);

    // Paginate rows
    const paginatedRows = useMemo(() => {
      return sortedRows.slice(
        page * pageSize,
        page * pageSize + pageSize
      );
    }, [sortedRows, page, pageSize]);

    // Handle page change
    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

    // Handle page size change
    const handleChangePageSize = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPageSize(parseInt(event.target.value, 10));
      setPage(0);
    };

    // Render skeleton row
    const renderSkeletonRow = () => (
      <TableRow>
        {columns.map((col) => (
          <TableCell key={String(col.field)} width={col.width}>
            <Skeleton variant="text" />
          </TableCell>
        ))}
      </TableRow>
    );

    // Render data rows
    const renderDataRows = () => {
      if (paginatedRows.length === 0) {
        return (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              align="center"
              sx={{ py: 6 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {filteredRows.length === 0
                  ? 'No data available'
                  : 'No results found'}
              </Typography>
            </TableCell>
          </TableRow>
        );
      }

      return paginatedRows.map((row, index) => (
        <TableRow
          key={getRowId(row, page * pageSize + index)}
          hover
          onClick={() => onRowClick?.(row, page * pageSize + index)}
          sx={{
            cursor: onRowClick ? 'pointer' : 'default',
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          {columns.map((col) => (
            <TableCell
              key={String(col.field)}
              width={col.width}
              align={col.align || 'left'}
            >
              {col.render
                ? col.render(row, page * pageSize + index)
                : String(row[col.field] ?? '')}
            </TableCell>
          ))}
        </TableRow>
      ));
    };

    return (
      <Paper
        ref={ref}
        elevation={2}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        {/* Search row */}
        {columns.some((col) => col.searchable) && (
          <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {columns
                .filter((col) => col.searchable)
                .map((col) => (
                  <TextField
                    key={String(col.field)}
                    size="small"
                    placeholder={`Search ${col.headerName.toLowerCase()}...`}
                    value={searchFilters[String(col.field)] || ''}
                    onChange={(e) =>
                      handleSearchChange(col.field, e.target.value)
                    }
                    sx={{ minWidth: 200 }}
                  />
                ))}
            </Stack>
          </Box>
        )}

        {/* Table */}
        <TableContainer sx={{ maxHeight: '600px' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.field)}
                    width={col.width}
                    align={col.align || 'left'}
                    sortDirection={
                      sort.field === col.field ? sort.order : false
                    }
                    sx={{
                      fontWeight: 600,
                      backgroundColor: '#fafafa',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={sort.field === col.field}
                        direction={
                          sort.field === col.field ? sort.order : 'asc'
                        }
                        onClick={() => handleSort(col.field)}
                      >
                        {col.headerName}
                        {sort.field === col.field ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sort.order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      col.headerName
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: pageSize }).map((_, idx) => (
                    <React.Fragment key={idx}>
                      {renderSkeletonRow()}
                    </React.Fragment>
                  ))
                : renderDataRows()}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {sortedRows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={pageSizeOptions}
            component="div"
            count={sortedRows.length}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangePageSize}
            sx={{
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fafafa',
            }}
          />
        )}
      </Paper>
    );
}) as React.ForwardRefExoticComponent<DataTableProps<any> & React.RefAttributes<HTMLDivElement>>;

DataTable.displayName = 'DataTable';

export { DataTable };
export type { DataTableColumn, DataTableProps };
