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


  // public async login(body: any): Promise<any> {
  //   const response = await this.post(`${this.prefix}/login`, {
  //     email: body.email,
  //     password: body.password,
  //   });

  //   const user = response.data.data;
  //   if (!user || !user.api_key) {
  //        throw new Error(response.data.message || "Login failed: Invalid response data.");
  //   }
  //   await this.handleSuccessfulAuth(user, body.email);
  //   return user;
  // }

  public async login(body: any): Promise<any> {
    // Use apiHandler for consistent error handling and response parsing
    const user = await this.apiHandler(async () =>
        this.post(`${this.prefix}/login`, {
            email: body.email,
            password: body.password,
        })
    );

    // apiHandler ensures 'user' (which is response.data.data) exists if no error was thrown.
    // It would have used response.data.message if the backend indicated a failure (e.g. wrong password but 2xx status with success:false).
    // Now, specifically check for api_key within the user object.
    if (!user.api_key) {
        // This case handles if the backend login was "successful" in returning a user object via apiHandler,
        // but that object is missing the critical api_key.
        // It assumes that if apiHandler succeeded, 'user' itself is not null/undefined.
        throw new Error("Login failed: API key missing from user data.");
    }
    await this.handleSuccessfulAuth(user, body.email);
    return user; // Return user data
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