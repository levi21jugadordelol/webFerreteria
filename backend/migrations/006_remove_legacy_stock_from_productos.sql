UPDATE productos
SET stock_total = stock
WHERE stock_total = 0
  AND stock IS NOT NULL;

ALTER TABLE productos
DROP COLUMN stock;