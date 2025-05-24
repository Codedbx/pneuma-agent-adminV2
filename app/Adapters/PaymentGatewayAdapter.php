<?php

namespace App\Adapters;

class PaymentGatewayAdapter
{
    public function charge(array $data): array
    {
        $gateway = $data['gateway'];
        
        return match ($gateway) {
            'stripe' => $this->chargeStripe($data),
            'paystack' => $this->chargePaystack($data),
            default => throw new \InvalidArgumentException("Unsupported gateway: {$gateway}")
        };
    }
    
    private function chargeStripe(array $data): array
    {
        // Stripe implementation
        // This would integrate with Stripe SDK
        return [
            'success' => true,
            'transaction_id' => 'stripe_' . $data['reference'],
            'message' => 'Payment successful'
        ];
    }
    
    private function chargePaystack(array $data): array
    {
        // Paystack implementation
        // This would integrate with Paystack SDK
        return [
            'success' => true,
            'transaction_id' => 'paystack_' . $data['reference'],
            'message' => 'Payment successful'
        ];
    }
}
