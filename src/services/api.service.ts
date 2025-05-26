// // // src/services/api.service.ts

// // import { HttpService } from './base.service';

// // // Create an instance of HttpService
// // const httpService = new HttpService();
// // const prefix = 'customer';


// // // Fetch Category List
// // export const fetchCategoryList = async () => {
// //     try {
// //         const response = await httpService.get(`${prefix}/category-list`);
// //         return response.data; // Return the data directly
// //     } catch (error) {
// //         console.error('Error fetching category list:', error);
// //         throw error;
// //     }
// // };

// // export const fetchSubCategoryList = async () => {
// //     try {
// //         const response = await httpService.get(`${prefix}/subcategory-list`);
// //         return response.data; // Return the data directly
// //     } catch (error) {
// //         console.error('Error fetching category list:', error);
// //         throw error;
// //     }
// // };


// // // Fetch Company List
// // export const fetchCompanyList = async () => {
// //     try {
// //         const response = await httpService.get(`${prefix}/company-list`);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching company list:', error);
// //         throw error;
// //     }
// // };


// // // Fetch Product Details
// // export const fetchProductDetails = async (companyId: string) => {
// //     try {
// //         const response = await httpService.get(`${prefix}/product-list`, {
// //             company_id: companyId,
// //         });
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching product details:', error);
// //         throw error;
// //     }
// // };


// // // Fetch Top Picks
// // export const fetchTopPicks = async (customerData: { customer_id: string; product_id: string; rating: number; review: string; order_number: string; cart_id: string; }) => {
// //     try {
// //         const response = await httpService.get(`/${prefix}/top-rated-products`, customerData);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching top rated products:', error);
// //         throw error;
// //     }
// // };

// // // Fetch Personalized Gifts

// // export const fetchPersonalizedGifts = async () => {
// //     try {
// //         const response = await httpService.get(`/${prefix}/personalized-gifts`);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching personalized ifts:', error);
// //         throw error;
// //     }
// // };

// // // Place Order
export const placeOrder = async (orderData: any) => {
    try {
        const response = await httpService.post(`${prefix}/place-order`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }

}


// // Fetch Order History
export const fetchOrderHistory = async () => {
    try {
        const response = await httpService.get(`${prefix}/order-history`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order history:', error);
        throw error;
    }
};

// // // Confirm Order
// // export const confirmOrder = async (orderId: string, paymentId: string) => {
// //     try {
// //         const response = await httpService.put(`${prefix}/confirm-order`, { order_id: orderId, payment_id: paymentId });
// //         return response;
// //     } catch (error) {
// //         console.error('Error confirming order:', error);
// //         throw error;
// //     }
// // };




// // // Fetch Dashboard Details
// // export const fetchDashboardDetails = async (categoryId: string, searchType: string) => {
// //     try {
// //         const response = await httpService.get(`${prefix}/dashboard`, {
// //             category_id: categoryId,
// //             search_type: searchType,
// //         });
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching dashboard details:', error);
// //         throw error;
// //     }
// // };

// // // Fetch Brand Details
// // export const fetchBrandDetails = async (categoryId: string, subcategoryId: string) => {
// //     try {
// //         const response = await httpService.get(`${prefix}/brand-list`, {
// //             category_id: categoryId,
// //             subcategory_id: subcategoryId,
// //         });
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching brand details:', error);
// //         throw error;
// //     }
// // };



// // // Fetch Promo Brand Details
// // export const fetchPromoBrandDetails = async () => {
// //     try {
// //         const response = await httpService.get(`${prefix}/promo-brand-list`);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching promo brand details:', error);
// //         throw error;
// //     }
// // };

// // // Fetch Sticker List
// // export const fetchStickerList = async (params: any) => {
// //     try {
// //         const response = await httpService.get(`${prefix}/sticker-list`, params);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching sticker list:', error);
// //         throw error;
// //     }
// // };

// // // Fetch Promo List
// // export const fetchPromoList = async (params: any) => {
// //     try {
// //         const response = await httpService.get(`${prefix}/promo-list`, params);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching promo list:', error);
// //         throw error;
// //     }
// // };


// // // Update Profile
// // // Update Profile
// // export const updateProfile = async (profileData: any) => {
// //     try {
// //         const response = await httpService.put(`${prefix}/update-profile`, profileData);
// //         return response.data;
// //     } catch (error: any) {
// //         console.error('Error updating profile:', error.response?.data || error.message);
// //         throw new Error(error.response?.data?.message || 'Failed to update profile.');
// //     }
// // };



// // // Fetch Jazz Cash Sticker List (Envelope List)
// // export const fetchEnvelopeList = async () => {
// //     try {
// //         const response = await httpService.get(`${prefix}/envelope-list`);
// //         return response.data; // Return the data directly
// //     } catch (error: any) {
// //         console.error('Error catching envelope list:', error.response?.data || error.message);
// //         throw new Error(error.response?.data?.message || 'Failed to catch envelope list.');
// //     }
// // };

// // // Place Order Jazz Cash
// // export const placeEnvelopeOrder = async (orderData: any) => {
// //     try {
// //         const response = await httpService.post(`${prefix}/place-envelope-order`, orderData);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error placing order:', error);
// //         throw error;
// //     }

// // }

// // src/services/api.service.ts
// // import { toast } from 'react-toastify';
// // import { HttpService } from './base.service';

// // // Create an instance of HttpService
// // const httpService = new HttpService();
// // const prefix = 'customer';

// // // Helper function to handle errors
// // const handleError = (error: any, defaultMessage: string) => {
// //     const errorMessage = error.response?.data?.message || defaultMessage;
// //     console.error(defaultMessage, error.response || error.message);
// //     throw new Error(errorMessage); // Return error message instead of displaying toast
// // };


// src/services/api.service.ts
import { toast } from 'react-toastify';
import { HttpService } from './base.service';

// Create an instance of HttpService
const httpService = new HttpService();
const prefix = 'customer';  // adjust prefix for actual backend route if different

// Helper function to handle errors
const handleError = (error: any, defaultMessage: string) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    console.error(defaultMessage, error.response || error.message);
    throw new Error(errorMessage); // Return error message instead of displaying toast
};
const getErrorMessage = (error: any, defaultMessage: string): string => {
    // Check for backend's specific error structure first
    const backendMessage = error.response?.data?.message || error.response?.data?.error;
    // Fallback to generic Axios error message or default
    return backendMessage || error.message || defaultMessage;
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

export const fetchTrendingProducts = async () => {
    try {
        const response = await httpService.get(`${prefix}/top-rated-products`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching top-rated products.');
    }
};

// export const fetchPersonalizedGifts = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/personalized-gifts`);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Error fetching personalized gifts.');
//     }
// };

// export const placeOrder = async (orderData: any) => {
//     try {
//         const response = await httpService.post(`${prefix}/place-order`, orderData);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Error placing order.');
//     }
// };

export const confirmOrder = async (orderId: string, paymentId: string) => {
    try {
        const response = await httpService.put(`${prefix}/confirm-order`, { order_id: orderId, payment_id: paymentId });
        toast.success('Order confirmed successfully!');
        return response;
    } catch (error) {
        handleError(error, 'Error confirming order.');
    }
};
// export const fetchOrderHistory = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/order-history`);
//         return response;
//     } catch (error: any) {
//         if (error.response?.status === 404) {
//             // Handle 404 specifically: No orders found (or endpoint not found)
//             return {
//                 success: false, // Indicate failure for order fetching
//                 message: 'No orders found yet!', // Specific message for no orders
//                 data: [] // Return empty data array
//             };
//         } else {
//             // For other errors, use the generic error handler
//             return handleError(error, 'Error fetching order history.');
//         }
//     }
// };


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

// Send a gift
export const sendGift = async (orderId: string, orderNumber: string, receiverEmail: string) => {
    try {
        const response = await httpService.post(`${prefix}/send-gift`, {
            order_id: orderId,
            order_number: orderNumber,
            receiver_email: receiverEmail
        });

        if (response.data?.success) {
            const receiverGifts = await getUserGifts(); // Fetch receiver's gifts
            return {
                sentGiftData: response.data.data || {},
                receiverGifts: receiverGifts
            };
        } else {
            throw new Error(response.data?.message || 'Error sending gift');
        }
    } catch (error) {
        return handleError(error, 'Error sending gift.');
    }
};

export const getUserGifts = async () => {
    try {
        const response = await httpService.get(`${prefix}/user-gifts`);

        if (response.data?.success) {
            return {
                receive_gifts: response.data.receive_gifts || [],
                claim_gifts: response.data.claim_gifts || []
            };
        } else {
            console.error('Server Error:', response.data?.message);
            return {
                receive_gifts: [],
                claim_gifts: [],
                error: response.data?.message || 'Error fetching user gifts'
            };
        }
    } catch (error: any) {
        console.error('Error fetching gifts:', error.response?.data || error.message);
        return {
            receive_gifts: [],
            claim_gifts: [],
            error: 'Error fetching user gifts'
        };
    }
};


// // In send-gift flow
// export const sendGift = async (orderId: string, orderNumber: string, receiverEmail: string) => {
//     try {
//         const response = await httpService.post(`${prefix}/send-gift`, {
//             order_id: orderId,
//             order_number: orderNumber,
//             receiver_email: receiverEmail
//         });

//         if (response.data?.success) {
//             // After successful gift sending, fetch receiver's gifts
//             const receiverGifts = await getUserGifts(); // This will use receiver's token
//             return {
//                 sentGiftData: response.data.data || {},
//                 receiverGifts: receiverGifts
//             };
//         } else {
//             throw new Error(response.data?.message || 'Error sending gift');
//         }
//     } catch (error) {
//         // Use the existing handleError helper function
//         return handleError(error, 'Error sending gift.');
//     }
// };

// // receive gift
// export const getUserGifts = async () => {
//     try {
//         const response = await httpService.get(`${prefix}/user-gifts`);

//         // Checking the response to ensure the success status
//         if (response.data?.success) {
//             return {
//                 receive_gifts: response.data.receive_gifts || [],
//                 claim_gifts: response.data.claim_gifts || []
//             };
//         } else {
//             throw new Error(response.data?.message || 'Error fetching user gifts');
//         }
//     } catch (error) {
//         // Simply use the existing handleError helper function
//         return handleError(error, 'Error fetching user gifts.');
//     }
// };

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

export const fetchPromotionList = async () => {
    try {
        const response = await httpService.get(`${prefix}/promo-list`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching promo details.');
    }
};

// Fetch Sticker List
export const fetchStickerList = async () => {
  try {
        const response = await httpService.get(`${prefix}/sticker-list`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching sticker list.');
    }
};

export const updateProfile = async (profileData: any) => {
    try {
        const response = await httpService.put(`${prefix}/profile-update`, profileData);
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to update profile.');
    }
};


// Fetch Events
export const fetchEvents = async () => {
    try {
        const response = await httpService.get(`${prefix}/event`);
        return response.data; // Ensure the data is returned
    } catch (error) {
        handleError(error, 'Failed to fetch events');
        return []; // Return an empty array on error to avoid breaking the UI
    }
};


// // Create Events
// export const createEvents = async (eventData: any) => {
//     try {
//         const response = await httpService.post(`${prefix}/event`, eventData);
//         return response.data;

//     } catch (error) {
//         handleError(error, 'Failed to create event');
//     }

// }

// Create Events
export const createEvents = async (eventData: any) => {
    try {
        const response = await httpService.post(`${prefix}/event`, eventData);
        // Check for backend success flag if it exists
        if (response.data && response.data.success === false) {
            throw new Error(response.data.message || 'Backend reported failure');
        }
        return response.data; // Return full response or response.data as needed

    } catch (error: any) {
        const errorMessage = getErrorMessage(error, 'Failed to create event');
        console.error('createEvents Error:', errorMessage, error.response || error);
        throw new Error(errorMessage); // Throw error
    }
};

// Fetch Personalized Gifts 
export const fetchPersonalizedGifts = async () => {
    try {
        const endpoint = `${prefix}/personalized-gifts`;
        const response = await httpService.get(endpoint);
        return response.data;
    } catch (error: any) {
        const errorMessage = getErrorMessage(error, 'Failed to fetch personalized gifts/event types');
        console.error('fetchPersonalizedGifts Error:', errorMessage, error.response || error);
        throw new Error(errorMessage);
    }
};

export const fetchMostUsedPersonalizedGifts = async () => {
    try {
        const endpoint = `${prefix}/most-used-gifts`;
        const response = await httpService.get(endpoint);
        return response.data;
    } catch (error: any) {
        const errorMessage = getErrorMessage(error, 'Failed to fetch personalized gifts/event types');
        console.error('fetchPersonalizedGifts Error:', errorMessage, error.response || error);
        throw new Error(errorMessage);
    }
};

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

// Filters
//Apply Price Filter
export const applyPriceFilter = async (params: any) => {
    try {
        const response = await httpService.get(`${prefix}/price-filter`, params);
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to apply price filter');
    }
}
//
export const applyRecOccFilter = async () => {
    try {
        const response = await httpService.get(`${prefix}/rec-occ`);
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to apply recipient and occasion filter');
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

