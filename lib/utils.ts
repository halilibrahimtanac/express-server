export function idParser(value?: string | null) {
  let parsedId = parseInt(value || "");
  if (isNaN(parsedId)) {
    throw new Error("Invalid ID");
  }

  return parsedId;
}
