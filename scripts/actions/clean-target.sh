#!/bin/bash

set -e # fail on any error
set -u # treat unset variables as error

find ./target/release -maxdepth 1 -type f -delete;
rm -fr ./target/release/{deps,.fingerprint}/*{parity,ethcore,ethkey,ethstore,parity-evm}*;
rm -f  ./target/.rustc_info.json;
