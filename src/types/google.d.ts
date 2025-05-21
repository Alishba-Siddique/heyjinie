// // src/global.d.ts (or src/types/google.d.ts, etc.)

// // Define the structure based on the methods you use from the GIS library
// interface GsiButtonConfiguration {
//     type?: 'standard' | 'icon';
//     theme?: 'outline' | 'filled_blue' | 'filled_black';
//     size?: 'large' | 'medium' | 'small';
//     text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
//     shape?: 'rectangular' | 'pill' | 'circle' | 'square';
//     logo_alignment?: 'left' | 'center';
//     width?: string; // e.g., '240' (pixels as string)
//     locale?: string;
//     click_listener?: () => void;
//     // Add other properties if you use them
//   }

//   interface IdConfiguration {
//     client_id: string;
//     login_uri?: string; // For redirect flow
//     callback?: (response: any) => void; // For callback flow (use a more specific type if needed)
//     ux_mode?: 'popup' | 'redirect';
//     nonce?: string;
//     state?: string;
//     // Add other properties if you use them
//   }

//   // Augment the existing Window interface
//   declare global {
//     interface Window {
//       // Use 'google?' with optional chaining in case the script hasn't loaded yet
//       google?: {
//         accounts?: {
//           id?: {
//             initialize: (config: IdConfiguration) => void;
//             renderButton: (
//               parent: HTMLElement,
//               options: GsiButtonConfiguration
//             ) => void;
//             prompt?: () => void; // Add if you use one-tap/automatic sign-in
//             cancel?: () => void; // Add if you use cancellation
//             // Add other methods if you use them (e.g., revoke)
//           };
//         };
//       };
//     }
//   }

//   // This export is necessary to make the file a module and apply the augmentation correctly.
//   export {};

// src/global.d.ts

interface GsiButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
  click_listener?: () => void;
}

interface IdConfiguration {
  client_id: string;
  login_uri?: string;
  callback?: (response: any) => void;
  ux_mode?: 'popup' | 'redirect';
  nonce?: string;
  state?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: IdConfiguration) => void;
          renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
          prompt?: () => void;
          cancel?: () => void;
        } | undefined;
      } | undefined;
    };
  }
}

export { };