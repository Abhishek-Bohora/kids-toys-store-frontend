import axios from "axios";
export const getUserCart = async (accessToken) => {
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

export const updateCartItem = async ({ productId, quantity, accessToken }) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/v1/ecommerce/cart/item/${productId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update cart item");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const addItemsToCart = async (id, accesToken) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/v1/ecommerce/cart/item/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
