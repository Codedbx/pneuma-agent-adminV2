import React, { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ChevronUp, ChevronDown, Clock, Plus, X, HelpCircle, Upload, Shield, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Head, useForm, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';



// type TimeSlot = {
//   id?: number;
//   starts_at: string;
//   ends_at: string;
//   capacity: string | number;
// };

// type ActivityFormProps = {
//   activity?: {
//     id: number;
//     title: string;
//     description: string;
//     price: number;
//     location: string;
//     time_slots: TimeSlot[];
//     media: { id: string; original_url: string }[];
//   };
// };

// const ActivityForm = ({ activity }: ActivityFormProps) => {
//   const isEditing = !!activity;
  
//   const breadcrumbs: BreadcrumbItem[] = [
//     {
//       title: isEditing ? 'Edit Activity' : 'Create Activity',
//       href: isEditing ? `/activities/${activity.id}/edit` : '/activities/create',
//     },
//   ];

//   const { data, setData, errors, post, put, processing, recentlySuccessful } = useForm({
//     title: activity?.title || '',
//     description: activity?.description || '',
//     price: activity?.price ? String(activity.price) : '',
//     location: activity?.location || '',
//     time_slots: activity?.time_slots || [{ starts_at: '', ends_at: '', capacity: '' }],
//     image: null as File | null,
//     delete_media: [] as string[],
//     delete_time_slots: [] as number[],
//   });

//   const [previewImage, setPreviewImage] = useState<string | null>(
//     activity?.media[0]?.original_url || null
//   );
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const addTimeSlot = (): void => {
//     setData('time_slots', [...data.time_slots, { starts_at: '', ends_at: '', capacity: '' }]);
//   };

//   const removeTimeSlot = (index: number, id?: number): void => {
//     if (id) {
//       setData('delete_time_slots', [...data.delete_time_slots, id]);
//     }
    
//     const newSlots = [...data.time_slots];
//     newSlots.splice(index, 1);
//     setData('time_slots', newSlots);
//   };

//   const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string): void => {
//     const newSlots = [...data.time_slots];
//     newSlots[index] = { ...newSlots[index], [field]: value };
//     setData('time_slots', newSlots);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setData('image', file);
      
//       // Create preview URL
//       setPreviewImage(URL.createObjectURL(file));
      
//       // Clear delete_media if replacing existing image
//       if (isEditing && activity?.media[0]?.id) {
//         setData('delete_media', [activity.media[0].id]);
//       }
//     }
//   };

//   const removeImage = () => {
//     if (activity?.media[0]?.id) {
//       setData('delete_media', [activity.media[0].id]);
//     }
    
//     setPreviewImage(null);
//     setData('image', null);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleSubmit = (e: React.FormEvent): void => {
//     e.preventDefault();
    
//     const formattedData = {
//       ...data,
//       time_slots: data.time_slots.map(slot => ({
//         ...slot,
//         capacity: Number(slot.capacity)
//       })),
//       price: Number(data.price)
//     };
    
//     if (isEditing) {
//   put(route('activities.update', activity.id), {
//         preserveScroll: true,
//       });
//     } else {
//       post(route('activities.store'));
//     }
//   };

//    // Helper to get time slot errors
//   const getTimeSlotError = (index: number, field: string): string | undefined => {
//     const errorKey = `time_slots.${index}.${field}`;
//     return (errors as Record<string, string>)?.[errorKey];
//   };
    
//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title={isEditing ? "Edit Activity" : "Create Activity"} />
//       <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//         <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 bg-gray-50 border-b rounded-t-lg">
//             <h2 className="text-lg font-medium text-gray-900">
//               {isEditing ? 'Edit Activity' : 'Create Activity'}
//             </h2>
//           </div>

//           {/* Form Content */}
//           <form onSubmit={handleSubmit}>
//             <div className="p-4 sm:p-6 space-y-6">
//               {/* Activity Basic Info */}
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="title" className="text-sm font-medium text-gray-700">
//                       Title *
//                     </Label>
//                     <Input
//                       id="title"
//                       placeholder="e.g., Swimming, Hiking, City Tour"
//                       value={data.title}
//                       onChange={(e) => setData('title', e.target.value)}
//                       required
//                     />
//                     {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="price" className="text-sm font-medium text-gray-700">
//                       Price *
//                     </Label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//                       <Input
//                         id="price"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         placeholder="0.00"
//                         value={data.price}
//                         onChange={(e) => setData('price', e.target.value)}
//                         className="w-full pl-8"
//                         required
//                       />
//                     </div>
//                     {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="location" className="text-sm font-medium text-gray-700">
//                       Location *
//                     </Label>
//                     <Input
//                       id="location"
//                       placeholder="e.g., Central Park, New York"
//                       value={data.location}
//                       onChange={(e) => setData('location', e.target.value)}
//                       required
//                     />
//                     {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description" className="text-sm font-medium text-gray-700">
//                     Description *
//                   </Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Describe your activity in detail..."
//                     value={data.description}
//                     onChange={(e) => setData('description', e.target.value)}
//                     className="min-h-[120px]"
//                     required
//                   />
//                   {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
//                 </div>
//               </div>

//               {/* Image Upload Section */}
//               <div className="border-t border-gray-200 pt-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <h3 className="text-md font-medium text-gray-900">Activity Image</h3>
//                   <span title="Upload activity image">
//                     <HelpCircle className="w-4 h-4 text-gray-400" />
//                   </span>
//                 </div>

//                 <div className="mb-4">
//                   <Label className="block text-sm font-medium text-gray-700 mb-2">
//                     Upload Image
//                   </Label>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept="image/jpeg,image/png,image/webp"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex items-center gap-2"
//                     onClick={() => fileInputRef.current?.click()}
//                   >
//                     <Upload className="w-4 h-4" />
//                     Select Image
//                   </Button>
//                   <p className="mt-2 text-xs text-gray-500">
//                     JPEG, PNG, WEBP up to 2MB
//                   </p>
//                   {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
//                 </div>

//                 {/* Image Preview */}
//                 {previewImage && (
//                   <div className="relative w-40 h-40 mb-6">
//                     <div className="aspect-square rounded-lg overflow-hidden border">
//                       <img 
//                         src={previewImage} 
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       className="absolute top-1 right-1 w-6 h-6"
//                       onClick={removeImage}
//                     >
//                       <X className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               {/* Time Slots Section */}
//               <div className="border-t border-gray-200 pt-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-md font-medium text-gray-900">Time Slots</h3>
//                     <span title="Define when this activity is available">
//                       <HelpCircle className="w-4 h-4 text-gray-400" />
//                     </span>
//                   </div>
//                   <Button
//                     type="button"
//                     onClick={addTimeSlot}
//                     size="sm"
//                     className="flex items-center gap-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Time Slot
//                   </Button>
//                 </div>

//                 {/* Time Slots */}
//                 <div className="space-y-4">
//                   {data.time_slots.map((slot, index) => {
//                     const slotId = slot.id || index;
//                     return (
//                       <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-sm font-medium text-gray-700">
//                             Time Slot {index + 1}
//                           </h4>
//                           {data.time_slots.length > 1 && (
//                             <Button
//                               type="button"
//                               variant="outline"
//                               size="sm"
//                               className="text-red-500 hover:bg-red-50"
//                               onClick={() => removeTimeSlot(index, slot.id)}
//                             >
//                               Remove
//                             </Button>
//                           )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="space-y-2">
//                             <Label className="text-sm font-medium text-gray-600">
//                               Start Time *
//                             </Label>
//                             <div className="relative">
//                               <Input
//                                 type="datetime-local"
//                                 value={slot.starts_at}
//                                 onChange={(e) => updateTimeSlot(index, 'starts_at', e.target.value)}
//                                 required
//                               />
//                               <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                             </div>
//                             {getTimeSlotError(index, 'capacity') && (
//                               <p className="text-red-500 text-xs mt-1">
//                                 {getTimeSlotError(index, 'capacity')}
//                               </p>
//                             )}
//                           </div>

//                           <div className="space-y-2">
//                             <Label className="text-sm font-medium text-gray-600">
//                               End Time *
//                             </Label>
//                             <div className="relative">
//                               <Input
//                                 type="datetime-local"
//                                 value={slot.ends_at}
//                                 onChange={(e) => updateTimeSlot(index, 'ends_at', e.target.value)}
//                                 required
//                               />
//                               <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                             </div>
//                             {getTimeSlotError(index, 'capacity') && (
//                               <p className="text-red-500 text-xs mt-1">
//                                 {getTimeSlotError(index, 'capacity')}
//                               </p>
//                             )}
//                           </div>

//                           <div className="space-y-2">
//                             <Label className="text-sm font-medium text-gray-600">
//                               Capacity *
//                             </Label>
//                             <Input
//                               type="number"
//                               min="1"
//                               placeholder="Number of people"
//                               value={slot.capacity}
//                               onChange={(e) => updateTimeSlot(index, 'capacity', e.target.value)}
//                               required
//                             />
//                             {getTimeSlotError(index, 'capacity') && (
//                               <p className="text-red-500 text-xs mt-1">
//                                 {getTimeSlotError(index, 'capacity')}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Bottom Options */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 gap-4">
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Shield className="w-4 h-4 text-gray-500" />
//                   <span>Privacy: Public</span>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => window.history.back()}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="bg-gray-900 hover:bg-gray-800"
//                     disabled={processing || !data.title || !data.description || !data.price || !data.location}
//                   >
//                     {processing ? (
//                       <span className="flex items-center">
//                         <Save className="w-4 h-4 mr-2 animate-spin" />
//                         {isEditing ? 'Saving...' : 'Creating...'}
//                       </span>
//                     ) : (
//                       <span className="flex items-center">
//                         <Save className="w-4 h-4 mr-2" />
//                         {isEditing ? 'Save Changes' : 'Create Activity'}
//                       </span>
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };


type TimeSlot = {
  id?: number;
  starts_at: string;
  ends_at: string;
};

type ActivityFormData = {
  title: string;
  description: string;
  price: string;
  location: string;
  time_slots: TimeSlot[];
  image: File | null;
  delete_media: string[];
  delete_time_slots: number[];
};

type ActivityFormProps = {
  activity?: {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
    time_slots: TimeSlot[];
    media: { id: string; original_url: string }[];
  };
  errors?: Record<string, string> & {
    time_slots?: Record<number, Record<string, string>>;
  };
};

export default function CreateActivity({ activity }: ActivityFormProps)  {
  const isEditing = !!activity;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: isEditing ? 'Edit Activity' : 'Create Activity',
      href: isEditing ? `/activities/${activity.id}/edit` : '/activities/create',
    },
  ];

  const initialFormData: ActivityFormData = {
    title: activity?.title || '',
    description: activity?.description || '',
    price: activity?.price ? String(activity.price) : '',
    location: activity?.location || '',
    time_slots: activity?.time_slots || [{ starts_at: '', ends_at: '' }],
    image: null,
    delete_media: [],
    delete_time_slots: [],
  };

  const { data, setData, errors, post, put, processing, recentlySuccessful } = useForm(initialFormData);

  const [previewImage, setPreviewImage] = useState<string | null>(
    activity?.media[0]?.original_url || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTimeSlot = (): void => {
    setData('time_slots', [
      ...data.time_slots,
      { starts_at: '', ends_at: '' },
    ]);
  };

  const removeTimeSlot = (index: number, id?: number): void => {
    if (id) {
      setData('delete_time_slots', [...data.delete_time_slots, id]);
    }

    const newSlots = [...data.time_slots];
    newSlots.splice(index, 1);
    setData('time_slots', newSlots);
  };

  const updateTimeSlot = (
    index: number,
    field: keyof TimeSlot,
    value: string
  ): void => {
    const newSlots = [...data.time_slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setData('time_slots', newSlots);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setData('image', file);

      // Create preview URL
      setPreviewImage(URL.createObjectURL(file));

      // Clear delete_media if replacing existing image
      if (isEditing && activity?.media[0]?.id) {
        setData('delete_media', [activity.media[0].id]);
      }
    }
  };

  const removeImage = () => {
    if (activity?.media[0]?.id) {
      setData('delete_media', [activity.media[0].id]);
    }

    setPreviewImage(null);
    setData('image', null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // Convert price to number; time_slots stay as-is (no capacity)
    const formData = {
      ...data,
      price: Number(data.price),
    };

    setData(formData as any);

    if (isEditing) {
      put(route('activities.update', activity.id), {
        preserveScroll: true,
      });
    } else {
      post(route('activities.store'));
    }
  };

  // Helper to get time slot errors
  const getTimeSlotError = (index: number, field: string): string | undefined => {
    const errorKey = `time_slots.${index}.${field}`;
    return (errors as Record<string, string>)?.[errorKey];
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEditing ? 'Edit Activity' : 'Create Activity'} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b rounded-t-lg">
            <h2 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Activity' : 'Create Activity'}
            </h2>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 space-y-6">
              {/* Activity Basic Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Swimming, Hiking, City Tour"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                      Price *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        className="w-full pl-8"
                        required
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., Central Park, New York"
                      value={data.location}
                      onChange={(e) => setData('location', e.target.value)}
                      required
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your activity in detail..."
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-md font-medium text-gray-900">Activity Image</h3>
                  <span title="Upload activity image">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </span>
                </div>

                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Select Image
                  </Button>
                  <p className="mt-2 text-xs text-gray-500">JPEG, PNG, WEBP up to 2MB</p>
                  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                {/* Image Preview */}
                {previewImage && (
                  <div className="relative w-40 h-40 mb-6">
                    <div className="aspect-square rounded-lg overflow-hidden border">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-6 h-6"
                      onClick={removeImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Time Slots Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-medium text-gray-900">Time Slots</h3>
                    <span title="Define when this activity is available">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={addTimeSlot}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Time Slot
                  </Button>
                </div>

                {/* Time Slots */}
                <div className="space-y-4">
                  {data.time_slots.map((slot, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Time Slot {index + 1}</h4>
                        {data.time_slots.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => removeTimeSlot(index, slot.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Start Time *</Label>
                          <div className="relative">
                            <Input
                              type="datetime-local"
                              value={slot.starts_at}
                              onChange={(e) => updateTimeSlot(index, 'starts_at', e.target.value)}
                              required
                            />
                            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {getTimeSlotError(index, 'starts_at') && (
                            <p className="text-red-500 text-xs mt-1">{getTimeSlotError(index, 'starts_at')}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">End Time *</Label>
                          <div className="relative">
                            <Input
                              type="datetime-local"
                              value={slot.ends_at}
                              onChange={(e) => updateTimeSlot(index, 'ends_at', e.target.value)}
                              required
                            />
                            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {getTimeSlotError(index, 'ends_at') && (
                            <p className="text-red-500 text-xs mt-1">{getTimeSlotError(index, 'ends_at')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Options */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span>Privacy: Public</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800"
                    disabled={
                      processing ||
                      !data.title ||
                      !data.description ||
                      !data.price ||
                      !data.location
                    }
                  >
                    {processing ? (
                      <span className="flex items-center">
                        <Save className="w-4 h-4 mr-2 animate-spin" />
                        {isEditing ? 'Saving...' : 'Creating...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Save Changes' : 'Create Activity'}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};
