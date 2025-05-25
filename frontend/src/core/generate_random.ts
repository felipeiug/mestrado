// Gerador pseudoaleatório com seed (Algoritmo Mulberry32)
export class SeededRandom {
  constructor(public seed: number) { }

  next() {
    this.seed |= 0;
    this.seed = this.seed + 0x6D2B79F5 | 0;
    let t = Math.imul(this.seed ^ this.seed >>> 15, 1 | this.seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Gerar número entre min (inclusivo) e max (exclusivo)
  between(min: number, max: number) {
    return min + this.next() * (max - min);
  }

  // Escolher item aleatório de um array
  pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

export function generateRandomHash(length: number, random?: SeededRandom): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor((random?.next() ?? Math.random()) * charsetLength);
    result += charset[randomIndex];
  }

  return result;
}

export function generateRandomColor(opaque = true, random?: SeededRandom): string {
  const charset = '0123456789ABCDEF';
  let result = '';
  const charsetLength = charset.length;

  for (let i = 0; i < (opaque ? 6 : 8); i++) {
    const randomIndex = Math.floor((random?.next() ?? Math.random()) * charsetLength);
    result += charset[randomIndex];
  }

  return "#" + result;
}

