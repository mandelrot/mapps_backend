
You can add any module you want here, and (after restarting the backend)
they will be available to be called from the frontend apps webpages 
via the 'utils' socket channel. This will be useful if you want to have
some tools commonly used in your webapps.

You can use the modules already existing in this folder as a format
example, and anyway you'll find all the info in the docs.


Important note about "encryption.js": when you use an encryption module
you need to stablish a password on which the encryption will be based.
If you encrypt something with a password you have to decrypt it with the
same password, or it will not work. 
You can use the backend encryption module located in this folder, or put
one in your frontend app and use that to work (it's a developer's choice
between consistency with the whole system or modularity and independence
of your frontend app). But if your frontend module has a different
password than the backend one, you will need to get sure everything is
done with the same tool.
