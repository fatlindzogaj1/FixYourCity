import { Head, useForm } from '@inertiajs/react';
import ReportForm from '@/components/reports/report-form';
import type { City } from '@/types';

type Props = {
    categories: string[];
    cities: City[];
};

export default function ReportsCreate({ categories, cities }: Props) {
    const form = useForm({
        title: '',
        description: '',
        category: categories[0] ?? 'other',
        city_id: '',
        latitude: null as number | null,
        longitude: null as number | null,
        images: [] as File[],
        deleted_image_ids: [] as number[],
    });

    return (
        <>
            <Head title="Create Report" />
            <div className="p-4">
                <ReportForm
                    form={form}
                    categories={categories}
                    cities={cities}
                    submitLabel="Create Report"
                    submit={() => form.post('/reports', { forceFormData: true })}
                />
            </div>
        </>
    );
}

ReportsCreate.layout = {
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
            title: 'Create',
            href: '/reports/create',
        },
    ],
};
