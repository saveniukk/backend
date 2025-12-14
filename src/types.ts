export interface Category {
  id: string;
  name: string;
}

export interface Record {
  id: string;
  userId: string;
  categoryId: string;
  timestamp: string;
  amount: number;
}
