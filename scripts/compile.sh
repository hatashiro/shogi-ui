#!/usr/bin/env bash

scripts_dir=$(dirname $0)
project_dir="$scripts_dir/.."

java -jar $scripts_dir/closure-compiler.jar \
  --compilation_level ADVANCED_OPTIMIZATIONS \
  --language_out ECMASCRIPT6 \
  --js $project_dir/src/shogi.js \
  --js_output_file $project_dir/src/shogi-compiled.js
