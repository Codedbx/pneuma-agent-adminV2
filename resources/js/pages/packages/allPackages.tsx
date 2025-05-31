import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PackagesTable from "@/components/dashboard/PackagesTable"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Packages',
        href: '/packages/all',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Packages" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
               <PackagesTable />
            </div>
        </AppLayout>
    );
}
