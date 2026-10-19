const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// REGISTER
export const registerData = async (form) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        return await res.json();
    } catch (error) {
        console.log("Register failed:", error.message);
    }
};

// LOGIN
export const loginData = async (form) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        return await res.json();
    } catch (error) {
        console.log("Login failed:", error.message);
    }
};


export const addCategory = async (form) => {
    try {
        const formData = new FormData();
        formData.append("name", form.name);
        if (form.image) {
            formData.append("image", form.image);
        }
        // Agar parentCategory selected hai toh bhejo, warna null/empty chhodo
        if (form.parentCategory) {
            formData.append("parentCategory", form.parentCategory);
        }

        const res = await fetch(`${BASE_URL}/category/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        return await res.json();
    } catch (error) {
        console.error("Add category failed:", error.message);
        throw error;
    }
};

// GET CATEGORY
export const getCategorydata = async () => {
    try {
        const res = await fetch(`${BASE_URL}/category/get`);
        return await res.json();
    } catch (error) {
        console.log(error.message);
    }
};

export const getParentCategorydata = async () => {
    try {
        const res = await fetch(`${BASE_URL}/category/get/parents`);
        return await res.json();
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteCategorydata = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/category/delete/${id}`, {
            method: "delete",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(id)
        })

        return await res.json();
    } catch (error) {
        console.log(error.message);
    }
}


export const updateCategorydata = async (id, form) => {
    try {
        const formData = new FormData();
        formData.append("name", form.name);
        if (form.image) {
            formData.append("image", form.image);
        }
        if (form.parentCategory !== undefined) {
            formData.append("parentCategory", form.parentCategory || "");
        }

        const res = await fetch(`${BASE_URL}/category/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        return await res.json();
    } catch (error) {
        console.error("Update category failed:", error.message);
        throw error;
    }
};


// GET PRODUCTS
export const getProductdata = async () => {
    try {
        const res = await fetch(`${BASE_URL}/product/`);
        return await res.json();
    } catch (error) {
        console.log(error.message);
    }
};

// GET ADDRESSES
export const getAddresses = async () => {
    try {
        const res = await fetch(`${BASE_URL}/address`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        return await res.json();
    } catch (error) {
        console.log("Get addresses failed:", error.message);
    }
};

// ADD ADDRESS
export const addAddress = async (form) => {
    try {
        const res = await fetch(`${BASE_URL}/address`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(form)
        });

        return await res.json();
    } catch (error) {
        console.log("Add address failed:", error.message);
    }
};

// GET CART
export const getCart = async () => {
    try {
        const res = await fetch(`${BASE_URL}/cart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        return await res.json();
    } catch (error) {
        console.log("Get cart failed:", error.message);
    }
};

export const createOrder = async (amount) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Order creation failed");
    }

    return data;
};

export const verifyResponse = async (paymentResponse, shippingAddress) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/payment/verify-payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            ...paymentResponse,
            shippingAddress,
        }),
    });

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(
            "API returned HTML instead of JSON. Check backend URL and route."
        );
    }

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Payment verification failed");
    }

    return data;
};

export const getMyOrders = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load orders");
    }

    return data;
};

// GET WISHLIST
export const getWishlist = async () => {
    try {
        const res = await fetch(`${BASE_URL}/wishlist`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to get wishlist");
        }

        return data;
    } catch (error) {
        console.log("Get wishlist failed:", error.message);
        throw error;
    }
};

// ADD TO WISHLIST
export const addToWishlist = async (productId) => {
    try {
        const res = await fetch(`${BASE_URL}/wishlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ productId })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to add to wishlist");
        }

        return data;
    } catch (error) {
        console.log("Add wishlist failed:", error.message);
        throw error;
    }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (productId) => {
    try {
        const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to remove from wishlist");
        }

        return data;
    } catch (error) {
        console.log("Remove wishlist failed:", error.message);
        throw error;
    }
};


// Add Product to Cart
export const addToCart = async ({
    productId,
    quantity = 1,
    size = "",
    color = "",
}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first to add products to your cart.");
    }

    const response = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            productId,
            quantity,
            size,
            color,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart.");
    }

    return data;
};


export const addProduct = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/product/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error("API addProduct Error:", error);
        throw error.response?.data || { status: false, message: error.message };
    }
}

// UPDATE PRODUCT
export const updateProduct = async (id, formData) => {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Product update failed");
    }

    return { status: response.status, data: result };
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Product delete failed");
    }

    return result;
};


// ADD PRODUCT REVIEW
export const addProductReview = async (productId, reviewData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/product/${productId}/reviews`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reviewData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
    }

    return data;
};

// GET PRODUCT REVIEWS
export const getProductReviews = async (productId) => {
    const response = await fetch(
        `${BASE_URL}/product/${productId}/reviews`,
        {
            method: "GET",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
    }

    return data;
};

export const getAdminCustomers = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/admin/customers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customers");
    }

    return data;
};


export const getAdminOrders = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/orders/admin-orders`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
    }

    return data;
};


export const cancelMyOrder = async (orderId, reason) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/orders/${orderId}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to cancel order");
  }

  return data;
};


