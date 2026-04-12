<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Kode Keamanan Reset Password - HeartPredict')
                    ->greeting('Halo, ' . $notifiable->name . '!')
                    ->line('Kami menerima permintaan untuk mengatur ulang kata sandi akun medis Anda.')
                    ->line('Gunakan kode verifikasi berikut untuk melanjutkan:')
                    ->line('**' . $this->token . '**')
                    ->line('Kode rahasia ini berlaku selama 60 menit. Jangan berikan kode ini kepada siapa pun untuk menjaga keamanan akun Anda.')
                    ->line('Jika Anda tidak melakukan permintaan ini, Anda dapat mengabaikan email ini dengan aman.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
