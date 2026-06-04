import { Head, useForm } from '@inertiajs/react';
import ReportForm from '@/components/reports/report-form';
import type { City, Report } from '@/types';

type Props = {
    report: Report;
    categories: string[];
    cities: City[];
};

export default function ReportsEdit({ report, categories, cities }: Props) {
    const form = useForm({
        title: report.title,
        description: report.description,
        category: report.category,
        city_id: report.city_id ? String(report.city_id) : '',
        latitude: report.latitude,
        longitude: report.longitude,
        images: [] as File[],
        deleted_image_ids: [] as number[],
    });

    return (
        <>
            <Head title="Edit Report" />
            <div className="p-4">
                <ReportForm
                    form={form}
                    report={report}
                    categories={categories}
                    cities={cities}
                    submitLabel="Update Report"
                    submit={() => form.put(`/reports/${report.id}`, { forceFormData: true })}
                />
            </div>
        </>
    );
}

ReportsEdit.layout = {
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
            title: 'Edit',
            href: '#',
        },
    ],
};
