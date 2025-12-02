<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        $tickets = SupportTicket::with('user', 'replies')->latest()->paginate(10);
        return Inertia::render('Admin/Support/Index', ['tickets' => $tickets]);
    }

    public function show(SupportTicket $ticket)
    {
        $ticket->load('user', 'replies.user');
        return Inertia::render('Admin/Support/Show', ['ticket' => $ticket]);
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $request->validate(['status' => 'required|in:open,closed']);
        $ticket->update(['status' => $request->status]);
        return back()->with('success', 'Trạng thái đã được cập nhật.');
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $request->validate(['message' => 'required|string']);

        SupportTicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return back()->with('success', 'Trả lời đã được gửi.');
    }
}
