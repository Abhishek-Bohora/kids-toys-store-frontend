import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCart, updateCartItem } from "@/services/cart.service";

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
