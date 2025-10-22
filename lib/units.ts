import { UnitType } from './types';

// ============================================================================
// Unit Conversion Constants and Functions
// ============================================================================

/**
 * Conversion factors to base units:
 * - Weight: ounces (oz)
 * - Volume: milliliters (ml)
 * - Count: count (no conversion)
 */

const WEIGHT_CONVERSIONS: Record<string, number> = {
  oz: 1,
  lb: 16, // 1 lb = 16 oz
  g: 0.035274, // 1 g = 0.035274 oz
  kg: 35.274, // 1 kg = 35.274 oz
};

const VOLUME_CONVERSIONS: Record<string, number> = {
  ml: 1,
  L: 1000, // 1 L = 1000 ml
  'fl oz': 29.5735, // 1 fl oz = 29.5735 ml
  gal: 3785.41, // 1 gal = 3785.41 ml
  qt: 946.353, // 1 qt = 946.353 ml
  pt: 473.176, // 1 pt = 473.176 ml
};

/**
 * Get the base unit for a given unit type
 */
export function getBaseUnit(unit: UnitType): 'oz' | 'ml' | 'count' {
  if (unit in WEIGHT_CONVERSIONS) return 'oz';
  if (unit in VOLUME_CONVERSIONS) return 'ml';
  return 'count';
}

/**
 * Convert quantity to base unit
 * @param quantity - The quantity to convert
 * @param unit - The unit to convert from
 * @returns Quantity in base units (oz for weight, ml for volume, count for items)
 */
export function toBaseUnit(quantity: number, unit: UnitType): number {
  if (unit === 'count') return quantity;

  if (unit in WEIGHT_CONVERSIONS) {
    return quantity * WEIGHT_CONVERSIONS[unit];
  }

  if (unit in VOLUME_CONVERSIONS) {
    return quantity * VOLUME_CONVERSIONS[unit];
  }

  // Fallback: treat as count
  return quantity;
}

/**
 * Convert from base unit to target unit
 * @param baseQuantity - The quantity in base units
 * @param targetUnit - The unit to convert to
 * @returns Quantity in target unit
 */
export function fromBaseUnit(baseQuantity: number, targetUnit: UnitType): number {
  if (targetUnit === 'count') return baseQuantity;

  if (targetUnit in WEIGHT_CONVERSIONS) {
    return baseQuantity / WEIGHT_CONVERSIONS[targetUnit];
  }

  if (targetUnit in VOLUME_CONVERSIONS) {
    return baseQuantity / VOLUME_CONVERSIONS[targetUnit];
  }

  return baseQuantity;
}

/**
 * Calculate normalized unit price for comparison
 * Normalizes to price per base unit (oz, ml, or count)
 * @param price - Total price
 * @param quantity - Quantity
 * @param unit - Unit of measurement
 * @returns Price per base unit
 */
export function calculateNormalizedUnitPrice(
  price: number,
  quantity: number,
  unit: UnitType
): number {
  const baseQuantity = toBaseUnit(quantity, unit);
  return parseFloat((price / baseQuantity).toFixed(4));
}

/**
 * Format unit display with base unit for clarity
 * Example: "16 oz" → "$2.49/oz", "2 L" → "$1.25/L ($0.00125/ml)"
 */
export function formatUnitPriceDisplay(
  price: number,
  quantity: number,
  unit: UnitType
): string {
  const unitPrice = price / quantity;
  const baseUnit = getBaseUnit(unit);
  const normalizedPrice = calculateNormalizedUnitPrice(price, quantity, unit);

  if (unit === 'count' || baseUnit === 'count') {
    return `$${unitPrice.toFixed(2)}/item`;
  }

  // Show both unit price and normalized price if different
  if (unit === baseUnit) {
    return `$${unitPrice.toFixed(2)}/${unit}`;
  }

  return `$${unitPrice.toFixed(2)}/${unit} ($${normalizedPrice.toFixed(4)}/${baseUnit})`;
}

/**
 * Check if two units are comparable (same base unit)
 */
export function areUnitsComparable(unit1: UnitType, unit2: UnitType): boolean {
  return getBaseUnit(unit1) === getBaseUnit(unit2);
}

/**
 * Get display label for normalized comparison
 */
export function getNormalizedLabel(unit: UnitType): string {
  const baseUnit = getBaseUnit(unit);
  if (baseUnit === 'count') return 'per item';
  if (baseUnit === 'oz') return 'per oz';
  if (baseUnit === 'ml') return 'per ml';
  return 'per unit';
}
