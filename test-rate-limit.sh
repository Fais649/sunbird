#!/bin/bash
for i in {1..20}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://punk.systems/event/create &
done
wait
