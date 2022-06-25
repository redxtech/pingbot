#!/usr/bin/env bash

# download bible if it doesn't exist
[ ! -f Bible.TXT ] && wget -q https://raw.githubusercontent.com/cia-foundation/TempleOS/archive/Misc/Bible.TXT

# extract a line
LINE=$(shuf -en 1 {1..100000} --random-source=/dev/urandom)

echo "Line $LINE:"; tail -n "$LINE" Bible.TXT | head -n 16
