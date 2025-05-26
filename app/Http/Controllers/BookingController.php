<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {
        // $this->middleware('auth:sanctum');
    }

    /**
     * List bookings (admins) or filter by user.
     */
    public function index(Request $request): JsonResponse
    {
        // If admin: list all, else only their own
        $user = $request->user();
        if ($user->hasRole('admin')) {
            // $bookings = $this->bookingService->getUserBookings(null); // implement repo->all() for admin
        } else {
            $bookings = $this->bookingService->getUserBookings($user->id);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $bookings,
        ]);
    }

    /**
     * Create new booking.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->createBooking($request->validated());

        return response()->json([
            'status'  => 'success',
            'message' => 'Booking created.',
            'data'    => $booking,
        ], 201);
    }

    /**
     * Show single booking.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $booking = $this->bookingService->getBooking($id);
        if ($request->user()) {
            if (!$booking || $booking->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Booking not found',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $booking,
            ]);
        }

        $validated = $request->validate([
            'booking_reference' => 'required|string',
            'access_token' => 'required|string',
        ]);

        if (!$booking ||
            $booking->booking_reference !== $validated['booking_reference'] ||
            $booking->access_token !== $validated['access_token']
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized or invalid booking reference',
            ], 403);
        }

        if (!$booking ||
            $booking->booking_reference !== $validated['booking_reference'] ||
            $booking->access_token !== $validated['access_token'] ||
            now()->greaterThan($booking->access_token_expires_at)
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized or expired access token',
            ], 403);
        }


        return response()->json([
            'status' => 'success',
            'data' => $booking,
        ]);
    }


    /**
     * Confirm a booking (admin only).
     */
    public function confirm(int $id): JsonResponse
    {
        // $this->authorize('confirm', Booking::class);

        $booking = $this->bookingService->confirmBooking($id);

        return response()->json([
            'status'  => 'success',
            'message' => 'Booking confirmed.',
            'data'    => $booking,
        ]);
    }

    /**
     * Cancel a booking (user or admin).
     */
    public function cancel(int $id): JsonResponse
    {
        $booking = $this->bookingService->cancelBooking($id);

        return response()->json([
            'status'  => 'success',
            'message' => 'Booking cancelled.',
            'data'    => $booking,
        ]);
    }
}
