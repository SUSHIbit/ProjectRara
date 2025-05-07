<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Receipt #{{ $transaction->id }}</title>
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
        .logo {
            max-width: 200px;
            margin-bottom: 10px;
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
        .info-section {
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            margin-bottom: 5px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
        }
        .info-value {
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
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        .total-row {
            margin-bottom: 5px;
        }
        .total-label {
            font-weight: bold;
            margin-right: 10px;
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
        <div class="title">RECEIPT</div>
        <div class="subtitle">Transaction #{{ $transaction->id }}</div>
    </div>
    
    <div class="info-section">
        <div class="info-row">
            <div class="info-label">Date:</div>
            <div class="info-value">{{ date('F j, Y', strtotime($transaction->created_at)) }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Customer:</div>
            <div class="info-value">{{ $transaction->customer->name }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Phone:</div>
            <div class="info-value">{{ $transaction->customer->phone }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Employee:</div>
            <div class="info-value">{{ $transaction->service->employee->name }}</div>
        </div>
    </div>
    
    <table class="table">
        <thead>
            <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $transaction->service->service_type }}</td>
                <td>{{ date('F j, Y', strtotime($transaction->service->date)) }}</td>
                <td>${{ number_format($transaction->total_price + $transaction->discount_applied, 2) }}</td>
            </tr>
        </tbody>
    </table>
    
    <div class="totals">
        <div class="total-row">
            <span class="total-label">Subtotal:</span>
            ${{ number_format($transaction->total_price + $transaction->discount_applied, 2) }}
        </div>
        
        @if($transaction->discount_applied > 0)
        <div class="total-row">
            <span class="total-label">Discount:</span>
            -${{ number_format($transaction->discount_applied, 2) }}
        </div>
        @endif
        
        @if($transaction->free_visit)
        <div class="total-row">
            <span class="total-label">Free Visit Applied:</span>
            Yes
        </div>
        @endif
        
        <div class="total-row" style="font-size: 18px; font-weight: bold;">
            <span class="total-label">Total:</span>
            ${{ number_format($transaction->total_price, 2) }}
        </div>
    </div>
    
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Member Management System</p>
    </div>
</body>
</html>