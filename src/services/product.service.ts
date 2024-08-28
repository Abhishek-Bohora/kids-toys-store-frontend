import axios from "axios";

export const getProductById = async (id, accessToken) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/ecommerce/product/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/ecommerce/product"
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/ecommerce/categories"
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};
