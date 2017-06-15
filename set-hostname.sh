#!/bin/bash

ATTEMPT=0
while [ $ATTEMPT -lt 10 ]; do
        IP=`ip addr show tun0 | grep -Po 'inet \K[\d.]+'`

        echo "${IP//[.]/-}"

        if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
                /bin/hostname "${IP//[.]/-}"
                exit 0
        else
                echo "failed to set hostname"
        fi

        let ATTEMPT=ATTEMPT+1
        sleep 1
done

exit 1