import { create } from "zustand";

interface CartItem {
  product: {
    _id: string;
    price: number;
    stock: number;
    name: string;
    mainImage: {
      url: string;
    };
  };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  subtotal: number;
  setCartData: (data: { items: CartItem[]; cartTotal: number }) => void;
  updateLocalItemQuantity: (productId: string, newQuantity: number) => void;
  calculateSubtotal: () => void;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  subtotal: 0,
  cartItemCount: 0,
  setCartData: (data) => {
    set({
      items: data.items,
      subtotal: data.cartTotal,
    });
  },
  updateLocalItemQuantity: (productId, newQuantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: parseInt(newQuantity.toString()) }
          : item
      ),
    }));
    get().calculateSubtotal();
  },
  calculateSubtotal: () => {
    const subtotal = get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    set({ subtotal });
  },
}));

export default useCartStore;
