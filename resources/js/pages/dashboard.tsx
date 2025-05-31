import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import DashboardStatsCards from '@/components/dashboard/DashboardStatCards'
import { GraphComponent } from '@/components/dashboard/GraphComponent'
import { PieChart } from '@/components/dashboard/PieChart'
import TableComponent from '@/components/dashboard/TableComponent'
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DashboardStatsCards />
                <div className='flex gap-6 w-full'>
                    <GraphComponent />
                    <PieChart />
                </div>
                <TableComponent />
            </div>
        </AppLayout>
    );
}
