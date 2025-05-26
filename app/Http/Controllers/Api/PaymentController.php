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
    ) {
        // $this->middleware('auth:sanctum');
    }

    public function charge(PaymentRequest $request, int $bookingId): JsonResponse
    {
        $booking = Booking::find($bookingId);

        if (!$booking || $booking->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found',
            ], 404);
        }

        if ($booking->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking is not in pending status',
            ], 400);
        }

        try {
            $payment = $this->paymentService->charge($booking, $request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Payment processed successfully',
                'data' => [
                    'payment' => $payment,
                    'booking' => $booking->fresh(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment failed: ' . $e->getMessage(),
            ], 400);
        }
    }
}