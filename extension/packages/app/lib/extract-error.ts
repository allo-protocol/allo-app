export function extractErrorReason(errorMessage: string): string {
  const regex = /reason:\s*(.*)$/m;
  const match = regex.exec(errorMessage);

  return match ? (match[1]?.trim() ?? "") : "";
}
