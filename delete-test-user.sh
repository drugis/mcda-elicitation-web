#!/bin/bash

psql -U mcdaweb -c "DELETE FROM Account WHERE username LIKE 'user'"