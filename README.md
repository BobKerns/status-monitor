# status-monitor

A set of utilities for monitoring status and results of activities on a web page.

## IdGenerator
Generates a series of IDs to identify activities.


# Content

## Primary organization

The important files are the outputs included in the published module, and the sources that
produce them. The rest are supporting mechanisms.

## package.json


## /lib/

This holds the built Javascript files. By default, three versions are built, for compatibility with various module systems. Ultimately, the world is moving toward the ECMAScript module format, but in the meantime,
### /lib/esm
This holds files in the ECMAScript module format.

### /lib/cjs
This uses the CommonJS used traditionally by node.

### /lib/umd
This holds files in the UMD format, a flat file loadable by web browsers.
