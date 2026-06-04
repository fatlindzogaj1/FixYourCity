import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import StatusBadge from '@/components/reports/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import type { Report, User } from '@/types';

type Props = {
    report: Report;
    canModerate: boolean;
    statuses: string[];
};

export default function ReportsShow({ report, canModerate }: Props) {
    const auth = usePage<{ auth: { user: User } }>().props.auth;

    const canEdit = auth.user.id === report.user_id || auth.user.role === 'admin' || auth.user.role === 'moderator';

    return (
        <>
            <Head title={report.title} />

            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <CardTitle>{report.title}</CardTitle>
                            <StatusBadge status={report.status} />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{report.description}</p>
                        <div className="grid gap-2 text-sm md:grid-cols-3">
                            <p>Category: {report.category}</p>
                            <p>City: {report.city?.name ?? 'N/A'}</p>
                            <p>By: {report.user?.name}</p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {(report.images ?? []).map((image) => (
                                <img
                                    key={image.id}
                                    src={`/storage/${image.image_path}`}
                                    alt={report.title}
                                    className="h-44 w-full rounded-md border object-cover"
                                />
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline">
                                <Link href="/reports">Back</Link>
                            </Button>
                            {canEdit && (
                                <>
                                    <Button asChild>
                                        <Link href={`/reports/${report.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button variant="destructive" onClick={() => router.delete(`/reports/${report.id}`)}>
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {canModerate && (
                    <div className="grid gap-6 xl:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Verification</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form action={`/reports/${report.id}/verifications`} method="post" className="space-y-4">
                                    {({ errors, processing }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label>Status</Label>
                                                <Select name="status" defaultValue="approved">
                                                    <SelectTrigger className="h-10 w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="approved">approved</SelectItem>
                                                        <SelectItem value="rejected">rejected</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-sm text-red-500">{errors.status}</p>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="note">Note</Label>
                                                <Textarea id="note" name="note" />
                                                <p className="text-sm text-red-500">{errors.note}</p>
                                            </div>
                                            <Button type="submit" disabled={processing}>
                                                Save Verification
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Change Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form action={`/reports/${report.id}/status`} method="patch" className="space-y-4">
                                    {({ errors, processing }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label>Status</Label>
                                                <Select name="status" defaultValue={report.status === 'pending' ? 'verified' : report.status}>
                                                    <SelectTrigger className="h-10 w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="verified">verified</SelectItem>
                                                        <SelectItem value="rejected">rejected</SelectItem>
                                                        <SelectItem value="resolved">resolved</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-sm text-red-500">{errors.status}</p>
                                            </div>
                                            <Button type="submit" disabled={processing}>
                                                Update Status
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Comments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form action={`/reports/${report.id}/comments`} method="post" className="space-y-2">
                            {({ errors, processing }) => (
                                <>
                                    <Textarea name="content" placeholder="Add a comment" />
                                    <p className="text-sm text-red-500">{errors.content}</p>
                                    <Button type="submit" disabled={processing}>
                                        Add Comment
                                    </Button>
                                </>
                            )}
                        </Form>

                        <div className="space-y-3">
                            {(report.comments ?? []).map((comment) => {
                                const canDelete =
                                    auth.user.id === comment.user_id ||
                                    auth.user.role === 'admin' ||
                                    auth.user.role === 'moderator';

                                return (
                                    <Card key={comment.id} size="sm">
                                        <CardContent className="space-y-2 pt-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{comment.user.name}</span>
                                                <span className="text-muted-foreground">
                                                    {new Date(comment.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <p>{comment.content}</p>
                                            {canDelete && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.delete(`/reports/${report.id}/comments/${comment.id}`)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Changed By</TableHead>
                                    <TableHead>Changed At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(report.status_histories ?? []).map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>{item.user.name}</TableCell>
                                        <TableCell>{new Date(item.changed_at).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ReportsShow.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'Reports',
            href: '/',
        },
        {
            title: 'Details',
            href: '#',
        },
    ],
};
