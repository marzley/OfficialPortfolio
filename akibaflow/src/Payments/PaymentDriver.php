<?php
declare(strict_types=1);
namespace Akiba\Payments;

interface PaymentDriver
{
    public function name(): string;

    /**
     * Ask the provider to prompt the payer.
     * @param array{amount_minor:int,phone:string,reference:string,description:string} $req
     * @return array{ok:bool,unknown?:bool,checkout_id?:string,merchant_id?:string,message:string}
     *   ok=false & unknown=true means "we do not know whether the customer was prompted" (timeout etc.).
     */
    public function initiate(array $req): array;

    /**
     * Independently ask the provider for the outcome.
     * @return array{status:'success'|'failed'|'pending'|'error',code:string,desc:string}
     */
    public function query(string $checkoutId): array;
}
