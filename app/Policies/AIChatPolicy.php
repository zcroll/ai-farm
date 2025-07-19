<?php

namespace App\Policies;

use App\Models\AIChat;
use App\Models\User;

class AIChatPolicy
{
    public function view(User $user, AIChat $chat): bool
    {
        return $user->id === $chat->user_id;
    }

    public function update(User $user, AIChat $chat): bool
    {
        return $user->id === $chat->user_id;
    }

    public function delete(User $user, AIChat $chat): bool
    {
        return $user->id === $chat->user_id;
    }
}