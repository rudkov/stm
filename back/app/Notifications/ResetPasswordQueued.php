<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordQueued extends ResetPassword implements ShouldQueue
{
    use Queueable;

    /**
     * Get the reset password notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($url)
    {
        return (new MailMessage)
            ->subject(__('Reset Your Password'))
            ->line(__('Someone requested a password reset for your account. If this was you, click the button below to create a new password:'))
            ->action(__('Reset Password'), $url)
            ->line(__('This link will expire in :count minutes for your security.', ['count' => config('auth.passwords.users.expire')]))
            ->line(__('If you didn\'t request a password reset, you can safely ignore this email. Your password will remain unchanged.'));
    }

    /**
     * Get the reset URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function resetUrl($notifiable)
    {
        return config('app.frontend_url') . "/reset-password/{$this->token}?email=" . urlencode($notifiable->getEmailForPasswordReset());
    }
} 