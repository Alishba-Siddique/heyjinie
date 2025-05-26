//src/components/page-ui/profile_form.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Loader2, AlertCircle } from 'lucide-react';
import { getCookie, setCookie } from '@/utils/cookieUtility';
import { setLocalStorageItem } from '@/utils/localStorage';
import { updateProfile } from '@/services/api.service';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PasswordChangeForm from './password_change_form';
import { Country, City, ICountry } from 'country-state-city';

// Enhanced schema validation
const profileFormSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  street_address: z
    .string()
    .min(5, { message: 'Street address must be at least 5 characters.' }),
  address_line2: z.string().optional(),
  postal_code: z.string().min(3, { message: 'Postal code is required.' }),
  state_province: z.string().min(2, { message: 'State/Province is required.' }),
  dob: z.string().refine(
    (date) => {
      try {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      } catch (error) {
        return false;
      }
    },
    {
      message: 'Must be a valid date',
    }
  ),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  image: z.string().optional(),
  city: z.string().min(2, { message: 'City is required.' }),
  country: z.string().min(2, { message: 'Country is required.' }),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});

interface UserData extends z.infer<typeof profileFormSchema> {
  id?: string;
  [key: string]: any;
}

const defaultMaleImage = '/images/default-male.png';
const defaultFemaleImage = '/images/default-female.png';
const placeholderImage = '/images/placeholder.png';

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uiLoading, setUiLoading] = useState(true); // Unified loading state for UI
  const [imageChanged, setImageChanged] = useState(false);
  const [storedImage, setStoredImage] = useState<string | null>(null);
  const [originalUserData, setOriginalUserData] = useState<UserData | null>(
    null
  );

  const [allCountriesList, setAllCountriesList] = useState<ICountry[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  const [countriesLoaded, setCountriesLoaded] = useState(false);
  const [userDataInitialized, setUserDataInitialized] = useState(false);

  const isSubmitting = useRef(false);

  function isGenderValue(value: string): value is 'Male' | 'Female' | 'Other' {
    return value === 'Male' || value === 'Female' || value === 'Other';
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      street_address: '',
      address_line2: '',
      postal_code: '',
      state_province: '',
      dob: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      gender: undefined,
      image: '',
    },
    mode: 'onBlur',
  });

  const gender = watch('gender');
  const selectedCountryName = watch('country');
  const selectedCity = watch('city');

  // 1. Fetch all countries on mount
  useEffect(() => {
    const countries = Country.getAllCountries();
    setAllCountriesList(countries);
    setCountriesLoaded(true);
  }, []);

  const filteredCountriesList = useMemo(() => {
    if (!countrySearchTerm) return allCountriesList;
    return allCountriesList.filter((country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
    );
  }, [allCountriesList, countrySearchTerm]);

  // 2. Load user data from cookie ONCE countries are loaded and it hasn't been initialized
  useEffect(() => {
    let isMounted = true;
    if (countriesLoaded && !userDataInitialized) {
      const initializeUserData = () => {
        try {
          const userDataFromCookie = getCookie('userData');
          const parsedUserData = parseUserDataCookie(userDataFromCookie);

          if (isMounted && parsedUserData) {
            let imageToSet =
              parsedUserData.image ||
              parsedUserData.user_image ||
              getDefaultImage(parsedUserData.gender);

            setOriginalUserData(parsedUserData);
            setStoredImage(imageToSet);

            const mappedData: UserData = {
              ...parsedUserData,
              street_address:
                parsedUserData.street_address || parsedUserData.address || '',
              image: imageToSet,
              country: parsedUserData.country || '', // Ensure these are passed to reset
              city: parsedUserData.city || '', // Ensure these are passed to reset
            };
            reset(mappedData); // THIS SETS THE RHF STATE including country and city
            setUserDataInitialized(true);
          } else if (isMounted) {
            // No user data / first time user
            setUserDataInitialized(true); // Mark as initialized (with no specific data)
          }
        } catch (error) {
          console.error('Error initializing user data:', error);
          if (isMounted) toast.error('Error loading user data.');
          setUserDataInitialized(true); // Proceed even on error
        }
      };
      initializeUserData();
    }
    return () => {
      isMounted = false;
    };
  }, [countriesLoaded, userDataInitialized, reset]); // Removed `getDefaultImage` as it's stable

  // 3. Update available cities when selectedCountryName (from RHF) changes
  //    This effect also validates/clears the RHF city if it's inconsistent.
  useEffect(() => {
    if (selectedCountryName && countriesLoaded) {
      const countryObj = allCountriesList.find(
        (c) => c.name === selectedCountryName
      );
      if (countryObj?.isoCode) {
        const citiesData = City.getCitiesOfCountry(countryObj.isoCode);
        let cityNamesForState: string[] = [];
        if (citiesData && citiesData.length > 0) {
          const uniqueCityNames = new Set(citiesData.map((c) => c.name));
          cityNamesForState = Array.from(uniqueCityNames).sort();
        }
        setAvailableCities(cityNamesForState);

        // Now, validate the current RHF city (selectedCity) against these available cities
        const cityInRHF = watch('city'); // Get the most current RHF city value
        if (cityInRHF) {
          // Only proceed if RHF thinks a city is selected
          const isCityValidForCountry = cityNamesForState.includes(cityInRHF);
          const countryHasNoCitiesListed = cityNamesForState.length === 0;

          if (countryHasNoCitiesListed) {
            setValue('city', '');
          } else if (!isCityValidForCountry) {
            setValue('city', '');
          }
          // If city is valid, do nothing, RHF already has the correct value.
        }
      } else {
        // Country name from RHF not found in our allCountriesList, or no isoCode
        setAvailableCities([]);
        if (watch('city') !== '') setValue('city', '');
      }
    } else {
      setAvailableCities([]);
      if (!selectedCountryName && watch('city') !== '') {
        setValue('city', '');
      }
    }
  }, [selectedCountryName, countriesLoaded, allCountriesList, setValue, watch]); // `watch` is a stable function from RHF

  // 4. Update overall UI loading state
  useEffect(() => {
    if (countriesLoaded && userDataInitialized) {
      setUiLoading(false);
    } else {
      setUiLoading(true);
    }
  }, [countriesLoaded, userDataInitialized]);

  const getDefaultImage = (genderValue: string | undefined): string => {
    switch (genderValue) {
      case 'Male':
        return defaultMaleImage;
      case 'Female':
        return defaultFemaleImage;
      default:
        return placeholderImage;
    }
  };

  const parseUserDataCookie = (cookieValue: string | null): UserData | null => {
    if (!cookieValue) return null;
    try {
      let processedValue = cookieValue;
      try {
        const testParse = JSON.parse(cookieValue);
        if (typeof testParse === 'object') return testParse as UserData;
      } catch {}
      if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
        processedValue = cookieValue.slice(1, -1);
      }
      processedValue = processedValue
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
      const parsedData = JSON.parse(processedValue);
      return parsedData as UserData;
    } catch (error) {
      console.error('Error parsing user data cookie:', error);
      return null;
    }
  };

  const updateUserDataStorage = (newUserData: UserData) => {
    try {
      setLocalStorageItem('userData', newUserData);
      setCookie('userData', JSON.stringify(newUserData), { expires: 30 });
    } catch (error) {
      console.error('Error updating user data storage:', error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setValue('image', base64Image);
      setStoredImage(base64Image);
      setImageChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: UserData) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsSaving(true);
    try {
      const fullAddress = `${data.street_address}${
        data.address_line2 ? ', ' + data.address_line2 : ''
      }, ${data.city}, ${data.state_province}, ${data.postal_code}, ${
        data.country
      }`;
      const dataToUpdate: any = {
        image: storedImage || getDefaultImage(data.gender),
        full_name: data.full_name,
        address: fullAddress,
        street_address: data.street_address,
        address_line2: data.address_line2 || '',
        postal_code: data.postal_code,
        state_province: data.state_province,
        dob: data.dob,
        email: data.email,
        phone: data.phone || '',
        gender: data.gender,
        city: data.city,
        country: data.country,
      };
      const response = await updateProfile(dataToUpdate);
      if (response) {
        const updatedData: UserData = {
          ...response,
          image: storedImage || getDefaultImage(response.gender || data.gender),
          gender: response.gender || data.gender,
        };
        updateUserDataStorage(updatedData);
        setOriginalUserData(updatedData);
        reset(updatedData);
        setImageChanged(false);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. See console for details.');
    } finally {
      setIsSaving(false);
      isSubmitting.current = false;
    }
  };

  const handleCancel = () => {
    if (originalUserData) {
      reset({
        ...originalUserData,
        image:
          originalUserData.image || getDefaultImage(originalUserData.gender),
      }); // This will trigger the city population effect if country changes.
      setStoredImage(
        originalUserData.image || getDefaultImage(originalUserData.gender)
      );
      setImageChanged(false);
    } else {
      reset(
        profileFormSchema.parse({
          full_name: '',
          street_address: '',
          postal_code: '',
          state_province: '',
          dob: new Date().toISOString().split('T')[0],
          email: '',
          city: '',
          country: '',
        })
      );
      toast.info('Form reset to defaults.');
    }
    setIsEditing(false);
  };

  const handleGenderChange = (value: string) => {
    if (isGenderValue(value)) {
      setValue('gender', value);
      const hasCustomImage =
        originalUserData?.image &&
        !originalUserData.image.includes(defaultMaleImage) &&
        !originalUserData.image.includes(defaultFemaleImage) &&
        !originalUserData.image.includes(placeholderImage);
      if (!imageChanged && !hasCustomImage) {
        const defaultImg = getDefaultImage(value);
        setValue('image', defaultImg);
        setStoredImage(defaultImg);
      }
    }
  };

  const handleCountryChange = (countryName: string) => {
    setValue('country', countryName);
    // City will be cleared by the useEffect if it's not valid for new country
    setCountrySearchTerm('');
  };

  const handleCityChange = (cityName: string) => {
    setValue('city', cityName);
  };

  if (uiLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#42a674]" />
        <span className="ml-2">Loading profile data...</span>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
              <img
                src={storedImage || getDefaultImage(gender)}
                alt={watch('full_name') || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getDefaultImage(gender);
                }}
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
            <h2 className="text-2xl font-bold">
              {watch('full_name') || 'User'}
            </h2>
            <p className="text-gray-500">{watch('email') || 'No email'}</p>
            <p className="text-gray-500">
              {watch('phone') || 'No phone number'}
            </p>
            {selectedCity &&
              selectedCountryName && ( // Use watched values for display consistency
                <p className="text-gray-500 text-sm mt-1">
                  {selectedCity}, {selectedCountryName}
                </p>
              )}
          </div>
          <div className="ml-auto">
            <Button
              variant={isEditing ? 'outline' : 'default'}
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              className="w-full md:w-auto bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
              disabled={isSaving}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center">
                Full Name
                {isEditing && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id="full_name"
                {...register('full_name')}
                disabled={!isEditing || isSaving}
                className={`w-full ${errors.full_name ? 'border-red-500' : ''}`}
              />
              {errors.full_name && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.full_name.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center">
                Date of Birth
                {isEditing && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id="dob"
                type="date"
                {...register('dob')}
                disabled={!isEditing || isSaving}
                className={`w-full ${errors.dob ? 'border-red-500' : ''}`}
              />
              {errors.dob && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dob.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={true}
                className="w-full bg-gray-50"
              />
              {errors.email && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                disabled={!isEditing || isSaving}
                className="w-full"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={handleGenderChange}
                disabled={!isEditing || isSaving}
                value={gender || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Address Section */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-2">Address Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street_address" className="flex items-center">
                Street Address
                {isEditing && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id="street_address"
                {...register('street_address')}
                disabled={!isEditing || isSaving}
                className={`w-full ${
                  errors.street_address ? 'border-red-500' : ''
                }`}
                placeholder="123 Main St"
              />
              {errors.street_address && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.street_address.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line2">Address Line 2</Label>
              <Input
                id="address_line2"
                {...register('address_line2')}
                disabled={!isEditing || isSaving}
                className="w-full"
                placeholder="Apartment, suite, unit, etc."
              />
            </div>

            {/* COUNTRY SELECTOR */}
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center">
                Country
                {isEditing && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Select
                onValueChange={handleCountryChange}
                disabled={!isEditing || isSaving}
                value={selectedCountryName || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="p-0">
                  <div className="p-2 sticky top-0 bg-background z-10">
                    <Input
                      placeholder="Search Country..."
                      value={countrySearchTerm}
                      onChange={(e) => setCountrySearchTerm(e.target.value)}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  <ScrollArea className="h-[250px]">
                    {filteredCountriesList.length > 0 ? (
                      filteredCountriesList.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.name}
                          className="py-2 px-3"
                        >
                          <div className="flex items-center w-full">
                            <img
                              src="/images/logoicon.png"
                              alt="Logo"
                              className="w-5 h-5 mr-2.5"
                            />
                            <div className="flex-grow">
                              <div className="font-medium text-sm">
                                {country.name}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                <img
                                  src={`https://flagcdn.com/w20/${country.isoCode.toLowerCase()}.png`}
                                  alt={`${country.name} flag`}
                                  className="w-4 h-auto mr-1.5"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = 'none';
                                  }}
                                />
                                <span>+{country.phonecode}</span>
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-center text-gray-500">
                        No countries found.
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {errors.country && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.country.message}
                </div>
              )}
            </div>

            {/* CITY SELECTOR */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center">
                City{isEditing && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Select
                onValueChange={handleCityChange}
                disabled={
                  !isEditing ||
                  isSaving ||
                  !selectedCountryName ||
                  availableCities.length === 0
                }
                value={selectedCity || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !selectedCountryName
                        ? 'Select a country first'
                        : availableCities.length === 0 && selectedCountryName
                        ? 'No cities available'
                        : 'Select a city'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.city.message}
                </div>
              )}
            </div>

            {/* State/Province & Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="state_province" className="flex items-center">
                State/Province
                {isEditing && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id="state_province"
                {...register('state_province')}
                disabled={!isEditing || isSaving}
                className={`w-full ${
                  errors.state_province ? 'border-red-500' : ''
                }`}
              />
              {errors.state_province && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.state_province.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code" className="flex items-center">
                Postal/ZIP Code
                {isEditing && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id="postal_code"
                {...register('postal_code')}
                disabled={!isEditing || isSaving}
                className={`w-full ${
                  errors.postal_code ? 'border-red-500' : ''
                }`}
              />
              {errors.postal_code && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.postal_code.message}
                </div>
              )}
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
                disabled={isSaving || isSubmitting.current}
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
        <br />
        <PasswordChangeForm />
      </div>
    </div>
  );
}
