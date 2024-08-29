import axios from "axios";
export const addProduct = async (productData: ProductformValues, accessTkn) => {
  try {
    console.log("add product function ");
    // console.log(Object.fromEntries(productData));
    // console.log(accessTkn);
    const response = await axios.post(
      "http://localhost:8080/api/v1/ecommerce/product",
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessTkn}`,
        },
      }
    );
  } catch (error) {
    throw new Error("Failed to add product");
  }
};

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

export const getProducts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/ecommerce/product?page=${page}&limit=${limit}`
    );
    return {
      products: response.data.data.products,
      hasNextPage: response.data.data.hasNextPage,
      hasPreviousPage: response.data.data.hasPreviousPage,
      totalPages: response.data.data.totalPages,
    };
  } catch (error) {
    console.error(error);
    throw error;
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
