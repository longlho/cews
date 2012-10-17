#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
forever start server.js --port=8080 --logfile=/var/tmp/ui/ui_8080.log &
forever start server.js --port=8081 --logfile=/var/tmp/ui/ui_8081.log &
