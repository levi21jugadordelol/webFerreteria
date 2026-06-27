/* ==========================================
   Migración 007
   Eliminar columna legacy dni_comprador
========================================== */

UPDATE pedidos
SET numero_documento = dni_comprador
WHERE numero_documento IS NULL
  AND dni_comprador IS NOT NULL;

ALTER TABLE pedidos
DROP COLUMN dni_comprador;