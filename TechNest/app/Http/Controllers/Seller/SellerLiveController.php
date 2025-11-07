<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\LiveStream;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SellerLiveController extends Controller
{
    public function dashboard()
    {
        $liveStreams = LiveStream::with('seller')
            ->where('seller_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($stream) {
                return [
                    'id' => $stream->id,
                    'title' => $stream->title,
                    'description' => $stream->description,
                    'seller_id' => $stream->seller_id,
                    'seller_name' => $stream->seller->name,
                    'room_id' => $stream->room_id,
                    'status' => $stream->status,
                    'viewer_count' => $stream->viewer_count,
                    'started_at' => $stream->started_at?->toISOString(),
                    'ended_at' => $stream->ended_at?->toISOString(),
                    'created_at' => $stream->created_at->toISOString(),
                    'updated_at' => $stream->updated_at->toISOString(),
                ];
            });

        return Inertia::render('Live/Seller/DashboardLive', [
            'liveStreams' => $liveStreams,
            'zegoConfig' => [
                'appID' => config('zego.app_id'),
                'serverSecret' => config('zego.server_secret'),
            ]
        ]);
    }

    public function start(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $liveStream = LiveStream::create([
            'title' => $request->title,
            'description' => $request->description,
            'seller_id' => Auth::id(),
            'room_id' => 'room_' . Auth::id() . '_' . time(),
            'status' => 'live',
            'started_at' => now(),
        ]);

        return redirect()->route('seller.live.stream', $liveStream);
    }

    public function stream(LiveStream $liveStream)
    {
        if ($liveStream->seller_id !== Auth::id()) {
            abort(403);
        }

        // Debug log
        Log::info('Zego Config:', [
            'appID' => config('zego.app_id'),
            'serverSecret' => config('zego.server_secret'),
            'room_id' => $liveStream->room_id
        ]);

        return Inertia::render('Live/Seller/StreamPage', [
            'liveStream' => [
                'id' => $liveStream->id,
                'title' => $liveStream->title,
                'description' => $liveStream->description,
                'seller_id' => $liveStream->seller_id,
                'seller_name' => $liveStream->seller->name,
                'room_id' => $liveStream->room_id,
                'status' => $liveStream->status,
                'viewer_count' => $liveStream->viewer_count,
                'started_at' => $liveStream->started_at?->toISOString(),
                'created_at' => $liveStream->created_at->toISOString(),
                'updated_at' => $liveStream->updated_at->toISOString(),
            ],
            'zegoConfig' => [
                'appID' => (int) config('zego.app_id'),
                'serverSecret' => config('zego.server_secret'),
            ]
        ]);
    }

    public function end(LiveStream $liveStream)
    {
        if ($liveStream->seller_id !== Auth::id()) {
            abort(403);
        }

        $liveStream->update([
            'status' => 'ended',
            'ended_at' => now(),
        ]);

        return redirect()->route('seller.live.dashboard');
    }
}
