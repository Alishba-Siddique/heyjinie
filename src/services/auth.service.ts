// src/services/auth.service.ts

import { HttpService } from "./base.service";
import { encrypt } from "./encryption.service"; // Import the encrypt and decrypt functions
import { setCookie, removeCookie, getCookie } from "../utils/cookieUtility";
import { setSession, clearSession } from "../utils/sessionUtility";
import { toast } from "react-toastify";

class AuthService extends HttpService {
  private readonly prefix: string = "customer";

  private async apiHandler(apiCall: () => Promise<any>) {
    try {
      const response = await apiCall();
      // console.log("API Call Response:", response);
      // Check if the response indicates success
      if (response.data?.success) {
        return response.data.data; // Return the data if successful
      } else {
        throw new Error(response.data?.message || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message || "An error occurred during the API call"
      );
    }
  }

  public async login(body: any): Promise<any> {
    return this.apiHandler(async () => {
      const { email, password } = body;

      if (typeof password !== "string") {
        throw new Error("Password must be a string");
      }

      const response = await this.post(`${this.prefix}/login`, {
        email,
        password,
      });

      if (!response.data || !response.data.data) {
        throw new Error("Invalid response structure");
      }

      const user = response.data.data;
      const token = user.api_key;

      if (!token) {
        throw new Error(
          response.data.message || "API key is missing from the response"
        );
      }

      // Concatenate API key and email
      const apiKeyString = `${token}:${email}`;

      // Encrypt the concatenated string
      const encryptedApiKey = encrypt(
        apiKeyString,
        process.env.NEXT_PUBLIC_ENCRYPTION_PASS_KEY as string
      );
      // console.log("Encrypted API Key:", encryptedApiKey);

      // Store the encrypted API key in cookies
      setCookie("authToken", encryptedApiKey);
      setCookie("userData", JSON.stringify(user));

      // Set the session
      await setSession(encryptedApiKey, user); // Ensure session is set

      // console.log("Session set with token and user data.");
      return response;
    });
  }

  public async register(body: any): Promise<any> {
    return this.apiHandler(async () => {
      const response = await this.post(`${this.prefix}/register`, body);
      const user = response.data.data;
      // console.log("User Data:", user);
      setCookie("userData", JSON.stringify(user));
      return response;
    });
  }

  public async resetPassword(body: any): Promise<any> {
    return this.apiHandler(async () => {
      const response = await this.put(`${this.prefix}/reset-password`, body);
      return response;
    });
  }

  public async sendOneTimePassword(body: any): Promise<any> {
    return this.apiHandler(async () => {
      const response = await this.put(
        `${this.prefix}/request-password-reset`,
        body
      );
      return response;
    });
  }
  public async verifyEmail(body: any): Promise<any> {
    // return this.apiHandler(async () => {
    const response = await this.put(`${this.prefix}/verify-otp`, body);

    // console.log("Verify Email Response:", response);

    if (!response?.data?.data) {
      throw new Error("Invalid response structure");
    }

    const user = response.data.data;
    const token = user.api_key;
    const email = user.email;

    if (!token) {
      throw new Error(
        response.data.message || "API key is missing from the response"
      );
    }

    const apiKeyString = `${token}:${email}`;
    const encryptedApiKey = encrypt(
      apiKeyString,
      process.env.NEXT_PUBLIC_ENCRYPTION_PASS_KEY as string
    );

    // Store in cookies
    setCookie("authToken", encryptedApiKey);
    setCookie("userData", JSON.stringify(user));

    // Set session
    await setSession(encryptedApiKey, user);

    // console.log("Session set successfully.");
    return response;
  }

  public async resendOtp(body: any): Promise<any> {
    return this.apiHandler(async () => {
      const response = await this.put(`${this.prefix}/resend-otp`, body);
      return response;
    });
  }

  public logout(): void {
    removeCookie("authToken");
    removeCookie("userData");
    clearSession(); 
    toast.success("Logged out successfully.");
  }

  public getUserData(): any {
    const userData = getCookie("userData");
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
