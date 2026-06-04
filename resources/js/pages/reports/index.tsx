import { Head, Link, router, usePage } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import ReportsMap from '@/components/reports/reports-map';
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
import type { City, Paginated, Report, User } from '@/types';

type Props = {
    reports: Paginated<Report>;
    mapReports: Report[];
    filters: {
        status?: string;
        category?: string;
        city_id?: string;
        search?: string;
    };
    categories: string[];
    statuses: string[];
    cities: City[];
};

export default function ReportsIndex({ reports, mapReports, filters, categories, statuses, cities }: Props) {
    const { auth } = usePage<{ auth: { user?: User | null } }>().props;
    const user = auth?.user ?? null;
    const isAuthenticated = Boolean(user);

    const applyFilter = (next: Record<string, string>) => {
        router.get('/', { ...filters, ...next }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Reports" />

            <Navbar user={user} />

            <div className="mx-auto max-w-(--breakpoint-xl) space-y-6 p-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Reports</h1>
                    {isAuthenticated ? (
                        <Button asChild>
                            <Link href="/reports/create">Create Report</Link>
                        </Button>
                    ) : null}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>City Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportsMap reports={mapReports} />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={filters.status ?? 'all'}
                                onValueChange={(value) => applyFilter({ status: value === 'all' ? '' : value })}
                            >
                                <SelectTrigger className="h-10 w-full">
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
                                value={filters.category ?? 'all'}
                                onValueChange={(value) => applyFilter({ category: value === 'all' ? '' : value })}
                            >
                                <SelectTrigger className="h-10 w-full">
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
                            <Label>City</Label>
                            <Select
                                value={filters.city_id ?? 'all'}
                                onValueChange={(value) => applyFilter({ city_id: value === 'all' ? '' : value })}
                            >
                                <SelectTrigger className="h-10 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={String(city.id)}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                defaultValue={filters.search ?? ''}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        applyFilter({ search: (event.currentTarget as HTMLInputElement).value });
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {reports.data.map((report) => {
                        const firstImage = report.images?.[0]?.image_path;

                        return (
                            <Card key={report.id}>
                                {firstImage ? (
                                    <img
                                        src={`/storage/${firstImage}`}
                                        alt={report.title}
                                        className="h-48 w-full rounded-t-lg object-cover"
                                    />
                                ) : null}
                                <CardHeader>
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle>{report.title}</CardTitle>
                                        <StatusBadge status={report.status} />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <p className="line-clamp-3 text-muted-foreground">{report.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span>{report.category}</span>
                                        <span>{report.city?.name ?? 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>{report.user?.name}</span>
                                        <span>{report.comments_count ?? 0} comments</span>
                                    </div>
                                    <Button className="w-full" asChild>
                                        <Link href={`/reports/${report.id}`}>View Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex flex-wrap gap-2">
                    {reports.links.map((link, index) => (
                        <Button
                            key={`${link.label}-${index}`}
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            onClick={() => {
                                if (link.url) {
                                    router.visit(link.url, { preserveState: true });
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

ReportsIndex.layout = null;
