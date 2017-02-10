#!/usr/bin/env bash

HN=`hostname`

if [[ $HN == "edison" ]]; then
  echo "Edison should reboot!"
  shutdown -r now
else
  echo "Edison does not need to reboot!"
fi
