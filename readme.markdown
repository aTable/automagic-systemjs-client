#Usage
Remember the automagic server needs to be running

##4. Install 
`jspm install npm:automagic-systemjs-client`

##5. Load systemjs + configuration
```
<head>
	<script src="jspm_packages/system.js" type="text/javascript"></script>
	<script src="systemjs-config.js"></script>
	<script>
		System.trace = true;
	</script> 
</head>
```

##6. Connect to the server
```
import automagic from 'automagic-systemjs-client';
automagic.baseUri = 'js/';
automagic.port = 3912;
automagic.init();
```

## automagic!
It's all setup, happy coding!

###automagic
####baseUri
the base path that files are served from e.g. `http://myawesomeapp.com/{automagic.baseUri}/bootstrap.js` 

defaults `js/`

####port
port to connect to. must match the server port 

defaults `3912`

