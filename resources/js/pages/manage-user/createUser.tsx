// import AppLayout from '@/layouts/app-layout';
// import { useState } from "react"
// import {
//   ArrowLeft,
//   Save,
//   Building,
//   Mail,
//   Key,
//   Phone,
//   CreditCard,
//   Eye,
//   EyeOff,
//   Users,
//   Shield,
//   Crown,
//   MapPin,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Create User',
//         href: '/user/create',
//     },
// ];

// export default function CreateUser() {

//   const [showPassword, setShowPassword] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Define types for form data and errors
//   type FormData = {
//     businessName: string;
//     fullName: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//     phone: string;
//     cacRegNo: string;
//     role: string;
//     address: string;
//     notes: string;
//     is_active: boolean;
//     send_welcome_email: boolean;
//   };

//   type FormErrors = Partial<Record<keyof FormData, string>>;

//   // Removed permissions and department from form data
//   const [formData, setFormData] = useState<FormData>({
//     // Basic Information
//     businessName: "",
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     cacRegNo: "",

//     // Role
//     role: "",

//     // Additional Information
//     address: "",
//     notes: "",
//     is_active: true,
//     send_welcome_email: true,
//   })
//   const validateForm = () => {
//     const newErrors: FormErrors = {}

//     // Required fields validation
//     if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
//     if (!formData.email.trim()) newErrors.email = "Email address is required"
//     if (!formData.password) newErrors.password = "Password is required"
//     if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password"
//     if (!formData.role) newErrors.role = "Role is required"

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (formData.email && !emailRegex.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address"
//     }

//     // Password validation
//     if (formData.password && formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters"
//     }

//     // Password confirmation
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match"
//     }

//     // Phone validation (if provided)
//     if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
//       newErrors.phone = "Please enter a valid phone number"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }
//     // Password validation
//     if (formData.password && formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters"
//     }

//     // Password confirmation
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match"
//     }

//     // Phone validation (if provided)
//     if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
//       newErrors.phone = "Please enter a valid phone number"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       // Here you would typically make an API call to create the user
//       console.log("Creating user:", formData)

//       // Navigate back to user access page
//     //   navigate("/admin/user-access")
//     } catch (error) {
//       console.error("Error creating user:", error)
//     } finally {
//     //   setIsSubmitting(false)
//     }
//   }

//   const getRoleIcon = (role) => {
//     const icons = {
//       admin: Crown,
//       manager: Shield,
//       user: Users,
//       viewer: Eye,
//     }
//     return icons[role] || Users
//   }

//   const getRoleColor = (role) => {
//     const colors = {
//       admin: "bg-red-100 text-red-800",
//       manager: "bg-blue-100 text-blue-800",
//       user: "bg-green-100 text-green-800",
//       viewer: "bg-gray-100 text-gray-800",
//     }
//     return colors[role] || "bg-gray-100 text-gray-800";
//   }
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
//                 {/* Header */}
//                 <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//                     <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => navigate("/admin/user-access")}
//                         className="flex items-center space-x-2 w-fit"
//                     >
//                         <ArrowLeft className="w-4 h-4" />
//                         <span>Back to Users</span>
//                     </Button>
//                     <div>
//                         <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create New User</h1>
//                         <p className="text-sm text-gray-600 mt-1">Add a new user to the system with appropriate role</p>
//                     </div>
//                     </div>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//                     {/* Basic Information Card */}
//                     <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center space-x-2">
//                         <Building className="w-5 h-5" />
//                         <span>Basic Information</span>
//                         </CardTitle>
//                         <CardDescription>Enter the user's basic contact and business information</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Business Name */}
//                         <div>
//                             <Label htmlFor="businessName">Business Name</Label>
//                             <div className="relative">
//                             <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 id="businessName"
//                                 value={formData.businessName}
//                                 onChange={(e) => handleInputChange("businessName", e.target.value)}
//                                 placeholder="Enter business name"
//                                 className="pl-10"
//                             />
//                             </div>
//                         </div>

//                         {/* Full Name */}
//                         <div>
//                             <Label htmlFor="fullName">Full Name *</Label>
//                             <div className="relative">
//                             <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 id="fullName"
//                                 value={formData.fullName}
//                                 onChange={(e) => handleInputChange("fullName", e.target.value)}
//                                 placeholder="Enter full name"
//                                 className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
//                             />
//                             </div>
//                             {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
//                         </div>

//                         {/* Email Address */}
//                         <div>
//                             <Label htmlFor="email">Email Address *</Label>
//                             <div className="relative">
//                             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 value={formData.email}
//                                 onChange={(e) => handleInputChange("email", e.target.value)}
//                                 placeholder="Enter email address"
//                                 className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
//                             />
//                             </div>
//                             {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
//                         </div>

//                         {/* Phone */}
//                         <div>
//                             <Label htmlFor="phone">Phone (Optional)</Label>
//                             <div className="relative">
//                             <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 id="phone"
//                                 value={formData.phone}
//                                 onChange={(e) => handleInputChange("phone", e.target.value)}
//                                 placeholder="Enter phone number"
//                                 className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
//                             />
//                             </div>
//                             {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
//                         </div>
//                         </div>

//                         {/* CAC Registration Number */}
//                         <div>
//                         <Label htmlFor="cacRegNo">CAC Reg. No</Label>
//                         <div className="relative">
//                             <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                             id="cacRegNo"
//                             value={formData.cacRegNo}
//                             onChange={(e) => handleInputChange("cacRegNo", e.target.value)}
//                             placeholder="Enter CAC registration number"
//                             className="pl-10"
//                             />
//                         </div>
//                         </div>
//                     </CardContent>
//                     </Card>

//                     {/* Security Information Card */}
//                     <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center space-x-2">
//                         <Key className="w-5 h-5" />
//                         <span>Security Information</span>
//                         </CardTitle>
//                         <CardDescription>Set up login credentials for the user</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Password */}
//                         <div>
//                             <Label htmlFor="password">Password *</Label>
//                             <div className="relative">
//                             <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 id="password"
//                                 type={showPassword ? "text" : "password"}
//                                 value={formData.password}
//                                 onChange={(e) => handleInputChange("password", e.target.value)}
//                                 placeholder="Enter password"
//                                 className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                             >
//                                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                             </button>
//                             </div>
//                             {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
//                         </div>

//                         {/* Confirm Password */}
//                         <div>
//                             <Label htmlFor="confirmPassword">Confirm Password *</Label>
//                             <div className="relative">
//                             <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 id="confirmPassword"
//                                 type={showPassword ? "text" : "password"}
//                                 value={formData.confirmPassword}
//                                 onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//                                 placeholder="Confirm password"
//                                 className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
//                             />
//                             </div>
//                             {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
//                         </div>
//                         </div>
//                     </CardContent>
//                     </Card>

//                     {/* Role Card (removed permissions and department) */}
//                     <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center space-x-2">
//                         <Shield className="w-5 h-5" />
//                         <span>User Role</span>
//                         </CardTitle>
//                         <CardDescription>Define the user's role and access level</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {/* Role */}
//                         <div>
//                         <Label htmlFor="role">Role *</Label>
//                         <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
//                             <SelectTrigger className={errors.role ? "border-red-500" : ""}>
//                             <SelectValue placeholder="Select role" />
//                             </SelectTrigger>
//                             <SelectContent>
//                             <SelectItem value="admin">
//                                 <div className="flex items-center space-x-2">
//                                 <Crown className="w-4 h-4 text-red-600" />
//                                 <span>Admin</span>
//                                 </div>
//                             </SelectItem>
//                             <SelectItem value="manager">
//                                 <div className="flex items-center space-x-2">
//                                 <Shield className="w-4 h-4 text-blue-600" />
//                                 <span>Manager</span>
//                                 </div>
//                             </SelectItem>
//                             <SelectItem value="user">
//                                 <div className="flex items-center space-x-2">
//                                 <Users className="w-4 h-4 text-green-600" />
//                                 <span>User</span>
//                                 </div>
//                             </SelectItem>
//                             <SelectItem value="viewer">
//                                 <div className="flex items-center space-x-2">
//                                 <Eye className="w-4 h-4 text-gray-600" />
//                                 <span>Viewer</span>
//                                 </div>
//                             </SelectItem>
//                             </SelectContent>
//                         </Select>
//                         {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
//                         </div>

//                         {/* Role Preview */}
//                         {formData.role && (
//                         <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                             <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
//                             <span className="text-sm font-medium text-gray-700">Selected Role:</span>
//                             <Badge variant="secondary" className={getRoleColor(formData.role)}>
//                                 {React.createElement(getRoleIcon(formData.role), { className: "w-3 h-3 mr-1" })}
//                                 {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
//                             </Badge>
//                             </div>
//                             <div className="mt-2 text-xs text-gray-500">
//                             {formData.role === "admin" && "Full system access with all administrative privileges"}
//                             {formData.role === "manager" && "Management access with team oversight capabilities"}
//                             {formData.role === "user" && "Standard user access with basic functionality"}
//                             {formData.role === "viewer" && "Read-only access to view information"}
//                             </div>
//                         </div>
//                         )}
//                     </CardContent>
//                     </Card>

//                     {/* Additional Information Card */}
//                     <Card>
//                     <CardHeader>
//                         <CardTitle>Additional Information</CardTitle>
//                         <CardDescription>Optional additional details and settings</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {/* Address */}
//                         <div>
//                         <Label htmlFor="address">Address</Label>
//                         <div className="relative">
//                             <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
//                             <Textarea
//                             id="address"
//                             value={formData.address}
//                             onChange={(e) => handleInputChange("address", e.target.value)}
//                             placeholder="Enter complete address"
//                             className="pl-10"
//                             rows={3}
//                             />
//                         </div>
//                         </div>

//                         {/* Notes */}
//                         <div>
//                         <Label htmlFor="notes">Notes</Label>
//                         <Textarea
//                             id="notes"
//                             value={formData.notes}
//                             onChange={(e) => handleInputChange("notes", e.target.value)}
//                             placeholder="Additional notes about the user"
//                             rows={3}
//                         />
//                         </div>

//                         <Separator />

//                         {/* Settings */}
//                         <div className="space-y-4">
//                         <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//                             <div className="space-y-0.5">
//                             <Label>Active User</Label>
//                             <p className="text-sm text-gray-500">User can log in and access the system</p>
//                             </div>
//                             <Switch
//                             checked={formData.is_active}
//                             onCheckedChange={(checked) => handleInputChange("is_active", checked)}
//                             />
//                         </div>

//                         <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//                             <div className="space-y-0.5">
//                             <Label>Send Welcome Email</Label>
//                             <p className="text-sm text-gray-500">Send login credentials via email</p>
//                             </div>
//                             <Switch
//                             checked={formData.send_welcome_email}
//                             onCheckedChange={(checked) => handleInputChange("send_welcome_email", checked)}
//                             />
//                         </div>
//                         </div>
//                     </CardContent>
//                     </Card>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => navigate("/admin/user-access")}
//                         disabled={isSubmitting}
//                         className="w-full sm:w-auto"
//                     >
//                         Cancel
//                     </Button>
//                     <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
//                         {isSubmitting ? (
//                         <>
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                             Creating User...
//                         </>
//                         ) : (
//                         <>
//                             <Save className="w-4 h-4 mr-2" />
//                             Create User
//                         </>
//                         )}
//                     </Button>
//                     </div>
//                 </form>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }


import React from "react";
import AppLayout from '@/layouts/app-layout';
import { useState } from "react";
import {
    ArrowLeft,
    Save,
    Building,
    Mail,
    Key,
    Phone,
    CreditCard,
    Eye,
    EyeOff,
    Users,
    Shield,
    Crown,
    MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react'; // Import useForm and router

// Define types for form data (matching your Laravel backend expected fields)
type FormData = {
    business_name: string; // Use snake_case if your Laravel backend expects it
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string; // Typically 'password_confirmation' for Laravel
    phone: string;
    cac_reg_no: string; // Snake_case
    role: string;
    address: string;
    notes: string;
    is_active: boolean;
    send_welcome_email: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create User',
        href: route('user.create'), 
    },
];

export default function CreateUser() {
    const [showPassword, setShowPassword] = useState(false);

    // Use Inertia's useForm hook
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        // Initialize with default values
        business_name: "",
        full_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        cac_reg_no: "",
        role: "",
        address: "",
        notes: "",
        is_active: true,
        send_welcome_email: true,
    });

    // Handle input changes, including select and switch components
    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setData(field, value as any); // Use 'as any' for now, or refine types
    };

    const handleSubmit = (e: React.FormEvent) => { // Type for form event
        e.preventDefault();

        // When using useForm, client-side validation is often done before post()
        // If you want robust client-side validation, uncomment and adapt validateForm below.
        // Inertia also handles server-side validation errors automatically.

        post(route('user.store'), { // Assuming you have a 'user.store' route for POST
            onSuccess: () => {
                reset(); // Clear form on success
                // Optionally navigate after successful submission if needed
                router.visit(route('user.index')); // Example: navigate to user listing page
            },
            onError: (formErrors) => {
                // Inertia automatically populates the `errors` object,
                // so you don't need a separate `setErrors` state.
                console.error("Validation errors:", formErrors);
            },
            onFinish: () => {
                // Any logic to run after submission finishes (success or error)
                // setIsSubmitting(false) is handled by `processing` state from useForm
            }
        });
    };

    // --- Optional: Client-Side Validation with useForm ---
    // If you need immediate feedback before the server roundtrip, keep this.
    // Otherwise, you can rely solely on server-side validation with Inertia.
    // Remember to call `validateForm()` before `post()` if you keep it.
    
    const validateForm = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!data.full_name.trim()) newErrors.full_name = "Full name is required";
        if (!data.email.trim()) newErrors.email = "Email address is required";
        if (!data.password) newErrors.password = "Password is required";
        if (!data.password_confirmation) newErrors.password_confirmation = "Please confirm password";
        if (!data.role) newErrors.role = "Role is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (data.password && data.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
        }

        if (data.phone && !/^[+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Please enter a valid phone number";
        }

        // Set the errors directly using setData, as useForm manages its own errors
        // You can update `errors` with client-side errors, then Inertia will merge/overwrite with server errors
        // However, a simpler approach is to let Inertia handle server errors and show them directly.
        // For client-side, you might just prevent submission if validation fails here.
        // For this example, we'll assume server-side validation is primary.

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };
    

    const getRoleIcon = (role: string) => {
        const icons = {
            admin: Crown,
            manager: Shield,
            user: Users,
            viewer: Eye,
        };
        return icons[role as keyof typeof icons] || Users; // Type assertion for safety
    };

    const getRoleColor = (role: string) => { // Type for role
        const colors = {
            admin: "bg-red-100 text-red-800",
            manager: "bg-blue-100 text-blue-800",
            user: "bg-green-100 text-green-800",
            viewer: "bg-gray-100 text-gray-800",
        };
        return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" /> {/* Corrected title */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                // Use router.visit or Link for navigation
                                onClick={() => router.visit(route('user.index'))} // Assuming 'user.index' exists for user listing
                                className="flex items-center space-x-2 w-fit"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Users</span>
                            </Button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create New User</h1>
                                <p className="text-sm text-gray-600 mt-1">Add a new user to the system with appropriate role</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Basic Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Building className="w-5 h-5" />
                                    <span>Basic Information</span>
                                </CardTitle>
                                <CardDescription>Enter the user's basic contact and business information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Business Name */}
                                    <div>
                                        <Label htmlFor="businessName">Business Name</Label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="businessName"
                                                value={data.business_name} // Use data from useForm
                                                onChange={(e) => handleInputChange("business_name", e.target.value)}
                                                placeholder="Enter business name"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <Label htmlFor="fullName">Full Name *</Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="fullName"
                                                value={data.full_name} // Use data from useForm
                                                onChange={(e) => handleInputChange("full_name", e.target.value)}
                                                placeholder="Enter full name"
                                                className={`pl-10 ${errors.full_name ? "border-red-500" : ""}`}
                                            />
                                        </div>
                                        {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>}
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <Label htmlFor="email">Email Address *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email} // Use data from useForm
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                placeholder="Enter email address"
                                                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                            />
                                        </div>
                                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <Label htmlFor="phone">Phone (Optional)</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="phone"
                                                value={data.phone} // Use data from useForm
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                placeholder="Enter phone number"
                                                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* CAC Registration Number */}
                                <div>
                                    <Label htmlFor="cacRegNo">CAC Reg. No</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="cacRegNo"
                                            value={data.cac_reg_no} // Use data from useForm
                                            onChange={(e) => handleInputChange("cac_reg_no", e.target.value)}
                                            placeholder="Enter CAC registration number"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Key className="w-5 h-5" />
                                    <span>Security Information</span>
                                </CardTitle>
                                <CardDescription>Set up login credentials for the user</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Password */}
                                    <div>
                                        <Label htmlFor="password">Password *</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={data.password} // Use data from useForm
                                                onChange={(e) => handleInputChange("password", e.target.value)}
                                                placeholder="Enter password"
                                                className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={data.password_confirmation} 
                                                onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                                                placeholder="Confirm password"
                                                className={`pl-10 ${errors.password_confirmation ? "border-red-500" : ""}`}
                                            />
                                        </div>
                                        {errors.password_confirmation && <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Role Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5" />
                                    <span>User Role</span>
                                </CardTitle>
                                <CardDescription>Define the user's role and access level</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Role */}
                                <div>
                                    <Label htmlFor="role">Role *</Label>
                                    <Select value={data.role} onValueChange={(value) => handleInputChange("role", value)}>
                                        <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                <div className="flex items-center space-x-2">
                                                    <Crown className="w-4 h-4 text-red-600" />
                                                    <span>Admin</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="manager">
                                                <div className="flex items-center space-x-2">
                                                    <Shield className="w-4 h-4 text-blue-600" />
                                                    <span>Manager</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="user">
                                                <div className="flex items-center space-x-2">
                                                    <Users className="w-4 h-4 text-green-600" />
                                                    <span>User</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="viewer">
                                                <div className="flex items-center space-x-2">
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                    <span>Viewer</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
                                </div>

                                {/* Role Preview */}
                                {/* {data.role && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                                            <span className="text-sm font-medium text-gray-700">Selected Role:</span>
                                            <Badge variant="secondary" className={getRoleColor(data.role)}>
                                                {React.createElement(getRoleIcon(data.role), { className: "w-3 h-3 mr-1" })}
                                                {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {data.role === "admin" && "Full system access with all administrative privileges"}
                                            {data.role === "manager" && "Management access with team oversight capabilities"}
                                            {data.role === "user" && "Standard user access with basic functionality"}
                                            {data.role === "viewer" && "Read-only access to view information"}
                                        </div>
                                    </div>
                                )} */}
                            </CardContent>
                        </Card>

                        {/* Additional Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                                <CardDescription>Optional additional details and settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Address */}
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                        <Textarea
                                            id="address"
                                            value={data.address} // Use data from useForm
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                            placeholder="Enter complete address"
                                            className="pl-10"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes} // Use data from useForm
                                        onChange={(e) => handleInputChange("notes", e.target.value)}
                                        placeholder="Additional notes about the user"
                                        rows={3}
                                    />
                                </div>

                                <Separator />

                                {/* Settings */}
                                {/* <div className="space-y-4">
                                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                        <div className="space-y-0.5">
                                            <Label>Active User</Label>
                                            <p className="text-sm text-gray-500">User can log in and access the system</p>
                                        </div>
                                        <Switch
                                            checked={data.is_active} // Use data from useForm
                                            onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                        <div className="space-y-0.5">
                                            <Label>Send Welcome Email</Label>
                                            <p className="text-sm text-gray-500">Send login credentials via email</p>
                                        </div>
                                        <Switch
                                            checked={data.send_welcome_email} 
                                            onCheckedChange={(checked) => handleInputChange("send_welcome_email", checked)}
                                        />
                                    </div>
                                </div> */}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        {/* <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(route('user.index'))} t
                                disabled={processing} 
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                {processing ? ( 
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Creating User...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Create User
                                    </>
                                )}
                            </Button>
                        </div> */}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
