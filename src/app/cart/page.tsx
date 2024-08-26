"use client";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
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

export default function Cart({ params: { id } }: { params: { id: string } }) {
  const { accessTkn } = useAuthStore.getState();
  const { data, isLoading } = useQuery({
    queryKey: ["useCart"],
    queryFn: () => getUserCart(accessTkn),
  });
  console.log(data);
  return <h1>product cart page {id}</h1>;
}
