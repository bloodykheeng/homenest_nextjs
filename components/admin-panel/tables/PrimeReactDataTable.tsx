"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableValueArray,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import { MenuItem } from "primereact/menuitem";
import * as XLSX from "xlsx";

import {
  FiTrash2,
  FiFileText,
  FiSettings,
  FiPlus,
  FiEdit,
  FiEye,
  FiCheckSquare,
} from "react-icons/fi";

// Generic type for data items
type DataItem = {
  [key: string]: any;
};

// Extended ColumnConfig type with visibility option
type ColumnConfig<T> = {
  field: string;
  header: string;
  type?: "date" | "image" | string;
  body?: (rowData: T) => React.ReactNode;
  visible?: boolean; // New property to control visibility
};

// Props type for the reusable DataTable component
type PrimeReactDataTableProps<T extends DataItem> = {
  data: T[];
  columns: ColumnConfig<T>[];
  totalRecords: number;
  rows: number;
  first: number;
  loading: boolean;
  emptyMessage?: string;
  title?: string;
  globalFilter?: string;
  onPageChange: (event: DataTablePageEvent) => void;
  headerContent?: React.ReactNode;
  responsiveLayout?: "stack" | "scroll";
  fileName?: string; // For Excel export
  rowsPerPageOptions?: number[];
  // deleting records
  showDelete?: boolean;
  handleDelete?: () => any;
  // multiple selects
  selection?: boolean;
  selectedItems?: [] | null;
  setSelectedItems?: (items: []) => void;
  // viewing a record
  showViewRecord?: boolean;
  handleViewRecord?: (data: any) => void;
  hideRowViewRecord?: (record: any) => boolean; // ✅ Function to hide view button for specific rows
  // creating a record
  showCreateRecord?: boolean;
  handleCreateRecord?: (data: any) => void;
  // editing a record
  showEditRecord?: boolean;
  handleEditRecord?: (data: any) => void;
  hideRowEditRecord?: (record: any) => boolean; // ✅ Function to hide edit button for specific rows
  // take action on records
  showTakeAction?: boolean;
  handleTakeAction?: () => any;
};

const PrimeReactDataTable = <T extends DataItem>({
  data,
  columns,
  totalRecords,
  rows,
  first,
  loading,
  emptyMessage = "No data found.",
  title,
  globalFilter,
  onPageChange,
  headerContent,
  responsiveLayout = "stack",
  fileName = "export",
  // rowsPerPageOptions = [5, 10, 25, 50],
  rowsPerPageOptions, // Will be auto-computed if not provided
  // deleting records
  showDelete = false,
  handleDelete = () => { },
  // selecting
  selection = false,
  selectedItems,
  setSelectedItems = () => { },
  // viewing records
  showViewRecord = false,
  handleViewRecord = () => { },
  hideRowViewRecord, // ✅ Destructure the new prop
  // creating a record
  showCreateRecord = false,
  handleCreateRecord = () => { },
  // editing a record
  showEditRecord = false,
  handleEditRecord = () => { },
  hideRowEditRecord, // ✅ Destructure the new prop

  // take action on records
  showTakeAction = false,
  handleTakeAction = () => { },
}: PrimeReactDataTableProps<T>) => {
  const memorisedColumns = useMemo(() => columns, [columns]);

  // Auto-compute rowsPerPageOptions based on totalRecords
  // const computedRowsPerPageOptions = useMemo(() => {
  //     // If rowsPerPageOptions is provided, use it as is
  //     if (rowsPerPageOptions && rowsPerPageOptions.length > 0) {
  //         return rowsPerPageOptions;
  //     }

  //     // If totalRecords is less than 5, return default options
  //     if (totalRecords < 5) {
  //         return [5, 10, 25, 50];
  //     }

  //     // Compute 4 sections: first=5, last=totalRecords, and 2 sections in between
  //     const sections = [];
  //     sections.push(5); // Always start with 5

  //     // Calculate the remaining 2 middle sections
  //     const remaining = totalRecords - 5;
  //     const section1 = Math.floor(remaining / 3) + 5;
  //     const section2 = Math.floor((remaining * 2) / 3) + 5;

  //     sections.push(section1);
  //     sections.push(section2);
  //     sections.push(totalRecords); // Always end with totalRecords

  //     // Remove duplicates and sort
  //     const uniqueSections = [...new Set(sections)].sort((a, b) => a - b);

  //     return uniqueSections;
  // }, [totalRecords, rowsPerPageOptions]);

  const computedRowsPerPageOptions = useMemo(() => {
    const baseOptions = [5, 10, 25, 50, 100, 200];

    // Only add totalRecords if it's not already in the array and greater than max default
    if (totalRecords > 200 && !baseOptions.includes(totalRecords)) {
      return [...baseOptions, totalRecords];
    }

    return baseOptions;
  }, [totalRecords]);

  // State for visible columns
  // Store column visibility state separately from column configuration
  const [columnVisibility, setColumnVisibility] = useState<
    Record<number, boolean>
  >(() =>
    columns.reduce((acc, col, index) => {
      acc[index] = col.visible !== false;
      return acc;
    }, {} as Record<number, boolean>)
  );

  // Toggle menu reference
  const columnMenuRef = useRef<Menu>(null);

  // Toggle column visibility
  const toggleColumnVisibility = (index: number) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Generate column visibility menu items
  const generateColumnMenuItems = (): MenuItem[] => {
    return columns.map((col, index) => ({
      template: () => (
        <div className="flex align-items-center gap-2 p-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            inputId={`col-${index}`}
            checked={columnVisibility[index]}
            onChange={() => toggleColumnVisibility(index)}
          />
          <label htmlFor={`col-${index}`} className="ml-2">
            {col.header}
          </label>
        </div>
      ),
    }));
  };

  // Excel export function
  const exportToExcel = () => {
    const exportData = data.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col, index) => {
        if (columnVisibility[index]) {
          const fieldPath = col.field.split(".");
          let value: any = item;
          for (const part of fieldPath) {
            value = value?.[part];
            if (value === undefined || value === null) break;
          }
          // Format the value if it's a date type
          if (col.type === "date" && value) {
            // Explicitly cast value to string before creating Date object
            try {
              value = new Date(String(value)).toLocaleDateString();
            } catch (e) {
              value = String(value); // Fallback if date parsing fails
            }
          }
          // Use plain text for cells with custom rendering
          row[col.header] =
            value !== undefined && value !== null ? String(value) : "";
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Custom header with column visibility toggle and export button
  const header = (
    <div className="flex flex-wrap justify-between items-center w-full gap-2">
      <div className="">{headerContent}</div>
      <div className="flex gap-2">
        {showTakeAction &&
          Array.isArray(selectedItems) &&
          selectedItems?.length > 0 && (
            <>
              <Button
                icon="pi pi-file-check mr-2"
                className="p-button-primary"
                tooltip="Take Action"
                onClick={handleTakeAction}
              >
                Take Action
              </Button>
            </>
          )}
        {showDelete &&
          Array.isArray(selectedItems) &&
          selectedItems?.length > 0 && (
            <>
              <Button
                // icon="pi pi-trash"
                icon={<FiTrash2 />}
                className="p-button-danger"
                tooltip="Delete"
                onClick={handleDelete}
              />
            </>
          )}
        <Button
          //   icon="pi pi-file-excel"
          icon={<FiFileText />}
          className="p-button-success"
          tooltip="Export to Excel"
          onClick={exportToExcel}
        />
        <Button
          //   icon="pi pi-cog"
          icon={<FiSettings />}
          className="p-button-secondary"
          tooltip="Toggle Columns"
          onClick={(e) => columnMenuRef.current?.toggle(e)}
        />

        {showCreateRecord && (
          <>
            <Button
              //   icon="pi pi-plus"
              icon={<FiPlus />}
              className="p-button-primary"
              label="Create"
              tooltip="Create record"
              tooltipOptions={{ position: "top" }}
              onClick={handleCreateRecord}
            />
          </>
        )}
      </div>
      <Menu
        ref={columnMenuRef}
        popup
        model={generateColumnMenuItems()}
        className="w-auto"
      />
    </div>
  );

  // Custom footer with loading indicator
  const footer = loading ? (
    <div className="flex justify-content-center align-items-center p-4">
      <ProgressSpinner style={{ width: "30px", height: "30px" }} />
      <span className="ml-2">Loading data...</span>
    </div>
  ) : null;

  // ✅ Updated action body template with row-level hide logic
  const actionBodyTemplate = (rowData: any) => {
    // Check if buttons should be hidden for this specific row
    const shouldHideEdit = hideRowEditRecord ? hideRowEditRecord(rowData) : false;
    const shouldHideView = hideRowViewRecord ? hideRowViewRecord(rowData) : false;

    return (
      <div className="flex flex-wrap gap-1">
        {showEditRecord && !shouldHideEdit && ( // ✅ Hide edit button if hideRowEditRecord returns true
          <>
            <Button
              // icon="pi pi-pencil"
              icon={<FiEdit />}
              tooltip="edit"
              rounded
              outlined
              severity="success"
              className="mr-2"
              onClick={() => handleEditRecord(rowData)}
            />
          </>
        )}

        {/* <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => { }} /> */}
        {showViewRecord && !shouldHideView && ( // ✅ Hide view button if hideRowViewRecord returns true
          <>
            <Button
              //   icon="pi pi-eye"
              icon={<FiEye />}
              rounded
              outlined
              className="p-button-info"
              tooltip="view record"
              onClick={() => handleViewRecord(rowData)}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <DataTable
        value={data}
        header={header}
        footer={footer}
        lazy
        paginator
        rows={rows}
        // rowsPerPageOptions={rowsPerPageOptions}
        rowsPerPageOptions={computedRowsPerPageOptions}
        totalRecords={totalRecords}
        first={first}
        onPage={onPageChange}
        emptyMessage={loading ? "loading..." : emptyMessage}
        globalFilter={globalFilter}
        responsiveLayout={responsiveLayout}
        breakpoint="960px"
        scrollable={true}
        scrollHeight="400px"
        stripedRows={false}
        showGridlines={false}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
        className="w-full shadow-sm"
        selectionMode={selection ? "multiple" : null}
        selection={selectedItems ?? []}
        onSelectionChange={(e: any) => {
          if (Array.isArray(e.value)) {
            setSelectedItems(e.value);
          }
        }}
      >
        <Column
          selectionMode={selection ? "multiple" : undefined}
          exportable={false}
        ></Column>
        {columns.map((col, index) =>
          columnVisibility[index] ? (
            <Column
              key={`${col.field}-${index}`}
              field={col.field}
              header={col.header}
              body={col.body}
              sortable={false}
              headerStyle={{ whiteSpace: "nowrap" }}
              headerClassName="border-b-2 border-gray-300 dark:border-gray-700"
            />
          ) : null
        )}

        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default PrimeReactDataTable;