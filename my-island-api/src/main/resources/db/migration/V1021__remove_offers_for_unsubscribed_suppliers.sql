-- V1021: Remove offers for suppliers without a subscription
-- Suppliers must have a valid subscription (ACTIVE, PAST_DUE, CANCELED, UNPAID) to have offers.
-- If subscription_status is 'NONE', they should not have any offers.

DELETE FROM offers
WHERE supplier_id IN (
    SELECT id
    FROM suppliers
    WHERE subscription_status = 'NONE'
);
