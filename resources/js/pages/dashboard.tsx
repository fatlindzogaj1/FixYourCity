import { Head, Link, router } from '@inertiajs/react';
import StatusBadge from '@/components/reports/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import type { Paginated, Report } from '@/types';

type Props = {
    reports: Paginated<Report>;
    filters: {
        status?: string;
        category?: string;
        search?: string;
    };
    statuses: string[];
    categories: string[];
};

export default function Dashboard({ reports, filters, statuses, categories }: Props) {
    const moderationStatuses = statuses.filter((status) => status !== 'pending');

    const applyFilter = (next: Record<string, string>) => {
        router.get('/dashboard', { ...filters, ...next }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleStatusUpdate = (reportId: number, status: string) => {
        router.patch(`/dashboard/reports/${reportId}/status`, { status }, { preserveScroll: true });
    };

    const handleDelete = (reportId: number) => {
        if (!window.confirm('Delete this report?')) {
            return;
        }

        router.delete(`/dashboard/reports/${reportId}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Manage reports, update statuses, and delete invalid posts.</p>
                    </div>
                    <Button asChild>
                        <Link href="/">Open public page</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => applyFilter({ status: value === 'all' ? '' : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                value={filters.category || 'all'}
                                onValueChange={(value) => applyFilter({ category: value === 'all' ? '' : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dashboard-search">Search</Label>
                            <Input
                                id="dashboard-search"
                                defaultValue={filters.search || ''}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        applyFilter({ search: (event.currentTarget as HTMLInputElement).value });
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Photo</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.data.map((report) => {
                                    const firstImage = report.images?.[0]?.image_path;

                                    return (
                                        <TableRow key={report.id}>
                                            <TableCell>
                                                {firstImage ? (
                                                    <img
                                                        src={`/storage/${firstImage}`}
                                                        alt={report.title}
                                                        className="h-14 w-20 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-14 w-20 rounded bg-muted" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/reports/${report.id}`} className="font-medium hover:underline">
                                                    {report.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="capitalize">{report.category}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={report.status} />
                                            </TableCell>
                                            <TableCell>{report.user?.name ?? '-'}</TableCell>
                                            <TableCell>{report.city?.name ?? '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Select
                                                        value={report.status}
                                                        onValueChange={(value) => handleStatusUpdate(report.id, value)}
                                                    >
                                                        <SelectTrigger className="w-36">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={report.status}>{report.status}</SelectItem>
                                                            {moderationStatuses
                                                                .filter((status) => status !== report.status)
                                                                .map((status) => (
                                                                    <SelectItem key={status} value={status}>
                                                                        {status}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button variant="destructive" onClick={() => handleDelete(report.id)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap gap-2">
                    {reports.links.map((link, index) => (
                        <Button
                            key={`${link.label}-${index}`}
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            onClick={() => {
                                if (link.url) {
                                    router.visit(link.url, { preserveState: true, preserveScroll: true });
                                }
                            }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
