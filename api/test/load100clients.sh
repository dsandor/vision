#!/bin/bash

echo "Spawning 100 clients..."
for i in {1..100} ;
do
    ( node pseudo-client.js & )
done