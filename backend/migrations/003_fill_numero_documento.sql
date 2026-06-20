UPDATE pedidos
SET numero_documento = dni_comprador
WHERE dni_comprador IS NOT NULL;