#!/usr/bin/env bash

# Meta-Ad-Studio UI Dev launcher (repositorio)
# Copiar a ~/.local/bin/meta-ad-studio-ui-dev-launcher.sh para uso local.

set -euo pipefail

REPO_DIR="$HOME/Davicho861/Meta-Ad-Studio-"
SCRIPT_PATH="$REPO_DIR/scripts/start-dev-fullstack.sh"
LOG_DIR="$HOME/.cache/meta-ad-studio"
LOG_FILE="$LOG_DIR/ui-dev.log"

mkdir -p "$LOG_DIR"

if [ ! -x "$SCRIPT_PATH" ]; then
  chmod +x "$SCRIPT_PATH" || true
fi

# Prefer common terminals
TERMINALS=("gnome-terminal" "konsole" "xfce4-terminal" "tilix" "alacritty" "kitty" "x-terminal-emulator" "uxterm" "xterm")
FOUND_TERM=""
for t in "${TERMINALS[@]}"; do
  if command -v "$t" >/dev/null 2>&1; then
    FOUND_TERM="$t"
    break
  fi
done

# Command to run inside the terminal
CMD="cd \"$REPO_DIR\" && exec \"$SCRIPT_PATH\""

if [ -n "$FOUND_TERM" ]; then
  case "$FOUND_TERM" in
    gnome-terminal)
      gnome-terminal -- bash -lc "$CMD; echo; echo 'Press Enter to close...'; read -r" &
      ;;
    konsole)
      konsole -e bash -lc "$CMD; echo; echo 'Press Enter to close...'; read -r" &
      ;;
    xfce4-terminal)
      xfce4-terminal -e "bash -lc '$CMD; echo; echo Press Enter to close...; read -r'" &
      ;;
    tilix)
      tilix -e bash -lc "$CMD; echo; echo 'Press Enter to close...'; read -r" &
      ;;
    alacritty)
      alacritty -e bash -lc "$CMD; echo; echo 'Press Enter to close...'; read -r" &
      ;;
    kitty)
      kitty @ launch --title "Meta-Ad-Studio UI Dev" bash -lc "$CMD; echo; echo 'Press Enter to close...'; read -r" &
      ;;
    x-terminal-emulator|uxterm|xterm)
      "$FOUND_TERM" -e bash -lc "$CMD; echo; echo 'Press Enter to close...'; read -r" &
      ;;
    *)
      "$FOUND_TERM" -e bash -lc "$CMD; echo; echo 'Press Enter to close...'; read -r" &
      ;;
  esac
  disown
  exit 0
else
  # No terminal found — run in background and log output
  echo "No terminal emulator found, starting in background. Logs: $LOG_FILE"
  (cd "$REPO_DIR" && "$SCRIPT_PATH") &> "$LOG_FILE" &
  disown
  exit 0
fi
