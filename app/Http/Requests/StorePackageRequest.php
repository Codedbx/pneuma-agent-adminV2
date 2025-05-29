<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        //  return $this->user()->hasAnyRole(['admin', 'agent']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'agent_addon_price' => 'required|numeric|min:0',
            'agent_price_type' => 'required|in:fixed,percentage',
            'check_in_time' => 'required|date_format:H:i',
            'check_out_time' => 'required|date_format:H:i|after:check_in_time',
            'booking_start_date' => 'required|date',
            'booking_end_date' => 'required|date|after:booking_start_date',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_refundable' => 'nullable|boolean',
            'terms_and_conditions' => 'nullable|string',
            'cancellation_policy' => 'nullable|string',
            'location' => 'required|string|max:255',
            'visibility' => 'nullable|in:public,private',
            'package_images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'activities' => 'nullable|array',
            'activities.*' => 'exists:activities,id',
            // Flight details
            'flight_from' => 'nullable|string|max:255',
            'flight_to' => 'nullable|string|max:255',
            'airline_name' => 'nullable|string|max:255',
            'booking_class' => 'nullable|in:economy,business',
            // Hotel details
            'hotel_name' => 'nullable|string|max:255',
            'hotel_star_rating' => 'nullable|integer|min:1|max:5',
            'hotel_checkin' => 'nullable|date',
            'hotel_checkout' => 'nullable|date|after:hotel_checkin',
        ];
    }
}
