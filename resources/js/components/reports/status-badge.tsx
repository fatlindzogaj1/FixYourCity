import { Badge } from '@/components/ui/badge';

type Props = {
    status: 'pending' | 'verified' | 'rejected' | 'resolved';
};

const statusClasses: Record<Props['status'], string> = {
    pending: 'bg-amber-500/10 text-amber-600',
    verified: 'bg-emerald-500/10 text-emerald-600',
    rejected: 'bg-red-500/10 text-red-600',
    resolved: 'bg-blue-500/10 text-blue-600',
};

export default function StatusBadge({ status }: Props) {
    return <Badge className={statusClasses[status]}>{status}</Badge>;
}

