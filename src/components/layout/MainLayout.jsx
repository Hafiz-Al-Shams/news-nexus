"use client";

export default function MainLayout({ leftSidebar, mainContent, rightSidebar }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar - Narrowest, independently scrollable */}
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        {leftSidebar}
      </aside>

      {/* Main Content - Largest, independently scrollable */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {mainContent}
      </main>

      {/* Right Sidebar - Double width of left, independently scrollable */}
      <aside className="w-[32rem] bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
        {rightSidebar}
      </aside>
    </div>
  );
}
