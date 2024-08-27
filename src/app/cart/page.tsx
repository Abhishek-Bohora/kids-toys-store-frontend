"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { useCartQuery, useUpdateCartItemMutation } from "@/hooks/useCartQuery";
import useCartStore from "@/store/cart.store";

export default function Cart() {
  const { accessTkn } = useAuthStore.getState();
  const { items, subtotal, setCartData, updateLocalItemQuantity } =
    useCartStore();
  const { data, isLoading, error } = useCartQuery(accessTkn);
  const updateCartItemMutation = useUpdateCartItemMutation();

  useEffect(() => {
    if (data) {
      setCartData(data);
    }
  }, [data, setCartData]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateLocalItemQuantity(productId, newQuantity);
    updateCartItemMutation.mutate({
      productId,
      quantity: newQuantity,
      accessToken: accessTkn,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart: {(error as Error).message}</div>;
  if (items.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-lg font-semibold mb-4">Shopping Items</h1>
          {items.map((item) => (
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
                <p className="text-gray-800 font-medium">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center">
                <select
                  className="border rounded px-2 py-1 mr-2"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.product._id,
                      parseInt(e.target.value)
                    )
                  }
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
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button type="submit" className="w-full">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
