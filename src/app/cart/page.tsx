"use client";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import axios from "axios";

const getUserCart = async (accessToken) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/ecommerce/cart",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export default function Cart() {
  const { accessTkn } = useAuthStore.getState();
  const { data, isLoading } = useQuery({
    queryKey: ["useCart"],
    queryFn: () => getUserCart(accessTkn),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No items in cart</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-lg font-semibold mb-4">Shopping Items</h1>
          {data.items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center mb-6 pb-6 border-b"
            >
              <img
                src={item.product.mainImage.url}
                alt={item.product.name}
                className="w-24 h-24 object-cover mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                {/* TODO: api to fetch category by id has not been made yet */}
                {/* <p className="text-gray-600">{item.product.category}</p> */}
                <p className="text-gray-800 font-medium">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center">
                <select
                  className="border rounded px-2 py-1 mr-2"
                  defaultValue={item.quantity}
                >
                  {[...Array(item.product.stock)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <button className="text-gray-500 hover:text-red-500">×</button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:w-1/3">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${data.cartTotal.toFixed(2)}</span>
            </div>

            <Button type="submit">Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
