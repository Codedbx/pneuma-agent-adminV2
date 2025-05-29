"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Eye, MapPin, Calendar, DollarSign, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const PackagesTable = () => {
  const [packages, setPackages] = useState([
    {
      id: 2,
      title: "Hello",
      description: "This is a title",
      base_price: "2999.00",
      check_in_time: "2025-05-25T14:57:29.000000Z",
      check_out_time: "2025-05-25T14:57:29.000000Z",
      booking_start_date: "2025-05-25T14:57:29.000000Z",
      booking_end_date: "2025-05-25T14:57:29.000000Z",
      is_active: true,
      is_featured: false,
      is_refundable: true,
      terms_and_conditions: "fafjdkf ajfkhj",
      cancellation_policy: "cancel",
      location: "nigeria",
      owner_id: 1,
      visibility: "public",
      activities_count: 0,
      media: [],
      activities: [],
    },
    {
      id: 3,
      title: "Luxury Paris Getaway",
      description: "5-day luxury package with Eiffel Tower access and river cruise",
      base_price: "2999.99",
      check_in_time: "2025-06-01T14:00:00.000000Z",
      check_out_time: "2025-06-06T11:00:00.000000Z",
      booking_start_date: "2025-05-25T00:00:00.000000Z",
      booking_end_date: "2025-05-30T23:59:59.000000Z",
      is_active: true,
      is_featured: true,
      is_refundable: true,
      terms_and_conditions: "Non-refundable after 30 days prior to check-in",
      cancellation_policy: "Full refund if cancelled 45 days before arrival",
      location: "Paris, France",
      owner_id: 1,
      visibility: "public",
      activities_count: 2,
      media: [],
      activities: [
        {
          id: 2,
          title: "Swimming",
          description: "going swimming at the beach",
          price: "600.00",
          time_slots: [
            {
              id: 1,
              starts_at: "2025-05-25T17:34:32.000000Z",
              ends_at: "2025-05-25T17:34:32.000000Z",
            },
            {
              id: 2,
              starts_at: "2025-05-28T16:34:59.000000Z",
              ends_at: "2025-05-31T16:34:59.000000Z",
            },
          ],
        },
        {
          id: 1,
          title: "hiking",
          description: "on the mountiains",
          price: "500.00",
          time_slots: [
            {
              id: 3,
              starts_at: "2025-05-28T16:36:10.000000Z",
              ends_at: "2025-05-31T16:36:10.000000Z",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: "Alaskan Adventure Package",
      description: "10-day wildlife tour with glacier hikes and whale watching",
      base_price: "1899.95",
      check_in_time: "2025-08-10T12:00:00.000000Z",
      check_out_time: "2025-08-20T10:00:00.000000Z",
      booking_start_date: "2025-07-01T00:00:00.000000Z",
      booking_end_date: "2025-07-31T23:59:59.000000Z",
      is_active: true,
      is_featured: true,
      is_refundable: false,
      terms_and_conditions: "Weather-dependent activities",
      cancellation_policy: "No refunds for weather cancellations",
      location: "Anchorage, Alaska",
      owner_id: 1,
      visibility: "public",
      activities_count: 2,
      media: [],
      activities: [
        {
          id: 1,
          title: "hiking",
          description: "on the mountiains",
          price: "500.00",
          time_slots: [
            {
              id: 3,
              starts_at: "2025-05-28T16:36:10.000000Z",
              ends_at: "2025-05-31T16:36:10.000000Z",
            },
          ],
        },
        {
          id: 2,
          title: "Swimming",
          description: "going swimming at the beach",
          price: "600.00",
          time_slots: [
            {
              id: 1,
              starts_at: "2025-05-25T17:34:32.000000Z",
              ends_at: "2025-05-25T17:34:32.000000Z",
            },
            {
              id: 2,
              starts_at: "2025-05-28T16:34:59.000000Z",
              ends_at: "2025-05-31T16:34:59.000000Z",
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: "Tokyo City Experience",
      description: "4-day cultural immersion with sushi class and temple tours",
      base_price: "1299.50",
      check_in_time: "2025-09-01T16:00:00.000000Z",
      check_out_time: "2025-09-05T11:00:00.000000Z",
      booking_start_date: "2025-08-01T00:00:00.000000Z",
      booking_end_date: "2025-08-25T23:59:59.000000Z",
      is_active: true,
      is_featured: true,
      is_refundable: true,
      terms_and_conditions: "Valid passport required",
      cancellation_policy: "Free date changes up to 7 days before",
      location: "Tokyo, Japan",
      owner_id: 1,
      visibility: "public",
      activities_count: 0,
      media: [],
      activities: [],
    },
  ])

  // Single dialog state approach
  const [dialogState, setDialogState] = useState({
    type: null, // 'view', 'edit', 'delete'
    isOpen: false,
    package: null,
    formData: {},
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPrice = (price) => {
    return `$${Number.parseFloat(price).toLocaleString()}`
  }

  const openDialog = (type, pkg) => {
    const formData =
      type === "edit"
        ? {
            title: pkg.title,
            description: pkg.description,
            base_price: pkg.base_price,
            location: pkg.location,
            is_active: pkg.is_active,
            is_featured: pkg.is_featured,
            is_refundable: pkg.is_refundable,
            terms_and_conditions: pkg.terms_and_conditions,
            cancellation_policy: pkg.cancellation_policy,
          }
        : {}

    setDialogState({
      type,
      isOpen: true,
      package: pkg,
      formData,
    })
  }

  const closeDialog = () => {
    setDialogState({
      type: null,
      isOpen: false,
      package: null,
      formData: {},
    })
  }

  const handleEdit = (pkg) => {
    openDialog("edit", pkg)
  }

  const handleDelete = (pkg) => {
    openDialog("delete", pkg)
  }

  const handleView = (pkg) => {
    openDialog("view", pkg)
  }

  const confirmDelete = () => {
    setPackages(packages.filter((pkg) => pkg.id !== dialogState.package.id))
    closeDialog()
  }

  const saveEdit = () => {
    setPackages(packages.map((pkg) => (pkg.id === dialogState.package.id ? { ...pkg, ...dialogState.formData } : pkg)))
    closeDialog()
  }

  const handleInputChange = (field, value) => {
    setDialogState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{pkg.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{pkg.description}</div>
                    <div className="flex gap-1">
                      {pkg.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {pkg.is_refundable && (
                        <Badge variant="outline" className="text-xs">
                          Refundable
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatPrice(pkg.base_price)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pkg.activities_count} activities</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={pkg.is_active ? "default" : "secondary"}>
                    {pkg.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(pkg.check_in_time)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(pkg)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(pkg)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Package
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(pkg)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Package
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Single Dialog Component */}
      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className={dialogState.type === "edit" ? "max-w-2xl" : "max-w-lg"}>
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === "view" && dialogState.package?.title}
              {dialogState.type === "edit" && "Edit Package"}
              {dialogState.type === "delete" && "Delete Package"}
            </DialogTitle>
            <DialogDescription>
              {dialogState.type === "view" && "Package details and information"}
              {dialogState.type === "edit" && "Make changes to the package information"}
              {dialogState.type === "delete" &&
                `Are you sure you want to delete "${dialogState.package?.title}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {/* View Content */}
          {dialogState.type === "view" && dialogState.package && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{dialogState.package.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Base Price</Label>
                  <p className="text-sm text-muted-foreground">{formatPrice(dialogState.package.base_price)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Check-in</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(dialogState.package.check_in_time)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Check-out</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(dialogState.package.check_out_time)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{dialogState.package.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Terms & Conditions</Label>
                <p className="text-sm text-muted-foreground">{dialogState.package.terms_and_conditions}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Cancellation Policy</Label>
                <p className="text-sm text-muted-foreground">{dialogState.package.cancellation_policy}</p>
              </div>
              {dialogState.package.activities && dialogState.package.activities.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Activities</Label>
                  <div className="space-y-2 mt-2">
                    {dialogState.package.activities.map((activity) => (
                      <div key={activity.id} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <Badge variant="outline">{formatPrice(activity.price)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Content */}
          {dialogState.type === "edit" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={dialogState.formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={dialogState.formData.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={dialogState.formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="base_price">Base Price</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={dialogState.formData.base_price || ""}
                  onChange={(e) => handleInputChange("base_price", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={dialogState.formData.is_active || false}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={dialogState.formData.is_featured || false}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_refundable"
                    checked={dialogState.formData.is_refundable || false}
                    onCheckedChange={(checked) => handleInputChange("is_refundable", checked)}
                  />
                  <Label htmlFor="is_refundable">Refundable</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="terms_and_conditions">Terms & Conditions</Label>
                <Textarea
                  id="terms_and_conditions"
                  value={dialogState.formData.terms_and_conditions || ""}
                  onChange={(e) => handleInputChange("terms_and_conditions", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                <Textarea
                  id="cancellation_policy"
                  value={dialogState.formData.cancellation_policy || ""}
                  onChange={(e) => handleInputChange("cancellation_policy", e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {dialogState.type === "view" && <Button onClick={closeDialog}>Close</Button>}
            {dialogState.type === "edit" && (
              <>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save Changes</Button>
              </>
            )}
            {dialogState.type === "delete" && (
              <>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete Package
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PackagesTable
