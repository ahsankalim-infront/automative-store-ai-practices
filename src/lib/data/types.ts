export interface IJsonStore {
  read<T>(collection: string): Promise<T[]>;
  write<T>(collection: string, data: T[]): Promise<void>;
  readOne<T extends { id: string }>(collection: string, id: string): Promise<T | null>;
  create<T extends { id: string }>(collection: string, item: T): Promise<T>;
  update<T extends { id: string }>(collection: string, id: string, partial: Partial<T>): Promise<T | null>;
  delete(collection: string, id: string): Promise<boolean>;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  flashSale?: boolean;
  search?: string;
  slug?: string;
  limit?: number;
  make?: string;
  model?: string;
  year?: number;
}
