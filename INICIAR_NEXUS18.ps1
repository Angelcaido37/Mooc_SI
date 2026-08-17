Write-Host "Misión NEXUS 18 - inicio local" -ForegroundColor Cyan
if (-not $env:NEXUS_TEACHER_PASSWORD) { $env:NEXUS_TEACHER_PASSWORD = Read-Host "Defina contraseña docente" }
if (-not $env:NEXUS_COURSE_CODE) { $env:NEXUS_COURSE_CODE = Read-Host "Defina código del curso (ej. SI-2026)" }
python -m pip install -r backend/requirements.txt
python run_nexus18.py
