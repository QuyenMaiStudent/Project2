<?php

namespace App\Policies;

use App\Models\SupportTicket;
use App\Models\User;

class SupportTicketPolicy
{
    /**
     * Create a new policy instance.
     */
    public function view(User $user, SupportTicket $ticket)
    {
        return $user->id === $ticket->user_id || $user->role === 'admin';
    }
}
