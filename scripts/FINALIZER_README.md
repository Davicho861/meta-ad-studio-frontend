Finalizer: Herramientas de apoyo para la fusión y pulido final

Propósito
--------
Colección de scripts de apoyo para localizar la PR `chore/ui-accessibility-audit`, descargar artefactos del workflow `quality-gate.yml`, y automatizar el ciclo de aplicar parches / commitear / pushear / monitorizar CI.

Requisitos
---------
- `gh` (GitHub CLI) autenticado y con permisos para el repositorio.
- `jq` para procesar JSON.
- `git`, `bash`.

Advertencia
---------
Estos scripts no realizan cambios remotos sin tu autorización explícita: requieren que los ejecutes desde una máquina con `gh` autenticado. No se ejecutan automáticamente ni se conectan por su cuenta.

Scripts
-------
- `scripts/finalizer_probe.sh [owner/repo] [branch]`
  - Localiza la PR para la rama (por defecto `chore/ui-accessibility-audit`) y descarga artefactos del último run de `quality-gate.yml`.

- `scripts/finalizer_patch_and_push.sh path/to/patch.patch "Commit message"`
  - Aplica un patch, commitea, push a `chore/ui-accessibility-audit` y monitoriza el run del workflow `quality-gate.yml` hasta que concluya (éxito o fallo). Descarga logs y artefactos del run.

Flujo sugerido (manual)
-----------------------
1. Localiza PR y descarga artefactos:

```bash
./scripts/finalizer_probe.sh Davicho861/meta-ad-studio-frontend chore/ui-accessibility-audit
```

2. Revisar artefactos descargados en `artifacts/finalizer_run_<id>/`.

3. Si detectas fallos (por ejemplo `axe` o `e2e`), preparar un patch local que corrija los problemas. Por ejemplo crear `fix-spacing.patch`.

4. Aplicar el patch y pushear:

```bash
./scripts/finalizer_patch_and_push.sh path/to/fix-spacing.patch "fix(ui): adjust spacing and animation easing"
```

5. El script monitoriza el run y descargará los artefactos del nuevo run en `artifacts/run_<id>/`.

6. Repetir hasta que el run sea exitoso y la UI cumpla el objetivo de pulido.

Fusión y limpieza
-----------------
Una vez que el CI de la PR esté en verde, puedes fusionar y limpiar ramas manualmente o con `gh`:

```bash
# Merge squash
gh pr merge --repo Davicho861/meta-ad-studio-frontend --squash --auto --merge

# Delete remote branch
gh pr close <pr-number> --delete-branch --repo Davicho861/meta-ad-studio-frontend

# Local cleanup
git checkout main
git pull origin main
git branch -D chore/ui-accessibility-audit || true
```

Nota final
---------
Si deseas que ejecute comandos `gh` desde este entorno, necesito que me habilites acceso con `gh` autenticado o pegues aquí los outputs de `gh` para que los analice y aplique parches localmente. No puedo ejecutar llamadas de red sin credenciales en este entorno.
