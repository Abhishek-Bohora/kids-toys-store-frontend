"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart.store";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartQuery } from "@/hooks/useCartQuery";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { headers } from "next/headers";
import { useToast } from "@/components/ui/use-toast";

const checkoutSchema = z.object({
  addressLine1: z.string().min(1, { message: "Product name is required" }),
  addressLine2: z.string(),
  district: z.string().min(1, { message: "district name is required" }),
  city: z.string().min(1, { message: "city name is required" }),
});

type checkoutSchemaFormValues = z.infer<typeof checkoutSchema>;

const generateKhaltiPaymentUrl = async (
  formData: checkoutSchemaFormValues,
  accessToken: string
) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/ecommerce/orders/provider/khalti",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default function CheckOut() {
  const { toast } = useToast();
  const { accessTkn } = useAuthStore.getState();
  const { items, subtotal, setCartData, updateLocalItemQuantity } =
    useCartStore();
  const { data, isLoading, error } = useCartQuery(accessTkn);

  useEffect(() => {
    if (data) {
      setCartData(data);
    }
  }, [data, setCartData]);

  console.log(items);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<checkoutSchemaFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const mutation = useMutation({
    mutationFn: (formData: checkoutSchemaFormValues) =>
      generateKhaltiPaymentUrl(formData, accessTkn),
    onSuccess: (data) => {
      if (data.success && data.data.payment_url) {
        window.location.href = data.data.payment_url;
      } else {
        toast({
          title: "Error",
          description: "Failed to generate payment URL",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "An error occurred while processing your order",
        variant: "destructive",
      });
    },
  });

  console.log(items);

  const onSubmit = (checkoutFormData: checkoutSchemaFormValues) => {
    mutation.mutate(checkoutFormData);
  };
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Cart Items */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex items-center gap-4">
                <img
                  src={item.product.mainImage.url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-medium">{item.product.name}</h3>
                  <p className="text-gray-500">
                    Quantity: {item.quantity} | Price: ${item.product.price}
                  </p>
                </div>
              </div>
            ))}
            <div className="text-right text-lg font-semibold">
              Total: ${subtotal.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Checkout Form */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input
              id="addressLine1"
              placeholder="Enter Address Line 1"
              {...register("addressLine1")}
              className="mt-1"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.addressLine1.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              placeholder="Enter Address Line 2 (Optional)"
              {...register("addressLine2")}
              className="mt-1"
            />
            {errors.addressLine2 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.addressLine2.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              placeholder="Enter District"
              {...register("district")}
              className="mt-1"
            />
            {errors.district && (
              <p className="text-red-500 text-sm mt-1">
                {errors.district.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter City"
              {...register("city")}
              className="mt-1"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Processing..." : "Place Order"}
          </Button>
        </form>
      </div>
    </div>
  );
}
