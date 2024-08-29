"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/product.service";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { useState } from "react";
import { addItemsToCart } from "@/services/cart.service";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCartItemMutation } from "@/hooks/useCartQuery";
import useCartStore from "@/store/cart.store";

export default function Item({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { accessTkn } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const updateCartItemMutation = useUpdateCartItemMutation();
  const { updateLocalItemQuantity } = useCartStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity > 0) {
        updateLocalItemQuantity(productId, newQuantity);
        updateCartItemMutation.mutate({
          productId,
          quantity: newQuantity,
          accessToken: accessTkn,
        });
      }
      toast({
        title: "Item added to cart",
        description: `item have been added to your cart successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding item to cart:", error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProductById(params.id, accessTkn),
  });

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (!data) return <div className="text-center p-8">Product not found</div>;

  const product = data.data;
  const mainImageUrl = product.mainImage.url;
  const subImages = [mainImageUrl, ...product.subImages.map((img) => img.url)];

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Carousel */}
        <div className="md:w-1/2">
          <div className="aspect-w-1 aspect-h-1 mb-4">
            <Image
              src={selectedImage || mainImageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {subImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className="flex-shrink-0"
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded-md hover:opacity-75 transition"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="text-yellow-400 mr-2">★★★★☆</div>
            <span className="text-gray-600">
              {data.data.ratings} Ratings | 14 Answered Questions
            </span>
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-orange-500">
              Rs. {product.price}
            </span>
            <span className="text-gray-500 line-through ml-2">
              Rs. {Math.round(product.price * 1.62)}
            </span>
            <span className="text-green-600 ml-2">-62%</span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={decrementQuantity}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
            >
              +
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
              onClick={() => handleQuantityChange(product._id, quantity)}
            >
              Add to Cart
            </button>
          </div>
          <p className="text-gray-700 mb-6 mt-2">
            Remaining stock: {product.stock}
          </p>
        </div>
      </div>
    </div>
  );
}
