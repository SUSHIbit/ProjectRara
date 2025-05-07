<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
    /**
     * Store a newly created service in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'service_type' => 'required|string',
            'notes' => 'nullable|string',
            'date' => 'required|date',
        ]);
        
        $service = Service::create([
            'user_id' => $request->user_id,
            'employee_id' => Auth::id(),
            'service_type' => $request->service_type,
            'notes' => $request->notes,
            'date' => $request->date,
        ]);
        
        return response()->json($service, 201);
    }
    
    /**
     * Display the specified service.
     */
    public function show($id)
    {
        $service = Service::with(['customer', 'employee'])->findOrFail($id);
        
        return response()->json($service);
    }
    
    /**
     * Update the specified service in storage.
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        
        $request->validate([
            'service_type' => 'sometimes|required|string',
            'notes' => 'nullable|string',
            'date' => 'sometimes|required|date',
        ]);
        
        $service->update($request->only([
            'service_type',
            'notes',
            'date'
        ]));
        
        return response()->json($service);
    }
    
    /**
     * Get services performed by the authenticated employee.
     */
    public function employeeServices()
    {
        $services = Service::where('employee_id', Auth::id())
            ->with(['customer', 'transaction'])
            ->orderBy('date', 'desc')
            ->paginate(15);
        
        return response()->json($services);
    }
    
    /**
     * Get services for a specific customer.
     */
    public function customerServices($customerId)
    {
        $services = Service::where('user_id', $customerId)
            ->with(['employee', 'transaction'])
            ->orderBy('date', 'desc')
            ->get();
        
        return response()->json($services);
    }
}