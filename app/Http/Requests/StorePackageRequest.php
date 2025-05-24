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
            'location' => 'required|string|max:255',
            'visibility' => 'in:public,private',
            'activities' => 'array',
            'activities.*.title' => 'required_with:activities|string|max:255',
            'activities.*.description' => 'required_with:activities|string',
            'activities.*.location' => 'required_with:activities|string|max:255',
            'activities.*.start_time' => 'required_with:activities|date',
            'activities.*.end_time' => 'required_with:activities|date|after:activities.*.start_time',
            'activities.*.price' => 'required_with:activities|numeric|min:0',
            'addon.type' => 'in:fixed,percentage',
            'addon.amount' => 'required_with:addon|numeric|min:0',
        ];
    }
}
