export default function generateRandomRotation(
  remainder: number,
  rotations?: number[]
) {
  if (!rotations)
    rotations = [
      1.6, -1.34, 1.2, -1.55, 1.8, -1.2, 1.3, -1.7, 1.4, -1.9, 1.1, -1.45,
    ];
  return rotations[remainder];
}

export function generateRandomNumber(): number {
  const random = Math.random();

  return random * (2.7 * 2) - 2.7;
}
