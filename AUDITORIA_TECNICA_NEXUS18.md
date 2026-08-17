# Auditoría técnica interna NEXUS 18

## Resultado de construcción
- Suite vigente: **21/21 pruebas aprobadas**.
- Backend Python: compilación sintáctica aprobada.
- Flujo E2E verificado: acceso estudiantil con código/clave/acuse de aviso, entrega, acceso docente, calificación, promedio provisional, exportación de datos, solicitud de derechos, respaldo SHA-256 y exportación de validación.

## Corrección de ponderación
Una categoría sin ninguna evidencia evaluada se representa como `None` y no consume peso en el promedio provisional. Ejemplo verificado: evidencia=90, demás categorías sin evaluar => promedio provisional 90, peso efectivamente evaluado 35 %, promedio final pendiente.

## Estado de los cuatro factores
1. Privacidad/gobernanza: controles técnicos implementados; aprobación institucional externa pendiente.
2. Accesibilidad: capa y matriz de preparación implementadas; conformidad WCAG 2.2 AA requiere auditoría formal.
3. Respaldos/retención: backup, SHA-256, restore e integridad implementados; simulacro en infraestructura definitiva pendiente.
4. Validación empírica: instrumentación y exportación listas; el resultado sólo puede validarse con un piloto real.

NEXUS 18 no falsifica un sello institucional que todavía no haya sido otorgado.
