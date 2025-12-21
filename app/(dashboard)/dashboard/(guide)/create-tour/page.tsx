"use client";

import React, { useRef, useState } from 'react';
import { Upload, X, Plus, Minus } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateTourMutation, useGetTourEnumsQuery } from '@/redux/features/tour/tour.api';
import { useGetMeQuery } from '@/redux/features/auth/auth.api';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Simplified schema matching backend exactly
const tourFormSchema = z.object({
  title: z.string().min(1, "Tour title is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional(),
  tourFee: z.number().min(0.01, "Price must be greater than 0"),
  maxDuration: z.number().min(0.1, "Duration must be greater than 0"),
  meetingPoint: z.string().min(1, "Meeting point is required"),
  maxGroupSize: z.number().min(1, "Group size must be at least 1"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  cancellationPolicy: z.string().optional(),
  status: z.string().optional(),
  itinerary: z.array(z.object({
    time: z.string().min(1, "Time is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().optional(),
  })).min(1, "At least one itinerary item is required"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

export default function CreateTourPage() {
  const router = useRouter();
  const { data: me } = useGetMeQuery(undefined) as { data: any };
  const { data: enumsResponse, isLoading: enumsLoading } = useGetTourEnumsQuery(undefined);
  const [createTour, { isLoading }] = useCreateTourMutation();
  
  const tourEnums = enumsResponse?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'ACTIVE',
      itinerary: [{ time: '', title: '', description: '', location: '' }],
    },
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control,
    name: "itinerary",
  });

  // Simple array state management
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [included, setIncluded] = useState<string[]>(['']);
  const [notIncluded, setNotIncluded] = useState<string[]>(['']);
  const [importantInfo, setImportantInfo] = useState<string[]>(['']);

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

  const onSubmit = async (data: TourFormData) => {
    try {
      if (!me) {
        toast.error("You must be logged in to create a tour");
        return;
      }

      // Create FormData matching backend expectations
      const formData = new FormData();
      
      // Required fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('tourFee', data.tourFee.toString());
      formData.append('maxDuration', data.maxDuration.toString());
      formData.append('meetingPoint', data.meetingPoint);
      formData.append('maxGroupSize', data.maxGroupSize.toString());
      formData.append('category', data.category);
      formData.append('location', data.location);
      
      // Optional fields
      if (data.longDescription) formData.append('longDescription', data.longDescription);
      if (data.cancellationPolicy) formData.append('cancellationPolicy', data.cancellationPolicy);
      if (data.status) formData.append('status', data.status);
      
      // Arrays - filter out empty values and stringify
      const cleanHighlights = highlights.filter(h => h && h.trim() !== '');
      const cleanIncluded = included.filter(i => i && i.trim() !== '');
      const cleanNotIncluded = notIncluded.filter(n => n && n.trim() !== '');
      const cleanImportantInfo = importantInfo.filter(info => info && info.trim() !== '');
      
      if (cleanHighlights.length > 0) formData.append('highlights', JSON.stringify(cleanHighlights));
      if (cleanIncluded.length > 0) formData.append('included', JSON.stringify(cleanIncluded));
      if (cleanNotIncluded.length > 0) formData.append('notIncluded', JSON.stringify(cleanNotIncluded));
      if (cleanImportantInfo.length > 0) formData.append('importantInfo', JSON.stringify(cleanImportantInfo));
      
      // Itinerary
      if (data.itinerary && data.itinerary.length > 0) {
        formData.append('itinerary', JSON.stringify(data.itinerary));
      }
      
      // Images
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await createTour(formData).unwrap();
      toast.success("Tour created successfully!");
      
      // Reset form
      reset();
      setSelectedFiles([]);
      setHighlights(['']);
      setIncluded(['']);
      setNotIncluded(['']);
      setImportantInfo(['']);
      
      router.push('/dashboard/my-tours');
      
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create tour. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Tour</h1>
        <p className="text-gray-600">Create an amazing tour experience for travelers</p>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
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
            
            {/* Tour Details */}
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
            
            {/* Location Details */}
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

            {/* Category and Status */}
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
                        {enumsLoading ? (
                          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                        ) : (
                          tourEnums?.categories?.map((cat: string) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0) + cat.slice(1).toLowerCase().replace(/_/g, ' ')}
                            </SelectItem>
                          ))
                        )}
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
                        {enumsLoading ? (
                          <SelectItem value="loading" disabled>Loading statuses...</SelectItem>
                        ) : (
                          tourEnums?.statuses?.map((stat: string) => (
                            <SelectItem key={stat} value={stat}>
                              {stat.charAt(0) + stat.slice(1).toLowerCase().replace(/_/g, ' ')}
                            </SelectItem>
                          ))
                        )}
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

            {/* Tour Highlights */}
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

            {/* What's Included */}
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

            {/* What's NOT Included */}
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

            {/* Important Information */}
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
            
            {/* Images Upload */}
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
                disabled={isLoading || !isValid}
                className="bg-[#1FB67A] hover:bg-[#1dd489]"
              >
                {isLoading ? 'Creating...' : 'Create Tour'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => reset()}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}