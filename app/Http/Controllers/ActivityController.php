<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;


class ActivityController extends Controller
{
     public function __construct(private ActivityService $activityService)
    {
        // $this->authorizeResource(Activity::class, 'activity');
    }

    /**
     * Display a listing of the activities.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'location', 'price_min', 'price_max']);
        
        if ($request->has('agent') && $request->user()->hasRole('agent')) {
            $activities = $this->activityService->getAgentActivities(Auth::id(), $filters);
        } else {
            $activities = $this->activityService->getAllActivities($filters);
        }

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new activity.
     */
    public function create()
    {
        return Inertia::render('Activities/Create');
    }

    /**
     * Store a newly created activity in storage.
     */
    public function store(StoreActivityRequest $request)
    {
        $activity = $this->activityService->createActivity($request->validated());

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $activity->addMedia($image)->toMediaCollection('images');
            }
        }

        return redirect()->route('activities.show', $activity)
            ->with('success', 'Activity created successfully.');
    }

    /**
     * Display the specified activity.
     */
    public function show(Activity $activity)
    {
        $activity->load(['timeSlots', 'agent']);
        
        return Inertia::render('Activities/Show', [
            'activity' => $activity,
            'media' => $activity->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                ];
            }),
        ]);
    }

    /**
     * Show the form for editing the specified activity.
     */
    public function edit(Activity $activity)
    {
        $activity->load('timeSlots');
        
        return Inertia::render('Activities/Edit', [
            'activity' => $activity,
            'media' => $activity->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                ];
            }),
        ]);
    }

    /**
     * Update the specified activity in storage.
     */
    public function update(UpdateActivityRequest $request, Activity $activity)
    {
        $activity = $this->activityService->updateActivity($activity->id, $request->validated());

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $activity->addMedia($image)->toMediaCollection('images');
            }
        }

        if ($request->has('delete_media') && is_array($request->delete_media)) {
            foreach ($request->delete_media as $mediaId) {
                $media = $activity->media()->find($mediaId);
                if ($media) {
                    $media->delete();
                }
            }
        }

        return redirect()->route('activities.show', $activity)
            ->with('success', 'Activity updated successfully.');
    }

    /**
     * Remove the specified activity from storage.
     */
    public function destroy(Activity $activity)
    {
        $this->activityService->deleteActivity($activity->id);
        
        return redirect()->route('activities.index')
            ->with('success', 'Activity deleted successfully.');
    }

}
