import { type ReactNode } from "react";
import AppBar from "../../appBar";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      {children}
    </div>
  );
}
