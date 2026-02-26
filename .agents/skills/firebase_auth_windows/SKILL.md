---
name: firebase_auth_windows
description: Guía para habilitar y configurar Firebase Auth en proyectos de entorno local bajo Windows con Antigravity
---

# Configuración de Firebase Auth en Local (Windows)

**Contexto y Problema:**
Al intentar configurar Firebase en un proyecto React/Next.js que está en modo local corriendo bajo Windows, la herramienta de terminal `run_command` suele dar un error de `sandbox-exec`. Esto impide que Antigravity pueda instalar la librería `firebase` directamente.

**Solución Implementada:**
1. **Inicializar y obtener credenciales:** Usar las herramientas de MCP de Firebase (`firebase_get_environment`, `firebase_list_projects`, `firebase_init`) para habilitar el servicio y obtener la configuración.
2. **Modificar Archivos:** 
   - Modificar manualmente `package.json` para agregar `"firebase": "^10.8.0"` u otra versión reciente.
   - Crear o modificar archivo `src/lib/firebase.ts` utilizando la configuración obtenida.
   - Refactorizar el `AuthContext.tsx` o proveedor de autenticación local para importar desde `firebase/auth`.
3. **Instalación Manual o Por Script Batch:** Ya que `run_command` falla en Windows, se debe pedir al usuario que ejecute `npm install` o lanzar un `.bat` para solventar la dependencia, tras lo cual se levanta de nuevo el proyecto.

**Uso Futuro:**
La próxima vez que ocurra este error, sigue este flujo y evita perder tiempo ejecutando comandos fallidos en la sandbox. Modifica los archivos en texto y pide al usuario que corra `npm i firebase`.
