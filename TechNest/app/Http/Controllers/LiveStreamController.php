<?php

namespace App\Http\Controllers;

use App\Models\LiveStream;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LiveStreamController extends Controller
{
    public function index()
    {
        $liveStreams = LiveStream::with('seller')
            ->where('status', 'live')
            ->orderBy('started_at', 'desc')
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
                    'created_at' => $stream->created_at->toISOString(),
                    'updated_at' => $stream->updated_at->toISOString(),
                ];
            });

        return Inertia::render('Live/LiveList', [
            'liveStreams' => $liveStreams,
        ]);
    }
}
