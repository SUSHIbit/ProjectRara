<?php

namespace App\Http\Controllers;

use App\Models\MemberBenefit;
use App\Models\User;
use Illuminate\Http\Request;

class BenefitController extends Controller
{
    /**
     * Display a listing of the benefits.
     */
    public function index()
    {
        $benefits = MemberBenefit::with('user')->get();
        
        return response()->json($benefits);
    }
    
    /**
     * Store a newly created benefit in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:discount,loyalty',
            'value' => 'required_if:type,discount|nullable|numeric|min:0|max:100',
            'threshold' => 'required_if:type,loyalty|nullable|integer|min:1',
            'is_active' => 'nullable|boolean'
        ]);
        
        // Check if user is a member
        $user = User::findOrFail($request->user_id);
        
        if (!$user->is_member) {
            return response()->json(['message' => 'User is not a member'], 400);
        }
        
        $benefit = MemberBenefit::create([
            'user_id' => $request->user_id,
            'type' => $request->type,
            'value' => $request->value,
            'threshold' => $request->threshold,
            'is_active' => $request->is_active ?? true,
        ]);
        
        return response()->json($benefit, 201);
    }
    
    /**
     * Update the specified benefit in storage.
     */
    public function update(Request $request, $id)
    {
        $benefit = MemberBenefit::findOrFail($id);
        
        $request->validate([
            'type' => 'sometimes|required|in:discount,loyalty',
            'value' => 'required_if:type,discount|nullable|numeric|min:0|max:100',
            'threshold' => 'required_if:type,loyalty|nullable|integer|min:1',
            'is_active' => 'nullable|boolean'
        ]);
        
        $benefit->update($request->only([
            'type',
            'value',
            'threshold',
            'is_active'
        ]));
        
        return response()->json($benefit);
    }
    
    /**
     * Remove the specified benefit from storage.
     */
    public function destroy($id)
    {
        $benefit = MemberBenefit::findOrFail($id);
        $benefit->delete();
        
        return response()->json(['message' => 'Benefit deleted successfully']);
    }
    
    /**
     * Get all benefits for a specific member.
     */
    public function memberBenefits($memberId)
    {
        $benefits = MemberBenefit::where('user_id', $memberId)->get();
        
        return response()->json($benefits);
    }
}