<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'total_price' => 'required|numeric|min:0',
            'discount_applied' => 'nullable|numeric|min:0',
            'free_visit' => 'nullable|boolean',
        ]);
        
        $transaction = Transaction::create([
            'customer_id' => $request->customer_id,
            'service_id' => $request->service_id,
            'total_price' => $request->total_price,
            'discount_applied' => $request->discount_applied ?? 0,
            'free_visit' => $request->free_visit ?? false,
        ]);
        
        return response()->json($transaction, 201);
    }
    
    public function generateReceipt($id)
    {
        $transaction = Transaction::with(['customer', 'service', 'service.employee'])
            ->findOrFail($id);
        
        $pdf = PDF::loadView('receipts.transaction', [
            'transaction' => $transaction
        ]);
        
        return $pdf->download('receipt_' . $transaction->id . '.pdf');
    }
    
    public function dailySales(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        
        $transactions = Transaction::with(['customer', 'service'])
            ->whereHas('service', function ($query) use ($date) {
                $query->whereDate('date', $date);
            })
            ->get();
        
        $totalSales = $transactions->sum('total_price');
        $totalDiscounts = $transactions->sum('discount_applied');
        $freeVisits = $transactions->where('free_visit', true)->count();
        
        return response()->json([
            'date' => $date,
            'transactions' => $transactions,
            'summary' => [
                'total_sales' => $totalSales,
                'total_discounts' => $totalDiscounts,
                'free_visits' => $freeVisits,
                'net_sales' => $totalSales - $totalDiscounts,
                'transaction_count' => $transactions->count(),
            ]
        ]);
    }
    
    public function monthlySales(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);
        
        $transactions = Transaction::with(['customer', 'service'])
            ->whereHas('service', function ($query) use ($year, $month) {
                $query->whereYear('date', $year)
                      ->whereMonth('date', $month);
            })
            ->get();
        
        // Group by day
        $dailySales = [];
        foreach ($transactions as $transaction) {
            $day = date('j', strtotime($transaction->service->date));
            
            if (!isset($dailySales[$day])) {
                $dailySales[$day] = [
                    'total_sales' => 0,
                    'total_discounts' => 0,
                    'free_visits' => 0,
                    'transaction_count' => 0,
                ];
            }
            
            $dailySales[$day]['total_sales'] += $transaction->total_price;
            $dailySales[$day]['total_discounts'] += $transaction->discount_applied;
            $dailySales[$day]['free_visits'] += $transaction->free_visit ? 1 : 0;
            $dailySales[$day]['transaction_count'] += 1;
        }
        
        // Calculate monthly totals
        $totalSales = $transactions->sum('total_price');
        $totalDiscounts = $transactions->sum('discount_applied');
        $freeVisits = $transactions->where('free_visit', true)->count();
        
        return response()->json([
            'year' => $year,
            'month' => $month,
            'daily_sales' => $dailySales,
            'summary' => [
                'total_sales' => $totalSales,
                'total_discounts' => $totalDiscounts,
                'free_visits' => $freeVisits,
                'net_sales' => $totalSales - $totalDiscounts,
                'transaction_count' => $transactions->count(),
            ]
        ]);
    }
    
    public function dailySalesPdf(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        
        $transactions = Transaction::with(['customer', 'service', 'service.employee'])
            ->whereHas('service', function ($query) use ($date) {
                $query->whereDate('date', $date);
            })
            ->get();
        
        $totalSales = $transactions->sum('total_price');
        $totalDiscounts = $transactions->sum('discount_applied');
        $freeVisits = $transactions->where('free_visit', true)->count();
        
        $summary = [
            'total_sales' => $totalSales,
            'total_discounts' => $totalDiscounts,
            'free_visits' => $freeVisits,
            'net_sales' => $totalSales - $totalDiscounts,
            'transaction_count' => $transactions->count(),
        ];
        
        $pdf = PDF::loadView('reports.daily_sales', [
            'date' => $date,
            'transactions' => $transactions,
            'summary' => $summary
        ]);
        
        return $pdf->download('daily_sales_' . $date . '.pdf');
    }
    
    public function monthlySalesPdf(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);
        
        $transactions = Transaction::with(['customer', 'service', 'service.employee'])
            ->whereHas('service', function ($query) use ($year, $month) {
                $query->whereYear('date', $year)
                      ->whereMonth('date', $month);
            })
            ->get();
        
        // Group by day
        $dailySales = [];
        foreach ($transactions as $transaction) {
            $day = date('j', strtotime($transaction->service->date));
            
            if (!isset($dailySales[$day])) {
                $dailySales[$day] = [
                    'total_sales' => 0,
                    'total_discounts' => 0,
                    'free_visits' => 0,
                    'transaction_count' => 0,
                ];
            }
            
            $dailySales[$day]['total_sales'] += $transaction->total_price;
            $dailySales[$day]['total_discounts'] += $transaction->discount_applied;
            $dailySales[$day]['free_visits'] += $transaction->free_visit ? 1 : 0;
            $dailySales[$day]['transaction_count'] += 1;
        }
        
        // Calculate monthly totals
        $totalSales = $transactions->sum('total_price');
        $totalDiscounts = $transactions->sum('discount_applied');
        $freeVisits = $transactions->where('free_visit', true)->count();
        
        $summary = [
            'total_sales' => $totalSales,
            'total_discounts' => $totalDiscounts,
            'free_visits' => $freeVisits,
            'net_sales' => $totalSales - $totalDiscounts,
            'transaction_count' => $transactions->count(),
        ];
        
        $pdf = PDF::loadView('reports.monthly_sales', [
            'year' => $year,
            'month' => $month,
            'daily_sales' => $dailySales,
            'transactions' => $transactions,
            'summary' => $summary
        ]);
        
        return $pdf->download('monthly_sales_' . $year . '_' . $month . '.pdf');
    }
}