"use client";
export default function Success() {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your purchase.
        </p>
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <button
          onClick={() => (window.location.href = "/product")}
          className="mt-8 px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
