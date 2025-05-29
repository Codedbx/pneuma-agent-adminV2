<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('base_price', 10, 2);
            $table->decimal('agent_addon_price', 10, 2);
            $table->enum('agent_price_type', ['fixed', 'percentage']);
            $table->datetime('check_in_time');
            $table->datetime('check_out_time');
            $table->datetime('booking_start_date');
            $table->datetime('booking_end_date');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_refundable')->default(true);
            $table->text('terms_and_conditions')->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->string('location');
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->enum('visibility', ['public', 'private'])->default('public');

            // Flight details
            $table->string('flight_from')->nullable();
            $table->string('flight_to')->nullable();
            $table->string('airline_name')->nullable();
            $table->enum('booking_class', ['economy', 'business'])->nullable();
            
            // Hotel details
            $table->string('hotel_name')->nullable();
            $table->integer('hotel_star_rating')->nullable();
            $table->dateTime('hotel_checkin')->nullable();
            $table->dateTime('hotel_checkout')->nullable();
            
            $table->index(['location', 'visibility']);
            $table->index('base_price');
            $table->index('owner_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
