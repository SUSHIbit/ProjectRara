<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);
        
        $customer = User::where('phone', $request->phone)
            ->where('role', 'customer')
            ->first();
        
        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }
        
        // Get member benefits if customer is a member
        $benefits = [];
        if ($customer->is_member) {
            $benefits = $customer->benefits()->where('is_active', true)->get();
        }
        
        return response()->json([
            'customer' => $customer,
            'benefits' => $benefits,
        ]);
    }
    
    public function members()
    {
        // Get all users who are members or have pending membership
        $members = User::where('role', 'customer')
            ->where(function ($query) {
                $query->where('is_member', true)
                    ->orWhere('membership_pending', true);
            })
            ->get();
        
        return response()->json($members);
    }
    
    public function memberDetails($id)
    {
        $member = User::where('id', $id)
            ->where('role', 'customer')
            ->where(function ($query) {
                $query->where('is_member', true)
                    ->orWhere('membership_pending', true);
            })
            ->firstOrFail();
        
        // Get member benefits
        $benefits = $member->benefits;
        
        // Get recent transactions
        $transactions = $member->transactions()
            ->with('service')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        
        return response()->json([
            'member' => $member,
            'benefits' => $benefits,
            'transactions' => $transactions,
        ]);
    }
    
    public function approveMembership($id)
    {
        $member = User::where('id', $id)
            ->where('role', 'customer')
            ->where('membership_pending', true)
            ->firstOrFail();
        
        $member->is_member = true;
        $member->membership_pending = false;
        $member->save();
        
        return response()->json(['message' => 'Membership approved successfully']);
    }
    
    public function rejectMembership($id)
    {
        $member = User::where('id', $id)
            ->where('role', 'customer')
            ->where('membership_pending', true)
            ->firstOrFail();
        
        $member->membership_pending = false;
        $member->save();
        
        return response()->json(['message' => 'Membership rejected successfully']);
    }
}