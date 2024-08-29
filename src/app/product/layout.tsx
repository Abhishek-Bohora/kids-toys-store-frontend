"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGithub } from "react-icons/fa";
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
import Image from "next/image";

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
    <div className="flex flex-col min-h-screen">
      <nav className="bg-green-600 shadow-lg border-b border-green-700 sticky top-0 z-50 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={75}
              height={75}
              className="rounded-full cursor-pointer"
              onClick={() => router.push("/product")}
            />
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
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-green-600 text-gray-200 p-6">
        <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaGithub size={24} />
            </a>
          </div>
          <p className="mt-4 md:mt-0 text-center text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
