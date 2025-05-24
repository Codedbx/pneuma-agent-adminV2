<?php

namespace App\Services;

use App\Adapters\PaymentGatewayAdapter;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        private PaymentGatewayAdapter $paymentAdapter
    ) {}

    public function charge(Booking $booking, array $data): Payment
    {
        $transactionRef = Str::uuid()->toString();
        
        // Create payment record
        $payment = Payment::create([
            'booking_id' => $booking->id,
            'amount' => $booking->total_price,
            'gateway' => $data['gateway'],
            'transaction_reference' => $transactionRef,
            'status' => 'pending',
        ]);
        
        try {
            // Process payment through adapter
            $result = $this->paymentAdapter->charge([
                'amount' => $booking->total_price,
                'reference' => $transactionRef,
                'gateway' => $data['gateway'],
                'customer_data' => $data['customer_data'] ?? [],
            ]);
            
            if ($result['success']) {
                $payment->update(['status' => 'paid']);
                $booking->update(['status' => 'confirmed']);
            } else {
                $payment->update(['status' => 'failed']);
            }
            
        } catch (\Exception $e) {
            $payment->update(['status' => 'failed']);
            throw $e;
        }
        
        return $payment;
    }
}
