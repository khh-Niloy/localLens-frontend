'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/features/user/user.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Globe, Briefcase, DollarSign, Heart, Save, X, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfileFormData {
  name: string;
  phone: string;
  address: string;
  bio: string;
  language: string[];
  expertise: string[];
  dailyRate: string;
  travelPreferences: string[];
  image?: any;
}

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

  let isGuide = userData?.role === 'GUIDE';
  let isTourist = userData?.role === 'TOURIST';

  const { 
    register, 
    handleSubmit: handleFormSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { isDirty, dirtyFields } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      bio: '',
      language: [],
      expertise: [],
      dailyRate: '',
      travelPreferences: [],
      image: null,
    }
  });

  const formData = watch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Debug: Track when selectedImage changes
  useEffect(() => {
    if (selectedImage) {
      console.log('✅ Image state updated:', selectedImage.name, selectedImage.size);
    }
  }, [selectedImage]);

  const [tempLanguage, setTempLanguage] = useState('');
  const [tempExpertise, setTempExpertise] = useState('');
  const [tempTravelPreference, setTempTravelPreference] = useState('');

  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      reset({
        name: profile.name || '',
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
  }, [profileData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📁 File input changed:', file ? { name: file.name, type: file.type, size: file.size } : 'No fileSelected');
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        console.warn('❌ Invalid file type:', file.type);
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        console.warn('❌ File too large:', file.size);
        toast.error('Image size must be less than 5MB');
        return;
      }

      console.log('✅ Setting selectedImage state...');
      setSelectedImage(file);
      setValue('image', file, { shouldDirty: true });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log('✅ Image preview updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const addLanguage = () => {
    if (tempLanguage && !formData.language.includes(tempLanguage)) {
      setValue('language', [...formData.language, tempLanguage], { shouldDirty: true });
      setTempLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setValue('language', formData.language.filter(l => l !== lang), { shouldDirty: true });
  };

  const addExpertise = () => {
    if (tempExpertise && !formData.expertise.includes(tempExpertise)) {
      setValue('expertise', [...formData.expertise, tempExpertise], { shouldDirty: true });
      setTempExpertise('');
    }
  };

  const removeExpertise = (exp: string) => {
    setValue('expertise', formData.expertise.filter(e => e !== exp), { shouldDirty: true });
  };

  const addTravelPreference = () => {
    if (tempTravelPreference && !formData.travelPreferences.includes(tempTravelPreference)) {
      setValue('travelPreferences', [...formData.travelPreferences, tempTravelPreference], { shouldDirty: true });
      setTempTravelPreference('');
    }
  };

  const removeTravelPreference = (pref: string) => {
    setValue('travelPreferences', formData.travelPreferences.filter(p => p !== pref), { shouldDirty: true });
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    console.log('🚀 onProfileSubmit triggered with data:', data);

    try {
      const formDataToSend = new FormData();
      
      // 1. Always add the image if a new one was selected (either from state or data)
      const imageToUpload = selectedImage || data.image;
      if (imageToUpload instanceof File) {
        console.log('Appending image to FormData:', imageToUpload.name);
        formDataToSend.append('image', imageToUpload);
      }

      // 2. Add other fields that have changed
      if (dirtyFields.name) formDataToSend.append('name', data.name);
      if (dirtyFields.phone) formDataToSend.append('phone', data.phone);
      if (dirtyFields.address) formDataToSend.append('address', data.address);
      if (dirtyFields.bio) formDataToSend.append('bio', data.bio);
      
      if (dirtyFields.language) {
        formDataToSend.append('language', JSON.stringify(data.language));
      }

      const isGuide = userData?.role === 'GUIDE';
      const isTourist = userData?.role === 'TOURIST';

      if (isGuide) {
        if (dirtyFields.expertise) formDataToSend.append('expertise', JSON.stringify(data.expertise));
        if (dirtyFields.dailyRate) formDataToSend.append('dailyRate', data.dailyRate);
      } else if (isTourist) {
        if (dirtyFields.travelPreferences) formDataToSend.append('travelPreferences', JSON.stringify(data.travelPreferences));
      }

      // Debug: Check if we have anything to send
      let entryCount = 0;
      formDataToSend.forEach(() => entryCount++);

      if (entryCount > 0) {
        console.log(`Sending request with ${entryCount} items...`);
        const result = await updateProfile(formDataToSend).unwrap();
        
        if (result?.data?.image) setImagePreview(result.data.image);
        
        setSelectedImage(null);
        setValue('image', null, { shouldDirty: false });
        await refetchProfile();
        await refetchUserData();
        
        toast.success('Profile updated successfully!');
      } else {
        toast.error('No changes detected');
      }
    } catch (error: any) {
      console.error('Submit Error:', error);
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4088FD]"></div>
        </div>
      </div>
    );
  }

  const profile = profileData?.data;

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Profile <span className="text-[#4088FD]">Settings</span></h1>
            <p className="text-gray-500 mt-1 font-medium text-sm sm:text-base">Manage your personal information and preferences</p>
          </div>
          <div className="flex gap-3">
             <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white hover:border-gray-300 transition-all text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                console.log('🖱️ CLICKED: Save Changes Button');
                console.log('Current state:', { isDirty, hasImage: !!selectedImage });
                handleFormSubmit(onProfileSubmit, (errors) => {
                  console.error('❌ Validation Errors:', errors);
                  toast.error('Please fill in required fields');
                })(e);
              }}
              disabled={isUpdating}
              className={`px-5 sm:px-8 py-2 sm:py-2.5 rounded-xl font-bold flex items-center shadow-lg transition-all text-xs sm:text-sm ${
                (isDirty || selectedImage) 
                  ? 'bg-[#4088FD] text-white hover:bg-blue-600 shadow-blue-100' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isUpdating ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Saving...
                 </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit(onProfileSubmit)} className="space-y-8">
          {/* Profile Picture & Basic Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50/50 rounded-xl sm:rounded-2xl border border-dashed border-gray-200">
              <div className="relative group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-blue-100 flex items-center justify-center text-4xl font-black text-[#4088FD]">
                    {formData.name.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest text-center px-4">Change Photo</p>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Your Profile Photo</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-sm">
                  Recommended: Square image, max 5MB. This photo will be visible to other users.
                </p>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label 
                  htmlFor="profile-upload"
                  className="inline-flex cursor-pointer px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Upload New Photo
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#4088FD] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4088FD] transition-colors" />
                   <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full pl-12 pr-5 py-3.5 bg-gray-100 rounded-xl border border-transparent text-gray-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4088FD] transition-colors" />
                   <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+880 1234 567890"
                    className="w-full pl-12 pr-5 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#4088FD] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900 font-medium font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Your Location
                </label>
                <div className="relative group">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4088FD] transition-colors" />
                   <input
                    type="text"
                    {...register('address')}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full pl-12 pr-5 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#4088FD] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Short Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                placeholder="Share your passion for travel and local experiences..."
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-[#4088FD] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900 font-medium resize-none leading-relaxed"
              />
            </div>
          </motion.div>

          {/* Languages Spoken */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Communication</h2>
            </div>

            <div className="space-y-6">
              <div className="max-w-md">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Add Languages</label>
                <div className="flex gap-2">
                  <Select value={tempLanguage} onValueChange={setTempLanguage}>
                    <SelectTrigger className="rounded-xl border border-gray-100 bg-gray-50 h-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#4088FD] transition-all">
                      <SelectValue placeholder="Select language..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                      {LANGUAGE_OPTIONS.map(lang => (
                        <SelectItem key={lang} value={lang} className="rounded-lg">
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-6 h-12 bg-white border border-[#4088FD] text-[#4088FD] font-bold rounded-xl hover:bg-[#4088FD] hover:text-white transition-all shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.language.length > 0 ? (
                  formData.language.map(lang => (
                    <motion.span
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={lang}
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-[#4088FD] rounded-xl text-sm font-bold border border-blue-100 shadow-sm"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="ml-2.5 p-0.5 hover:bg-white rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 font-medium italic">No languages added yet...</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Guide-Specific Fields */}
          {isGuide && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4088FD]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Your Expertise</h2>
                </div>

                <div className="space-y-6">
                  <div className="max-w-md">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Add Specialties</label>
                    <div className="flex gap-2">
                      <Select value={tempExpertise} onValueChange={setTempExpertise}>
                        <SelectTrigger className="rounded-xl border border-gray-100 bg-gray-50 h-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#4088FD] transition-all">
                          <SelectValue placeholder="Select expertise area..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          {EXPERTISE_OPTIONS.map(exp => (
                            <SelectItem key={exp} value={exp} className="rounded-lg">
                              {exp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <button
                        type="button"
                        onClick={addExpertise}
                        className="px-6 h-12 bg-white border border-[#4088FD] text-[#4088FD] font-bold rounded-xl hover:bg-[#4088FD] hover:text-white transition-all shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.expertise.length > 0 ? (
                      formData.expertise.map(exp => (
                        <motion.span
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={exp}
                          className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-800 rounded-xl text-sm font-bold border border-gray-200 shadow-sm"
                        >
                          {exp}
                          <button
                            type="button"
                            onClick={() => removeExpertise(exp)}
                            className="ml-2.5 p-0.5 hover:bg-white rounded-md transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 font-medium italic">Share your expertise to attract more tourists!</p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Service Rate</h2>
                </div>

                <div className="max-w-md">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block">
                    Daily Service Rate (TK)
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-900 font-black">TK</span>
                    <input
                      type="number"
                      {...register('dailyRate')}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-[#4088FD] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900 font-black text-xl"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-medium leading-relaxed">
                    Set a competitive daily rate to attract more bookings. You can update this anytime based on demand.
                  </p>
                </div>
              </motion.div>
            </>
          )}

          {/* Tourist-Specific Fields */}
          {isTourist && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <Heart className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Travel Style</h2>
              </div>

              <div className="space-y-6">
                <div className="max-w-md">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Your Preferences</label>
                  <div className="flex gap-2">
                    <Select value={tempTravelPreference} onValueChange={setTempTravelPreference}>
                      <SelectTrigger className="rounded-xl border border-gray-100 bg-gray-50 h-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#4088FD] transition-all">
                        <SelectValue placeholder="Select lifestyle preference..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        {TRAVEL_PREFERENCES_OPTIONS.map(pref => (
                          <SelectItem key={pref} value={pref} className="rounded-lg">
                            {pref}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      onClick={addTravelPreference}
                      className="px-6 h-12 bg-white border border-[#4088FD] text-[#4088FD] font-bold rounded-xl hover:bg-[#4088FD] hover:text-white transition-all shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.travelPreferences.length > 0 ? (
                    formData.travelPreferences.map(pref => (
                      <motion.span
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={pref}
                        className="inline-flex items-center px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-sm font-bold border border-pink-100 shadow-sm"
                      >
                        {pref}
                        <button
                          type="button"
                          onClick={() => removeTravelPreference(pref)}
                          className="ml-2.5 p-0.5 hover:bg-white rounded-md transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 font-medium italic">Tell guides what you love to get better recommendations!</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
