"use client";

import React, { useRef, useState } from 'react';
import { Upload, X, Plus, Minus } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTourMutation } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Simplified Zod schema matching backend validation
const tourFormSchema = z.object({
  title: z.string().min(1, "Tour title is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional().or(z.literal("")),
  tourFee: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().min(0).optional(),
  maxDuration: z.number().min(0.1, "Duration must be greater than 0"),
  meetingPoint: z.string().min(1, "Meeting point is required"),
  maxGroupSize: z.number().min(1, "Group size must be at least 1"),
  category: z.enum(["FOOD", "HISTORICAL", "ART", "NATURE", "ADVENTURE", "CULTURAL"]),
  location: z.string().min(1, "Location is required"),
  cancellationPolicy: z.string().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "DRAFT", "PAUSED", "SUSPENDED"]).optional(),
  // Arrays - simplified (backend handles parsing)
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  importantInfo: z.array(z.string()).optional(),
  itinerary: z.array(z.object({
    time: z.string().min(1, "Time is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().optional().or(z.literal("")),
  })).min(1, "At least one itinerary item is required"),
  availableDates: z.array(z.object({
    date: z.string(),
    times: z.array(z.string()),
  })).optional(),
});

type TourFormData = z.infer<typeof tourFormSchema>;

export default function CreateTourPage() {
  const { data: me } = useGetMeQuery(undefined) as { data: any };
  const [createTour, { isLoading }] = useCreateTourMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
  } = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      tourFee: undefined as any,
      originalPrice: 0,
      maxDuration: undefined as any,
      meetingPoint: '',
      maxGroupSize: undefined as any,
      category: undefined as any,
      location: '',
      cancellationPolicy: '',
      status: 'ACTIVE',
      highlights: [],
      included: [],
      notIncluded: [],
      importantInfo: [],
      itinerary: [{ time: '', title: '', description: '', location: '' }],
      availableDates: [],
    },
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

  const onSubmit = async (data: TourFormData) => {
    console.log('🚀 onSubmit function called!');
    console.log('📝 Form data received:', data);
    
    try {
      if (!me) {
        console.log('❌ User not authenticated:', me);
        toast.error("You must be logged in to create a tour");
        return;
      }

      console.log('Form submission started');
      console.log('User data:', me);
      console.log('Form data:', data);
      
      // Validate required fields
      if (!data.title || !data.description || !data.tourFee || !data.maxDuration || 
          !data.meetingPoint || !data.maxGroupSize || !data.category || !data.location ||
          !data.itinerary || data.itinerary.length === 0) {
        console.log('Validation failed:', {
          title: !!data.title,
          description: !!data.description,
          tourFee: !!data.tourFee,
          maxDuration: !!data.maxDuration,
          meetingPoint: !!data.meetingPoint,
          maxGroupSize: !!data.maxGroupSize,
          category: !!data.category,
          location: !!data.location,
          itinerary: data.itinerary?.length || 0
        });
        toast.error("Please fill in all required fields");
        return;
      }

      // Filter out empty strings from arrays and handle empty arrays
      const cleanData = {
        ...data,
        guideId: me._id,
        status: "ACTIVE",
        active: true,
        // Ensure string fields are never undefined
        title: data.title || '',
        description: data.description || '',
        longDescription: data.longDescription || '',
        meetingPoint: data.meetingPoint || '',
        location: data.location || '',
        cancellationPolicy: data.cancellationPolicy || '',
        // Ensure number fields are valid
        tourFee: data.tourFee || 0,
        originalPrice: data.originalPrice || 0,
        maxDuration: data.maxDuration || 0,
        maxGroupSize: data.maxGroupSize || 0,
        // Ensure category is set
        category: data.category || 'CULTURAL',
        // Handle arrays
        highlights: highlights.filter(h => h && h.trim() !== ''),
        included: included.filter(i => i && i.trim() !== ''),
        notIncluded: notIncluded.filter(n => n && n.trim() !== ''),
        importantInfo: importantInfo.filter(info => info && info.trim() !== ''),
        // Ensure itinerary items have no undefined values
        itinerary: (data.itinerary || []).map(item => ({
          time: item.time || '',
          title: item.title || '',
          description: item.description || '',
          location: item.location || '',
        })),
        // Handle availableDates - ensure no undefined values in nested objects
        ...(data.availableDates && data.availableDates.length > 0 ? { 
          availableDates: data.availableDates.map(dateItem => ({
            date: dateItem.date || '',
            times: (dateItem.times || []).filter(time => time && time.trim() !== ''),
          }))
        } : {}),
      };

      // Debug: Log the clean data structure
      console.log('Clean data structure:', cleanData);
      
      // Debug: Check for undefined values
      console.log('Checking for undefined values:');
      Object.entries(cleanData).forEach(([key, value]) => {
        if (value === undefined) {
          console.error(`❌ UNDEFINED FIELD: ${key} = ${value}`);
        } else {
          console.log(`✅ ${key}: ${typeof value} = ${Array.isArray(value) ? `[${value.length} items]` : value}`);
        }
      });

      // Create FormData for file upload - backend expects individual fields
      const formData = new FormData();
      
      // Append each field individually as the backend validation expects them in req.body
      // String fields
      formData.append('title', cleanData.title);
      formData.append('description', cleanData.description);
      formData.append('longDescription', cleanData.longDescription || '');
      formData.append('meetingPoint', cleanData.meetingPoint);
      formData.append('location', cleanData.location);
      formData.append('cancellationPolicy', cleanData.cancellationPolicy || '');
      formData.append('category', cleanData.category);
      formData.append('guideId', cleanData.guideId);
      formData.append('status', cleanData.status);
      
      // Number fields - convert to string for FormData but backend should parse them
      formData.append('tourFee', cleanData.tourFee.toString());
      formData.append('originalPrice', cleanData.originalPrice.toString());
      formData.append('maxDuration', cleanData.maxDuration.toString());
      formData.append('maxGroupSize', cleanData.maxGroupSize.toString());
      
      // Boolean fields
      formData.append('active', cleanData.active.toString());
      
      // Array fields - send as JSON strings
      formData.append('highlights', JSON.stringify(cleanData.highlights));
      formData.append('included', JSON.stringify(cleanData.included));
      formData.append('notIncluded', JSON.stringify(cleanData.notIncluded));
      formData.append('importantInfo', JSON.stringify(cleanData.importantInfo));
      formData.append('itinerary', JSON.stringify(cleanData.itinerary));
      
      // Optional availableDates
      if (cleanData.availableDates && cleanData.availableDates.length > 0) {
        formData.append('availableDates', JSON.stringify(cleanData.availableDates));
      }
      
      // Append images
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      console.log('Sending FormData to backend...');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const result = await createTour(formData).unwrap();
      console.log("result",result);
      toast.success("Tour created and published successfully!");
      
      // Reset form or redirect
      window.location.href = '/dashboard/my-tours';
      
    } catch (error: any) {
      console.error('Tour creation error:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.data?.message,
        fullError: error
      });
      toast.error(error?.data?.message || "Failed to create tour. Please try again.");
    }
  };
  // Debug form state
  console.log('Form state:', { 
    isValid, 
    isSubmitting, 
    errorsCount: Object.keys(errors).length,
    errors: errors 
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Tour</h1>
        <p className="text-gray-600">Create an amazing tour experience for travelers</p>
        {/* Debug info */}
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          <p>Form Valid: {isValid ? '✅' : '❌'}</p>
          <p>Submitting: {isSubmitting ? '⏳' : '⭕'}</p>
          <p>Errors: {Object.keys(errors).length}</p>
          {Object.keys(errors).length > 0 && (
            <div className="mt-1 text-red-600 text-xs">
              {Object.entries(errors).map(([field, error]) => (
                <div key={field}>
                  <strong>{field}:</strong> {error?.message || 'Invalid'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Enter tour location (e.g., Barcelona, Spain)"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Tour Category *
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CULTURAL">Cultural</SelectItem>
                        <SelectItem value="FOOD">Food & Drink</SelectItem>
                        <SelectItem value="HISTORICAL">Historical</SelectItem>
                        <SelectItem value="ADVENTURE">Adventure</SelectItem>
                        <SelectItem value="NATURE">Nature</SelectItem>
                        <SelectItem value="ART">Art & Museums</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PAUSED">Paused</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
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
                          placeholder="10:00"
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
                      placeholder="What's included (e.g., snacks, drinks, entrance fees)"
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
                      placeholder="What's not included (e.g., personal expenses, tips)"
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
                      placeholder="Important info (e.g., dress code, fitness level required)"
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
                placeholder="Describe your cancellation policy (e.g., Free cancellation up to 24 hours before the tour)"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Tour Images
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
                <p className="text-gray-500 mb-2">Drag and drop images here, or click to select files</p>
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
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Files ({selectedFiles.length})</p>
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
                disabled={isLoading}
                className="bg-[#1FB67A] hover:bg-[#1dd489]"
                onClick={() => console.log('🔥 Submit button clicked!')}
              >
                {isLoading ? 'Creating...' : 'Create Tour'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => window.history.back()}
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

