# cadence/m2-regenerate #

This Gruntfile and associated task are meant to allow rapid deployment of a Magento 2 installation in *developer* mode. 

### Where do the files go ###

Unzip the files into *{MAGENTO_ROOT}/bin/regenerate*

### How do I use it? ###

Once you've unzipped the files, update the Gruntfile.js to make sure the path to the Magento 2 *app* folder is correct (if you followed the directions above, it should be). 

You can then run the below command to install, assuming you change into the *{MAGENTO_ROOT}/bin/regenerate* folder


```
#!bash
npm install --dev
```

And the below command to run

```
#!bash
grunt cadence:regenerate
```

### How does it work? ###

The grunt task uses *grunt-contrib-watch* to look for changes to the below files:

* app/etc/config.php
* app/**/di.xml
* app/code/**/\.php

Anytime the global config file or a di.xml file is changed, the script will clear the entire *var/generation* folder. 

If a specific php file is changed, the script will attempt to remove the generated Interceptor and/or Factory for that php file. 

### Troubleshooting ###

The biggest issue I've run into is accidentally running *bin/magento setup:di:compile* in my Magento 2 environment. If Magento detects any *.ser* files in *var/di*, it will run in a special "compiled" mode where it doesn't automatically generate code.

### Why did you add your own Gruntfile.js? ###

The grunt system included in Magento 2 at *dev/tools/* is geared towards frontend development, and it's difficult to add additional tasks which operate on the backend. For simplicity's sake, I wanted this to be a stand-alone app that you exclude from git and only run on your development box. 


### Where can I get more information? ###

See our official support guide here: https://www.cadence-labs.com/