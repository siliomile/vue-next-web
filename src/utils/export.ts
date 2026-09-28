/**
 * @description 前端导出工具（CSV，Excel 可直接打开，含 BOM 防中文乱码）（迁移自 party-dues-pc）
 */

export interface ExportColumn<T = Record<string, any>> {
  prop: string;
  label: string;
  formatter?: (row: T) => string | number | undefined | null;
}

/**
 * 导出 CSV 文件
 * @param fileName 文件名（无需后缀）
 * @param columns 列配置
 * @param rows 数据行
 */
export const exportCsv = (fileName: string, columns: ExportColumn<any>[], rows: any[] = []) => {
  const escape = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const text = String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const header = columns.map(col => escape(col.label)).join(',');
  const body = rows.map(row =>
    columns
      .map(col => {
        const value = col.formatter ? col.formatter(row) : row[col.prop];
        return escape(value);
      })
      .join(','),
  );

  const csv = `\uFEFF${[header, ...body].join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** 金额格式化：保留两位小数，不带千分位 */
export const formatAmount = (value?: number | string | null) => {
  if (value === null || value === undefined || value === '') return '0.00';
  const num = Number(value);
  if (Number.isNaN(num)) return '0.00';
  return num.toFixed(2);
};

/** 金额展示：¥ 12.00 */
export const formatMoney = (value?: number | string | null) => `¥${formatAmount(value)}`;

/** 百分比展示（整数，四舍五入） */
export const formatPercent = (value?: number | null) => `${Math.round(Number(value ?? 0))}%`;
