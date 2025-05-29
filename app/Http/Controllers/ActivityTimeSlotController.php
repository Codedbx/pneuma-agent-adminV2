<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityTimeSlot;
use App\Services\ActivityTimeSlotService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreActivityTimeSlotRequest;
use App\Http\Requests\UpdateActivityTimeSlotRequest;

class ActivityTimeSlotController extends Controller
{
    public function __construct(private ActivityTimeSlotService $timeSlotService)
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of time slots for a specific activity.
     */
    public function index(Activity $activity)
    {
        $this->authorize('view', $activity);

        $timeSlots = $this->timeSlotService->getActivityTimeSlots($activity->id);
        
        return Inertia::render('TimeSlots/Index', [
            'activity' => $activity,
            'timeSlots' => $timeSlots,
        ]);
    }

    /**
     * Show the form for creating a new time slot.
     */
    public function create(Activity $activity)
    {
        $this->authorize('update', $activity);
        
        return Inertia::render('TimeSlots/Create', [
            'activity' => $activity,
        ]);
    }

    /**
     * Store a newly created time slot in storage.
     */
    public function store(StoreActivityTimeSlotRequest $request, Activity $activity)
    {
        $this->authorize('update', $activity);
        
        $timeSlot = $this->timeSlotService->createTimeSlot(
            array_merge($request->validated(), ['activity_id' => $activity->id])
        );
        
        return redirect()->route('activities.time-slots.index', $activity)
            ->with('success', 'Time slot created successfully.');
    }

    /**
     * Show the form for editing the specified time slot.
     */
    public function edit(Activity $activity, ActivityTimeSlot $timeSlot)
    {
        $this->authorize('update', $activity);
        
        return Inertia::render('TimeSlots/Edit', [
            'activity' => $activity,
            'timeSlot' => $timeSlot,
        ]);
    }

    /**
     * Update the specified time slot in storage.
     */
    public function update(UpdateActivityTimeSlotRequest $request, Activity $activity, ActivityTimeSlot $timeSlot)
    {
        $this->authorize('update', $activity);
        
        $this->timeSlotService->updateTimeSlot($timeSlot->id, $request->validated());
        
        return redirect()->route('activities.time-slots.index', $activity)
            ->with('success', 'Time slot updated successfully.');
    }

    /**
     * Remove the specified time slot from storage.
     */
    public function destroy(Activity $activity, ActivityTimeSlot $timeSlot)
    {
        $this->authorize('update', $activity);
        
        $this->timeSlotService->deleteTimeSlot($timeSlot->id);
        
        return redirect()->route('activities.time-slots.index', $activity)
            ->with('success', 'Time slot deleted successfully.');
    }

    /**
     * Get available time slots for an activity within a date range (for API/Ajax calls).
     */
    public function getAvailableTimeSlots(Request $request, Activity $activity)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $availableSlots = $this->timeSlotService->getAvailableTimeSlots(
            $activity->id,
            $request->start_date,
            $request->end_date
        );

        return response()->json([
            'timeSlots' => $availableSlots
        ]);
    }
}