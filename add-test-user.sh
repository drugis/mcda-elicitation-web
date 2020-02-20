#!/bin/bash
# It is best to run this script and end-to-end tests against an empty database.
# The inserted password hash was generated from the password 'test'.

psql -U mcdaweb -c "INSERT INTO Account (username, firstName, lastName, password) VALUES ('user', 'user', 'user', '\$2a\$10\$TmvbK5.HpkoPGDV5ykycsOFIJbvDHAtgwW.JfyLNGPrBCSABAq9Na')"
