<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'                 => ['sometimes','required','string','max:255'],
            'description'           => ['sometimes','required','string'],
            'base_price'            => ['sometimes','required','numeric','min:0'],
            'agent_addon_price'     => ['sometimes','nullable','numeric','min:0'],
            'agent_price_type'      => ['sometimes','required','in:fixed,percentage'],
            'booking_start_date'    => ['sometimes','required','date','before_or_equal:booking_end_date'],
            'booking_end_date'      => ['sometimes','required','date','after_or_equal:booking_start_date'],
            'is_active'             => ['sometimes','boolean'],
            'is_featured'           => ['sometimes','boolean'],
            'is_refundable'         => ['sometimes','boolean'],
            'terms_and_conditions'  => ['sometimes','nullable','string'],
            'cancellation_policy'   => ['sometimes','nullable','string'],
            'location'              => ['sometimes','required','string'],
            'visibility'            => ['sometimes','required','in:public,private,agents_only'],
            'flight_from'           => ['sometimes','nullable','string'],
            'flight_to'             => ['sometimes','nullable','string'],
            'airline_name'          => ['sometimes','nullable','string'],
            'booking_class'         => ['sometimes','nullable','in:economy,premium_economy,business,first'],
            'hotel_name'            => ['sometimes','nullable','string'],
            'hotel_star_rating'     => ['sometimes','nullable','integer','between:1,5'],
            'hotel_checkin'         => ['sometimes','nullable','date','before_or_equal:hotel_checkout'],
            'hotel_checkout'        => ['sometimes','nullable','date','after_or_equal:hotel_checkin'],
         
            'activities'            => ['sometimes','array'],
            'activities.*'          => ['exists:activities,id'],
            'package_images.*'      => ['sometimes','image','max:5120'],
            'delete_media'          => ['sometimes','array'],
            'delete_media.*'        => ['exists:media,id'],
        ];
    }
}
