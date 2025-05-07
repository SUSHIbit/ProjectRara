<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index()
    {
        // Only accessible by managers
        $attendances = Attendance::with('user')
            ->whereHas('user', function ($query) {
                $query->whereIn('role', ['employee', 'manager']);
            })
            ->orderBy('date', 'desc')
            ->paginate(15);
        
        return response()->json($attendances);
    }
    
    public function clockIn(Request $request)
    {
        $user = Auth::user();
        
        // Check if user is already clocked in
        $existingAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->whereNull('clock_out')
            ->first();
        
        if ($existingAttendance) {
            return response()->json(['message' => 'You are already clocked in'], 400);
        }
        
        // Create new attendance record
        $attendance = Attendance::create([
            'user_id' => $user->id,
            'clock_in' => now(),
            'date' => now()->toDateString(),
        ]);
        
        return response()->json($attendance);
    }
    
    public function clockOut(Request $request)
    {
        $user = Auth::user();
        
        // Find the active attendance record
        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->whereNull('clock_out')
            ->first();
        
        if (!$attendance) {
            return response()->json(['message' => 'No active clock-in found'], 400);
        }
        
        // Update the clock out time
        $attendance->clock_out = now();
        $attendance->save();
        
        return response()->json($attendance);
    }
    
    public function update(Request $request, $id)
    {
        // Only managers can update attendance records
        $attendance = Attendance::findOrFail($id);
        
        $request->validate([
            'clock_in' => 'nullable|date',
            'clock_out' => 'nullable|date|after_or_equal:clock_in',
        ]);
        
        if ($request->has('clock_in')) {
            $attendance->clock_in = $request->clock_in;
        }
        
        if ($request->has('clock_out')) {
            $attendance->clock_out = $request->clock_out;
        }
        
        $attendance->save();
        
        return response()->json($attendance);
    }
    
    public function current()
    {
        $user = Auth::user();
        
        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->whereNull('clock_out')
            ->first();
        
        $clockedIn = (bool) $attendance;
        
        return response()->json([
            'clocked_in' => $clockedIn,
            'id' => $attendance ? $attendance->id : null,
            'clock_in' => $attendance ? $attendance->clock_in : null,
        ]);
    }
}