#!/usr/bin/env bash

RESET=0
ATTEMPT=0
while [ $ATTEMPT -lt 10 ]; do
  HN=`hostname`

  if [[ $HN == "edison" ]]; then
    let RESET=RESET+1
  fi

  let ATTEMPT=ATTEMPT+1
  sleep 1
done

if [[ $RESET == 10 ]]; then
  echo "Edison should reboot!"
  shutdown -r +1
else
  echo "Edison does not need to reboot!"
fi
