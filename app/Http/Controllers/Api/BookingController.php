<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {
        // $this->middleware('auth:sanctum');
    }

    public function index(): JsonResponse
    {
        $bookings = $this->bookingService->getUserBookings(auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    // public function store(Request $request): JsonResponse
    // {

    public function store(StoreBookingRequest $request): JsonResponse{
        
        try {

            Log::info('Creating booking', [
                'package_id' => $request->package_id,
                'data' => $request->all(),
            ]);
            $booking = $this->bookingService->createBooking(
                $request->package_id,
                $request->all(),
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Booking created successfully',
                'data' => array_merge(
                    $booking->load(['package', 'user'])->toArray(),
                    ['payment_gateway' => $request->payment_gateway] 
                ),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $booking = $this->bookingService->getBooking($id);

        if (!$booking || $booking->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $booking->load(['package', 'payment', 'invoice']),
        ]);
    }

    public function cancel(int $id): JsonResponse
    {
        try {
            $booking = $this->bookingService->cancelBooking($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Booking cancelled successfully',
                'data' => $booking,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}