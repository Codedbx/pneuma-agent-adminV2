// // resources/js/Pages/packages/EditPackage.tsx

// 'use client'

// import React, { useState } from 'react'
// import { Head, useForm, usePage } from '@inertiajs/react'
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Upload,
//   Plus,
//   X,
//   Calendar,
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Textarea } from '@/components/ui/textarea'
// import { Checkbox } from '@/components/ui/checkbox'
// import { MultiSelect } from '@/components/multi-select'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
// import { toast } from 'sonner'
// import AppLayout from '@/layouts/app-layout'
// import { type BreadcrumbItem } from '@/types'

// // -------------------------------
// // 1) Define TypeScript types for props
// // -------------------------------
// type Activity = {
//   id: number
//   title: string
//   price: number
// }

// type ExistingMedia = {
//   id: number
//   url: string
//   thumbnail: string
// }


// type PackageProps = {
//   package: {
//     id: number
//     title: string
//     description: string
//     base_price: string
//     location: string
//     agent_addon_price: string
//     agent_price_type: string
//     booking_start_date: string  // already “YYYY-MM-DD” from controller
//     booking_end_date: string    // already “YYYY-MM-DD”
//     is_active: boolean
//     is_featured: boolean
//     is_refundable: boolean
//     visibility: string
//     terms_and_conditions: string
//     cancellation_policy: string
//     flight_from: string
//     flight_to: string
//     airline_name: string
//     booking_class: string
//     hotel_name: string
//     hotel_star_rating: string
//     hotel_checkin: string      // “YYYY-MM-DD” or empty
//     hotel_checkout: string     // “YYYY-MM-DD” or empty
//     activities: { id: number }[]  // existing activity IDs
//   }
//   images: ExistingMedia[]
//   allActivities: Activity[]
// }


// const breadcrumbs: BreadcrumbItem[] = [
//   { title: 'Packages', href: '/packages' },
//   { title: 'Edit Package', href: '' },
// ]


// export default function EditPackage() {
//   // Grab props from Inertia
//   const {
//     package: pkg,
//     images: existingImagesProp,
//     allActivities,
//   } = usePage<PackageProps>().props

//   // Local state for existing images (thumbnails from media)
//   const [existingImages, setExistingImages] = useState<ExistingMedia[]>(
//     existingImagesProp
//   )
//   const [deleteMedia, setDeleteMedia] = useState<number[]>([])

//   // Local state for previewing newly uploaded files
//   const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

//   // Inertia form, seeded with package data
//   const { data, setData, put, processing, errors, progress } = useForm({
//     // 1) Basic fields
//     title: pkg.title,
//     description: pkg.description,
//     base_price: pkg.base_price,
//     location: pkg.location,
//     agent_addon_price: pkg.agent_addon_price,
//     agent_price_type: pkg.agent_price_type,

//     // 2) Booking dates are already “YYYY-MM-DD” strings
//     booking_start_date: pkg.booking_start_date || '',
//     booking_end_date: pkg.booking_end_date || '',

//     // 3) Flags & settings
//     is_active: pkg.is_active,
//     is_featured: pkg.is_featured,
//     is_refundable: pkg.is_refundable,
//     visibility: pkg.visibility,
//     terms_and_conditions: pkg.terms_and_conditions,
//     cancellation_policy: pkg.cancellation_policy,

//     // 4) Flight details (optional)
//     flight_from: pkg.flight_from,
//     flight_to: pkg.flight_to,
//     airline_name: pkg.airline_name,
//     booking_class: pkg.booking_class,

//     // 5) Hotel details (optional)
//     hotel_name: pkg.hotel_name,
//     hotel_star_rating: pkg.hotel_star_rating,
//     hotel_checkin: pkg.hotel_checkin || '',
//     hotel_checkout: pkg.hotel_checkout || '',

//     // 6) Activities: map each existing ID → string
//     activities: pkg.activities.map((a) => a.id.toString()),

//     // 7) For brand-new file uploads
//     package_images: [] as File[],
//   })

//   // Stepper state & titles
//   const steps = [
//     { number: 1, title: 'Basic Information' },
//     { number: 2, title: 'Activities & Media' },
//     { number: 3, title: 'Flight & Hotel' },
//     { number: 4, title: 'Settings & Policies' },
//   ]
//   const [currentStep, setCurrentStep] = useState<number>(1)

//   // -------------------------------
//   // 4) Step-validation logic
//   // -------------------------------
//   const isStepValid = (step: number) => {
//     switch (step) {
//       case 1:
//         return (
//           data.title.trim() &&
//           data.description.trim() &&
//           data.base_price.trim() &&
//           data.location.trim() &&
//           data.agent_addon_price.trim() &&
//           data.agent_price_type.trim() &&
//           data.booking_start_date.trim() &&
//           data.booking_end_date.trim()
//         )
//       case 2:
//         // Must have at least one existing image OR one new upload
//         return existingImages.length + (data.package_images?.length || 0) > 0
//       case 3:
//         // Everything on step 3 is optional → always valid
//         return true
//       case 4:
//         return !!data.visibility.trim()
//       default:
//         return false
//     }
//   }

//   const nextStep = () => {
//     if (!isStepValid(currentStep)) {
//       toast.error(
//         'Please complete all required fields for this step before continuing.'
//       )
//       return
//     }
//     setCurrentStep((prev) => Math.min(prev + 1, 4))
//   }

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1)
//     }
//   }

//   // -------------------------------
//   // 5) Remove an existing image
//   // -------------------------------
//   const removeExistingImage = (mediaId: number) => {
//     setDeleteMedia((prev) => [...prev, mediaId])
//     setExistingImages((prev) => prev.filter((img) => img.id !== mediaId))
//   }

//   // -------------------------------
//   // 6) Handle new file uploads
//   // -------------------------------
//   const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || [])
//     if (files.length === 0) return

//     // Limit total images to 10
//     const currentNewCount = (data.package_images as File[]).length
//     const maxSlots = 10 - existingImages.length - currentNewCount
//     const toAdd = files.slice(0, maxSlots)

//     // Append to Inertia form data
//     setData('package_images', [...(data.package_images as File[]), ...toAdd])

//     // Build preview URLs
//     const previews = toAdd.map((file) => URL.createObjectURL(file))
//     setNewImagePreviews((prev) => [...prev, ...previews])
//   }

//   const removeNewImage = (index: number) => {
//     // Remove from FormData array
//     const newFiles = (data.package_images as File[]).filter((_, i) => i !== index)
//     setData('package_images', newFiles)

//     // Revoke old URL and remove from previews
//     URL.revokeObjectURL(newImagePreviews[index])
//     setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
//   }

//   // -------------------------------
//   // 7) Handle MultiSelect for activities
//   // -------------------------------
//   const handleActivityChange = (selected: string[]) => {
//     setData('activities', selected)
//   }

//   // -------------------------------
//   // 8) Final “PUT” submit
//   // -------------------------------
//   const submit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!isStepValid(4)) {
//       toast.error('Please fill out all required fields before saving.')
//       return
//     }

//     const formData = new FormData()

//     // 1) Primitive fields
//     Object.entries(data).forEach(([key, value]) => {
//       if (key === 'activities' || key === 'package_images') {
//         // skip → handle below
//       } else if (typeof value === 'boolean') {
//         formData.append(key, value ? '1' : '0')
//       } else if (value != null) {
//         formData.append(key, value.toString())
//       }
//     })

//     // 2) New images under “package_images[]”
//     ;(data.package_images as File[]).forEach((file, idx) => {
//       formData.append(`package_images[${idx}]`, file)
//     })

//     // 3) Activities IDs
//     ;(data.activities as string[]).forEach((actId, idx) => {
//       formData.append(`activities[${idx}]`, actId)
//     })

//     // 4) Which existing images to delete
//     deleteMedia.forEach((mediaId, idx) => {
//       formData.append(`delete_media[${idx}]`, mediaId.toString())
//     })

//     // Do the Inertia.put
//     put(route('packages.update', pkg.id), {
//       data: formData,
//       forceFormData: true,
//       preserveScroll: true,
//       preserveState: 'errors',
//       onSuccess: () => {
//         newImagePreviews.forEach((url) => URL.revokeObjectURL(url))
//         toast.success('Package updated successfully!')
//       },
//       onError: (errs) => {
//         // Jump to whichever step has the first validation error
//         const stepFieldMap: Record<string, number> = {
//           title: 1,
//           description: 1,
//           base_price: 1,
//           location: 1,
//           agent_addon_price: 1,
//           agent_price_type: 1,
//           booking_start_date: 1,
//           booking_end_date: 1,
//           visibility: 4,
//           terms_and_conditions: 4,
//           cancellation_policy: 4,
//         }
//         const keys = Object.keys(errs)
//         if (keys.length > 0) {
//           const firstStep = Math.min(
//             ...keys.map((f) => stepFieldMap[f] || 1)
//           )
//           setCurrentStep(firstStep)
//         }
//         toast.error('Validation errors—please fix and try again.')
//       },
//     })
//   }

//   // -------------------------------
//   // 9) Render JSX
//   // -------------------------------

//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="Edit Package" />
//       <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//         <Card className="w-full mx-auto">
//           <CardHeader className="bg-gray-50 border-b">
//             <CardTitle className="text-xl font-medium text-gray-900 mb-4">
//               Edit Travel Package
//             </CardTitle>

//             {/* ── Stepper ── */}
//             <div className="flex items-center justify-between">
//               {steps.map((step, idx) => (
//                 <React.Fragment key={step.number}>
//                   <div className="flex items-center">
//                     <div
//                       className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
//                         currentStep >= step.number
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-200 text-gray-600'
//                       }`}
//                     >
//                       {step.number}
//                     </div>
//                     <span
//                       className={`ml-2 text-sm font-medium hidden sm:inline ${
//                         currentStep >= step.number
//                           ? 'text-blue-600'
//                           : 'text-gray-500'
//                       }`}
//                     >
//                       {step.title}
//                     </span>
//                   </div>
//                   {idx < steps.length - 1 && (
//                     <div
//                       className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
//                         currentStep > step.number
//                           ? 'bg-blue-600'
//                           : 'bg-gray-200'
//                       }`}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>

//             {/* ── Progress Bar (if uploading) ── */}
//             {progress && (
//               <div className="mt-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-600">Uploading…</span>
//                   <span className="text-sm text-gray-600">
//                     {Math.round(progress.percentage || 0)}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${progress.percentage || 0}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//           </CardHeader>

//           <CardContent className="p-6">
//             <form onSubmit={submit}>
//               {/* ========== STEP 1: BASIC INFO ========== */}
//               {currentStep === 1 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Basic Package Information
//                   </h3>

//                   {/* Title & Description */}
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="title"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Package Title *
//                       </Label>
//                       <Input
//                         id="title"
//                         name="title"
//                         placeholder="e.g., Luxury Paris Getaway"
//                         value={data.title}
//                         onChange={(e) => setData('title', e.target.value)}
//                         required
//                         disabled={processing}
//                         className="w-full"
//                       />
//                       {errors.title && (
//                         <p className="text-sm text-red-600">{errors.title}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="description"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Description *
//                       </Label>
//                       <Textarea
//                         id="description"
//                         name="description"
//                         placeholder="e.g., 5-day luxury package with Eiffel Tower"
//                         value={data.description}
//                         onChange={(e) =>
//                           setData('description', e.target.value)
//                         }
//                         required
//                         disabled={processing}
//                         className="w-full min-h-[80px] resize-none"
//                       />
//                       {errors.description && (
//                         <p className="text-sm text-red-600">
//                           {errors.description}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Price & Location */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="base_price"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Base Price ($) *
//                       </Label>
//                       <Input
//                         id="base_price"
//                         name="base_price"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         placeholder="e.g., 2999.99"
//                         value={data.base_price}
//                         onChange={(e) =>
//                           setData('base_price', e.target.value)
//                         }
//                         required
//                         disabled={processing}
//                         className="w-full"
//                       />
//                       {errors.base_price && (
//                         <p className="text-sm text-red-600">
//                           {errors.base_price}
//                         </p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="location"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Location *
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="location"
//                           name="location"
//                           placeholder="e.g., Paris, France"
//                           value={data.location}
//                           onChange={(e) =>
//                             setData('location', e.target.value)
//                           }
//                           required
//                           disabled={processing}
//                           className="w-full pr-10"
//                         />
//                         <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.location && (
//                         <p className="text-sm text-red-600">
//                           {errors.location}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Agent Addon & Type */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="agent_addon_price"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Agent Addon Price *
//                       </Label>
//                       <Input
//                         id="agent_addon_price"
//                         name="agent_addon_price"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         placeholder="e.g., 299.99 or 15 (for %)"
//                         value={data.agent_addon_price}
//                         onChange={(e) =>
//                           setData('agent_addon_price', e.target.value)
//                         }
//                         required
//                         disabled={processing}
//                         className="w-full"
//                       />
//                       {errors.agent_addon_price && (
//                         <p className="text-sm text-red-600">
//                           {errors.agent_addon_price}
//                         </p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-gray-700">
//                         Agent Price Type *
//                       </Label>
//                       <Select
//                         value={data.agent_price_type}
//                         onValueChange={(v) => setData('agent_price_type', v)}
//                         disabled={processing}
//                         name="agent_price_type"
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
//                           <SelectItem value="percentage">
//                             Percentage (%)
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       {errors.agent_price_type && (
//                         <p className="text-sm text-red-600">
//                           {errors.agent_price_type}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Booking Dates */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="booking_start_date"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Booking Start Date *
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="booking_start_date"
//                           name="booking_start_date"
//                           type="date"
//                           value={data.booking_start_date}
//                           onChange={(e) =>
//                             setData('booking_start_date', e.target.value)
//                           }
//                           required
//                           disabled={processing}
//                           className="w-full pr-10"
//                         />
//                         <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.booking_start_date && (
//                         <p className="text-sm text-red-600">
//                           {errors.booking_start_date}
//                         </p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="booking_end_date"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Booking End Date *
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="booking_end_date"
//                           name="booking_end_date"
//                           type="date"
//                           value={data.booking_end_date}
//                           onChange={(e) =>
//                             setData('booking_end_date', e.target.value)
//                           }
//                           required
//                           disabled={processing}
//                           className="w-full pr-10"
//                         />
//                         <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.booking_end_date && (
//                         <p className="text-sm text-red-600">
//                           {errors.booking_end_date}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ========== STEP 2: ACTIVITIES & MEDIA ========== */}
//               {currentStep === 2 && (
//                 <div className="space-y-6">
//                   <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Package Activities
//                     </h3>
//                   </div>

//                   <div className="space-y-4">
//                     {/* MultiSelect for Activities */}
//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-gray-700">
//                         Select Activities
//                       </Label>
//                       <MultiSelect
//                         name="activities"
//                         options={allActivities.map((act) => ({
//                           label: `${act.title} – $${act.price}`,
//                           value: act.id.toString(),
//                         }))}
//                         value={data.activities}
//                         onValueChange={handleActivityChange}
//                         placeholder="Select activities for this package"
//                         variant="inverted"
//                         maxCount={3}
//                         disabled={processing}
//                       />
//                       <p className="text-sm text-gray-500">
//                         Choose activities included in this package.
//                       </p>
//                       {errors.activities && (
//                         <p className="text-sm text-red-600">
//                           {errors.activities}
//                         </p>
//                       )}
//                     </div>

//                     {/* Show currently selected activities as chips */}
//                     {data.activities.length > 0 && (
//                       <div className="mt-4">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">
//                           Selected Activities:
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {data.activities.map((activityId, idx) => {
//                             const act = allActivities.find(
//                               (a) => a.id === parseInt(activityId, 10)
//                             )
//                             return (
//                               <div
//                                 key={idx}
//                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                               >
//                                 {act
//                                   ? `${act.title} – $${act.price}`
//                                   : `Activity #${activityId}`}
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     const filtered = data.activities.filter(
//                                       (x) => x !== activityId
//                                     )
//                                     setData('activities', filtered)
//                                   }}
//                                   className="ml-2 text-blue-600 hover:text-blue-800"
//                                   disabled={processing}
//                                 >
//                                   <X className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             )
//                           })}
//                         </div>
//                       </div>
//                     )}

//                     <Separator className="my-6" />

//                     {/* Package Media (Existing + Upload New) */}
//                     <div className="space-y-6">
//                       <h4 className="text-lg font-medium text-gray-900">
//                         Package Media
//                       </h4>

//                       {/* Existing Images */}
//                       {existingImages.length > 0 && (
//                         <div className="mb-4">
//                           <h5 className="text-sm font-medium text-gray-700 mb-2">
//                             Current Images
//                           </h5>
//                           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                             {existingImages.map((img) => (
//                               <div key={img.id} className="relative group">
//                                 <img
//                                   src={img.url}
//                                   alt={`Media ${img.id}`}
//                                   className="w-full h-24 object-cover rounded-lg border"
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() => removeExistingImage(img.id)}
//                                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                                   disabled={processing}
//                                 >
//                                   <X className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Upload New Images */}
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-gray-700">
//                           Upload New Images
//                         </Label>
//                         <div className="flex items-center gap-4">
//                           <input
//                             type="file"
//                             accept="image/jpeg,image/png,image/webp"
//                             multiple
//                             onChange={handleNewImageUpload}
//                             className="hidden"
//                             id="new-image-upload"
//                             disabled={processing}
//                           />
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               document
//                                 .getElementById('new-image-upload')
//                                 ?.click()
//                             }}
//                             disabled={
//                               processing ||
//                               existingImages.length +
//                                 (data.package_images.length || 0) >=
//                                 10
//                             }
//                             className="flex items-center gap-2"
//                           >
//                             <Upload className="w-4 h-4" />
//                             Upload Images
//                           </Button>
//                           <p className="text-sm text-gray-500">
//                             {existingImages.length +
//                               (data.package_images.length || 0)}
//                             /10 images • Max 5MB each
//                           </p>
//                         </div>
//                         {errors.package_images && (
//                           <p className="text-sm text-red-600">
//                             {errors.package_images}
//                           </p>
//                         )}
//                       </div>

//                       {/* Preview New Uploads */}
//                       {newImagePreviews.length > 0 && (
//                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                           {newImagePreviews.map((previewUrl, idx) => (
//                             <div key={idx} className="relative group">
//                               <img
//                                 src={previewUrl}
//                                 alt={`New preview ${idx + 1}`}
//                                 className="w-full h-24 object-cover rounded-lg border"
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => removeNewImage(idx)}
//                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                                 disabled={processing}
//                               >
//                                 <X className="w-3 h-3" />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ========== STEP 3: FLIGHT & HOTEL ========== */}
//               {currentStep === 3 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Flight & Hotel Information
//                   </h3>

//                   {/* Flight Details */}
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">
//                       Flight Details (Optional)
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="flight_from"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Flight From
//                         </Label>
//                         <Input
//                           id="flight_from"
//                           name="flight_from"
//                           placeholder="e.g., New York (JFK)"
//                           value={data.flight_from}
//                           onChange={(e) => setData('flight_from', e.target.value)}
//                           className="w-full"
//                           disabled={processing}
//                         />
//                         {errors.flight_from && (
//                           <p className="text-sm text-red-600">
//                             {errors.flight_from}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="flight_to"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Flight To
//                         </Label>
//                         <Input
//                           id="flight_to"
//                           name="flight_to"
//                           placeholder="e.g., Paris (CDG)"
//                           value={data.flight_to}
//                           onChange={(e) => setData('flight_to', e.target.value)}
//                           className="w-full"
//                           disabled={processing}
//                         />
//                         {errors.flight_to && (
//                           <p className="text-sm text-red-600">
//                             {errors.flight_to}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="airline_name"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Airline Name
//                         </Label>
//                         <Input
//                           id="airline_name"
//                           name="airline_name"
//                           placeholder="e.g., Air France"
//                           value={data.airline_name}
//                           onChange={(e) =>
//                             setData('airline_name', e.target.value)
//                           }
//                           className="w-full"
//                           disabled={processing}
//                         />
//                         {errors.airline_name && (
//                           <p className="text-sm text-red-600">
//                             {errors.airline_name}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="booking_class"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Booking Class
//                         </Label>
//                         <Select
//                           value={data.booking_class}
//                           onValueChange={(v) => setData('booking_class', v)}
//                           disabled={processing}
//                           name="booking_class"
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select class" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="economy">Economy</SelectItem>
//                             <SelectItem value="premium_economy">
//                               Premium Economy
//                             </SelectItem>
//                             <SelectItem value="business">Business</SelectItem>
//                             <SelectItem value="first">First Class</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.booking_class && (
//                           <p className="text-sm text-red-600">
//                             {errors.booking_class}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Hotel Details */}
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">
//                       Hotel Details (Optional)
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_name"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Hotel Name
//                         </Label>
//                         <Input
//                           id="hotel_name"
//                           name="hotel_name"
//                           placeholder="e.g., Le Meurice"
//                           value={data.hotel_name}
//                           onChange={(e) =>
//                             setData('hotel_name', e.target.value)
//                           }
//                           className="w-full"
//                           disabled={processing}
//                         />
//                         {errors.hotel_name && (
//                           <p className="text-sm text-red-600">
//                             {errors.hotel_name}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_star_rating"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Star Rating
//                         </Label>
//                         <Select
//                           value={data.hotel_star_rating}
//                           onValueChange={(v) =>
//                             setData('hotel_star_rating', v)
//                           }
//                           disabled={processing}
//                           name="hotel_star_rating"
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select rating" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="1">1 Star</SelectItem>
//                             <SelectItem value="2">2 Stars</SelectItem>
//                             <SelectItem value="3">3 Stars</SelectItem>
//                             <SelectItem value="4">4 Stars</SelectItem>
//                             <SelectItem value="5">5 Stars</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.hotel_star_rating && (
//                           <p className="text-sm text-red-600">
//                             {errors.hotel_star_rating}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_checkin"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Hotel Check-in Date
//                         </Label>
//                         <Input
//                           id="hotel_checkin"
//                           name="hotel_checkin"
//                           type="date"
//                           value={data.hotel_checkin}
//                           onChange={(e) =>
//                             setData('hotel_checkin', e.target.value)
//                           }
//                           disabled={processing}
//                           className="w-full"
//                         />
//                         {errors.hotel_checkin && (
//                           <p className="text-sm text-red-600">
//                             {errors.hotel_checkin}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_checkout"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Hotel Check-out Date
//                         </Label>
//                         <Input
//                           id="hotel_checkout"
//                           name="hotel_checkout"
//                           type="date"
//                           value={data.hotel_checkout}
//                           onChange={(e) =>
//                             setData('hotel_checkout', e.target.value)
//                           }
//                           disabled={processing}
//                           className="w-full"
//                         />
//                         {errors.hotel_checkout && (
//                           <p className="text-sm text-red-600">
//                             {errors.hotel_checkout}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ========== STEP 4: SETTINGS & POLICIES ========== */}
//               {currentStep === 4 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Settings & Policies
//                   </h3>

//                   {/* Package Settings */}
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">
//                       Package Settings
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-gray-700">
//                           Visibility *
//                         </Label>
//                         <Select
//                           value={data.visibility}
//                           onValueChange={(v) => setData('visibility', v)}
//                           disabled={processing}
//                           name="visibility"
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select visibility" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="public">
//                               Public – Visible to everyone
//                             </SelectItem>
//                             <SelectItem value="private">
//                               Private – Only visible to you
//                             </SelectItem>
//                             <SelectItem value="agents_only">
//                               Agents Only – Visible to agents
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.visibility && (
//                           <p className="text-sm text-red-600">
//                             {errors.visibility}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-4">
//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_active"
//                             checked={data.is_active}
//                             onCheckedChange={(val) =>
//                               setData('is_active', !!val)
//                             }
//                             disabled={processing}
//                             name="is_active"
//                           />
//                           <Label
//                             htmlFor="is_active"
//                             className="text-sm font-medium text-gray-700"
//                           >
//                             Active Package
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">
//                           Package is available for booking
//                         </p>

//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_featured"
//                             checked={data.is_featured}
//                             onCheckedChange={(val) =>
//                               setData('is_featured', !!val)
//                             }
//                             disabled={processing}
//                             name="is_featured"
//                           />
//                           <Label
//                             htmlFor="is_featured"
//                             className="text-sm font-medium text-gray-700"
//                           >
//                             Featured Package
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">
//                           Display in featured packages section
//                         </p>

//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_refundable"
//                             checked={data.is_refundable}
//                             onCheckedChange={(val) =>
//                               setData('is_refundable', !!val)
//                             }
//                             disabled={processing}
//                             name="is_refundable"
//                           />
//                           <Label
//                             htmlFor="is_refundable"
//                             className="text-sm font-medium text-gray-700"
//                           >
//                             Refundable
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">
//                           Allow refunds for this package
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Terms & Conditions */}
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">
//                       Terms & Conditions
//                     </h4>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="terms_and_conditions"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Terms and Conditions
//                       </Label>
//                       <Textarea
//                         id="terms_and_conditions"
//                         name="terms_and_conditions"
//                         placeholder="Enter terms and conditions..."
//                         value={data.terms_and_conditions}
//                         onChange={(e) =>
//                           setData('terms_and_conditions', e.target.value)
//                         }
//                         className="w-full min-h-[120px] resize-y"
//                         disabled={processing}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Include important terms and requirements for this package.
//                       </p>
//                       {errors.terms_and_conditions && (
//                         <p className="text-sm text-red-600">
//                           {errors.terms_and_conditions}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Cancellation Policy */}
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">
//                       Cancellation Policy
//                     </h4>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="cancellation_policy"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Cancellation Policy
//                       </Label>
//                       <Textarea
//                         id="cancellation_policy"
//                         name="cancellation_policy"
//                         placeholder="Enter cancellation policy..."
//                         value={data.cancellation_policy}
//                         onChange={(e) =>
//                           setData('cancellation_policy', e.target.value)
//                         }
//                         className="w-full min-h-[120px] resize-y"
//                         disabled={processing}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Define cancellation terms, deadlines, and refund rules.
//                       </p>
//                       {errors.cancellation_policy && (
//                         <p className="text-sm text-red-600">
//                           {errors.cancellation_policy}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Policy Guidelines */}
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-start space-x-3">
//                       <span className="mt-0.5 text-blue-600">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                           className="w-5 h-5"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V7a1 1 0 10-2 0v1a1 1 0 102 0zm-.5 2.5a.75.75 0 10-1.5 0v3.25a.75.75 0 001.5 0V9.5z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </span>
//                       <div>
//                         <h5 className="text-sm font-medium text-blue-900 mb-1">
//                           Policy Guidelines
//                         </h5>
//                         <p className="text-sm text-blue-700">
//                           Ensure your terms and cancellation policies are clear
//                           and comply with local regulations. Include details
//                           about booking changes, refund timelines, and any
//                           non-refundable fees.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ========== NAVIGATION BUTTONS ========== */}
//               <div className="flex items-center justify-between pt-6 border-t border-gray-200">
//                 <div className="flex items-center space-x-2">
//                   {currentStep > 1 && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={prevStep}
//                       className="flex items-center space-x-2"
//                       disabled={processing}
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       <span>Previous</span>
//                     </Button>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   {currentStep < 4 ? (
//                     <div
//                       onClick={nextStep}
//                       role="button"
//                       tabIndex={0}
//                       className={
//                         `inline-flex items-center space-x-2 px-4 py-2 rounded text-white ` +
//                         (processing
//                           ? 'bg-gray-400 cursor-not-allowed'
//                           : 'bg-blue-600 hover:bg-blue-700 cursor-pointer')
//                       }
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                           e.preventDefault()
//                           nextStep()
//                         }
//                       }}
//                     >
//                       {processing && (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       )}
//                       <span>Next</span>
//                       <ChevronRight className="w-4 h-4" />
//                     </div>
//                   ) : (
//                     <Button
//                       type="submit"
//                       disabled={processing}
//                       className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
//                     >
//                       {processing ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                           <span>Updating...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Plus className="w-4 h-4" />
//                           <span>Update Package</span>
//                         </>
//                       )}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </AppLayout>
//   )
// }



"use client"

import React, { useState } from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Upload,
  Plus,
  X,
  Calendar,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "@/components/multi-select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"

type Activity = {
  id: number
  title: string
  price: number
}

type ExistingMedia = {
  id: number
  url: string
  thumbnail: string
}

type PackageProps = {
  package: {
    id: number
    title: string
    description: string
    base_price: string
    location: string
    agent_addon_price: string
    agent_price_type: string
    booking_start_date: string    // "YYYY-MM-DD"
    booking_end_date: string      // "YYYY-MM-DD"
    is_active: boolean
    is_featured: boolean
    is_refundable: boolean
    visibility: string
    terms_and_conditions: string
    cancellation_policy: string
    flight_from: string
    flight_to: string
    airline_name: string
    booking_class: string
    hotel_name: string
    hotel_star_rating: string
    hotel_checkin: string         // "YYYY-MM-DD" or empty
    hotel_checkout: string        // "YYYY-MM-DD" or empty
    activities: { id: number }[]
  }
  images: ExistingMedia[]
  allActivities: Activity[]
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Packages", href: "/packages" },
  { title: "Edit Package", href: "" },
]

export default function EditPackage() {
  const {
    package: pkg,
    images: existingImagesProp,
    allActivities,
  } = usePage<PackageProps>().props

  const [existingImages, setExistingImages] = useState<ExistingMedia[]>(existingImagesProp)
  const [deleteMedia, setDeleteMedia] = useState<number[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  const { data, setData, put, processing, errors, progress } = useForm({
    title: pkg.title,
    description: pkg.description,
    base_price: pkg.base_price,
    location: pkg.location,
    agent_addon_price: pkg.agent_addon_price,
    agent_price_type: pkg.agent_price_type,

    booking_start_date: pkg.booking_start_date || "",
    booking_end_date: pkg.booking_end_date || "",

    is_active: pkg.is_active,
    is_featured: pkg.is_featured,
    is_refundable: pkg.is_refundable,
    visibility: pkg.visibility,
    terms_and_conditions: pkg.terms_and_conditions,
    cancellation_policy: pkg.cancellation_policy,

    flight_from: pkg.flight_from,
    flight_to: pkg.flight_to,
    airline_name: pkg.airline_name,
    booking_class: pkg.booking_class,

    hotel_name: pkg.hotel_name,
    hotel_star_rating: pkg.hotel_star_rating,
    hotel_checkin: pkg.hotel_checkin || "",
    hotel_checkout: pkg.hotel_checkout || "",

    activities: pkg.activities.map((a) => a.id.toString()),

    package_images: [] as File[],
  })

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Activities & Media" },
    { number: 3, title: "Flight & Hotel" },
    { number: 4, title: "Settings & Policies" },
  ]
  const [currentStep, setCurrentStep] = useState<number>(1)

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          data.title.trim() &&
          data.description.trim() &&
          data.base_price.trim() &&
          data.location.trim() &&
          data.agent_addon_price.trim() &&
          data.agent_price_type.trim() &&
          data.booking_start_date.trim() &&
          data.booking_end_date.trim()
        )
      case 2:
        return existingImages.length + (data.package_images?.length || 0) > 0
      case 3:
        return true
      case 4:
        return !!data.visibility.trim()
      default:
        return false
    }
  }

  const nextStep = () => {
    if (!isStepValid(currentStep)) {
      toast.error("Please complete all required fields before continuing.")
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const removeExistingImage = (mediaId: number) => {
    setDeleteMedia((prev) => [...prev, mediaId])
    setExistingImages((prev) => prev.filter((img) => img.id !== mediaId))
  }

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const currentNew = data.package_images.length
    const remainingSlots = 10 - existingImages.length - currentNew
    const toAdd = files.slice(0, remainingSlots)

    const validFiles: File[] = []
    const previews: string[] = []

    toAdd.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 2MB and was not added.`)
        return
      }
      validFiles.push(file)
      previews.push(URL.createObjectURL(file))
    })

    setData("package_images", [...(data.package_images as File[]), ...validFiles])
    setNewImagePreviews((prev) => [...prev, ...previews])
    e.target.value = ""
  }

  const removeNewImage = (index: number) => {
    const updated = (data.package_images as File[]).filter((_, i) => i !== index)
    setData("package_images", updated)
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleActivityChange = (selected: string[]) => {
    setData("activities", selected)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStepValid(4)) {
      toast.error("Please fill out all required fields before saving.")
      return
    }

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === "activities" || key === "package_images") return
      if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0")
      } else if (value != null) {
        formData.append(key, value.toString())
      }
    })

    ;(data.activities as string[]).forEach((actId, i) => {
      formData.append(`activities[${i}]`, actId)
    })
    ;(data.package_images as File[]).forEach((file, i) => {
      const uniqueName = `${Date.now()}_${file.name}`
      formData.append(`package_images[${i}]`, file, uniqueName)
    })
    deleteMedia.forEach((mediaId, i) => {
      formData.append(`delete_media[${i}]`, mediaId.toString())
    })

    put(route("packages.update", pkg.id), {
      data: formData,
      forceFormData: true,
      preserveScroll: true,
      preserveState: "errors",
      onSuccess: () => {
        newImagePreviews.forEach((url) => URL.revokeObjectURL(url))
        toast.success("Package updated successfully!")
      },
      onError: (errs) => {
        const stepFieldMap: Record<string, number> = {
          title: 1,
          description: 1,
          base_price: 1,
          location: 1,
          agent_addon_price: 1,
          agent_price_type: 1,
          booking_start_date: 1,
          booking_end_date: 1,
          visibility: 4,
          terms_and_conditions: 4,
          cancellation_policy: 4,
        }
        const keys = Object.keys(errs)
        if (keys.length) {
          const firstStep = Math.min(...keys.map((f) => stepFieldMap[f] || 1))
          setCurrentStep(firstStep)
        }
        toast.error("Validation errors—please fix and try again.")
      },
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Package" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card className="w-full mx-auto">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-medium text-gray-900 mb-4">
              Edit Travel Package
            </CardTitle>

            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium hidden sm:inline ${
                        currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                        currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {progress && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading…</span>
                  <span className="text-sm text-gray-600">{Math.round(progress.percentage || 0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage || 0}%` }}
                  />
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={submit}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Package Information</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Package Title *
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., Luxury Paris Getaway"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        className="w-full"
                        required
                      />
                      {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="e.g., 5-day luxury package with Eiffel Tower"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className="w-full min-h-[80px] resize-none"
                        required
                      />
                      {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base_price" className="text-sm font-medium text-gray-700">
                        Base Price ($) *
                      </Label>
                      <Input
                        id="base_price"
                        name="base_price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 2999.99"
                        value={data.base_price}
                        onChange={(e) => setData("base_price", e.target.value)}
                        className="w-full"
                        required
                      />
                      {errors.base_price && <p className="text-sm text-red-600">{errors.base_price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Location *
                      </Label>
                      <div className="relative">
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g., Paris, France"
                          value={data.location}
                          onChange={(e) => setData("location", e.target.value)}
                          className="w-full pr-10"
                          required
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agent_addon_price" className="text-sm font-medium text-gray-700">
                        Agent Addon Price *
                      </Label>
                      <Input
                        id="agent_addon_price"
                        name="agent_addon_price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 299.99 or 15 (for %)"
                        value={data.agent_addon_price}
                        onChange={(e) => setData("agent_addon_price", e.target.value)}
                        className="w-full"
                        required
                      />
                      {errors.agent_addon_price && (
                        <p className="text-sm text-red-600">{errors.agent_addon_price}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Agent Price Type *</Label>
                      <Select
                        value={data.agent_addon_price_type || data.agent_addon_price_type}
                        onValueChange={(v) => setData("agent_price_type", v)}
                        name="agent_price_type"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.agent_price_type && (
                        <p className="text-sm text-red-600">{errors.agent_price_type}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="booking_start_date" className="text-sm font-medium text-gray-700">
                        Booking Start Date *
                      </Label>
                      <div className="relative">
                        <Input
                          id="booking_start_date"
                          name="booking_start_date"
                          type="date"
                          value={data.booking_start_date}
                          onChange={(e) => setData("booking_start_date", e.target.value)}
                          className="w-full pr-10"
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.booking_start_date && (
                        <p className="text-sm text-red-600">{errors.booking_start_date}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="booking_end_date" className="text-sm font-medium text-gray-700">
                        Booking End Date *
                      </Label>
                      <div className="relative">
                        <Input
                          id="booking_end_date"
                          name="booking_end_date"
                          type="date"
                          value={data.booking_end_date}
                          onChange={(e) => setData("booking_end_date", e.target.value)}
                          className="w-full pr-10"
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.booking_end_date && (
                        <p className="text-sm text-red-600">{errors.booking_end_date}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <h3 className="text-lg font-medium text-gray-900">Package Activities</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Select Activities</Label>
                      <MultiSelect
                        name="activities"
                        options={allActivities.map((act) => ({
                          label: `${act.title} – $${act.price}`,
                          value: act.id.toString(),
                        }))}
                        value={data.activities}
                        onValueChange={handleActivityChange}
                        placeholder="Select activities for this package"
                        variant="inverted"
                        maxCount={3}
                      />
                      <p className="text-sm text-gray-500">
                        Choose activities included in this package.
                      </p>
                      {errors.activities && (
                        <p className="text-sm text-red-600">{errors.activities}</p>
                      )}
                    </div>

                    {data.activities.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Activities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.activities.map((activityId, idx) => {
                            const act = allActivities.find((a) => a.id === parseInt(activityId, 10))
                            return (
                              <div
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                              >
                                {act ? `${act.title} – $${act.price}` : `Activity #${activityId}`}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = data.activities.filter((x) => x !== activityId)
                                    setData("activities", filtered)
                                  }}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <Separator className="my-6" />

                    <div className="space-y-6">
                      <h4 className="text-lg font-medium text-gray-900">Package Media</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Package Images</Label>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                              multiple
                              onChange={handleNewImageUpload}
                              className="hidden"
                              id="new-image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("new-image-upload")?.click()}
                              className="flex items-center gap-2"
                              disabled={existingImages.length + (data.package_images.length || 0) >= 10 || processing}
                            >
                              <Upload className="w-4 h-4" />
                              Upload Images
                            </Button>
                            <p className="text-sm text-gray-500">
                              {existingImages.length + (data.package_images.length || 0)}/10 images • Max 2MB each
                            </p>
                          </div>
                          {errors.package_images && (
                            <p className="text-sm text-red-600">{errors.package_images}</p>
                          )}
                        </div>

                        {existingImages.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Current Images</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              {existingImages.map((img) => (
                                <div key={img.id} className="relative group">
                                  <img
                                    src={img.url}
                                    alt={`Media ${img.id}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeExistingImage(img.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    disabled={processing}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {newImagePreviews.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {newImagePreviews.map((preview, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={preview}
                                  alt={`New preview ${idx + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeNewImage(idx)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Flight & Hotel Information</h3>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Flight Details (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="flight_from" className="text-sm font-medium text-gray-700">
                          Flight From
                        </Label>
                        <Input
                          id="flight_from"
                          name="flight_from"
                          placeholder="e.g., New York (JFK)"
                          value={data.flight_from}
                          onChange={(e) => setData("flight_from", e.target.value)}
                          className="w-full"
                        />
                        {errors.flight_from && <p className="text-sm text-red-600">{errors.flight_from}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="flight_to" className="text-sm font-medium text-gray-700">
                          Flight To
                        </Label>
                        <Input
                          id="flight_to"
                          name="flight_to"
                          placeholder="e.g., Paris (CDG)"
                          value={data.flight_to}
                          onChange={(e) => setData("flight_to", e.target.value)}
                          className="w-full"
                        />
                        {errors.flight_to && <p className="text-sm text-red-600">{errors.flight_to}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="airline_name" className="text-sm font-medium text-gray-700">
                          Airline Name
                        </Label>
                        <Input
                          id="airline_name"
                          name="airline_name"
                          placeholder="e.g., Air France"
                          value={data.airline_name}
                          onChange={(e) => setData("airline_name", e.target.value)}
                          className="w-full"
                        />
                        {errors.airline_name && <p className="text-sm text-red-600">{errors.airline_name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="booking_class" className="text-sm font-medium text-gray-700">
                          Booking Class
                        </Label>
                        <Select
                          value={data.booking_class}
                          onValueChange={(v) => setData("booking_class", v)}
                          name="booking_class"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="premium_economy">Premium Economy</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="first">First Class</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.booking_class && <p className="text-sm text-red-600">{errors.booking_class}</p>}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Hotel Details (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hotel_name" className="text-sm font-medium text-gray-700">
                          Hotel Name
                        </Label>
                        <Input
                          id="hotel_name"
                          name="hotel_name"
                          placeholder="e.g., Le Meurice"
                          value={data.hotel_name}
                          onChange={(e) => setData("hotel_name", e.target.value)}
                          className="w-full"
                        />
                        {errors.hotel_name && <p className="text-sm text-red-600">{errors.hotel_name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hotel_star_rating" className="text-sm font-medium text-gray-700">
                          Star Rating
                        </Label>
                        <Select
                          value={data.hotel_star_rating}
                          onValueChange={(v) => setData("hotel_star_rating", v)}
                          name="hotel_star_rating"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Star</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hotel_checkin" className="text-sm font-medium text-gray-700">
                          Hotel Check-in Date
                        </Label>
                        <Input
                          id="hotel_checkin"
                          name="hotel_checkin"
                          type="date"
                          value={data.hotel_checkin}
                          onChange={(e) => setData("hotel_checkin", e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hotel_checkout" className="text-sm font-medium text-gray-700">
                          Hotel Check-out Date
                        </Label>
                        <Input
                          id="hotel_checkout"
                          name="hotel_checkout"
                          type="date"
                          value={data.hotel_checkout}
                          onChange={(e) => setData("hotel_checkout", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Settings & Policies</h3>
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Package Settings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Visibility *</Label>
                        <Select
                          value={data.visibility}
                          onValueChange={(v) => setData("visibility", v)}
                          name="visibility"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public – Visible to everyone</SelectItem>
                            <SelectItem value="private">Private – Only visible to you</SelectItem>
                            <SelectItem value="agents_only">Agents Only – Visible to agents</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.visibility && <p className="text-sm text-red-600">{errors.visibility}</p>}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(val) => setData("is_active", !!val)}
                            name="is_active"
                          />
                          <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Active Package
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">Package is available for booking</p>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is_featured"
                            checked={data.is_featured}
                            onCheckedChange={(val) => setData("is_featured", !!val)}
                            name="is_featured"
                          />
                          <Label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                            Featured Package
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">Display in featured packages</p>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is_refundable"
                            checked={data.is_refundable}
                            onCheckedChange={(val) => setData("is_refundable", !!val)}
                            name="is_refundable"
                          />
                          <Label htmlFor="is_refundable" className="text-sm font-medium text-gray-700">
                            Refundable
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">Allow refunds for this package</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Terms & Conditions</h4>
                    <div className="space-y-2">
                      <Label htmlFor="terms_and_conditions" className="text-sm font-medium text-gray-700">
                        Terms and Conditions
                      </Label>
                      <Textarea
                        id="terms_and_conditions"
                        name="terms_and_conditions"
                        placeholder="Enter terms and conditions..."
                        value={data.terms_and_conditions}
                        onChange={(e) => setData("terms_and_conditions", e.target.value)}
                        className="w-full min-h-[120px] resize-y"
                      />
                      <p className="text-xs text-gray-500">
                        Include important terms and requirements for this package.
                      </p>
                      {errors.terms_and_conditions && (
                        <p className="text-sm text-red-600">{errors.terms_and_conditions}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Cancellation Policy</h4>
                    <div className="space-y-2">
                      <Label htmlFor="cancellation_policy" className="text-sm font-medium text-gray-700">
                        Cancellation Policy
                      </Label>
                      <Textarea
                        id="cancellation_policy"
                        name="cancellation_policy"
                        placeholder="Enter cancellation policy..."
                        value={data.cancellation_policy}
                        onChange={(e) => setData("cancellation_policy", e.target.value)}
                        className="w-full min-h-[120px] resize-y"
                      />
                      <p className="text-xs text-gray-500">
                        Define cancellation terms, deadlines, and refund rules.
                      </p>
                      {errors.cancellation_policy && (
                        <p className="text-sm text-red-600">{errors.cancellation_policy}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-medium text-blue-900 mb-1">Policy Guidelines</h5>
                        <p className="text-sm text-blue-700">
                          Ensure your terms and cancellation policies are clear and comply with local regulations.
                          Include details about booking changes, refund timelines, and any non‐refundable fees.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center space-x-2"
                      disabled={processing}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {currentStep < 4 ? (
                    <div
                      onClick={nextStep}
                      role="button"
                      tabIndex={0}
                      className={
                        `inline-flex items-center space-x-2 px-4 py-2 rounded text-white ` +
                        (processing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer")
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          nextStep()
                        }
                      }}
                    >
                      {processing && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      )}
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={processing}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Update Package</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
