export const compareStreamFolders = (left: string, right: string): number => {
  const leftNumber = Number(left.replace("stream_", ""));
  const rightNumber = Number(right.replace("stream_", ""));
  return leftNumber - rightNumber;
};

export const toRelativePath = (file: File): string => {
  const raw = file.webkitRelativePath || file.name;
  const parts = raw.split("/").filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join("/") : parts[0] ?? file.name;
};

export const getFileIdentity = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;
