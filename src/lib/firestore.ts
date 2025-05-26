import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Define types for our data models
export interface Order {
  id?: string;
  customer: string;
  email: string;
  phone: string;
  amount: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: 'mobile_money' | 'card' | 'cash';
  date: string;
  items: Array<{name: string; quantity: number; price: string}>;
  address: string;
  notes: string;
  createdAt?: any;
}

export interface Payment {
  id?: string;
  orderId: string;
  customer: string;
  amount: string;
  method: 'mobile_money' | 'card' | 'cash';
  provider: string;
  status: 'successful' | 'pending' | 'refunded' | 'failed';
  reference: string;
  date: string;
  createdAt?: any;
}

export interface Restaurant {
  id?: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  totalOrders: number;
  status: 'active' | 'inactive';
  featured: boolean;
  cuisineType: string;
  deliveryTime: string;
  createdAt?: any;
}

export interface MenuItem {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  restaurant: string;
  restaurantId: string;
  available: boolean;
  popular: boolean;
  preparationTime: string;
  calories: number;
  createdAt?: any;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'restaurant_owner';
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
  orders: number;
  createdAt?: any;
}

// Define collection names
export type CollectionName = 'orders' | 'payments' | 'restaurants' | 'menuItems' | 'users';

// Helper function to convert Firestore document to our model
const convertDoc = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data
  } as T;
};

// Get all documents from a collection
export const getCollection = async <T>(collectionName: CollectionName): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => convertDoc<T>(doc));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    return [];
  }
};

// Get a document by ID
export const getDocument = async <T>(collectionName: CollectionName, id: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    return null;
  }
};

// Add a new document
export const addDocument = async <T>(collectionName: CollectionName, data: T): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    return null;
  }
};

// Update a document
export const updateDocument = async <T>(
  collectionName: CollectionName, 
  id: string, 
  data: Partial<T>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data as any);
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return false;
  }
};

// Delete a document
export const deleteDocument = async (
  collectionName: CollectionName, 
  id: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    return false;
  }
};

// Query documents by field
export const queryDocuments = async <T>(
  collectionName: CollectionName,
  field: string,
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=',
  value: any,
  orderByField?: string,
  orderDirection?: 'asc' | 'desc',
  limitCount?: number
): Promise<T[]> => {
  try {
    let q = query(collection(db, collectionName), where(field, operator, value));
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDoc<T>(doc));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    return [];
  }
};

export default {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments
};
