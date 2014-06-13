Media-API Client
---

This is the browser client to upload files to the [TCS Media-API](https://github.com/smrchy/media-api).

You can use it with general js loading or require.js.

## Installation

To install the client just place the script `build/mediaapiclient.js` or `build/mediaapiclient.min.js` to your client code.

### JS Init

Then init it by calling:

```
new window.MediaApiClient( dragSelector, resultsSelector, options );
```

#### Examples

**With internal GUI**

```
new window.MediaApiClient( "#clientEl", "#results", { host: "@@host", domain: "@@domain", accesskey: "@@accesskey" } );
```

**No File Object GUI**

```
new window.MediaApiClient( "#clientEl", { host: "@@host", domain: "@@domain", accesskey: "@@accesskey" } );
```

**Predefine the defaults**

```
window.MediaApiClient.defaults( { host: "@@host", domain: "@@domain", accesskey: "@@accesskey" } )
	
new window.MediaApiClient( "#clientEl", "#results" )
new window.MediaApiClient( "#clientEl2" )
```

**Note:** You have to replace the placeholders prefixed with `@@`

#### Arguments

Options can be used as JS options or data attributes. Expect the function options

* **dragSelector** ( `String|DOM|jQuery-Obj`, **required** ): A selector, dom-element or jQuery object conntaining the drag space. Within this element a file input element ( optional selector `options.inputclass` ) needs to be found.
* **resultsSelector** ( `null|String|DOM|jQuery-Obj` ): Optional selector to show a file rendering with status bar. But you can also do this your own by listening to the events. If you set this to `null` the client acts in non-GUI mode and you have to listen to the events.
* **options.host** ( `String`, **required** ): The media Api host
* **options.domain** ( `String`, **required** ): The domain to upload to
* **options.accesskey** ( `String`, **required** ): The domains access key 
* **options.maxsize** ( `Number`, *default `0`* ): Maximum size of a file. `0` means no restriction.
* **options.maxcount** ( `Number`, *default `0`* ): Maximum count of files. `0` means no restriction.
* **options.ttl** ( `Number`, *default `0`* ): File ttl to invalidate file after `n` seconds. `0` means forever.
* **options.tags** ( `Array` ): File tags to add to the media-api object.
* **options.properties** ( `Object`, *default `{ filename: "{FileApi.name}" }`* ): Property object to add to the media-api object
* **options.content-disposition** ( `String` ): the content disposition e.g. `attachment; filename=friendly_filename.pdf`
* **options.acl** ( `String`, *default `public-read`; enum:( `public-read`, `authenticated-read` )* ): The S3 access control.
* **options.inputclass** ( `String` ): Optional css class to find the file input
* **options.accept** ( `String` ): Mimetyps to accept.
* **options.keyprefix** ( `String` *default `clientupload`* ): Key prefix 
* **options.autostart** ( `Boolean`, *default `true`* ): Start upload on drop/change
* **options.requestSignFn** ( `Function` ): Function to generate the signature. This Method should be redefined by you, because the standard Media-API signing will be IP filtered. So you have to tunnel it trough your own server or generate a valid signature within your server. For details see the `Signing` section. 
* **options.resultTemplateFn** ( `Function` ): Template Fucntion to display the File state.

#### Defaults

It's possible to predefine all options by using the `MediaApiClient.defaults()` method.

Usually you would use it to store the options `host`, `domain` and `accesskey` for all client instances.
But it's possible to overwrite it with the options or html-data-attributes for every instance.

#### Components

You can write your own sub components like:

* `MediaApiClient.EventEmitter`: Internal event emitter.
* `MediaApiClient.Base`: Basic class with general error handling.
* `MediaApiClient.File`: Handling of a single file upload.
* `MediaApiClient.FileView`: File rendering to show the process.

by replacing and/or extend them.

### HTML Structure

**complete:**

With internal File object rendering.

```
<label id="clientEl" class="mediaapiclient" for="clientElselect">
	<b class="dropactive"><span>click to select or drop files here</span></b>
	<b class="dropfallback"><span>Your Browser is not supported. Please use a modern Browser.</span></b>
	<input type="file" id="clientElselect" name="clientEl" multiple="multiple" />
	<div class="results"></div>
</label>
```

**minimal:**

```
<label id="clientEl"for="clientElselect">
	<input type="file" id="clientElselect" name="clientEl" />
</label>
```

## Signing

You have to do the signing your own, because the sign endpoint of the media-api will be restricted to a list of ip's.
The upload itself will be done directly to the Media-API.

To realize this you have to overwrite the function `option.requestSignFn` and add some serverside code.

### Clientside

You have to redefine the `option.requestSignFn` to request your own server to be abele to create the signature within your own server.

The following example shows a possible solution with a call to the server taht generates the signature itself:

```
	myRequestSignFn = function( domain, accesskey, madiaapiurl, key, json, cb ){
		var mySignUrl, postData, postReq;
		var mySignUrl = "http://www.myservice.com/sign-media-api";

		var postData = {
			url: madiaapiurl,
			key: key,
			json: JSON.stringify( json )
		};

		var postReq = jQuery.post( mySignUrl, postData, null, "text" );
		
		postReq.done( function( signature ){
			cb( null, signature )
		} );

		postReq.error( function( error ){
			cb( error )
		} );
	}	
```

### Serverside 

There are two variants to do the signing.

#### Use the Media-API Sign Endpoint

After your server has been added to the secure ip list, you can use the media-api sign *( `/mediaapi/{domain}/sign/{accesskey}` )* endpoint.

	POST /mediaapi/{domain}/sign/{accesskey}

**URL-Parameter**

* **domain** *( `String` )*: Your target domain *( passed to `option.requestSignFn` function )*
* **url** *( `String` )*: The domain/bucket accesskey *( passed to `option.requestSignFn` function )*

**Form-Parameter**

* **json** *( `String` )*: A stringified JSON of the relevant media-api parameters *( passed to `option.requestSignFn` function )*
* **key** *( `String` )*: The media-api object key *( passed to `option.requestSignFn` function )*
* **url** *( `String` )*: The media-api request url you want to call *( passed to `option.requestSignFn` function )*

You will get a simple text response with the signature

**Example:**

*Request:*

	POST /mediaapi/mydomain/sign/123456789
	Content-Type: application/x-www-form-urlencoded

	json = {"blob":true,"acl":"public-read","content_type":"image/jpeg"}
	key = clientupload_rxv450jpg_1402487116_1	
	url	= http://192.168.1.8:8005/mediaapi/mediaapitest/clientupload_rxv450jpg_1402487116_1

*Response:*

	123456789ABCEFGHIJo9ZFeQ6ds=

#### Generate the signature yourself

To generate the signature your own you have to send the `json` and `madiaapiurl` passed to the `option.requestSignFn` function to your server. Therefor you have to know the domain/bucket secret within your server.

The signature itself has to be generated like the following js-code example:

```
	generateSignature = function( domainSecretKey, url, stringifiedJSON ){
		var stringToHash, shasum;
		
		// add the stringified JSON to the url if exsitend
		if( stringifiedJSON != undefined and stringifiedJSON.length >= 0 ){
			stringToHash = url + stringifiedJSON;
		} else {
			stringToHash = url;
		}
		
		// create a SHA1 hash with the domain/bucket secret
		shasum = crypto.createHmac( "sha1", domainSecretKey );
		shasum.update( stringToHash );
		
		// create the base64 encoded signature 
		return shasum.digest('base64');
	};
```

## Client Object `MediaApiClient`

The Client to start and init uploads

You cann get the current instance of the `MediaApiClient` by reading the dom-elements jQuery data attribute `mediaapiclient`.

**Example**
```
myClient = jQuery( "#clientEl" ).data( "mediaapiclient" )
```

### Methods

#### `MediaApiClient.upload( files )`

Start the upload manually. 
 
**Arguments**

* `files` : *( `FileAPI-Object[]` )*: An array of file API objects.

#### `MediaApiClient.disable()`

Disable the client. This will stop the Client from accepting new files

#### `MediaApiClient.enable()`

Enable the client.

#### `MediaApiClient.abortAll()`

Abort all file uploads

### CSS

The drag element will offer it's current state by some css Calsses added or removed.

* **`hover`**: Detected a Fiel Drag'n'Drop hover over the `dragSelector` element.
* **`process`**: Files are currently uploading.
* **`disabled`**: The Client is currently disabled

### Events

**`finish`** *()*: 
All currently running uploads are done.

**`file.new`** *( file )*: 
New file dropped/selected.
* `file` *( File )*: The file object 

**`file.content`** *( file, key, json )*: 
Event to hook a data manipulation. So you are able to change the object's key and json data before signing and uploading
* `file` *( File )*: The file object 
* `key` *( String )*: The generated key
* `json` *( Object )*: The media-api json data
	* `json.blob` *( Boolean )*: **Do not manipulate this!** Flag to define a regular file upload
	* `json.acl` *( `String`, *default `public-read`; enum:( `public-read`, `authenticated-read` )*: The S3 access control.
	* `json.ttl` *( `Number`, *default `0`)*: File ttl to invalidate file after `n` seconds. `0` means forever.
	* `json.properties` *( Object )*: Optional properties object 
	* `json.tags` *( Array )*: An Array of Strings to set object tags. The Media-API can query by this tags.
	* `json.content_type` *( String )*: The files content type read by the browser file API
	* `json.content-disposition` *( String )*: the content disposition e.g. `attachment; filename=friendly_filename.pdf`

**`file.upload`** *( file )*: 
File upload started
* `file` *( File )*: The file object 

**`file.done`** *( file )*: 
File upload done
* `file` *( File )*: The file object

**`file.aborted`** *( file )*: 
File upload aborted
* `file` *( File )*: The file object

**`file.invalid`** *( file, validation )*: 
File upload invalid
* `file` *( File )*: The file object 
* `validation` *( Array )*: Array of invalid keys ( `maxsize`: File too big; `accept`: invalid type ) 

**`file.error`** *( file, error )*: 
File error
* `file` *( File )*: The file object 
* `error` *( Error )*: the error object

## File Object

For every dropped/selected File a FileObject is generated witch initializes the signing and upload.

### Methods

#### `FileInstance.start()`

Start the upload of a file. Only relevant ist `options.autostart` is set to `false`

**Returns**

*( `File-Obj` )*: Itself

#### `FileInstance.abort()` **Not implemented yet**

Abort the signing/upload of a file

**Returns**

*( `File-Obj` )*: Itself

#### `FileInstance.getState()`

Returns the current state ( `new`, `start`, `signed`, `upload`, `progress`, `done`, `aborted`, `invalid`, `error` )

**Returns**

*( `String` )*: Current State

#### `FileInstance.getResult()`

The the Fileresult or `null` until it's not done.

**Returns**

*( `null|Object` )*: Returns `null` if file not done yet. Otherwise it retruned a result object ( `url`: The Url to the final file; `hash`: The filehash; `key`: The generated file key; `type`: The file mimetype ).

#### `FileInstance.getProgress( asFactor )`

Returns the current file progress state.

**Arguments**

* `asFactor` : *( `Boolean` default = `false` )*: Return the progress as factor from `0` to `1`. Otherwise it will return a precentage from `0` to `100`

**Returns**

*( `Number` )*: The factor or precentage

#### `FileInstance.getName()`

Returns the file name.

**Returns**

*( `String` )*: The file name


#### `FileInstance.getType()`

Returns the file type.

**Returns**

*( `String` )*: The file type

#### `FileInstance.getData()`

Returns a object of all current data ( e.g. for rendering ).

**Returns**

*( `Object` )*: 
* `name` ( `String` ): The input field name 
* `file` ( `String` ): The return of `getName()`
* `idx` ( `Number` ): The index number. A running number for all files of this client instance.
* `state` ( `String` ): The return of `getResult()`
* `result` ( `null|Object` ): The return of `getResult( false )`
* `options` ( `Object` ): The client options
* `invalid_reason` ( `null|Array` ): The invalid reasons for state `invalid` ( `maxsize`: File too big; `accept`: invalid type ) 
* `error` ( `null|Error` ): The errro details for state `error`

### Events

**`start`** *()*: 
File upload started

**`state`** *( state )*: 
New file dropped/selected.
* `state` *( String )*: The current file state ( `new`, `start`, `signed`, `upload`, `progress`, `done`, `invalid`, `error` )

**`content`** *( key, json )*: 
Event to hook a data manipulation. So you are able to change the object's key and json data before signing and uploading
* `key` *( String )*: The generated key
* `json` *( Object )*: The media-api json data
	* `json.blob` *( Boolean )*: **Do not manipulate this!** Flag to define a regular file upload
	* `json.acl` *( `String`, *default `public-read`; enum:( `public-read`, `authenticated-read` )*: The S3 access control.
	* `json.ttl` *( `Number`, *default `0`)*: File ttl to invalidate file after `n` seconds. `0` means forever.
	* `json.properties` *( Object )*: Optional properties object 
	* `json.tags` *( Array )*: An Array of Strings to set object tags. The Media-API can query by this tags.
	* `json.content_type` *( String )*: The files content type read by the browser file API
	* `json.content-disposition` *( String )*: the content disposition e.g. `attachment; filename=friendly_filename.pdf`

**`signed`** *()*: 
File has been signed

**`progress`** *( percent, event )*: 
File error
* `percent` *( Number )*: The uploaded progress in precent
* `event` *( Event )*: Xhr Event

**`done`** *()*: 
File upload done

**`aborted`** *()*: 
File upload aborted

**`invalid`** *( validation )*: 
File upload invalid
* `validation` *( Array )*: Array of invalid keys ( `maxsize`: File too big; `accept`: invalid type ) 

**`error`** *( error )*: 
File error
* `error` *( Error )*: the error object

## OPEN Features

> currently no features are planed. Please create a issue if you need a new feature.

## Release History
|Version|Date|Description|
|:--:|:--:|:--|
|v0.4.0|2014-06-13|Added file `abort`; client `abortAll`; Added event hook `content` and `file.content` to manipulate the key and json data|
|v0.3.0|2014-06-11|Added media api arguments like `ttl`, `tags`, `properties`, `acl` and `content-disposition`; Added details docs and some code optimisations|
|v0.2.0|2014-06-10|Gui less version|
|v0.1.0|2014-06-09|Initial version|
|v0.0.0|2014-06-09|Dev version|


## The MIT License (MIT)

Copyright © 2013 Mathias Peter, http://www.tcs.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
