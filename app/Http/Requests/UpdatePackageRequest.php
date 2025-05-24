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
        // $package = $this->route('package');
        // return $this->user()->hasRole('admin') || 
        //        ($this->user()->hasRole('agent') && $package->owner_id === $this->user()->id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'base_price' => 'sometimes|numeric|min:0',
            'location' => 'sometimes|string|max:255',
            'visibility' => 'sometimes|in:public,private',
            'activities' => 'sometimes|array',
            'activities.*.title' => 'required_with:activities|string|max:255',
            'activities.*.description' => 'required_with:activities|string',
            'activities.*.location' => 'required_with:activities|string|max:255',
            'activities.*.start_time' => 'required_with:activities|date',
            'activities.*.end_time' => 'required_with:activities|date|after:activities.*.start_time',
            'activities.*.price' => 'required_with:activities|numeric|min:0',
            'addon.type' => 'sometimes|in:fixed,percentage',
            'addon.amount' => 'required_with:addon|numeric|min:0',
        ];
    }
}
