<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\LiveStream;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewerController extends Controller
{
    public function show(LiveStream $liveStream)
    {
        if ($liveStream->status !== 'live') {
            return redirect()->route('live.index')->with('error', 'Live stream is not available');
        }

        $liveStream->increment('viewer_count');

        return Inertia::render('Live/Viewer/LiveViewer', [
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

    public function join(LiveStream $liveStream)
    {
        if ($liveStream->status !== 'live') {
            return response()->json(['error' => 'Live stream is not available'], 400);
        }

        return response()->json(['success' => true]);
    }

    public function status(LiveStream $liveStream)
    {
        return response()->json([
            'id' => $liveStream->id,
            'status' => $liveStream->status,
        ]);
    }
}
