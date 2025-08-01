<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Str;

class VerifyEmailQueued extends VerifyEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Get the verification email notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($url)
    {
        return (new MailMessage)
            ->subject(__('Verify Your Email Address'))
            ->line(__('Please click the button below to verify your email address.'))
            ->action(__('Verify Email Address'), $url)
            ->line(__('If you didn\'t create an account with us, you can safely ignore this email.'));
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {        
        // Extract the query parameters from the signed URL
        $parsedUrl = parse_url(parent::verificationUrl($notifiable));
        $prefix = '/email-verify';
        $frontendPath = $prefix . Str::after($parsedUrl['path'], $prefix);
        // Construct the frontend URL with the same path and parameters 
        return config('app.frontend_url') . $frontendPath . '?' . $parsedUrl['query'];
    }
} 