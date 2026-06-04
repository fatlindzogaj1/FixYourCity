import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import InputError from '@/components/input-error';
import MapPicker from '@/components/reports/map-picker';
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
import { Textarea } from '@/components/ui/textarea';
import type { City, Report } from '@/types';

type FormData = {
    title: string;
    description: string;
    category: string;
    city_id: string;
    latitude: number | null;
    longitude: number | null;
    images: File[];
    deleted_image_ids: number[];
};

type Props = {
    form: {
        data: FormData;
        setData: (key: keyof FormData, value: FormData[keyof FormData]) => void;
        errors: Record<string, string>;
        processing: boolean;
        post: (url: string, options?: { forceFormData?: boolean }) => void;
        put: (url: string, options?: { forceFormData?: boolean }) => void;
    };
    categories: string[];
    cities: City[];
    submitLabel: string;
    submit: () => void;
    report?: Report;
};

export default function ReportForm({ form, categories, cities, submitLabel, submit, report }: Props) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const existingImages = useMemo(() => report?.images ?? [], [report?.images]);

    const handleMapChange = useCallback(
        ({ latitude, longitude }: { latitude: number; longitude: number }) => {
            form.setData('latitude', latitude);
            form.setData('longitude', longitude);
        },
        [form],
    );

    const toggleDeleteImage = (imageId: number) => {
        const set = new Set(form.data.deleted_image_ids);

        if (set.has(imageId)) {
            set.delete(imageId);
        } else {
            set.add(imageId);
        }

        form.setData('deleted_image_ids', Array.from(set));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{submitLabel}</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="grid gap-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={form.data.title}
                            onChange={(event) => form.setData('title', event.target.value)}
                        />
                        <InputError message={form.errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={form.data.description}
                            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                                form.setData('description', event.target.value)
                            }
                        />
                        <InputError message={form.errors.description} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                value={form.data.category}
                                onValueChange={(value) => form.setData('category', value)}
                            >
                                <SelectTrigger className="h-10 w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label>City</Label>
                            <Select value={form.data.city_id} onValueChange={(value) => form.setData('city_id', value)}>
                                <SelectTrigger className="h-10 w-full">
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={String(city.id)}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.city_id} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="images">Images</Label>
                        <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(event) => {
                                const files = Array.from(event.target.files ?? []);
                                setSelectedFiles(files);
                                form.setData('images', files);
                            }}
                        />
                        {selectedFiles.length > 0 && (
                            <p className="text-sm text-muted-foreground">{selectedFiles.length} file(s) selected</p>
                        )}
                        <InputError message={form.errors.images} />
                    </div>

                    {existingImages.length > 0 && (
                        <div className="grid gap-2">
                            <Label>Existing Images</Label>
                            <div className="grid gap-3 md:grid-cols-3">
                                {existingImages.map((image) => {
                                    const selected = form.data.deleted_image_ids.includes(image.id);

                                    return (
                                        <button
                                            key={image.id}
                                            type="button"
                                            className={`overflow-hidden rounded-md border ${selected ? 'border-red-500' : 'border-border'}`}
                                            onClick={() => toggleDeleteImage(image.id)}
                                        >
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt="Report"
                                                className="h-32 w-full object-cover"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Location</Label>
                        <MapPicker
                            latitude={form.data.latitude}
                            longitude={form.data.longitude}
                            onChange={handleMapChange}
                        />
                        <InputError message={form.errors.latitude} />
                        <InputError message={form.errors.longitude} />
                    </div>

                    <Button type="submit" disabled={form.processing}>
                        {submitLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
