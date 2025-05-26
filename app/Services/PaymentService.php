<?php

namespace App\Services;

use App\Adapters\PaymentGatewayAdapter;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{

     public function __construct(
        private PaymentGatewayAdapter $gatewayFactory
    ) {}

    public function initiate(Booking $booking, array $data): Payment
    {
        return DB::transaction(function () use ($booking, $data) {
            $gateway = $this->gatewayFactory->make($data['gateway']);
            $reference = Str::uuid()->toString();

            $payment = Payment::create([
                'booking_id' => $booking->id,
                'amount' => $booking->total_price,
                'gateway' => $data['gateway'],
                'transaction_reference' => $reference,
                'status' => 'pending',
                'meta' => [
                    'return_url' => $data['return_url'],
                    'cancel_url' => $data['cancel_url'],
                ],
            ]);

            try {
                $result = $gateway->initialize([
                    'amount' => $booking->total_price * 100, // Convert to smallest currency unit
                    'currency' => 'USD',
                    'reference' => $reference,
                    'email' => $booking->customer_email,
                    'metadata' => [
                        'booking_reference' => $booking->reference,
                        'customer_name' => $booking->customer_name,
                    ],
                    'return_url' => $data['return_url'],
                    'cancel_url' => $data['cancel_url'],
                ]);

                $payment->update([
                    'meta' => array_merge($payment->meta, [
                        'checkout_url' => $result['checkout_url'],
                        'gateway_reference' => $result['gateway_reference'] ?? null,
                    ]),
                ]);

                return $payment;
            } catch (\Exception $e) {
                $payment->update(['status' => 'failed']);
                throw $e;
            }
        });
    }

    public function verify(string $reference): array
    {
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
        $gateway = $this->gatewayFactory->make($payment->gateway);

        $verificationResult = $gateway->verify($reference);

        if ($verificationResult['status'] === 'success') {
            $this->updatePaymentStatus($payment, 'paid');
            $this->confirmBooking($payment->booking);
        } else {
            $this->updatePaymentStatus($payment, 'failed');
        }

        return [
            'payment' => $payment->fresh(),
            'booking' => $payment->booking,
        ];
    }

    public function handleWebhook(array $payload): void
    {
        $gateway = $this->gatewayFactory->make($payload['gateway'] ?? '');
        $event = $gateway->parseWebhookPayload($payload);

        if (!$event) {
            throw new \Exception('Invalid webhook payload');
        }

        $payment = Payment::where('transaction_reference', $event['reference'])->first();

        if (!$payment) {
            Log::error('Payment not found for webhook', ['event' => $event]);
            return;
        }

        switch ($event['type']) {
            case 'payment.success':
                $this->updatePaymentStatus($payment, 'paid');
                $this->confirmBooking($payment->booking);
                break;
            case 'payment.failed':
                $this->updatePaymentStatus($payment, 'failed');
                break;
            default:
                Log::info('Unhandled webhook event', ['type' => $event['type']]);
        }
    }

    private function updatePaymentStatus(Payment $payment, string $status): void
    {
        $payment->update([
            'status' => $status,
            'paid_at' => $status === 'paid' ? now() : null,
        ]);
    }

    private function confirmBooking(Booking $booking): void
    {
        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        // Dispatch booking confirmation events
        // event(new BookingConfirmed($booking));
    }


}

    //  public function __construct(
    //     private PaymentGatewayFactory $gatewayFactory
    // ) {}

    // public function initiate(Booking $booking, array $data): Payment
    // {
    //     return DB::transaction(function () use ($booking, $data) {
    //         $gateway = $this->gatewayFactory->make($data['gateway']);
    //         $reference = Str::uuid()->toString();

    //         $payment = Payment::create([
    //             'booking_id' => $booking->id,
    //             'amount' => $booking->total_price,
    //             'gateway' => $data['gateway'],
    //             'transaction_reference' => $reference,
    //             'status' => 'pending',
    //             'meta' => [
    //                 'return_url' => $data['return_url'],
    //                 'cancel_url' => $data['cancel_url'],
    //             ],
    //         ]);

    //         try {
    //             $result = $gateway->initialize([
    //                 'amount' => $booking->total_price * 100, // Convert to smallest currency unit
    //                 'currency' => 'USD',
    //                 'reference' => $reference,
    //                 'email' => $booking->customer_email,
    //                 'metadata' => [
    //                     'booking_reference' => $booking->reference,
    //                     'customer_name' => $booking->customer_name,
    //                 ],
    //                 'return_url' => $data['return_url'],
    //                 'cancel_url' => $data['cancel_url'],
    //             ]);

    //             $payment->update([
    //                 'meta' => array_merge($payment->meta, [
    //                     'checkout_url' => $result['checkout_url'],
    //                     'gateway_reference' => $result['gateway_reference'] ?? null,
    //                 ]),
    //             ]);

    //             return $payment;
    //         } catch (\Exception $e) {
    //             $payment->update(['status' => 'failed']);
    //             throw $e;
    //         }
    //     });
    // }

    // public function verify(string $reference): array
    // {
    //     $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
    //     $gateway = $this->gatewayFactory->make($payment->gateway);

    //     $verificationResult = $gateway->verify($reference);

    //     if ($verificationResult['status'] === 'success') {
    //         $this->updatePaymentStatus($payment, 'paid');
    //         $this->confirmBooking($payment->booking);
    //     } else {
    //         $this->updatePaymentStatus($payment, 'failed');
    //     }

    //     return [
    //         'payment' => $payment->fresh(),
    //         'booking' => $payment->booking,
    //     ];
    // }

    // public function handleWebhook(array $payload): void
    // {
    //     $gateway = $this->gatewayFactory->make($payload['gateway'] ?? '');
    //     $event = $gateway->parseWebhookPayload($payload);

    //     if (!$event) {
    //         throw new \Exception('Invalid webhook payload');
    //     }

    //     $payment = Payment::where('transaction_reference', $event['reference'])->first();

    //     if (!$payment) {
    //         Log::error('Payment not found for webhook', ['event' => $event]);
    //         return;
    //     }

    //     switch ($event['type']) {
    //         case 'payment.success':
    //             $this->updatePaymentStatus($payment, 'paid');
    //             $this->confirmBooking($payment->booking);
    //             break;
    //         case 'payment.failed':
    //             $this->updatePaymentStatus($payment, 'failed');
    //             break;
    //         default:
    //             Log::info('Unhandled webhook event', ['type' => $event['type']]);
    //     }
    // }

    // private function updatePaymentStatus(Payment $payment, string $status): void
    // {
    //     $payment->update([
    //         'status' => $status,
    //         'paid_at' => $status === 'paid' ? now() : null,
    //     ]);
    // }

    // private function confirmBooking(Booking $booking): void
    // {
    //     $booking->update([
    //         'status' => 'confirmed',
    //         'confirmed_at' => now(),
    //     ]);

    //     // Dispatch booking confirmation events
    //     // event(new BookingConfirmed($booking));
    // }
   