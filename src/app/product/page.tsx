"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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

export default function Product() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["products"], queryFn: getProducts });
  console.log(query.data);

  return (
    <div>
      {query.data?.products?.map((product) => {
        return (
          <div key={product._id}>
            <p>{product.name}</p>
            <p>{product?.mainImage?.url}</p>
          </div>
        );
      })}
    </div>
  );
}
