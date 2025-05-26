<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Booking;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{


     public function __construct(
        private PaymentService $paymentService
    ) {}

    public function initiate(PaymentRequest $request, string $bookingRef): JsonResponse
    {
        $booking = Booking::where('reference', $bookingRef)->firstOrFail();

        if ($booking->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking is not in pending status',
            ], 400);
        }

        try {
            $payment = $this->paymentService->initiate($booking, $request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Payment initiated successfully',
                'data' => [
                    'payment' => $payment,
                    'redirect_url' => $payment->meta['checkout_url'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment initiation failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function verify(string $reference): JsonResponse
    {
        try {
            $result = $this->paymentService->verify($reference);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment verification successful',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function webhook(): JsonResponse
    {
        try {
            $payload = request()->all();
            $this->paymentService->handleWebhook($payload);

            return response()->json([
                'status' => 'success',
                'message' => 'Webhook processed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Webhook processing failed: ' . $e->getMessage(),
            ], 400);
        }
    }
    
    // public function __construct(
    //     private PaymentService $paymentService
    // ) {
    //     // $this->middleware('auth:sanctum');
    // }

    // public function charge(PaymentRequest $request, int $bookingId): JsonResponse
    // {
    //     $booking = Booking::find($bookingId);

    //     if (!$booking || $booking->user_id !== auth()->id()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Booking not found',
    //         ], 404);
    //     }

    //     if ($booking->status !== 'pending') {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Booking is not in pending status',
    //         ], 400);
    //     }

    //     try {
    //         $payment = $this->paymentService->charge($booking, $request->validated());

    //         return response()->json([
    //             'status' => 'success',
    //             'message' => 'Payment processed successfully',
    //             'data' => [
    //                 'payment' => $payment,
    //                 'booking' => $booking->fresh(),
    //             ],
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Payment failed: ' . $e->getMessage(),
    //         ], 400);
    //     }
    // }
}