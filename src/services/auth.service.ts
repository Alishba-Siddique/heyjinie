// // // src/services/auth.service.ts

// // import { HttpService } from "./base.service";
// // import { encrypt } from "./encryption.service"; // Import the encrypt and decrypt functions
// // import { setCookie, removeCookie, getCookie } from "../utils/cookieUtility";
// // import { setSession, clearSession } from "../utils/sessionUtility";
// // import { toast } from "react-toastify";

// // class AuthService extends HttpService {
// //   private readonly prefix: string = "customer";

// //   private async apiHandler(apiCall: () => Promise<any>) {
// //     try {
// //       const response = await apiCall();
// //       // console.log("API Call Response:", response);
// //       // Check if the response indicates success
// //       if (response.data?.success) {
// //         return response.data.data; // Return the data if successful
// //       } else {
// //         throw new Error(response.data?.message || "Unknown error occurred");
// //       }
// //     } catch (error: any) {
// //       console.error("API Error:", error);
// //       throw new Error(
// //         error.response?.data?.message || "An error occurred during the API call"
// //       );
// //     }
// //   }

// //   public async login(body: any): Promise<any> {
// //     return this.apiHandler(async () => {
// //       const { email, password } = body;

// //       if (typeof password !== "string") {
// //         throw new Error("Password must be a string");
// //       }

// //       const response = await this.post(`${this.prefix}/login`, {
// //         email,
// //         password,
// //       });

// //       if (!response.data || !response.data.data) {
// //         throw new Error("Invalid response structure");
// //       }

// //       const user = response.data.data;
// //       const token = user.api_key;

// //       if (!token) {
// //         throw new Error(
// //           response.data.message || "API key is missing from the response"
// //         );
// //       }

// //       // Concatenate API key and email
// //       const apiKeyString = `${token}:${email}`;

// //       // Encrypt the concatenated string
// //       const encryptedApiKey = encrypt(
// //         apiKeyString,
// //         process.env.NEXT_PUBLIC_ENCRYPTION_PASS_KEY as string
// //       );
// //       // console.log("Encrypted API Key:", encryptedApiKey);

// //       // Store the encrypted API key in cookies
// //       setCookie("authToken", encryptedApiKey);
// //       setCookie("userData", JSON.stringify(user));

// //       // Set the session
// //       await setSession(encryptedApiKey, user); // Ensure session is set

// //       // console.log("Session set with token and user data.");
// //       return response;
// //     });
// //   }

// //   public async register(body: any): Promise<any> {
// //     return this.apiHandler(async () => {
// //       const response = await this.post(`${this.prefix}/register`, body);
// //       const user = response.data.data;
// //       // console.log("User Data:", user);
// //       setCookie("userData", JSON.stringify(user));
// //       return response;
// //     });
// //   }

// //   public async resetPassword(body: any): Promise<any> {
// //     return this.apiHandler(async () => {
// //       const response = await this.put(`${this.prefix}/reset-password`, body);
// //       return response;
// //     });
// //   }

// //   public async requestPasswordReset(body: any): Promise<any> {
// //     return this.apiHandler(async () => {
// //       const response = await this.put(
// //         `${this.prefix}/request-password-reset`,
// //         body
// //       );
// //       return response;
// //     });
// //   }
// //   public async verifyEmail(body: any): Promise<any> {
// //     // return this.apiHandler(async () => {
// //     const response = await this.put(`${this.prefix}/verify-otp`, body);

// //     // console.log("Verify Email Response:", response);

// //     if (!response?.data?.data) {
// //       throw new Error("Invalid response structure");
// //     }

// //     const user = response.data.data;
// //     const token = user.api_key;
// //     const email = user.email;

// //     if (!token) {
// //       throw new Error(
// //         response.data.message || "API key is missing from the response"
// //       );
// //     }

// //     const apiKeyString = `${token}:${email}`;
// //     const encryptedApiKey = encrypt(
// //       apiKeyString,
// //       process.env.NEXT_PUBLIC_ENCRYPTION_PASS_KEY as string
// //     );

// //     // Store in cookies
// //     setCookie("authToken", encryptedApiKey);
// //     setCookie("userData", JSON.stringify(user));

// //     // Set session
// //     await setSession(encryptedApiKey, user);

// //     // console.log("Session set successfully.");
// //     return response;
// //   }

// //   public async resendOtp(body: any): Promise<any> {
// //     return this.apiHandler(async () => {
// //       const response = await this.put(`${this.prefix}/resend-otp`, body);
// //       return response;
// //     });
// //   }

// //   public logout(): void {
// //     removeCookie("authToken");
// //     removeCookie("userData");
// //     clearSession(); 
// //     toast.success("Logged out successfully.");
// //   }

// //   public getUserData(): any {
// //     const userData = getCookie("userData");
// //     return userData ? JSON.parse(userData) : null;
// //   }
// // }

// // export const authService = new AuthService();


// // src/services/auth.service.ts

// import { HttpService } from "./base.service";
// import { encrypt } from "./encryption.service"; // Import the encrypt function
// import { setCookie, removeCookie, getCookie } from "../utils/cookieUtility";
// import { setSession, clearSession } from "../utils/sessionUtility";
// import { toast } from "react-toastify";

// interface GoogleLoginPayload {
//     idToken: string;
//     email: string;
//     full_name: string;
//     fcm_token?: string | null; // Optional
//     gender?: string | null;    // Optional
// }

// class AuthService extends HttpService {
//   private readonly prefix: string = "customer";

//   // Keep your existing apiHandler method
//   private async apiHandler(apiCall: () => Promise<any>) {
//     try {
//       const response = await apiCall();
//       // Check if the response indicates success (adjust based on your actual backend response structure)
//       // Assuming your backend wraps successful data in response.data.data
//       // And uses response.data.success (boolean) or just checks for data presence
//       if (response.data && (response.data.success === true || response.data.data)) {
//           // console.log("API Call Response:", response); // Uncomment for debugging
//           return response.data.data; // Return the actual data payload on success
//       } else {
//           // Try to get a meaningful error message
//           const errorMessage = response.data?.message || response.data?.error || "An unknown error occurred in the API response.";
//           console.error("API Handled Error (Non-Success):", errorMessage, response.data);
//           throw new Error(errorMessage);
//       }
//     } catch (error: any) {
//         // Handle errors from the HTTP request itself (network, 4xx, 5xx)
//         // Or errors thrown from the try block above
//         const errorMessage = error.response?.data?.message || // Axios error structure
//                            error.response?.data?.error ||
//                            error.message || // Error thrown manually or JS error
//                            "An unexpected error occurred during the API call.";
//         console.error("API Handling Exception:", errorMessage, error.response?.data || error);
//         throw new Error(errorMessage);
//     }
//   }


//   // Helper to handle successful login/verification (sets cookies/session)
//   private async handleSuccessfulAuth(user: any, email: string) {
//     const token = user.api_key;

//     if (!token) {
//       throw new Error("API key is missing from the successful auth response");
//     }

//     // Concatenate API key and email for encryption
//     const apiKeyString = `${token}:${email}`;
//     const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_PASS_KEY;

//     if (!encryptionKey) {
//         console.error("Encryption pass key is not defined in environment variables!");
//         throw new Error("Client-side configuration error."); // Avoid exposing details
//     }


//     const encryptedApiKey = encrypt(apiKeyString, encryptionKey);
//     // console.log("Encrypted API Key:", encryptedApiKey); // For debugging

//     // Store encrypted token and user data
//     setCookie("authToken", encryptedApiKey, { expires: 7 }); // Example: expires in 7 days
//     setCookie("userData", JSON.stringify(user), { expires: 7 });

//     // Set session (if your session utility does more than cookies)
//     await setSession(encryptedApiKey, user);
//     // console.log("Session updated successfully."); // For debugging
//   }


//   public async login(body: any): Promise<any> {
//     // Use apiHandler for consistency
//     const response = await this.post(`${this.prefix}/login`, {
//       email: body.email,
//       password: body.password,
//     });

//     // apiHandler throws on failure, so we assume success if we reach here
//     // The actual data is in response.data.data as per your backend structure
//     const user = response.data.data;
//     if (!user || !user.api_key) {
//          throw new Error(response.data.message || "Login failed: Invalid response data.");
//     }
//     await this.handleSuccessfulAuth(user, body.email);
//     return user; // Return user data
//   }

//   public async register(body: any): Promise<any> {
//       const response = await this.post(`${this.prefix}/register`, body);
//       // Assuming register endpoint returns user data directly in response.data.data upon success
//       const user = response.data.data;
//       if (!user || !user.id) { // Check for a field indicating success, like 'id'
//            throw new Error(response.data.message || "Registration failed: Invalid response data.");
//       }
//       // You might not set auth token cookies here, depends on flow (e.g., if email verification is next)
//       setCookie("userData", JSON.stringify(user)); // Store basic data if needed
//       return user; // Return user data (like the ID)
//   }

//   // public async googleLogin(payload: GoogleLoginPayload): Promise<any> {
//   //     // console.log("Sending to backend /google-login:", payload); // Debugging
//   //     const response = await this.post(`${this.prefix}/google-login`, payload);

//   //     // Assuming successful google login also returns user data and api_key in response.data.data
//   //     const user = response.data.data;
//   //     console.log("Google Login Response:", user); // Debugging
//   //     console.log("Google Login Response:", response.data); // Debugging

//   //      if (!user || !user.api_key) {
//   //           throw new Error(response.data.message || "Google login failed: Invalid response data.");
//   //      }
//   //     // Use the email from the payload (verified by Google) for consistency
//   //     await this.handleSuccessfulAuth(user, payload.email);
//   //     return user; // Return user data
//   // }


//   public async resetPassword(body: any): Promise<any> {
//       // Using apiHandler to simplify structure - it will return response.data.data or throw
//       return this.apiHandler(async () =>
//           this.put(`${this.prefix}/reset-password`, body)
//       );
//   }

//   public async requestPasswordReset(body: any): Promise<any> {
//       // Using apiHandler
//       return this.apiHandler(async () =>
//           this.put(`${this.prefix}/request-password-reset`, body)
//       );
//   }

//   public async verifyEmail(body: any): Promise<any> {
//     const response = await this.put(`${this.prefix}/verify-otp`, body);

//     // console.log("Verify Email Raw Response:", response); // Debug Raw Response

//     const user = response?.data?.data; // Navigate safely
//     const email = body.email; // Get email from the request body passed in

//     // Check for essential user data and api_key after verification
//     if (!user || !user.api_key || !email) {
//       console.error("Verification response missing user data, api_key, or email.", user);
//       throw new Error(response?.data?.message || "Email verification failed: Invalid response data.");
//     }

//     // console.log("User data from verifyEmail:", user); // Debug user data
//     await this.handleSuccessfulAuth(user, email);
//     return user; // Return user data
//   }

//   public async resendOtp(body: any): Promise<any> {
//       // Using apiHandler
//       return this.apiHandler(async () =>
//           this.put(`${this.prefix}/resend-otp`, body)
//       );
//   }

//   public logout(): void {
//     removeCookie("authToken");
//     removeCookie("userData");
//     clearSession();
//     // Optionally clear Google session info if needed, though typically not required
//     // google?.accounts?.id?.disableAutoSelect(); // Example if using GIS auto-select
//     toast.success("Logged out successfully.");
//     // Consider window.location.href = '/login'; // Or router push after slight delay
//   }

//   public getUserData(): any {
//     const userData = getCookie("userData");
//     if (!userData) return null;
//     try {
//         return JSON.parse(userData);
//     } catch (error) {
//         console.error("Failed to parse user data from cookie:", error);
//         removeCookie("userData"); // Clear corrupted cookie
//         return null;
//     }
//   }
// }

// export const authService = new AuthService();

// src/services/auth.service.ts
import { HttpService } from "./base.service";
import { encrypt } from "./encryption.service";
import { setCookie, removeCookie, getCookie } from "../utils/cookieUtility";
import { setSession, clearSession } from "../utils/sessionUtility";
import { toast } from "react-toastify";

interface GoogleLoginPayload {
    idToken: string;
    email: string;
    full_name: string;
    fcm_token?: string | null;
    gender?: string | null;
}

class AuthService extends HttpService {
  private readonly prefix: string = "customer";

  private async apiHandler(apiCall: () => Promise<any>) {
    try {
      const response = await apiCall();
      if (response.data && (response.data.success === true || response.data.data)) {
          return response.data.data;
      } else {
          const errorMessage = response.data?.message || response.data?.error || "An unknown error occurred in the API response.";
          console.error("API Handled Error (Non-Success):", errorMessage, response.data);
          throw new Error(errorMessage);
      }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message ||
                           error.response?.data?.error ||
                           error.message ||
                           "An unexpected error occurred during the API call.";
        console.error("API Handling Exception:", errorMessage, error.response?.data || error);
        throw new Error(errorMessage);
    }
  }

  private async handleSuccessfulAuth(user: any, email: string) {
    const token = user.api_key;

    if (!token) {
      throw new Error("API key is missing from the successful auth response");
    }

    const apiKeyString = `${token}:${email}`;
    const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_PASS_KEY;

    if (!encryptionKey) {
        console.error("Encryption pass key is not defined in environment variables!");
        throw new Error("Client-side configuration error.");
    }

    const encryptedApiKey = encrypt(apiKeyString, encryptionKey);

    setCookie("authToken", encryptedApiKey, { expires: 7 });
    setCookie("userData", JSON.stringify(user), { expires: 7 });

    await setSession(encryptedApiKey, user);
  }


  public async login(body: any): Promise<any> {
    const response = await this.post(`${this.prefix}/login`, {
      email: body.email,
      password: body.password,
    });

    const user = response.data.data;
    if (!user || !user.api_key) {
         throw new Error(response.data.message || "Login failed: Invalid response data.");
    }
    await this.handleSuccessfulAuth(user, body.email);
    return user;
  }

  public async register(body: any): Promise<any> {
      const response = await this.post(`${this.prefix}/register`, body);
      const user = response.data.data;
      if (!user || !user.id) {
           throw new Error(response.data.message || "Registration failed: Invalid response data.");
      }
      setCookie("userData", JSON.stringify(user));
      return user;
  }


  public async googleLogin(payload: GoogleLoginPayload): Promise<any> {
      const response = await this.post(`${this.prefix}/google-login`, payload);
      const user = response.data.data;
       if (!user || !user.api_key) {
            throw new Error(response.data.message || "Google login failed: Invalid response data.");
       }
      await this.handleSuccessfulAuth(user, payload.email);
      return user;
  }


  public async resetPassword(body: any): Promise<any> {
      return this.apiHandler(async () =>
          this.put(`${this.prefix}/reset-password`, body)
      );
  }

  public async requestPasswordReset(body: any): Promise<any> {
      return this.apiHandler(async () =>
          this.put(`${this.prefix}/request-password-reset`, body)
      );
  }

  public async verifyEmail(body: any): Promise<any> {
    const response = await this.put(`${this.prefix}/verify-otp`, body);
    const user = response?.data?.data;
    const email = body.email;

    if (!user || !user.api_key || !email) {
      console.error("Verification response missing user data, api_key, or email.", user);
      throw new Error(response?.data?.message || "Email verification failed: Invalid response data.");
    }
    await this.handleSuccessfulAuth(user, email);
    return user;
  }

  public async resendOtp(body: any): Promise<any> {
      return this.apiHandler(async () =>
          this.put(`${this.prefix}/resend-otp`, body)
      );
  }

  public logout(): void {
    removeCookie("authToken");
    removeCookie("userData");
    clearSession();
    toast.success("Logged out successfully.");
  }

  public getUserData(): any {
    const userData = getCookie("userData");
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("Failed to parse user data from cookie:", error);
        removeCookie("userData");
        return null;
    }
  }
}

export const authService = new AuthService();