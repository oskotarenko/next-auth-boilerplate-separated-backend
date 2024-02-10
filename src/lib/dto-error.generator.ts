export function genEmptyMessage(fieldName: string) {
  fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  return `${fieldName} can't be empty`;
}

export function genInvalidMessage(fieldName: string) {
  fieldName = fieldName.toLocaleLowerCase();
  return `Invalid ${fieldName}`;
}
