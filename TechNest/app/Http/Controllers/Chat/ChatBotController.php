<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ChatBotController extends Controller
{
    public function chat(Request $request)
    {
        $apiKey = env('GROQ_API_KEY', '');
        if (empty($apiKey)) {
            return response()->json(['error' => 'GROQ_API_KEY not configured'], 500);
        }

        $model = $request->string('model')->toString() ?: 'llama-3.3-70b-versatile';
        // accept either `message` (singular) or `messages`
        $messages = $request->input('message', $request->input('messages', []));

        if (!is_array($messages) || count($messages) === 0) {
            return response()->json(['error' => 'No messages provided'], 422);
        }

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => (float) $request->input('temperature', 0.5),
            'stream' => false,
        ];

        $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Authorization: Bearer " . $apiKey,
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT => 60,
        ]);

        $out = curl_exec($ch);
        $errNo = curl_errno($ch);
        $errMsg = curl_error($ch);
        $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errNo) {
            return response()->json(['error' => "cURL error: {$errMsg}", 'errno' => $errNo], 500);
        }

        $json = json_decode($out ?: '{}', true);
        // safe access to choices path
        $text = $json['choices'][0]['message']['content'] ?? $json['choices'][0]['text'] ?? null;
        if ($text === null) {
            return response()->json(['error' => 'No content returned from provider', 'raw' => $json], 502);
        }

        return response()->json(['content' => $text, 'raw' => $json], $httpStatus ?: 200);
    }
}
