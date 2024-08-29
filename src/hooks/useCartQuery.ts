import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCart, updateCartItem } from "@/services/cart.service";
import axios from "axios";

export const useCartQuery = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getUserCart(accessToken),
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

export const useDeleteCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      accessToken,
    }: {
      productId: string;
      accessToken: string;
    }) =>
      axios.delete(
        `http://localhost:8080/api/v1/ecommerce/cart/item/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};
