import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  password: string; // hashed
  createdAt: Date;
}

export interface RowItem {
  _id?: ObjectId;
  title: string;
  quantity: number;
  price: number;
  unitPrice: number;
  createdAt: Date;
  owner: ObjectId;
  username: string;
  private?: boolean;
}

export interface SessionUser {
  id: string;
  username: string;
}
