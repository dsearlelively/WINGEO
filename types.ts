import { LucideIcon } from "lucide-react";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'employee' | 'manager';
}

export interface AppModule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string; // Tailwind color class prefix like 'bg-blue-500'
  bgGradient: string;
}

export interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}