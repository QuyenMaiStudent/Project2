<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Cloudinary\Configuration\Configuration;

class CloudinaryServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Set Cloudinary configuration
        Configuration::instance([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key' => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret')
            ],
            'url' => [
                'secure' => config('services.cloudinary.secure', true)
            ]
        ]);
    }

    public function register()
    {
        //
    }
}