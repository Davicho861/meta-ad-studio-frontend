#!/bin/bash

        # Script para verificar la existencia de subdirectorios recursivos con el nombre "meta-studio-flow-main"

        find . -name "meta-studio-flow-main" -type d -print0 | while IFS= read -r -d $'\0' dir; do
          parent=$(dirname "$dir")
          if [[ "$parent" == *"meta-studio-flow-main"* ]]; then
            echo "ERROR: Se encontró un directorio recursivo: $dir"
            exit 1
          fi
        done

        echo "No se encontraron directorios recursivos."
        exit 0