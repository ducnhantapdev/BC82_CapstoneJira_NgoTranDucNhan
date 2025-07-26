import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>Header</div>
      {children}
      <div>footer</div>
    </>
  );
}
