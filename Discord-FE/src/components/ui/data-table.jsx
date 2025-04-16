"use client";
import * as React from "react";
import { Input } from "./input";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { useTranslation } from "react-i18next";

export function DataTable({
  columns,
  data,
  filterProps,
  buildInSearch = true,
  onSortingChange,
}) {
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      if (onSortingChange) onSortingChange(newSorting);
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex items-center py-4 mt-0">
        {buildInSearch && (
          <Input
            placeholder={filterProps.placeholder}
            value={table.getColumn(filterProps.column)?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn(filterProps.column)
                ?.setFilterValue(event.target.value)
            }
            className="w-full max-w-sm sm:max-w-xs"
          />
        )}
        {!buildInSearch && filterProps.onChange && (
          <Input
            placeholder={filterProps.placeholder}
            value={filterProps.value || ""}
            onChange={(event) => filterProps.onChange(event.target.value)}
            className="w-full max-w-sm sm:max-w-xs"
          />
        )}
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`
                      ${
                        header.column.columnDef.accessorKey === "email"
                          ? "hidden sm:table-cell"
                          : ""
                      }
                      ${
                        header.column.columnDef.accessorKey === "photoURL"
                          ? "hidden md:table-cell"
                          : ""
                      }
                      px-2 sm:px-4 text-xs sm:text-sm
                    `}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="dark:even:bg-gray-700 text-start"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`
                        ${
                          cell.column.columnDef.accessorKey === "email"
                            ? "hidden sm:table-cell"
                            : ""
                        }
                        ${
                          cell.column.columnDef.accessorKey === "photoURL"
                            ? "hidden md:table-cell"
                            : ""
                        }
                        px-2 sm:px-4 py-2 text-xs sm:text-sm
                      `}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs sm:text-sm"
                >
                  {t("No results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
