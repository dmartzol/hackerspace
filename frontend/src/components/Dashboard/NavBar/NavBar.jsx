import React from "react";

export default function Dashboard() {
  return (
    <header class="text-gray-600 body-font">
      <div class="container mx-auto p-5 inline-flex justify-end">
        <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 mt-4 md:mt-0 focus:outline-none hover:bg-gray-200 rounded text-base">
          Log out
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
