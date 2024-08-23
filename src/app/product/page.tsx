"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { FaCartPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IoMdAddCircle } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const getProducts = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/ecommerce/product"
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const productSchema = z.object({
  productName: z.string().min(1, { message: "Product name is required" }),
  productDescription: z.string().min(1),
  category: z.string().min(1, { message: "Password is required" }),
  stock: z
    .number()
    .min(0, { message: "Stock must be a non-negative number" })
    .default(0),
  price: z
    .number()
    .min(0, { message: "Price must be a non-negative number" })
    .default(0),
  mainImage: z.any().refine((file) => file instanceof File, {
    message: "Main image is required",
  }),
  subImages: z
    .array(z.any())
    .refine((files) => files.every((file) => file instanceof File), {
      message: "Invalid sub images",
    })
    .optional(),
});

type ProductformValues = z.infer<typeof productSchema>;

export default function Product() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["products"], queryFn: getProducts });
  console.log(query.data);

  return (
    <div className="mx-3">
      <AddProductDialog />
      <div className="flex flex-wrap mt-2 gap-4  p-2">
        {query.data?.products?.map((product) => {
          return (
            <div key={product._id}>
              <ProductCard
                name={product.name}
                mainImageUrl={product?.mainImage?.url}
                price={product.price}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ProductCard = ({ name, mainImageUrl, price }) => {
  return (
    <div className="hover:bg-gray-200 400 p-4 rounded-md">
      <div className="flex">
        <div className="mr-2 w-44 h-44">
          <Image
            src={mainImageUrl}
            alt="Product Image"
            className="object-cover"
            width={200}
            height={200}
          />
        </div>
        <div className="w-10 h-10 bg-white p-2 rounded-full shadow z-10 ">
          <FaCartPlus size={22} />
        </div>
      </div>

      <div className="mt-2">
        <h2 className="font-bold text-xl mb-2 truncate font-sans text-gray-800">
          {name}
        </h2>
        <p className="text-gray-600 text-sm mb-2 font-sans">
          Product description
        </p>
        <p className="font-bold text-lg font-sans text-gray-800">Rs {price}</p>
      </div>
    </div>
  );
};

function AddProductDialog() {
  const onSubmit = (productFormData: ProductformValues) => {
    console.log(productFormData);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductformValues>({ resolver: zodResolver(productSchema) });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 mx-1">
          Add product <IoMdAddCircle className="mx-1" size={20} />
        </Button>
      </DialogTrigger>
      {/*  */}
      <DialogContent
        className={"sm:max-w-[600px] overflow-y-scroll max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>Add your products here</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Product name"
              {...register("productName")}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Product description"
              {...register("productDescription")}
            />
            {errors.productDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productDescription.message}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Category 1</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                min={0}
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainImage">Main Image</Label>
            <Input
              id="mainImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("mainImage", file);
                }
              }}
            />
            {errors.mainImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mainImage.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="subImages">Sub Images</Label>
            <Input
              id="subImages"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setValue("subImages", files);
              }}
            />
            {errors.subImages && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subImages.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
