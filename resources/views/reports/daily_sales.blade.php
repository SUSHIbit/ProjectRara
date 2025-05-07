<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Daily Sales Report - {{ $date }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 16px;
            color: #666;
        }
        .summary {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
        }
        .summary-row {
            display: flex;
            margin-bottom: 5px;
        }
        .summary-label {
            font-weight: bold;
            width: 200px;
        }
        .summary-value {
            flex: 1;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Daily Sales Report</div>
        <div class="subtitle">{{ date('F j, Y', strtotime($date)) }}</div>
    </div>
    
    <div class="summary">
        <div class="summary-row">
            <div class="summary-label">Total Sales:</div>
            <div class="summary-value">${{ number_format($summary['total_sales'], 2) }}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Total Discounts:</div>
            <div class="summary-value">${{ number_format($summary['total_discounts'], 2) }}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Net Sales:</div>
            <div class="summary-value">${{ number_format($summary['net_sales'], 2) }}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Transaction Count:</div>
            <div class="summary-value">{{ $summary['transaction_count'] }}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Free Visits Used:</div>
            <div class="summary-value">{{ $summary['free_visits'] }}</div>
        </div>
    </div>
    
    <table class="table">
        <thead>
            <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Employee</th>
                <th>Total</th>
                <th>Discount</th>
                <th>Free Visit</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $transaction)
            <tr>
                <td>{{ $transaction->id }}</td>
                <td>{{ $transaction->customer->name }}</td>
                <td>{{ $transaction->service->service_type }}</td>
                <td>{{ $transaction->service->employee->name }}</td>
                <td>${{ number_format($transaction->total_price, 2) }}</td>
                <td>${{ number_format($transaction->discount_applied, 2) }}</td>
                <td>{{ $transaction->free_visit ? 'Yes' : 'No' }}</td>
            </tr>
            @endforeach
            
            @if(count($transactions) === 0)
            <tr>
                <td colspan="7" style="text-align: center;">No transactions found for this date.</td>
            </tr>
            @endif
        </tbody>
    </table>
    
    <div class="footer">
        <p>Generated on {{ date('F j, Y H:i:s') }}</p>
        <p>Member Management System</p>
    </div>
</body>
</html>