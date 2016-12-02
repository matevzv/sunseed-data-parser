#!/usr/bin/env bash

USBNET="auto usb1
allow-hotplug usb1
iface usb1 inet dhcp
dns-nameservers 193.189.160.13 193.189.160.23"

DIR="/sys/class/gpio/gpio46"

if ! [ -d $DIR ]; then
  echo "46" > /sys/class/gpio/export
  echo "out" > /sys/class/gpio/gpio46/direction
  sleep 1
fi

echo "1" > /sys/class/gpio/gpio46/value
sleep 1
echo "0" > /sys/class/gpio/gpio46/value
sleep 1

ATTEMPT=0
while [ $ATTEMPT -lt 10 ]; do
  USB=`lsusb`

  if [[ $USB == *"1e2d:0061"* ]]; then
    echo "Modem is present."
    echo "$USBNET" > /etc/network/interfaces.d/usbnet
    sed -i -e 's/eth0/usb1/g' /bin/set-hostname.sh
    sed -i -e 's/eth0/usb1/g' /bin/videk
    systemctl enable mdm.service
    shutdown -r +1
    exit
  else
    echo "Modem is not present."
  fi

  let ATTEMPT=ATTEMPT+1
  sleep 5
done
