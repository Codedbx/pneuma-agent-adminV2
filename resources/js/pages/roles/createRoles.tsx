// import AppLayout from "@/layouts/app-layout";
// import type { BreadcrumbItem } from "@/types";

// import { Head, useForm, usePage } from "@inertiajs/react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import {
//   CheckCircle2,
//   Circle,
//   Users,
//   Shield,
//   Save,
//   Plus,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Permission {
//   id: number;
//   name: string;
//   description: string;
//   category: string;
// }

// type PageProps = {
//   permissions: Record<string, Permission[]>;
//   [key: string]: unknown;
// };

// export default function CreateRole() {
//   const { permissions } = usePage<PageProps>().props;

//   const breadcrumbs: BreadcrumbItem[] = [
//     {
//       title: "Create Role",
//       href: "/roles/create",
//     },
//   ];

//   const { data, setData, post, processing, errors, reset } = useForm({
//     name: "",
//     guard_name: "web",
//     permissions: [] as string[],
//   });

//   const togglePermission = (perm: string) => {
//     if (data.permissions.includes(perm)) {
//       setData(
//         "permissions",
//         data.permissions.filter((p) => p !== perm)
//       );
//     } else {
//       setData("permissions", [...data.permissions, perm]);
//     }
//   };

//   const toggleCategory = (perms: string[]) => {
//     const allSelected = perms.every((p) =>
//       data.permissions.includes(p)
//     );
//     if (allSelected) {
//       setData(
//         "permissions",
//         data.permissions.filter((p) => !perms.includes(p))
//       );
//     } else {
//       setData(
//         "permissions",
//         [...new Set([...data.permissions, ...perms])]
//       );
//     }
//   };

//   const getCategoryStats = (perms: Permission[]) => {
//     const selected = perms.filter((p) =>
//       data.permissions.includes(p.name)
//     ).length;
//     const total = perms.length;
//     return { selected, total };
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     post(route("roles.store"), {
//       preserveScroll: true,
//       onSuccess: () => reset(),
//     });
//   };

//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="Create Role" />
//       <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
//         <div className="max-w-5xl mx-auto w-full space-y-6">
//           {/* Header */}
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Plus className="h-6 w-6 text-primary" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">
//                 Create New Role
//               </h1>
//               <p className="text-muted-foreground">
//                 Define a new role and assign permissions
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Role Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Users className="h-5 w-5" />
//                   Role Information
//                 </CardTitle>
//                 <CardDescription>
//                   Basic information about the role
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Role Name</Label>
//                     <Input
//                       id="name"
//                       placeholder="Enter role name"
//                       value={data.name}
//                       onChange={(e) => setData("name", e.target.value)}
//                       className={cn(
//                         errors.name && "border-destructive focus-visible:ring-destructive"
//                       )}
//                     />
//                     {errors.name && (
//                       <p className="text-sm text-destructive">
//                         {errors.name}
//                       </p>
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="guard_name">Guard</Label>
//                     <select
//                       id="guard_name"
//                       value={data.guard_name}
//                       onChange={(e) =>
//                         setData("guard_name", e.target.value)
//                       }
//                       className={cn(
//                         "block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
//                         errors.guard_name &&
//                           "border-destructive focus:ring-destructive"
//                       )}
//                     >
//                       <option value="web">Web</option>
//                     </select>
//                     {errors.guard_name && (
//                       <p className="text-sm text-destructive">
//                         {errors.guard_name}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Permissions */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Shield className="h-5 w-5" />
//                   Permissions
//                 </CardTitle>
//                 <CardDescription>
//                   Select permissions for this role. Click on badges to toggle permissions.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {Object.entries(permissions).map(
//                   ([category, perms]) => {
//                     const stats = getCategoryStats(perms);
//                     const allSelected = stats.selected === stats.total;

//                     return (
//                       <div key={category} className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <h3 className="text-lg font-semibold capitalize">
//                               {category.replace("_", " ")}
//                             </h3>
//                             <Badge variant="secondary" className="text-xs">
//                               {stats.selected}/{stats.total}
//                             </Badge>
//                           </div>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               toggleCategory(perms.map((p) => p.name))
//                             }
//                             className="flex items-center gap-2"
//                           >
//                             {allSelected ? (
//                               <CheckCircle2 className="h-4 w-4" />
//                             ) : (
//                               <Circle className="h-4 w-4" />
//                             )}
//                             {allSelected ? "Deselect All" : "Select All"}
//                           </Button>
//                         </div>

//                         <div className="flex flex-wrap gap-2">
//                           {perms.map((perm) => {
//                             const isSelected = data.permissions.includes(
//                               perm.name
//                             );
//                             return (
//                               <Badge
//                                 key={perm.name}
//                                 variant={
//                                   isSelected ? "default" : "outline"
//                                 }
//                                 className={cn(
//                                   "cursor-pointer transition-all duration-200 hover:scale-105",
//                                   isSelected
//                                     ? "bg-primary text-primary-foreground shadow-md"
//                                     : "hover:bg-muted border-2 border-dashed"
//                                 )}
//                                 onClick={() =>
//                                   togglePermission(perm.name)
//                                 }
//                               >
//                                 <span className="flex items-center gap-1.5">
//                                   {isSelected ? (
//                                     <CheckCircle2 className="h-3 w-3" />
//                                   ) : (
//                                     <Circle className="h-3 w-3" />
//                                   )}
//                                   {perm.description || perm.name}
//                                 </span>
//                               </Badge>
//                             );
//                           })}
//                         </div>

//                         {category !==
//                           Object.keys(permissions)[
//                             Object.keys(permissions).length - 1
//                           ] && <Separator />}
//                       </div>
//                     );
//                   }
//                 )}

//                 {data.permissions.length > 0 && (
//                   <div className="mt-6 p-4 bg-muted/50 rounded-lg">
//                     <h4 className="font-medium mb-2">
//                       Selected Permissions Summary
//                     </h4>
//                     <p className="text-sm text-muted-foreground">
//                       {data.permissions.length} permission
//                       {data.permissions.length !== 1 ? "s" : ""} selected
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Actions */}
//             <div className="flex justify-end gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => window.history.back()}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={processing}
//                 className="flex items-center gap-2"
//               >
//                 <Save className="h-4 w-4" />
//                 {processing ? "Creating..." : "Create Role"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }


// resources/js/Pages/roles/Create.jsx

import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Users,
  Shield,
  Save,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Permission {
  id: number;
  name: string;
  description: string | null;
}

type PageProps = {
  permissions: Permission[];           // flat array
  errors: Record<string, string>;      // validation errors
  flash?: { success?: string };        // optional flash message
};

export default function CreateRole() {
  const { permissions, errors, flash } = usePage<PageProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Roles", href: "/roles" },
    { title: "Create Role", href: "/roles/create" },
  ];

  const { data, setData, post, processing, reset } = useForm({
    name: "",
    guard_name: "web" as "web" | "api",
    permissions: [] as string[],
  });

  // Toggle a permission by its name
  const togglePermission = (permName: string) => {
    if (data.permissions.includes(permName)) {
      setData(
        "permissions",
        data.permissions.filter((p) => p !== permName)
      );
    } else {
      setData("permissions", [...data.permissions, permName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("roles.store"), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const selectedCount = data.permissions.length;
  const totalCount    = permissions.length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Role" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Flash “success” banner */}
        {flash?.success && (
          <div className="rounded-md bg-green-100 p-3 text-green-700">
            {flash.success}
          </div>
        )}

        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Role
            </h1>
            <p className="text-muted-foreground">
              Define a role and assign permissions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Information
              </CardTitle>
              <CardDescription>
                Basic details about this role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. administrator"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className={cn(
                      errors.name && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Guard */}
                <div className="space-y-2">
                  <Label htmlFor="guard_name">Guard</Label>
                  <select
                    id="guard_name"
                    value={data.guard_name}
                    onChange={(e) =>
                      setData("guard_name", e.target.value as "web" | "api")
                    }
                    className={cn(
                      "block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                      errors.guard_name &&
                        "border-destructive focus:ring-destructive"
                    )}
                  >
                    <option value="web">Web</option>
                    <option value="api">API</option>
                  </select>
                  {errors.guard_name && (
                    <p className="text-sm text-destructive">
                      {errors.guard_name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card (flat list) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>
                Click on each badge to toggle a permission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {permissions.map((perm) => {
                  const isSelected = data.permissions.includes(perm.name);
                  return (
                    <Badge
                      key={perm.id}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:scale-105",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted border-2 border-dashed"
                      )}
                      onClick={() => togglePermission(perm.name)}
                    >
                      <span className="flex items-center gap-1.5">
                        {isSelected ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                        {perm.description || perm.name}
                      </span>
                    </Badge>
                  );
                })}
              </div>

              {/* “X of Y selected” summary */}
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedCount} of {totalCount} permission
                {totalCount !== 1 ? "s" : ""} selected
              </div>

              {errors.permissions && (
                <p className="text-sm text-destructive">
                  {errors.permissions}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Link
              href={route("roles.index")}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {processing ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
