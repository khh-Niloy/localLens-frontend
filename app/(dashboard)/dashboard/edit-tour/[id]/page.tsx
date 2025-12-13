"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Upload, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetMyToursQuery, useUpdateTourMutation, useGetTourEnumsQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Zod schema for form validation
const tourFormSchema = z.object({
  title: z.string().min(1, "Tour title is required").max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().optional().or(z.literal("")),
  tourFee: z.number().min(0.01, "Price must be greater than 0"),
  maxDuration: z.number().min(0.1, "Duration must be greater than 0"),
  meetingPoint: z.string().min(1, "Meeting point is required"),
  maxGroupSize: z.number().min(1, "Group size must be at least 1").max(50, "Group size too large"),
  category: z.string().min(1, "Please select a category"),
  location: z.string().min(1, "Location is required"),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  importantInfo: z.array(z.string()).optional(),
  cancellationPolicy: z.string().optional().or(z.literal("")),
  status: z.string().optional(),
  itinerary: z.array(z.object({
    time: z.string().min(1, "Time is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().optional().or(z.literal("")),
  })).min(1, "At least one itinerary item is required"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

interface Tour {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  tourFee: number;
  maxDuration: number;
  meetingPoint: string;
  maxGroupSize: number;
  category: string;
  location: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  importantInfo: string[];
  cancellationPolicy?: string;
  status: string;
  images: string[];
  itinerary: Array<{
    time: string;
    title: string;
    description: string;
    location?: string;
  }>;
}

export default function EditTourPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.id as string;
  
  const { data: me } = useGetMeQuery(undefined) as { data: any };
  const { data: myToursData, isLoading: toursLoading } = useGetMyToursQuery({});
  const { data: enumsData } = useGetTourEnumsQuery({});
  const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const tours: Tour[] = myToursData?.data || [];
  const tour = tours.find(t => t._id === tourId);
  const categories = enumsData?.data?.categories || ["FOOD", "HISTORICAL", "ART", "NATURE", "ADVENTURE", "CULTURAL"];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    watch,
    setValue,
    reset,
    clearErrors,
    trigger,
  } = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      tourFee: 0,
      maxDuration: 0,
      meetingPoint: '',
      maxGroupSize: 0,
      category: '',
      location: '',
      cancellationPolicy: '',
      status: 'ACTIVE',
      highlights: [],
      included: [],
      notIncluded: [],
      importantInfo: [],
      itinerary: [{ time: '', title: '', description: '', location: '' }],
    }
  });


  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control,
    name: "itinerary",
  });

  // Simple state management for string arrays
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [included, setIncluded] = useState<string[]>(['']);
  const [notIncluded, setNotIncluded] = useState<string[]>(['']);
  const [importantInfo, setImportantInfo] = useState<string[]>(['']);

  // Set default values when tour data is loaded
  useEffect(() => {
    if (tour && categories.length > 0 && !isFormInitialized) {
      // Ensure the category from DB exists in available categories (case-insensitive check)
      const normalizedCategory = tour.category?.toUpperCase();
      const validCategory = categories.find((cat: string) => cat.toUpperCase() === normalizedCategory) || 'CULTURAL';
      
      const formValues = {
        title: tour.title || '',
        description: tour.description || '',
        longDescription: tour.longDescription || '',
        tourFee: tour.tourFee || 0,
        maxDuration: tour.maxDuration || 0,
        meetingPoint: tour.meetingPoint || '',
        maxGroupSize: tour.maxGroupSize || 0,
        category: validCategory,
        location: tour.location || '',
        cancellationPolicy: tour.cancellationPolicy || '',
        status: tour.status || 'ACTIVE',
        itinerary: tour.itinerary || [{ time: '', title: '', description: '', location: '' }],
      };
      
      // Reset form with clean state
      reset(formValues, { 
        keepDirtyValues: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false
      });

      // Set array states
      setHighlights(tour.highlights?.length > 0 ? tour.highlights : ['']);
      setIncluded(tour.included?.length > 0 ? tour.included : ['']);
      setNotIncluded(tour.notIncluded?.length > 0 ? tour.notIncluded : ['']);
      setImportantInfo(tour.importantInfo?.length > 0 ? tour.importantInfo : ['']);
      setExistingImages(tour.images || []);
      
      // Force set the category and status values after a short delay
      setTimeout(() => {
        setValue("category", validCategory, { shouldValidate: true, shouldDirty: false });
        setValue("status", tour.status || 'ACTIVE', { shouldValidate: true, shouldDirty: false });
        
        // Clear validation errors and trigger validation
        setTimeout(() => {
          if (validCategory) {
            clearErrors("category");
            trigger("category");
          }
          if (tour.status) {
            clearErrors("status");
            trigger("status");
          }
        }, 100);
      }, 500);
      
      // Mark form as initialized
      setIsFormInitialized(true);
    }
  }, [tour, reset, categories, isFormInitialized, setValue, clearErrors, trigger]);

  // Array management functions
  const addHighlight = () => setHighlights([...highlights, '']);
  const removeHighlight = (index: number) => setHighlights(highlights.filter((_, i) => i !== index));
  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const addIncluded = () => setIncluded([...included, '']);
  const removeIncluded = (index: number) => setIncluded(included.filter((_, i) => i !== index));
  const updateIncluded = (index: number, value: string) => {
    const newIncluded = [...included];
    newIncluded[index] = value;
    setIncluded(newIncluded);
  };

  const addNotIncluded = () => setNotIncluded([...notIncluded, '']);
  const removeNotIncluded = (index: number) => setNotIncluded(notIncluded.filter((_, i) => i !== index));
  const updateNotIncluded = (index: number, value: string) => {
    const newNotIncluded = [...notIncluded];
    newNotIncluded[index] = value;
    setNotIncluded(newNotIncluded);
  };

  const addImportantInfo = () => setImportantInfo([...importantInfo, '']);
  const removeImportantInfo = (index: number) => setImportantInfo(importantInfo.filter((_, i) => i !== index));
  const updateImportantInfo = (index: number, value: string) => {
    const newImportantInfo = [...importantInfo];
    newImportantInfo[index] = value;
    setImportantInfo(newImportantInfo);
  };

  // File handling
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TourFormData) => {
    try {
      if (!me || !tour) {
        toast.error("Authentication error");
        return;
      }


      // Create FormData for file upload
      const formData = new FormData();
      
      // Only include dirty fields in the update
      Object.keys(dirtyFields).forEach(key => {
        const fieldKey = key as keyof TourFormData;
        const value = data[fieldKey];
        
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Handle array fields that might have changed
      const cleanHighlights = highlights.filter(h => h && h.trim() !== '');
      const cleanIncluded = included.filter(i => i && i.trim() !== '');
      const cleanNotIncluded = notIncluded.filter(n => n && n.trim() !== '');
      const cleanImportantInfo = importantInfo.filter(info => info && info.trim() !== '');

      // Check if arrays have changed from original
      const originalHighlights = tour.highlights || [];
      const originalIncluded = tour.included || [];
      const originalNotIncluded = tour.notIncluded || [];
      const originalImportantInfo = tour.importantInfo || [];

      if (JSON.stringify(cleanHighlights) !== JSON.stringify(originalHighlights)) {
        formData.append('highlights', JSON.stringify(cleanHighlights));
      }
      if (JSON.stringify(cleanIncluded) !== JSON.stringify(originalIncluded)) {
        formData.append('included', JSON.stringify(cleanIncluded));
      }
      if (JSON.stringify(cleanNotIncluded) !== JSON.stringify(originalNotIncluded)) {
        formData.append('notIncluded', JSON.stringify(cleanNotIncluded));
      }
      if (JSON.stringify(cleanImportantInfo) !== JSON.stringify(originalImportantInfo)) {
        formData.append('importantInfo', JSON.stringify(cleanImportantInfo));
      }

      // Handle images
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      // If existing images were removed, we need to handle this
      if (existingImages.length !== (tour.images?.length || 0)) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

        const result = await updateTour({ id: tourId, ...Object.fromEntries(formData) }).unwrap();
      toast.success("Tour updated successfully!");
      
      // Redirect to my tours
      router.push('/dashboard/my-tours');
      
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update tour. Please try again.");
      }
  };

  if (toursLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Tour not found</h3>
          <p className="text-red-600 text-sm mt-1">
            The tour you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <button 
            onClick={() => router.back()}
            className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Tours
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Tour</h1>
        <p className="text-gray-600">Update your tour information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Tour Title *
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  type="text"
                  className={errors.title ? 'border-red-500' : ''}
                  placeholder="Enter tour title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="tourFee" className="text-sm font-medium text-gray-700">
                  Price (USD) *
                </Label>
                <Input
                  id="tourFee"
                  {...register("tourFee", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className={errors.tourFee ? 'border-red-500' : ''}
                  placeholder="99"
                />
                {errors.tourFee && (
                  <p className="text-red-500 text-sm mt-1">{errors.tourFee.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Tour Description *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
                placeholder="Describe your tour experience..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="longDescription" className="text-sm font-medium text-gray-700">
                Detailed Description
              </Label>
              <Textarea
                id="longDescription"
                {...register("longDescription")}
                rows={3}
                placeholder="Provide more detailed information about your tour..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="maxDuration" className="text-sm font-medium text-gray-700">
                  Duration (hours) *
                </Label>
                <Input
                  id="maxDuration"
                  {...register("maxDuration", { valueAsNumber: true })}
                  type="number"
                  step="0.5"
                  className={errors.maxDuration ? 'border-red-500' : ''}
                  placeholder="3"
                />
                {errors.maxDuration && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxDuration.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="maxGroupSize" className="text-sm font-medium text-gray-700">
                  Max Group Size *
                </Label>
                <Input
                  id="maxGroupSize"
                  {...register("maxGroupSize", { valueAsNumber: true })}
                  type="number"
                  className={errors.maxGroupSize ? 'border-red-500' : ''}
                  placeholder="8"
                />
                {errors.maxGroupSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxGroupSize.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="meetingPoint" className="text-sm font-medium text-gray-700">
                  Meeting Point *
                </Label>
                <Input
                  id="meetingPoint"
                  {...register("meetingPoint")}
                  type="text"
                  className={errors.meetingPoint ? 'border-red-500' : ''}
                  placeholder="Enter meeting location"
                />
                {errors.meetingPoint && (
                  <p className="text-red-500 text-sm mt-1">{errors.meetingPoint.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location *
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  type="text"
                  className={errors.location ? 'border-red-500' : ''}
                  placeholder="Enter tour location"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Tour Category *
                </Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Please select a category" }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ''}
                      key={`category-${field.value}`}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: string) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0) + category.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Tour Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DEACTIVATE">Deactivate</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            
            {/* Itinerary Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium text-gray-700">
                  Itinerary *
                </Label>
                <Button
                  type="button"
                  onClick={() => appendItinerary({ time: '', title: '', description: '', location: '' })}
                  size="sm"
                  className="bg-[#1FB67A] hover:bg-[#1dd489]"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-4">
                {itineraryFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                      {itineraryFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItinerary(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`itinerary-time-${index}`} className="text-sm font-medium text-gray-700">
                          Time *
                        </Label>
                        <Input
                          id={`itinerary-time-${index}`}
                          {...register(`itinerary.${index}.time`)}
                          type="time"
                          className={errors.itinerary?.[index]?.time ? 'border-red-500' : ''}
                        />
                        {errors.itinerary?.[index]?.time && (
                          <p className="text-red-500 text-xs mt-1">{errors.itinerary[index]?.time?.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`itinerary-title-${index}`} className="text-sm font-medium text-gray-700">
                          Title *
                        </Label>
                        <Input
                          id={`itinerary-title-${index}`}
                          {...register(`itinerary.${index}.title`)}
                          type="text"
                          className={errors.itinerary?.[index]?.title ? 'border-red-500' : ''}
                          placeholder="Activity title"
                        />
                        {errors.itinerary?.[index]?.title && (
                          <p className="text-red-500 text-xs mt-1">{errors.itinerary[index]?.title?.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor={`itinerary-description-${index}`} className="text-sm font-medium text-gray-700">
                        Description *
                      </Label>
                      <Textarea
                        id={`itinerary-description-${index}`}
                        {...register(`itinerary.${index}.description`)}
                        rows={2}
                        className={errors.itinerary?.[index]?.description ? 'border-red-500' : ''}
                        placeholder="Describe this activity"
                      />
                      {errors.itinerary?.[index]?.description && (
                        <p className="text-red-500 text-xs mt-1">{errors.itinerary[index]?.description?.message}</p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor={`itinerary-location-${index}`} className="text-sm font-medium text-gray-700">
                        Location (optional)
                      </Label>
                      <Input
                        id={`itinerary-location-${index}`}
                        {...register(`itinerary.${index}.location`)}
                        type="text"
                        placeholder="Specific location for this activity"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {errors.itinerary && (
                <p className="text-red-500 text-sm mt-1">{errors.itinerary.message}</p>
              )}
            </div>

            {/* Highlights Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium text-gray-700">
                  Tour Highlights
                </Label>
                <Button
                  type="button"
                  onClick={addHighlight}
                  size="sm"
                  className="bg-[#1FB67A] hover:bg-[#1dd489]"
                >
                  <Plus className="w-4 h-4" />
                  Add Highlight
                </Button>
              </div>
              
              <div className="space-y-2">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="flex-1"
                      placeholder="Enter a highlight"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium text-gray-700">
                  What's Included
                </Label>
                <Button
                  type="button"
                  onClick={addIncluded}
                  size="sm"
                  className="bg-[#1FB67A] hover:bg-[#1dd489]"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-2">
                {included.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={item}
                      onChange={(e) => updateIncluded(index, e.target.value)}
                      className="flex-1"
                      placeholder="What's included"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIncluded(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* What's NOT Included Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium text-gray-700">
                  What's NOT Included
                </Label>
                <Button
                  type="button"
                  onClick={addNotIncluded}
                  size="sm"
                  className="bg-[#1FB67A] hover:bg-[#1dd489]"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-2">
                {notIncluded.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={item}
                      onChange={(e) => updateNotIncluded(index, e.target.value)}
                      className="flex-1"
                      placeholder="What's not included"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotIncluded(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Information Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium text-gray-700">
                  Important Information
                </Label>
                <Button
                  type="button"
                  onClick={addImportantInfo}
                  size="sm"
                  className="bg-[#1FB67A] hover:bg-[#1dd489]"
                >
                  <Plus className="w-4 h-4" />
                  Add Info
                </Button>
              </div>
              
              <div className="space-y-2">
                {importantInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={info}
                      onChange={(e) => updateImportantInfo(index, e.target.value)}
                      className="flex-1"
                      placeholder="Important information"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImportantInfo(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <Label htmlFor="cancellationPolicy" className="text-sm font-medium text-gray-700">
                Cancellation Policy
              </Label>
              <Textarea
                id="cancellationPolicy"
                {...register("cancellationPolicy")}
                rows={3}
                placeholder="Describe your cancellation policy"
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Tour image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Add New Images
              </Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-[#1FB67A] bg-green-50' 
                    : 'border-gray-300 hover:border-[#1FB67A]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">Drag and drop new images here, or click to select files</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  onClick={handleFileSelect}
                  className="bg-[#1FB67A] hover:bg-[#1dd489]"
                >
                  Choose Files
                </Button>
              </div>
              
              {/* Display selected files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Files ({selectedFiles.length})</p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          <Upload className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                disabled={isUpdating}
                className="bg-[#1FB67A] hover:bg-[#1dd489]"
              >
                {isUpdating ? 'Updating...' : 'Update Tour'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}