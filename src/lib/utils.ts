import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToOunces(
  amount: number,
  unit: string
): { value: number; unit: string } {
  const normalizedUnit = unit.toLowerCase();

  if (
    normalizedUnit === "g" ||
    normalizedUnit === "grams" ||
    normalizedUnit === "gram"
  ) {
    return {
      value: Number((amount * 0.035274).toFixed(1)),
      unit: "oz",
    };
  }

  return {
    value: amount,
    unit: unit,
  };
}
