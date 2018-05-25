#!/usr/bin/env bash

declare -a arr=("16700204541000610086a000a000006f"
"1670020454100061008ea000a0000057"
"16700204541000610045a000a0000028"
"167002045410006104aaa000a00000ff"
"167002045410006104ada000a00000ea"
"167002045410006104bba000a0000088"
"167002045410006104c1a000a00000e9"
"167002045410006104c2a000a00000e0"
"167002045410006104c0a000a00000ee"
"167002045410006104c5a000a00000f5"
"167002045410006104c7a000a00000fb"
"167002045410006104bfa000a0000094"
"167002045410006104b3a000a00000b0")

run = ""

for i in "${arr[@]}"
do
  run+="nodejs spm.js -i ${i} & "
done

eval "$run""wait"
