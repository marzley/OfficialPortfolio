<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CorrelationId
{
    public function handle(Request $request, Closure $next)
    {
        $id = (string) Str::uuid(); // never trust a client-supplied value in logs/audit
        $request->attributes->set('correlation_id', $id);
        Log::shareContext(['correlation_id' => $id]);
        $response = $next($request);
        $response->headers->set('X-Correlation-Id', $id);
        return $response;
    }
}
