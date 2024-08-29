"use client";
import { queryClient } from "@/lib/queryClient";
import {
  useQuery,
  useQueryClient,
  useMutation,
  keepPreviousData,
} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { FaCartPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IoMdAddCircle } from "react-icons/io";
import { useAuthStore } from "@/store/auth.store";
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
import { Skeleton } from "@/components/ui/skeleton";
import ClipLoader from "react-spinners/ClipLoader";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { addItemsToCart } from "@/services/cart.service";
import {
  getProducts,
  getCategories,
  addProduct,
} from "@/services/product.service";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const productSchema = z.object({
  productName: z.string().min(1, { message: "Product name is required" }),
  productDescription: z.string().min(1),
  category: z.string().min(1, { message: "category is required" }),
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
  const [page, setPage] = useState(1); // Start from page 1
  const limit = 10;

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    isLoading,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts(page, limit),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    const skeletonArray = Array.from({ length: 8 });

    return (
      <div className="flex flex-wrap mt-2 gap-4 p-2">
        {skeletonArray.map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-3">
      <AddProductDialog />
      <div className="flex flex-wrap mt-2 gap-4  p-2">
        {data?.products?.map((product) => {
          return (
            <div key={product._id}>
              <ProductCard
                name={product.name}
                mainImageUrl={product?.mainImage?.url}
                price={product.price}
                productId={product._id}
              />
            </div>
          );
        })}
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              className={`cursor-pointer ${
                page === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setPage(index + 1)}
                isActive={page === index + 1}
                className="cursor-pointer"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (!isPlaceholderData && data?.hasNextPage) {
                  setPage((old) => old + 1);
                }
              }}
              className={`cursor-pointer ${
                isPlaceholderData || !data?.hasNextPage
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {isFetching && !isPending ? <div>Updating...</div> : null}
    </div>
  );
}

const ProductCard = ({ name, mainImageUrl, price, productId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { accessTkn } = useAuthStore();
  const mutation = useMutation({
    mutationFn: () => addItemsToCart(productId, accessTkn),
    onSuccess: (data) => {
      toast({
        title: "Item added to cart",
        description: "Your Item has been added to cart successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding item to cart:", error);
    },
  });
  return (
    <div
      className="hover:bg-gray-200 400 p-4 rounded-md cursor-pointer"
      onClick={() => router.push(`/product/${productId}`)}
    >
      <div className="flex">
        <div className="mr-2 w-44 h-44">
          <Image
            src={mainImageUrl}
            alt="Product Image"
            className="object-cover cursor-pointer"
            width={200}
            height={200}
          />
        </div>
        <div className="w-10 h-10 bg-white p-2 rounded-full shadow z-10 cursor-pointer ">
          <FaCartPlus
            size={22}
            onClick={(e) => {
              e.stopPropagation();
              mutation.mutate();
            }}
          />
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
  const { accessTkn, refreshTkn, isAuthenticated, accessTokenData } =
    useAuthStore.getState();
  const mutation = useMutation({
    mutationFn: (formData: FormData) => addProduct(formData, accessTkn),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // success toast
      toast({
        title: "Product Added",
        description: "Your product has been added successfully!",
      });
    },
  });

  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { toast } = useToast();

  console.log(categoryQuery.data);

  const onSubmit = (productFormData: ProductformValues) => {
    const formData = new FormData();
    // Map productName to name, productDescription to description
    formData.append("name", productFormData.productName);
    formData.append("description", productFormData.productDescription);

    // Ensure category is an ID
    formData.append("category", productFormData.category);

    // Ensure these are numbers
    formData.append("stock", productFormData.stock.toString());
    formData.append("price", productFormData.price.toString());

    if (productFormData.mainImage instanceof File) {
      formData.append("mainImage", productFormData.mainImage);
    }

    if (productFormData.subImages && Array.isArray(productFormData.subImages)) {
      productFormData.subImages.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`subImages`, file);
        }
      });
    }
    mutation.mutate(formData);
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
        {accessTokenData?.role === "ADMIN" && (
          <Button className="mt-4 mx-1">
            Add product <IoMdAddCircle className="mx-1" size={20} />
          </Button>
        )}
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
              <Select
                onValueChange={(value) => setValue("category", value)}
                disabled={categoryQuery.isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryQuery.data?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <div className="mx-2 mt-2">
                  <ClipLoader
                    loading={mutation.isPending}
                    color="#fff"
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
