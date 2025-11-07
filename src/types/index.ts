export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoList {
  id: string;
  userId: string;
  title: string;
  description?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoItem {
  id: string;
  listId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}