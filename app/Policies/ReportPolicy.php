<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Report $report): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user !== null;
    }

    public function update(User $user, Report $report): bool
    {
        return $user->id === $report->user_id || $user->isAdminOrModerator();
    }

    public function delete(User $user, Report $report): bool
    {
        return $user->id === $report->user_id || $user->isAdminOrModerator();
    }

    public function moderate(User $user): bool
    {
        return $user->isAdminOrModerator();
    }
}
