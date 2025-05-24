<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Str;


class SendBookingConfirmationEmail
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BookingCreated $event): void
    {
         $booking = $event->booking;
        
        // Generate invoice
        $invoice = Invoice::create([
            'booking_id' => $booking->id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'file_path' => 'invoices/' . $booking->id . '.pdf',
            'issued_at' => now(),
        ]);
        
        // Send confirmation email (implement as needed)
        // Mail::to($booking->user->email)->send(new BookingConfirmationMail($booking, $invoice));
    }
}
