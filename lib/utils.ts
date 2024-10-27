export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // 基本的なXSS対策
    .replace(/\s+/g, ' '); // 複数の空白を1つに
}