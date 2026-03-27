import { useState } from "react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface Props {
  title: string;
  data: any[];
  columns: Column[];
  searchKey?: string;
  emptyMessage?: string;
  pageSize?: number;
}

export default function ContentTable({ title, data, columns, searchKey, emptyMessage = "No items.", pageSize = 50 }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = searchKey && search
    ? data.filter((row) => String(row[searchKey] ?? "").toLowerCase().includes(search.toLowerCase()))
    : data;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <p className="font-body text-[13px] tracking-[0.15em] uppercase text-[#f0ead6]/75">{title}</p>
        {searchKey && (
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search…"
            className="bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-1.5 font-body text-xs focus:outline-none focus:border-[#f0ead6]/20 w-48"
          />
        )}
      </div>
      <div className="border border-[#f0ead6]/8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0ead6]/8">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-2.5 font-body text-[13px] tracking-[0.12em] uppercase text-[#f0ead6]/72 font-normal">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ead6]/5">
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-6 text-center font-body text-xs text-[#f0ead6]/68">{emptyMessage}</td></tr>
            ) : (
              paged.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-[#f0ead6]/8 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 font-body text-xs text-[#f0ead6]/92">
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-3">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="font-body text-xs text-[#f0ead6]/75 hover:text-[#f0ead6] disabled:opacity-30">← Prev</button>
          <span className="font-body text-[13px] text-[#f0ead6]/68">{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="font-body text-xs text-[#f0ead6]/75 hover:text-[#f0ead6] disabled:opacity-30">Next →</button>
        </div>
      )}
    </div>
  );
}
