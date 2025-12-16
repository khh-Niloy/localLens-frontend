'use client';

import React, { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/features/user/user.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Globe, Briefcase, DollarSign, Heart, Save, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EXPERTISE_OPTIONS = [
  'History',
  'Nightlife',
  'Shopping',
  'Food & Dining',
  'Art & Culture',
  'Nature & Wildlife',
  'Adventure',
  'Photography',
  'Architecture',
  'Music',
  'Sports',
  'Family Friendly',
];

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Russian',
];

const TRAVEL_PREFERENCES_OPTIONS = [
  'Budget Travel',
  'Luxury Travel',
  'Adventure',
  'Cultural',
  'Food & Dining',
  'Nature',
  'History',
  'Art & Museums',
  'Nightlife',
  'Shopping',
  'Family Friendly',
  'Solo Travel',
];

export default function ProfilePage() {
  const { data: userData, refetch: refetchUserData } = useGetMeQuery({});
  const { data: profileData, isLoading: isLoadingProfile, refetch: refetchProfile } = useGetProfileQuery({}, { skip: !userData });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    phone: '',
    address: '',
    bio: '',
    language: [] as string[],
    expertise: [] as string[],
    dailyRate: '',
    travelPreferences: [] as string[],
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [tempLanguage, setTempLanguage] = useState('');
  const [tempExpertise, setTempExpertise] = useState('');
  const [tempTravelPreference, setTempTravelPreference] = useState('');

  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setFormData({
        name: profile.name || '',
        image: profile.image || '',
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || '',
        language: profile.language || [],
        expertise: profile.expertise || [],
        dailyRate: profile.dailyRate?.toString() || '',
        travelPreferences: profile.travelPreferences || [],
      });
      setImagePreview(profile.image || '');
    }
  }, [profileData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLanguage = () => {
    if (tempLanguage && !formData.language.includes(tempLanguage)) {
      setFormData(prev => ({
        ...prev,
        language: [...prev.language, tempLanguage],
      }));
      setTempLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      language: prev.language.filter(l => l !== lang),
    }));
  };

  const addExpertise = () => {
    if (tempExpertise && !formData.expertise.includes(tempExpertise)) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, tempExpertise],
      }));
      setTempExpertise('');
    }
  };

  const removeExpertise = (exp: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== exp),
    }));
  };

  const addTravelPreference = () => {
    if (tempTravelPreference && !formData.travelPreferences.includes(tempTravelPreference)) {
      setFormData(prev => ({
        ...prev,
        travelPreferences: [...prev.travelPreferences, tempTravelPreference],
      }));
      setTempTravelPreference('');
    }
  };

  const removeTravelPreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      travelPreferences: prev.travelPreferences.filter(p => p !== pref),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name);
      if (formData.phone) formDataToSend.append('phone', formData.phone);
      if (formData.address) formDataToSend.append('address', formData.address);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      
      // Add arrays as JSON strings
      if (formData.language.length > 0) {
        formDataToSend.append('language', JSON.stringify(formData.language));
      }

      // Add role-specific fields
      if (userData?.role === 'GUIDE') {
        if (formData.expertise.length > 0) {
          formDataToSend.append('expertise', JSON.stringify(formData.expertise));
        }
        if (formData.dailyRate) {
          formDataToSend.append('dailyRate', formData.dailyRate);
        }
      } else if (userData?.role === 'TOURIST') {
        if (formData.travelPreferences.length > 0) {
          formDataToSend.append('travelPreferences', JSON.stringify(formData.travelPreferences));
        }
      }

      // Add image file if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
        console.log('Sending image file:', selectedImage.name, selectedImage.size);
      }

      const result = await updateProfile(formDataToSend).unwrap();
      
      // Update image preview with the new image URL from response
      if (result?.data?.image) {
        setImagePreview(result.data.image);
        setFormData(prev => ({ ...prev, image: result.data.image }));
      }
      
      setSelectedImage(null); // Clear selected image after successful upload
      
      // Refresh profile data to show updated image
      await refetchProfile();
      
      // Refetch user data to update address/phone in booking validation
      await refetchUserData();
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1FB67A]"></div>
        </div>
      </div>
    );
  }

  const profile = profileData?.data;
  const isGuide = userData?.role === 'GUIDE';
  const isTourist = userData?.role === 'TOURIST';

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h2>

            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-30 h-30 rounded-full object-cover border-4 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                    {formData.name.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1FB67A] file:text-white hover:file:bg-[#1dd489]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 5MB. Accepted formats: JPG, PNG, GIF, WebP
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Your address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
              />
            </div>
          </div>

          {/* Languages Spoken */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Languages Spoken
            </h2>

            <div className="mb-4">
              <div className="flex gap-2">
                <Select value={tempLanguage} onValueChange={setTempLanguage}>
                  <SelectTrigger className="flex-1 w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489]"
                >
                  Add
                </button>
              </div>
            </div>

            {formData.language.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.language.map(lang => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-3 py-1 bg-[#1FB67A]/10 text-[#1FB67A] rounded-full text-sm"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="ml-2 text-[#1FB67A] hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Guide-Specific Fields */}
          {isGuide && (
            <>
              <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Guide Expertise
                </h2>

                <div className="mb-4">
                  <div className="flex gap-2">
                    <Select value={tempExpertise} onValueChange={setTempExpertise}>
                      <SelectTrigger className="flex-1 w-full">
                        <SelectValue placeholder="Select expertise area" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERTISE_OPTIONS.map(exp => (
                          <SelectItem key={exp} value={exp}>
                            {exp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise.map(exp => (
                      <span
                        key={exp}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {exp}
                        <button
                          type="button"
                          onClick={() => removeExpertise(exp)}
                          className="ml-2 text-blue-800 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Daily Rate
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How much do you charge per day? (USD)
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FB67A]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Tourist-Specific Fields */}
          {isTourist && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Travel Preferences
              </h2>

              <div className="mb-4">
                <div className="flex gap-2">
                  <Select value={tempTravelPreference} onValueChange={setTempTravelPreference}>
                    <SelectTrigger className="flex-1 w-full">
                      <SelectValue placeholder="Select travel preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAVEL_PREFERENCES_OPTIONS.map(pref => (
                        <SelectItem key={pref} value={pref}>
                          {pref}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={addTravelPreference}
                    className="px-4 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {formData.travelPreferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.travelPreferences.map(pref => (
                    <span
                      key={pref}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {pref}
                      <button
                        type="button"
                        onClick={() => removeTravelPreference(pref)}
                        className="ml-2 text-purple-800 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-[#1FB67A] text-white rounded-md hover:bg-[#1dd489] disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
