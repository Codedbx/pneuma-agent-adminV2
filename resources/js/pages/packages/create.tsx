import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Shield, Upload, Plus, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/multi-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package } from '@/types/package';

import { Activity } from '@/types/package';

// interface Props {
//     availableActivities: Activity[];
// }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packages',
        href: '/packages',
    },
    {
        title: 'Create Package',
        href: '/packages/create',
    },
];

export default function CreatePackages(){
    const { activities }: Props = usePage().props;
    const [currentStep, setCurrentStep] = useState(1);
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    console.log('Available Activities:', activities);

    const { data, setData, post, processing, errors, reset, progress } = useForm<Package>({
        title: "",
        description: "",
        base_price: "",
        location: "",
        agent_addon_price: "",
        agent_price_type: "fixed",
        check_in_time: "",
        check_out_time: "",
        booking_start_date: "",
        booking_end_date: "",
        is_active: true,
        is_featured: false,
        is_refundable: true,
        visibility: "public",
        terms_and_conditions: "",
        cancellation_policy: "",
        flight_from: "",
        flight_to: "",
        airline_name: "",
        booking_class: "",
        hotel_name: "",
        hotel_star_rating: "",
        hotel_checkin: "",
        hotel_checkout: "",
        activities: [],
        images: [],
    });

    // Transform activities for MultiSelect component
    const activityOptions = activities.map(activity => ({
        label: `${activity.title} - $${activity.price}`,
        value: activity.id.toString(), // MultiSelect typically expects string values
    }));

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Limit to 10 images total
            const currentImages = data.images.length;
            const remainingSlots = 10 - currentImages;
            const filesToAdd = files.slice(0, remainingSlots);
            
            setData('images', [...data.images, ...filesToAdd]);
            
            // Create preview URLs
            const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
            setImagePreview(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        
        // Clean up the URL object
        URL.revokeObjectURL(imagePreview[index]);
        
        setData('images', newImages);
        setImagePreview(newPreviews);
    };

    const handleActivityChange = (selectedValues: string[]) => {
        // Convert string values back to numbers for the backend
        const activityIds = selectedValues.map(value => parseInt(value, 10));
        setData('activities', activityIds);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Create FormData for file upload
        const formData = new FormData();
        
        // Append all form fields
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images') {
                // Append each image file
                (value as File[]).forEach((file, index) => {
                    formData.append(`images[${index}]`, file);
                });
            } else if (key === 'activities') {
                // Append activity IDs as array
                (value as number[]).forEach((activityId, index) => {
                    formData.append(`activities[${index}]`, activityId.toString());
                });
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, value as string);
            }
        });

        post(route('packages.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                // Clean up preview URLs
                imagePreview.forEach(url => URL.revokeObjectURL(url));
                reset();
                setImagePreview([]);
                setCurrentStep(1);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    const steps = [
        { number: 1, title: "Basic Information" },
        { number: 2, title: "Package Activities" },
        { number: 3, title: "Flight & Hotel Details" },
        { number: 4, title: "Settings & Policies" }
    ];

    // Validation helper
    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(data.title && data.description && data.base_price && data.location && 
                         data.agent_addon_price && data.agent_price_type && data.check_in_time && data.check_out_time);
            case 2:
                return true; // Activities are optional
            case 3:
                return true; // Flight and hotel details are optional
            case 4:
                return true; // All fields in this step are optional or have defaults
            default:
                return false;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Package" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full  mx-auto">
                    {/* Header with Progress */}
                    <CardHeader className="bg-gray-50 border-b">
                        <CardTitle className="text-xl font-medium text-gray-900 mb-4">
                            Travel Package Builder
                        </CardTitle>
                        
                        {/* Step Progress */}
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                        currentStep >= step.number 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {step.number}
                                    </div>
                                    <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                                        currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {step.title}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                                            currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Upload Progress Bar */}
                        {progress && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Uploading package...</span>
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

                    {/* Form Content */}
                    <CardContent className="p-6">
                        <form onSubmit={submit}>
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Package Information</h3>
                                    
                                    {/* Package Title and Description */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                                Package Title *
                                            </Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g., Luxury Paris Getaway"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
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
                                                placeholder="e.g., 5-day luxury package with Eiffel Tower access and river cruise"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="w-full min-h-[80px] resize-none"
                                                required
                                            />
                                            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                                        </div>
                                    </div>

                                    {/* Base Price and Location */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="base_price" className="text-sm font-medium text-gray-700">
                                                Base Price ($) *
                                            </Label>
                                            <Input
                                                id="base_price"
                                                placeholder="e.g., 2999.99"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.base_price}
                                                onChange={(e) => setData('base_price', e.target.value)}
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
                                                    placeholder="e.g., Paris, France"
                                                    value={data.location}
                                                    onChange={(e) => setData('location', e.target.value)}
                                                    className="w-full pr-10"
                                                    required
                                                />
                                                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                                        </div>
                                    </div>

                                    {/* Agent Pricing */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="agent_addon_price" className="text-sm font-medium text-gray-700">
                                                Agent Addon Price *
                                            </Label>
                                            <Input
                                                id="agent_addon_price"
                                                placeholder="e.g., 299.99 or 15 (for percentage)"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.agent_addon_price}
                                                onChange={(e) => setData('agent_addon_price', e.target.value)}
                                                className="w-full"
                                                required
                                            />
                                            {errors.agent_addon_price && <p className="text-sm text-red-600">{errors.agent_addon_price}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">Agent Price Type *</Label>
                                            <Select value={data.agent_price_type} onValueChange={(value) => setData('agent_price_type', value)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.agent_price_type && <p className="text-sm text-red-600">{errors.agent_price_type}</p>}
                                        </div>
                                    </div>

                                    {/* Check-in/out Times */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="check_in_time" className="text-sm font-medium text-gray-700">
                                                Check-in Time *
                                            </Label>
                                            <Input
                                                id="check_in_time"
                                                type="time"
                                                value={data.check_in_time}
                                                onChange={(e) => setData('check_in_time', e.target.value)}
                                                className="w-full"
                                                required
                                            />
                                            {errors.check_in_time && <p className="text-sm text-red-600">{errors.check_in_time}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="check_out_time" className="text-sm font-medium text-gray-700">
                                                Check-out Time *
                                            </Label>
                                            <Input
                                                id="check_out_time"
                                                type="time"
                                                value={data.check_out_time}
                                                onChange={(e) => setData('check_out_time', e.target.value)}
                                                className="w-full"
                                                required
                                            />
                                            {errors.check_out_time && <p className="text-sm text-red-600">{errors.check_out_time}</p>}
                                        </div>
                                    </div>

                                    {/* Booking Dates */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="booking_start_date" className="text-sm font-medium text-gray-700">
                                                Booking Start Date
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="booking_start_date"
                                                    type="date"
                                                    value={data.booking_start_date}
                                                    onChange={(e) => setData('booking_start_date', e.target.value)}
                                                    className="w-full pr-10"
                                                />
                                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                            {errors.booking_start_date && <p className="text-sm text-red-600">{errors.booking_start_date}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="booking_end_date" className="text-sm font-medium text-gray-700">
                                                Booking End Date
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="booking_end_date"
                                                    type="date"
                                                    value={data.booking_end_date}
                                                    onChange={(e) => setData('booking_end_date', e.target.value)}
                                                    className="w-full pr-10"
                                                />
                                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                            {errors.booking_end_date && <p className="text-sm text-red-600">{errors.booking_end_date}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Package Activities */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                        <h3 className="text-lg font-medium text-gray-900">Package Activities</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Select Activities
                                            </Label>
                                            <MultiSelect
                                                options={activityOptions}
                                                value={data.activities.map(id => id.toString())}
                                                onValueChange={handleActivityChange}
                                                placeholder="Select activities for this package"
                                                variant="inverted"
                                                maxCount={3}
                                            />
                                            <p className="text-sm text-gray-500">
                                                Choose activities that are included in this package. You can select multiple options.
                                            </p>
                                            {errors.activities && <p className="text-sm text-red-600">{errors.activities}</p>}
                                        </div>

                                        {data.activities.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Activities:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.activities.map((activityId, index) => {
                                                        const activity = activities.find(a => a.id === activityId);
                                                        return (
                                                            <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                                {activity ? `${activity.title} - $${activity.price}` : `Activity #${activityId}`}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newActivities = data.activities.filter(id => id !== activityId);
                                                                        setData('activities', newActivities);
                                                                    }}
                                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Media Upload Section */}
                                        <Separator className="my-6" />
                                        
                                        <div className="space-y-6">
                                            <h4 className="text-lg font-medium text-gray-900">Package Media</h4>
                                            
                                            {/* Image Upload */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-700">
                                                        Package Images
                                                    </Label>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                                            multiple
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                            id="image-upload"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => document.getElementById('image-upload')?.click()}
                                                            className="flex items-center gap-2"
                                                            disabled={data.images.length >= 10}
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            Upload Images
                                                        </Button>
                                                        <p className="text-sm text-gray-500">
                                                            {data.images.length}/10 images • Max 5MB each
                                                        </p>
                                                    </div>
                                                    {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
                                                </div>

                                                {/* Image Preview */}
                                                {imagePreview.length > 0 && (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {imagePreview.map((preview, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="w-full h-24 object-cover rounded-lg border"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
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

                            {/* Step 3: Flight & Hotel Details */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Flight & Hotel Information</h3>

                                    {/* Flight Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-medium text-gray-700">Flight Details (Optional)</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="flight_from" className="text-sm font-medium text-gray-700">
                                                    Flight From
                                                </Label>
                                                <Input
                                                    id="flight_from"
                                                    placeholder="e.g., New York (JFK)"
                                                    value={data.flight_from}
                                                    onChange={(e) => setData('flight_from', e.target.value)}
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
                                                    placeholder="e.g., Paris (CDG)"
                                                    value={data.flight_to}
                                                    onChange={(e) => setData('flight_to', e.target.value)}
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
                                                    placeholder="e.g., Air France"
                                                    value={data.airline_name}
                                                    onChange={(e) => setData('airline_name', e.target.value)}
                                                    className="w-full"
                                                />
                                                {errors.airline_name && <p className="text-sm text-red-600">{errors.airline_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="booking_class" className="text-sm font-medium text-gray-700">
                                                    Booking Class
                                                </Label>
                                                <Select value={data.booking_class} onValueChange={(value) => setData('booking_class', value)}>
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

                                    {/* Hotel Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-medium text-gray-700">Hotel Details (Optional)</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="hotel_name" className="text-sm font-medium text-gray-700">
                                                    Hotel Name
                                                </Label>
                                                <Input
                                                    id="hotel_name"
                                                    placeholder="e.g., Le Meurice"
                                                    value={data.hotel_name}
                                                    onChange={(e) => setData('hotel_name', e.target.value)}
                                                    className="w-full"
                                                />
                                                {errors.hotel_name && <p className="text-sm text-red-600">{errors.hotel_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hotel_star_rating" className="text-sm font-medium text-gray-700">
                                                    Star Rating
                                                </Label>
                                                <Select value={data.hotel_star_rating} onValueChange={(value) => setData('hotel_star_rating', value)}>
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
                                                    type="date"
                                                    value={data.hotel_checkin}
                                                    onChange={(e) => setData('hotel_checkin', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hotel_checkout" className="text-sm font-medium text-gray-700">
                                                    Hotel Check-out Date
                                                </Label>
                                                <Input
                                                    id="hotel_checkout"
                                                    type="date"
                                                    value={data.hotel_checkout}
                                                    onChange={(e) => setData('hotel_checkout', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Settings & Policies */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Settings & Policies</h3>

                                    {/* Package Settings */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-medium text-gray-700">Package Settings</h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Visibility Setting */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">Visibility</Label>
                                                <Select value={data.visibility} onValueChange={(value) => setData('visibility', value)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select visibility" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                                                        <SelectItem value="private">Private - Only visible to you</SelectItem>
                                                        <SelectItem value="agents_only">Agents Only - Visible to agents</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.visibility && <p className="text-sm text-red-600">{errors.visibility}</p>}
                                            </div>

                                            {/* Package Toggles */}
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="is_active"
                                                        checked={data.is_active}
                                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
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
                                                        onCheckedChange={(checked) => setData('is_featured', !!checked)}
                                                    />
                                                    <Label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                                                        Featured Package
                                                    </Label>
                                                </div>
                                                <p className="text-xs text-gray-500 ml-6">Display in featured packages section</p>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="is_refundable"
                                                        checked={data.is_refundable}
                                                        onCheckedChange={(checked) => setData('is_refundable', !!checked)}
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

                                    {/* Terms and Conditions */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-medium text-gray-700">Terms & Conditions</h4>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="terms_and_conditions" className="text-sm font-medium text-gray-700">
                                                Terms and Conditions
                                            </Label>
                                            <Textarea
                                                id="terms_and_conditions"
                                                placeholder="Enter terms and conditions for this package..."
                                                value={data.terms_and_conditions}
                                                onChange={(e) => setData('terms_and_conditions', e.target.value)}
                                                className="w-full min-h-[120px] resize-y"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Include important terms, conditions, and requirements for this package
                                            </p>
                                            {errors.terms_and_conditions && (
                                                <p className="text-sm text-red-600">{errors.terms_and_conditions}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Cancellation Policy */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-medium text-gray-700">Cancellation Policy</h4>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="cancellation_policy" className="text-sm font-medium text-gray-700">
                                                Cancellation Policy
                                            </Label>
                                            <Textarea
                                                id="cancellation_policy"
                                                placeholder="Enter cancellation policy for this package..."
                                                value={data.cancellation_policy}
                                                onChange={(e) => setData('cancellation_policy', e.target.value)}
                                                className="w-full min-h-[120px] resize-y"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Define cancellation terms, deadlines, and refund policies
                                            </p>
                                            {errors.cancellation_policy && (
                                                <p className="text-sm text-red-600">{errors.cancellation_policy}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Policy Templates (Optional Enhancement) */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <h5 className="text-sm font-medium text-blue-900 mb-1">Policy Guidelines</h5>
                                                <p className="text-sm text-blue-700">
                                                    Ensure your terms and cancellation policies are clear and comply with local regulations. 
                                                    Include details about booking changes, refund timelines, and any non-refundable fees.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    {currentStep > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            className="flex items-center space-x-2"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    {currentStep < 4 ? (
                                        <Button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex items-center space-x-2"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Creating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    <span>Create Package</span>
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
    );
}