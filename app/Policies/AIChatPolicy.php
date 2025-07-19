<?php

namespace App\Policies;

use App\Models\AIChat;
use App\Models\User;

class AIChatPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AIChat $chat): bool
    {
        return $user->id === $chat->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AIChat $chat): bool
    {
        return $user->id === $chat->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AIChat $chat): bool
    {
        return $user->id === $chat->user_id;
    }
}