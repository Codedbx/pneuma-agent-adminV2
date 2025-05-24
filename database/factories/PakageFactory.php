<?php

namespace Database\Factories;

use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pakage>
 */
class PakageFactory extends Factory
{
    protected $model = Package::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraphs(3, true),
            'base_price' => $this->faker->randomFloat(2, 100, 5000),
            'location' => $this->faker->city() . ', ' . $this->faker->country(),
            'owner_id' => User::factory(),
            'visibility' => $this->faker->randomElement(['public', 'private']),
        ];
    }

    public function withActivities(int $count = 3): static
    {
        return $this->afterCreating(function (Package $package) use ($count) {
            $package->activities()->createMany(
                \App\Models\Activity::factory($count)->make()->toArray()
            );
        });
    }

    public function withAddon(): static
    {
        return $this->afterCreating(function (Package $package) {
            $package->addon()->create([
                'type' => $this->faker->randomElement(['fixed', 'percentage']),
                'amount' => $this->faker->randomFloat(2, 10, 100),
            ]);
        });
    }
}
