// // src/components/page-ui/profile_form.tsx
// "use client";
// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Camera, Loader2 } from 'lucide-react';
// import { getCookie } from '@/utils/cookieUtility';
// import { setLocalStorageItem, getLocalStorageItem } from '@/utils/localStorage';
// import { updateProfile } from '@/services/api.service';

// interface UserData {
//   full_name: string;
//   address: string;
//   dob: string;
//   email: string;
//   user_image?: string;
// }

// export default function ProfileForm() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [formData, setFormData] = useState<UserData>({
//     full_name: '',
//     address: '',
//     dob: '',
//     email: '',
//     user_image: ''
//   });

//   useEffect(() => {
//     const initializeUserData = () => {
//       const emailFromCookie = getCookie('userEmail');
//       let localData = getLocalStorageItem('userData');
      
//       if (!localData) {
//         const userDataString = getCookie('userData');
//         if (userDataString) {
//           try {
//             localData = JSON.parse(userDataString);
//             setLocalStorageItem('userData', localData);
//           } catch (error) {
//             console.error('Error parsing user data:', error);
//             return;
//           }
//         }
//       }

//       const combinedData = {
//         ...localData,
//         email: emailFromCookie || localData?.email || ''
//       };

//       setUserData(combinedData);
//       setFormData(combinedData);
//       setSelectedImage(combinedData.user_image || null);
//     };

//     initializeUserData();
//   }, []);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64Image = reader.result as string;
//         setSelectedImage(base64Image);
//         setFormData(prev => ({
//           ...prev,
//           user_image: base64Image
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);
//     try {
//       const response = await updateProfile(formData);
      
//       if (response.data) {
//         const finalData = {
//           ...formData,
//           ...response.data,
//           email: formData.email
//         };
//         setLocalStorageItem('userData', finalData);
//         setUserData(finalData);
//       }
      
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (userData) {
//       setFormData(userData);
//       setSelectedImage(userData.user_image || null);
//     }
//     setIsEditing(false);
//   };

//   return (
//     <div className="w-full mx-auto">
//       <CardHeader className="pb-4">
//         <div className="flex flex-col md:flex-row items-center gap-6">
//           <div className="relative group">
//             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
//               <img
//                 src={selectedImage || formData.user_image || '/images/placeholder.png'}
//                 alt={formData.full_name || 'User'}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             {isEditing && (
//               <div className="absolute inset-0 flex items-center justify-center bg-[#42a674] bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
//                 <label className="cursor-pointer">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                   <Camera className="w-8 h-8 text-white" />
//                 </label>
//               </div>
//             )}
//           </div>
//           <div className="text-center md:text-left">
//             <h2 className="text-2xl font-bold">{formData.full_name || 'Loading...'}</h2>
//             <p className="text-gray-500">{formData.email || 'Loading...'}</p>
//           </div>
//           <div className="ml-auto">
//             <Button
//               variant={isEditing ? "outline" : "default"}
//               onClick={() => setIsEditing(!isEditing)}
//               className="w-full md:w-auto bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
//               disabled={isSaving}
//             >
//               {isEditing ? 'Cancel Edit' : 'Edit Profile'}
//             </Button>
//           </div>
//         </div>
//       </CardHeader>
//       <div>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="full_name">Full Name</Label>
//               <Input
//                 id="full_name"
//                 name="full_name"
//                 value={formData.full_name}
//                 onChange={handleInputChange}
//                 disabled={!isEditing || isSaving}
//                 className="w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 disabled={!isEditing || isSaving}
//                 className="w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="dob">Date of Birth</Label>
//               <Input
//                 id="dob"
//                 name="dob"
//                 type="date"
//                 value={formData.dob}
//                 onChange={handleInputChange}
//                 disabled={!isEditing || isSaving}
//                 className="w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 disabled={true}
//                 className="w-full bg-gray-50"
//               />
//             </div>
//           </div>
          
//           {isEditing && (
//             <div className="flex justify-end gap-4 mt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={isSaving}
//                 className="bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit"
//                 disabled={isSaving}
//                 className="min-w-[120px] bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   'Save Changes'
//                 )}
//               </Button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2 } from 'lucide-react';
import { getCookie } from '@/utils/cookieUtility';
import { setLocalStorageItem, getLocalStorageItem } from '@/utils/localStorage';
import { updateProfile } from '@/services/api.service';

interface UserData {
  full_name: string;
  address: string;
  dob: string;
  email: string;
  user_image?: string;
}

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    full_name: '',
    address: '',
    dob: '',
    email: '',
    user_image: ''
  });

  useEffect(() => {
    const initializeUserData = () => {
      const emailFromCookie = getCookie('userEmail');
      let localData = getLocalStorageItem('userData');

      if (!localData) {
        const userDataString = getCookie('userData');
        if (userDataString) {
          try {
            localData = JSON.parse(userDataString);
            setLocalStorageItem('userData', localData);
          } catch (error) {
            console.error('Error parsing user data:', error);
            return;
          }
        }
      }

      const combinedData = {
        ...localData,
        email: emailFromCookie || localData?.email || ''
      };

      setUserData(combinedData);
      setFormData(combinedData);
      setSelectedImage(combinedData.user_image || null);
    };

    initializeUserData();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setSelectedImage(base64Image);
        setFormData(prev => ({
          ...prev,
          user_image: base64Image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await updateProfile(formData);

      if (response.data) {
        const finalData = {
          ...formData,
          ...response.data,
          email: formData.email
        };
        setLocalStorageItem('userData', finalData);
        setUserData(finalData);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData(userData);
      setSelectedImage(userData.user_image || null);
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full mx-auto">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
              <img
                src={selectedImage || formData.user_image || '/images/placeholder.png'}
                alt={formData.full_name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#42a674] bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 text-white" />
                </label>
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{formData.full_name || 'Loading...'}</h2>
            <p className="text-gray-500">{formData.email || 'Loading...'}</p>
          </div>
          <div className="ml-auto">
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className="w-full md:w-auto bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
              disabled={isSaving}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!isEditing || isSaving}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing || isSaving}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                disabled={!isEditing || isSaving}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled={true}
                className="w-full bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSaving}
                className="min-w-[120px] bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}