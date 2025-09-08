Apply patch/bundle helper

Archivos generados por el agente:
- /tmp/meta-verse-visualizer-chore-ui-accessibility-audit.bundle
- /tmp/meta-verse-visualizer-chore-ui-accessibility-audit.patch
- /home/davicho/Davicho861/Meta-Ad-Studio-/PR_UI_ACCESSIBILITY.md

Uso recomendado (en una máquina con el repo clonado y remoto configurado):

1) Copiar el bundle/patch al host de trabajo (o usar rutas locales si está en el mismo filesystem).
2) Ir al clone del repo destino y ejecutar (ejemplo):

   ./scripts/apply_patch_and_push.sh --bundle /path/to/meta-verse-visualizer-chore-ui-accessibility-audit.bundle --branch chore/ui-accessibility-audit --remote origin --pr-body /path/to/PR_UI_ACCESSIBILITY.md

3) Si `gh` está disponible, el script intentará crear el PR automáticamente.

Notas:
- Si el comando falla al aplicar el patch con `git am`, revisa manualmente el patch y aplícalo con `git apply` seguido de un commit.
- El script comprueba que el working tree esté limpio antes de ejecutar.
