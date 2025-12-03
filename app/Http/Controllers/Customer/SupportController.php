<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        $tickets = Auth::user()->SupportTickets()->with('replies')->latest()->paginate(10);
        return Inertia::render('Customer/Support/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function create()
    {
        return Inertia::render('Customer/Support/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,mdium,high',
        ]);

        SupportTicket::create([
            'user_id' => Auth::id(),
            'subject' => $request->subject,
            'message' => $request->message,
            'priority' => $request->priority,
            'status' => 'open',
        ]);

        return redirect()->route('customer.support.index')->with('success', 'Ticket đã được tạo.');
    }

    public function show(Request $request, SupportTicket $ticket)
    {
        $this->authorize('view', $ticket);
        $request->validate(['message' => 'required|string']);

        SupportTicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return back()->with('success', 'Trả lời đã được gửi.');
    }
}
