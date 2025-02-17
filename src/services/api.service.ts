// // src/services/api.service.ts

// import { HttpService } from './base.service';

// // Create an instance of HttpService
// const httpService = new HttpService();
// const prefix = 'customer';


// // Fetch Category List
// export const fetchCategoryList = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/category-list`);
//         return response.data; // Return the data directly
//     } catch (error) {
//         console.error('Error fetching category list:', error);
//         throw error;
//     }
// };

// export const fetchSubCategoryList = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/subcategory-list`);
//         return response.data; // Return the data directly
//     } catch (error) {
//         console.error('Error fetching category list:', error);
//         throw error;
//     }
// };


// // Fetch Company List
// export const fetchCompanyList = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/company-list`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching company list:', error);
//         throw error;
//     }
// };


// // Fetch Product Details
// export const fetchProductDetails = async (companyId: string) => {
//     try {
//         const response = await httpService.get(`${prefix}/product-list`, {
//             company_id: companyId,
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching product details:', error);
//         throw error;
//     }
// };


// // Fetch Top Picks
// export const fetchTopPicks = async (customerData: { customer_id: string; product_id: string; rating: number; review: string; order_number: string; cart_id: string; }) => {
//     try {
//         const response = await httpService.get(`/${prefix}/top-rated-products`, customerData);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching top rated products:', error);
//         throw error;
//     }
// };

// // Fetch Personalized Gifts

// export const fetchPersonalizedGifts = async () => {
//     try {
//         const response = await httpService.get(`/${prefix}/personalized-gifts`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching personalized ifts:', error);
//         throw error;
//     }
// };

// // Place Order
// export const placeOrder = async (orderData: any) => {
//     try {
//         const response = await httpService.post(`${prefix}/place-order`, orderData);
//         return response.data;
//     } catch (error) {
//         console.error('Error placing order:', error);
//         throw error;
//     }

// }


// // Fetch Order History
// export const fetchOrderHistory = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/order-history`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching order history:', error);
//         throw error;
//     }
// };

// // Confirm Order
// export const confirmOrder = async (orderId: string, paymentId: string) => {
//     try {
//         const response = await httpService.put(`${prefix}/confirm-order`, { order_id: orderId, payment_id: paymentId });
//         return response;
//     } catch (error) {
//         console.error('Error confirming order:', error);
//         throw error;
//     }
// };




// // Fetch Dashboard Details
// export const fetchDashboardDetails = async (categoryId: string, searchType: string) => {
//     try {
//         const response = await httpService.get(`${prefix}/dashboard`, {
//             category_id: categoryId,
//             search_type: searchType,
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching dashboard details:', error);
//         throw error;
//     }
// };

// // Fetch Brand Details
// export const fetchBrandDetails = async (categoryId: string, subcategoryId: string) => {
//     try {
//         const response = await httpService.get(`${prefix}/brand-list`, {
//             category_id: categoryId,
//             subcategory_id: subcategoryId,
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching brand details:', error);
//         throw error;
//     }
// };



// // Fetch Promo Brand Details
// export const fetchPromoBrandDetails = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/promo-brand-list`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching promo brand details:', error);
//         throw error;
//     }
// };

// // Fetch Sticker List
// export const fetchStickerList = async (params: any) => {
//     try {
//         const response = await httpService.get(`${prefix}/sticker-list`, params);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching sticker list:', error);
//         throw error;
//     }
// };

// // Fetch Promo List
// export const fetchPromoList = async (params: any) => {
//     try {
//         const response = await httpService.get(`${prefix}/promo-list`, params);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching promo list:', error);
//         throw error;
//     }
// };


// // Update Profile
// // Update Profile
// export const updateProfile = async (profileData: any) => {
//     try {
//         const response = await httpService.put(`${prefix}/update-profile`, profileData);
//         return response.data;
//     } catch (error: any) {
//         console.error('Error updating profile:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to update profile.');
//     }
// };



// // Fetch Jazz Cash Sticker List (Envelope List)
// export const fetchEnvelopeList = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/envelope-list`);
//         return response.data; // Return the data directly
//     } catch (error: any) {
//         console.error('Error catching envelope list:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to catch envelope list.');
//     }
// };

// // Place Order Jazz Cash
// export const placeEnvelopeOrder = async (orderData: any) => {
//     try {
//         const response = await httpService.post(`${prefix}/place-envelope-order`, orderData);
//         return response.data;
//     } catch (error) {
//         console.error('Error placing order:', error);
//         throw error;
//     }

// }

// src/services/api.service.ts
import { toast } from 'react-toastify';
import { HttpService } from './base.service';

// Create an instance of HttpService
const httpService = new HttpService();
const prefix = 'customer';

// Helper function to handle errors
const handleError = (error: any, defaultMessage: string) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    toast.error(errorMessage); // Show a toast notification
    console.error(defaultMessage, error.response || error.message);
    throw new Error(errorMessage);
};

// Fetch Category List
export const fetchCategoryList = async () => {
    try {
        const response = await httpService.get(`${prefix}/category-list`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching category list.');
    }
};

export const fetchSubCategoryList = async () => {
    try {
        const response = await httpService.get(`${prefix}/subcategory-list`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching subcategory list.');
    }
};

export const fetchCompanyList = async () => {
    try {
        const response = await httpService.get(`${prefix}/company-list`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching company list.');
    }
};

export const fetchProductDetails = async (companyId: string) => {
    try {
        const response = await httpService.get(`${prefix}/product-list`, {
            company_id: companyId,
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching product details.');
    }
};

export const fetchTopPicks = async () => {
    try {
        const response = await httpService.get(`${prefix}/top-rated-products`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching top-rated products.');
    }
};

export const fetchPersonalizedGifts = async () => {
    try {
        const response = await httpService.get(`${prefix}/personalized-gifts`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching personalized gifts.');
    }
};

export const placeOrder = async (orderData: any) => {
    try {
        const response = await httpService.post(`${prefix}/place-order`, orderData);
        return response.data;
    } catch (error) {
        handleError(error, 'Error placing order.');
    }
};

export const fetchOrderHistory = async () => {
    try {
        const response = await httpService.get(`${prefix}/order-history`);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        // toast.error(errorMessage); // Show a toast notification
        console.error(error.response || error.message);
        throw new Error(errorMessage);
    }
};

export const confirmOrder = async (orderId: string, paymentId: string) => {
    try {
        const response = await httpService.put(`${prefix}/confirm-order`, { order_id: orderId, payment_id: paymentId });
        toast.success('Order confirmed successfully!');
        return response;
    } catch (error) {
        handleError(error, 'Error confirming order.');
    }
};

export const fetchReviews = async (productId: string) => {
    try {
        const response = await httpService.get(`${prefix}/review?productId=${productId}`);
        return response.data.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error fetching reviews.';
        console.error(errorMessage, error.response || error.message);
        throw new Error(errorMessage);
    }
};

export const addReviews = async (productId: string, rating: number, review: string, orderNumber: string, cartId: string) => {
    try {
        const response = await httpService.post(`${prefix}/add_review`, {
            product_id: productId,
            rating: rating,
            review: review,
            order_number: orderNumber,
            cart_id: cartId
        });

        // Checking the response to ensure the success status
        if (response.data.success) {
            return response.data.data; // Return the review data
        } else {
            throw new Error(response.data.message || 'Error adding review');
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error adding review.';
        console.error(errorMessage, error.response || error.message);
        throw new Error(errorMessage);
    }
};


// //My Gifts

// export const sendGift = async (orderId: string, orderNumber: string, receiverEmail: string) => {
//     try {
//         const response = await httpService.post(`${prefix}/send-gift`, {
//             order_id: orderId,
//             order_number: orderNumber,
//             receiver_email: receiverEmail
//         });

//         // Checking the response to ensure the success status
//         if (response.data.success) {
//             return response.data.data; // Return the gift data
//         } else {
//             throw new Error(response.data.message || 'Error sending gift');
//         }
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Error sending gift.';
//         console.error(errorMessage, error.response || error.message);
//         throw new Error(errorMessage);
//     }
// };

// In send-gift flow
export const sendGift = async (orderId: string, orderNumber: string, receiverEmail: string) => {
    try {
        const response = await httpService.post(`${prefix}/send-gift`, {
            order_id: orderId,
            order_number: orderNumber,
            receiver_email: receiverEmail
        });

        if (response.data.success) {
            // After successful gift sending, fetch receiver's gifts
            const receiverGifts = await getUserGifts(); // This will use receiver's token
            return {
                sentGiftData: response.data.data,
                receiverGifts: receiverGifts
            };
        } else {
            throw new Error(response.data.message || 'Error sending gift');
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error sending gift.';
        console.error(errorMessage, error.response || error.message);
        throw new Error(errorMessage);
    }
};

// receive gift
export const getUserGifts = async () => {
    try {
        const response = await httpService.get(`${prefix}/user-gifts`);

        // Checking the response to ensure the success status
        if (response.data.success) {
            // Return the gifts directly from response.data since it contains
            // success, message, receive_gifts, and claim_gifts
            return {
                receive_gifts: response.data.receive_gifts,
                claim_gifts: response.data.claim_gifts
            };
        } else {
            throw new Error(response.data.message || 'Error fetching user gifts');
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error fetching user gifts.';
        console.error(errorMessage, error.response || error.message);
        throw new Error(errorMessage);
    }
};


export const fetchDashboardDetails = async (categoryId: string, searchType: string) => {
    try {
        const response = await httpService.get(`${prefix}/dashboard`, {
            category_id: categoryId,
            search_type: searchType,
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching dashboard details.');
    }
};

export const fetchBrandDetails = async (categoryId: string, subcategoryId: string) => {
    try {
        const response = await httpService.get(`${prefix}/brand-list`, {
            category_id: categoryId,
            subcategory_id: subcategoryId,
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching brand details.');
    }
};

export const updateProfile = async (profileData: any) => {
    try {
        const response = await httpService.put(`${prefix}/profile-update`, profileData);
        toast.success(response.data.message || 'Profile updated successfully!');
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to update profile.');
    }
};

// Fetch Events
export const fetchEvents = async () => {
    try {
        const response = await httpService.get(`${prefix}/event`);
        return response.data;
    }
    catch (error) {
        handleError(error, 'Failed to fetch events');
    }
};


// Create Events
export const createEvents = async (eventData: any) => {
    try {
        const response = await httpService.post(`${prefix}/event`, eventData);
        return response.data;

    } catch (error) {
        handleError(error, 'Failed to create event');
    }

}

// Delete Events
// export const deleteEvents = async (eventId: string) => {
//     try {
//         const response = await httpService.delete(`${prefix}/event/${eventId}`);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Failed to delete event');
//     }
// }


//Contact
export const contactUs = async (userData: any) => {
    try {
        const response = await httpService.post(`${prefix}/contact-us`, userData);
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to contact us');
    }
}


// Fetch Jazz Cash Sticker List (Envelope List)
export const fetchEnvelopeList = async () => {
    try {
        const response = await httpService.get(`${prefix}/envelope-list`);
        return response.data; // Return the data directly
    } catch (error: any) {
        console.error('Error catching envelope list:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to catch envelope list.');
    }
};

// Place Order Jazz Cash
export const placeEnvelopeOrder = async (orderData: any) => {
    try {
        const response = await httpService.post(`${prefix}/place-envelope-order`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }

}