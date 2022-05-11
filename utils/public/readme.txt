
You can add any module you want here, and (after restarting the backend)
they will be available to be called from the frontend apps webpages 
via the 'utils' socket channel. This will be useful if you want to have
some tools commonly used in your webapps.

You can use the modules already existing in this folder as a format
example, and anyway you'll find all the info in the docs.


Note: the "encryption.js" module will also be sent by Control to the
internal/external frontend functions, so they can access the same module
(and therefore the same password) to encrypt/decript information and then
make the encryption compatible with other elements that use this same 
module. They may use their own, it's just in case the developers decide
to have an encryption coherence in all the suite.