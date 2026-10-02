// utils/resumeHelpers.js
export const toArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data instanceof Map) return Array.from(data.values());
  if (typeof data === 'object') return Object.values(data);
  return [];
};

export const sortByPriority = (items) => {
  return [...items].sort((a, b) => (a.priority || 1) - (b.priority || 1));
};

export const formatDate = (val) => {
  if (!val) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (val instanceof Date) return val.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return String(val);
};