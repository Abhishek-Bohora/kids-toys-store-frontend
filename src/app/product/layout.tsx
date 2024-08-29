"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useCartQuery } from "@/hooks/useCartQuery";
import { useAuthStore } from "@/store/auth.store";
import useCartStore from "@/store/cart.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CiShoppingCart } from "react-icons/ci";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { items, setCartData } = useCartStore();
  const { accessTkn, clearTokens } = useAuthStore();
  const { data, isLoading, error } = useCartQuery(accessTkn);
  useEffect(() => {
    if (data) {
      setCartData(data);
    }
  }, [data, setCartData]);
  const cartItemCount = items.length;

  const handleLogout = () => {
    clearTokens();
    router.replace("auth/login");
  };

  return (
    <div>
      <nav className="bg-green-600 p-4 shadow-lg border-b border-green-700 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://github.com/shadcn.png"
              alt="Logo"
              className="h-10 w-10 rounded-full cursor-pointer hover:opacity-80"
              onClick={() => router.push("/product")}
            />
            <span
              className="text-white text-xl font-semibold cursor-pointer"
              onClick={() => router.push("/product")}
            >
              Brand Name
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <CiShoppingCart
                color="#fff"
                size={28}
                className="cursor-pointer hover:text-gray-200"
                onClick={() => router.push("/product/cart")}
              />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:opacity-80">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleLogout()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
