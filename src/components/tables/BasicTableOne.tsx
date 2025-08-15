// BasicTableOne.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";

// Struktur kolom tabel
export interface Column<T, K extends keyof T = keyof T> {
  label: string; // Judul kolom di header
  data: K;       // Nama properti di object data yang diambil nilainya
  render?: (value: T[K], row: T) => React.ReactNode; // Custom render cell
}

interface BasicTableProps<T> {
  columns: Column<T>[]; // Daftar kolom tabel
  data: T[];            // Data yang mau ditampilkan
}

// Komponen tabel generik
export default function BasicTable<T>({ columns, data }: BasicTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Header tabel */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((col, i) => (
                  <TableCell
                    key={i}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body tabel */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col, ci) => (
                    <TableCell
                      key={ci}
                      className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400"
                    >
                      {/* Kalau ada render custom pakai itu, kalau tidak tampilkan value apa adanya */}
                      {col.render
                        ? col.render(row[col.data], row)
                        : String(row[col.data] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
