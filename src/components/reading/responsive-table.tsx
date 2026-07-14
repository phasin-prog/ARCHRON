import type { ReactNode, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

// ห่อหุ้มตารางให้สามารถเลื่อนซ้ายขวาได้ (overflow-x-auto) บนจอมือถือโดยไม่ทำให้เลย์เอาต์หลักแตก
export function ResponsiveTable({ children, className = "", ...props }: TableHTMLAttributes<HTMLTableElement> & { children?: ReactNode }) {
  return (
    <div className="my-7 w-full overflow-x-auto rounded-xl border border-border/80 bg-bg-card shadow-xs transition-colors">
      <table className={`w-full border-collapse text-left text-sm text-text-body ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

// ตกแต่งส่วนหัวตาราง (th) ให้เด่นชัด มีขอบเขต และอ่านง่ายสไตล์วิชาการ
export function ResponsiveTableHeader({ children, className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <th
      className={`border-b border-border bg-bg-elevated/80 px-4 py-3 font-semibold text-text-heading text-xs uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

// ตกแต่งช่องข้อมูลตาราง (td) ให้มีระยะห่างที่พอเหมาะและรองรับ Markdown ภายใน
export function ResponsiveTableCell({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td
      className={`border-b border-border/50 px-4 py-3 text-sm leading-relaxed text-text-body transition-colors hover:bg-bg-elevated/20 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
