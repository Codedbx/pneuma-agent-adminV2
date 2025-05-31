import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useState } from "react"
import { ChevronUp, ChevronDown, MapPin, Shield, Upload, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Package',
        href: '/package/create',
    },
];

export default function CreatePackage() {
    const [isExpanded, setIsExpanded] = useState(true)
  type Activity = { id: number; title: string; description: string; price: string };
  const [activities, setActivities] = useState<Activity[]>([])
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({ title: "", description: "", price: "" })
  const [isAddingActivity, setIsAddingActivity] = useState(false)

  const addActivity = () => {
    if (newActivity.title && newActivity.description && newActivity.price) {
      setActivities([...activities, { ...newActivity, id: Date.now() }])
      setNewActivity({ title: "", description: "", price: "" })
      setIsAddingActivity(false)
    }
  }

  const removeActivity = (id : number) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Packages" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                

 
            <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 border-b cursor-pointer rounded-t-lg"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-lg sm:text-xl font-medium text-gray-900">Travel Package Builder</h2>
                {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
            </div>

            {/* Form Content */}
            {isExpanded && (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Package Title and Description */}
                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Package Title *
                    </Label>
                    <Input
                        id="title"
                        placeholder="e.g., Luxury Paris Getaway"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                    />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description *
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="e.g., 5-day luxury package with Eiffel Tower access and river cruise"
                        className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none"
                    />
                    </div>
                </div>

                {/* Base Price and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="base-price" className="text-sm font-medium text-gray-700">
                        Base Price ($) *
                    </Label>
                    <Input
                        id="base-price"
                        placeholder="e.g., 2999.99"
                        type="number"
                        step="0.01"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                        required
                    />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Location *
                    </Label>
                    <div className="relative">
                        <Input
                        id="location"
                        placeholder="e.g., Paris, France"
                        className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-md bg-gray-50"
                        required
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    </div>
                </div>

                {/* Agent Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="agent-addon-price" className="text-sm font-medium text-gray-700">
                        Agent Addon Price ($) *
                    </Label>
                    <Input
                        id="agent-addon-price"
                        placeholder="e.g., 299.99"
                        type="number"
                        step="0.01"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                        required
                    />
                    </div>

                    <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Agent Price Type *</Label>
                    <Select defaultValue="">
                        <SelectTrigger className="w-full h-10 bg-gray-50">
                        <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* Check-in/out Times */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="check-in-time" className="text-sm font-medium text-gray-700">
                        Check-in Time *
                    </Label>
                    <Input
                        id="check-in-time"
                        type="time"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                        required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="check-out-time" className="text-sm font-medium text-gray-700">
                        Check-out Time *
                    </Label>
                    <Input
                        id="check-out-time"
                        type="time"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                        required
                    />
                    </div>
                </div>

                {/* Package Settings */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Package Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="is-active" />
                        <Label htmlFor="is-active" className="text-sm text-gray-600">
                        Active Package
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="is-featured" />
                        <Label htmlFor="is-featured" className="text-sm text-gray-600">
                        Featured Package
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="is-refundable" />
                        <Label htmlFor="is-refundable" className="text-sm text-gray-600">
                        Refundable
                        </Label>
                    </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Visibility</Label>
                        <Select defaultValue="public">
                        <SelectTrigger className="w-full h-10 bg-gray-50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    </div>
                </div>

                {/* Terms and Policies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="terms" className="text-sm font-medium text-gray-700">
                        Terms and Conditions
                    </Label>
                    <Textarea
                        id="terms"
                        placeholder="e.g., Non-refundable after 30 days prior to check-in"
                        className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none"
                    />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="cancellation" className="text-sm font-medium text-gray-700">
                        Cancellation Policy
                    </Label>
                    <Textarea
                        id="cancellation"
                        placeholder="e.g., Full refund if cancelled 45 days before arrival"
                        className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none"
                    />
                    </div>
                </div>

                {/* Activities Section */}
                <div className="space-y-4">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <h3 className="text-sm font-medium text-gray-700">Package Activities</h3>
                    <Button
                        onClick={() => setIsAddingActivity(true)}
                        size="sm"
                        className="flex items-center gap-2 h-8 px-3 text-xs bg-blue-600 text-white hover:bg-blue-700 w-fit"
                    >
                        <Plus className="w-3 h-3" />
                        Add Activity
                    </Button>
                    </div>

                    {/* Existing Activities */}
                    {activities.map((activity) => (
                    <div key={activity.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-sm font-medium text-green-600 mt-2">${activity.price}</p>
                        </div>
                        <Button
                            onClick={() => removeActivity(activity.id)}
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 self-start sm:ml-2"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                        </div>
                    </div>
                    ))}

                    {/* Add New Activity Form */}
                    {isAddingActivity && (
                    <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
                        <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                            placeholder="Activity title (e.g., Swimming)"
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                            className="bg-white"
                            />
                            <Input
                            placeholder="Price (e.g., 600.00)"
                            type="number"
                            step="0.01"
                            value={newActivity.price}
                            onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                            className="bg-white"
                            />
                        </div>
                        <Textarea
                            placeholder="Activity description (e.g., going swimming at the beach)"
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            className="bg-white resize-none"
                            rows={2}
                        />
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <Button
                            onClick={addActivity}
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                            >
                            Add Activity
                            </Button>
                            <Button
                            onClick={() => {
                                setIsAddingActivity(false)
                                setNewActivity({ title: "", description: "", price: "" })
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            >
                            Cancel
                            </Button>
                        </div>
                        </div>
                    </div>
                    )}
                </div>

                {/* Bottom Options */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pt-4 border-t border-gray-200">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 h-8 px-3 text-xs bg-gray-900 text-white border-gray-900 hover:bg-gray-800 w-fit"
                    >
                        <Upload className="w-3 h-3" />
                        Upload Media
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span>Owner ID: Auto-assigned</span>
                    </div>
                    </div>

                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-4 text-sm border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className="h-8 px-4 text-sm bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
                    >
                        Create Package
                    </Button>
                    </div>
                </div>
                </div>
            )}
            </div>
 
            </div>
        </AppLayout>
    );
}
