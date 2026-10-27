#!/bin/bash
# Double-click this file to start BitByBit and open the clean local URL.
set -u
cd "$(dirname "$0")" || exit 1

PORT=4173
URL="http://bitbybitja.localhost:$PORT/"

open_site() {
  if curl -s -o /dev/null --max-time 2 "$URL"; then
    open "$URL"
  else
    open "http://localhost:$PORT/"
  fi
}

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  open_site
  exit 0
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT INT TERM HUP

sleep 1
echo "BitByBit is running at $URL"
echo "Alternative: http://localhost:$PORT/"
echo "Close this window or press Ctrl+C to stop the server."
open_site
wait "$SERVER_PID"
