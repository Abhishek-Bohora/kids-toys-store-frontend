"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  useCartQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/hooks/useCartQuery";
import useCartStore from "@/store/cart.store";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Cart() {
  const { accessTkn } = useAuthStore.getState();
  const {
    items,
    subtotal,
    setCartData,
    updateLocalItemQuantity,
    removeItemFromCart,
  } = useCartStore();
  const { data, isLoading, error } = useCartQuery(accessTkn);
  const updateCartItemMutation = useUpdateCartItemMutation();
  const deleteCartItemMutation = useDeleteCartItemMutation();

  const router = useRouter();
  useEffect(() => {
    if (data) {
      setCartData(data);
    }
  }, [data, setCartData]);

  const handleQuantityChange = (
    productId: string,
    newQuantity: number,
    stock: number
  ) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      updateLocalItemQuantity(productId, newQuantity);
      updateCartItemMutation.mutate({
        productId,
        quantity: newQuantity,
        accessToken: accessTkn,
      });
    }
  };

  const handleDeleteItem = (productId: string) => {
    deleteCartItemMutation.mutate(
      {
        productId,
        accessToken: accessTkn,
      },
      {
        onSuccess: () => {
          removeItemFromCart(productId);
        },
      }
    );
  };

  if (isLoading) return <SkeletonLoader />;
  if (error) return <div>Error loading cart: {(error as Error).message}</div>;
  if (items.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center font-sans">
        Your Shopping Cart
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="mb-6 pb-6 border-b last:border-b-0"
              >
                <div className="flex items-center">
                  <Image
                    src={item.product.mainImage.url}
                    alt={item.product.name}
                    height={120}
                    width={120}
                    className="object-cover rounded-md mr-6"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Rs {item.product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.product.stock} items in stock
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center border rounded-md mb-2">
                      <button
                        className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity - 1,
                            item.product.stock
                          )
                        }
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity + 1,
                            item.product.stock
                          )
                        }
                        disabled={item.quantity === item.product.stock}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteItem(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">Rs {subtotal.toFixed(2)}</span>
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={() => router.push("/product/cart/checkout")}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  const skeletonArray = Array.from({ length: 3 });
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center font-sans">
        Your Shopping Cart
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Skeleton for cart items */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <div className="max-h-[calc(100vh-300px)] pr-4">
            {skeletonArray.map((_, index) => (
              <div
                className="mb-6 pb-6 border-b last:border-b-0 animate-pulse"
                key={index}
              >
                <div className="flex items-center">
                  <div className="w-28 h-28 bg-gray-200 rounded-md mr-6"></div>
                  <div className="flex-grow">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded mb-2 w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center border rounded-md mb-2">
                      <div className="w-10 h-8 bg-gray-200 rounded"></div>
                      <div className="w-10 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Skeleton for order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="flex justify-between mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
