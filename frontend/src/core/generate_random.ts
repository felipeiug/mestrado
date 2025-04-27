export function generateRandomHash(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset[randomIndex];
  }

  return result;
}

export function generateRandomColor(opaque = true): string {
  const charset = '0123456789ABCDEF';
  let result = '';
  const charsetLength = charset.length;

  for (let i = 0; i < (opaque?6:8); i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset[randomIndex];
  }

  return "#" + result;
}