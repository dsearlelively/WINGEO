import { User } from '../types';

// This is a mock service. In a real app, this would use firebase/auth
// import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const MOCK_USER: User = {
  uid: 'user-123',
  email: 'field.engineer@example.com',
  displayName: 'Alex Field',
  role: 'employee',
};

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulating network delay
      localStorage.setItem('fieldops_user', JSON.stringify(MOCK_USER));
      resolve(MOCK_USER);
    }, 800);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('fieldops_user');
      resolve();
    }, 400);
  });
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('fieldops_user');
  return stored ? JSON.parse(stored) : null;
};