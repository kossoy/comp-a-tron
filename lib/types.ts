import { ObjectId } from 'mongodb';

// ============================================================================
// User Types
// ============================================================================

export interface User {
  _id?: ObjectId;
  username: string;
  password: string; // hashed
  createdAt: Date;
}

export interface SessionUser {
  id: string;
  username: string;
}

// ============================================================================
// Unit Types and Categories
// ============================================================================

export type UnitType =
  | 'count'     // items (default)
  | 'oz'        // ounces
  | 'lb'        // pounds
  | 'g'         // grams
  | 'kg'        // kilograms
  | 'ml'        // milliliters
  | 'L'         // liters
  | 'fl oz'     // fluid ounces
  | 'gal'       // gallons
  | 'qt'        // quarts
  | 'pt';       // pints

export type CategoryType =
  | 'groceries'
  | 'beverages'
  | 'household'
  | 'personal-care'
  | 'electronics'
  | 'snacks'
  | 'produce'
  | 'dairy'
  | 'frozen'
  | 'other';

export const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'household', label: 'Household' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'produce', label: 'Produce' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'other', label: 'Other' },
];

export const UNITS: { value: UnitType; label: string; baseUnit?: string }[] = [
  { value: 'count', label: 'Count (items)' },
  { value: 'oz', label: 'Ounces (oz)', baseUnit: 'oz' },
  { value: 'lb', label: 'Pounds (lb)', baseUnit: 'oz' },
  { value: 'g', label: 'Grams (g)', baseUnit: 'g' },
  { value: 'kg', label: 'Kilograms (kg)', baseUnit: 'g' },
  { value: 'ml', label: 'Milliliters (ml)', baseUnit: 'ml' },
  { value: 'L', label: 'Liters (L)', baseUnit: 'ml' },
  { value: 'fl oz', label: 'Fluid Ounces (fl oz)', baseUnit: 'ml' },
  { value: 'gal', label: 'Gallons (gal)', baseUnit: 'ml' },
  { value: 'qt', label: 'Quarts (qt)', baseUnit: 'ml' },
  { value: 'pt', label: 'Pints (pt)', baseUnit: 'ml' },
];

// ============================================================================
// Item Types
// ============================================================================

export interface RowItem {
  _id?: ObjectId;
  title: string;
  quantity: number;
  unit: UnitType;
  price: number;
  unitPrice: number; // price per unit (e.g., price per oz)
  normalizedUnitPrice?: number; // price in base unit for comparison
  createdAt: Date;
  updatedAt?: Date;
  owner: ObjectId;
  username: string;
  private?: boolean;
  category?: CategoryType;
  tags?: string[];
  notes?: string;
  store?: string;
  expirationDate?: Date;
}

// ============================================================================
// Price History Types
// ============================================================================

export interface PriceHistoryEntry {
  _id?: ObjectId;
  itemId: ObjectId;
  itemTitle: string;
  price: number;
  unitPrice: number;
  quantity: number;
  unit: UnitType;
  recordedAt: Date;
  owner: ObjectId;
}

// ============================================================================
// Shopping List Types
// ============================================================================

export interface ShoppingListItem {
  itemId?: ObjectId; // Reference to RowItem if added from comparison
  title: string;
  quantity: number;
  unit: UnitType;
  estimatedPrice?: number;
  checked: boolean;
  notes?: string;
}

export interface ShoppingList {
  _id?: ObjectId;
  name: string;
  items: ShoppingListItem[];
  totalEstimatedCost: number;
  createdAt: Date;
  updatedAt: Date;
  owner: ObjectId;
  username: string;
  shared?: boolean;
  sharedWith?: string[]; // usernames
}

// ============================================================================
// Filter and Sort Types
// ============================================================================

export type SortField = 'unitPrice' | 'price' | 'quantity' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface ItemFilters {
  category?: CategoryType;
  tags?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: Date;
  dateTo?: Date;
  store?: string;
}
