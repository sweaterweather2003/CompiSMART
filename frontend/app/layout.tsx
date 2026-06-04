import React from 'react';
import './globals.css';
export const metadata = {
  title: 'Cross-Video Benchmarking RAG',
  description: 'Performance Diagnostics and Transcript Context Analysis Workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="antialiased m-0 p-0">
        {children}
      </body>
    </html>
  );
}