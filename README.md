Media-API Client
---

This is the browser client to upload files to the [TCS Media-API](https://github.com/smrchy/media-api).

You can use it with general js loading or require.js.

## Installation

To install the client just place the script `build/mediaapiclient.js` or `build/mediaapiclient.min.js` to your client code.

### JS Init

Then init it by calling:

```
new window.MediaApiClient( dragSelector, [ resultsSelector, ] options );
```

#### Examples

```
new window.MediaApiClient( "#clientEl", "#results", { host: "@@host", domain: "@@domain", accesskey: "@@accesskey" } );
```

```
window.MediaApiClient.defaults( { host: "@@host", domain: "@@domain", accesskey: "@@accesskey" } )
	
new window.MediaApiClient( "#clientEl", "#results" )
new window.MediaApiClient( "#clientEl2" )
```

**Note:** You have to replace the placeholders beginning with `@@`

#### Arguments

Options can be used as JS options or data attributes. Expect the function options

* **dragSelector** ( `String|DOM|jQuery-Obj`, **required** ): A selector, dom-element or jQuery object conntaining the drag space. Within this element a file input element ( optional selector `options.inputclass` ) needs to be found.
* **resultsSelector** ( `String|DOM|jQuery-Obj` ): Optional selector to show a file rendering with status bar. But you can also do this your own by listening to the events.
* **options.host** ( `String`, **required** ): The media Api host
* **options.domain** ( `String`, **required** ): The domain to upload to
* **options.accesskey** ( `String`, **required** ): The domains access key 
* **options.maxsize** ( `Number`, *default `0`* ): Maximum size of a file. `0` means no restriction.
* **options.maxcount** ( `Number`, *default `0`*  ): Maximum count of files. `0` means no restriction.
* **options.inputclass** ( `String` ): Optional css class to find the file input
* **options.accept** ( `String` ): Mimetyps to accept.
* **options.keyprefix** ( `String` *default `clientupload`* ): Key prefix 
* **options.autostart** ( `Boolean`, *default `true`* ): Start upload on drop/change
* **options.requestSignFn** ( `Function` ): Function to generate the signature
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

**`file.upload`** *( file )*: 
File upload started
* `file` *( File )*: The file object 

**`file.done`** *( file )*: 
File upload done
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

#### `MediaApiClient.start()`

Start the upload of a file. Only relevant ist `options.autostart` is set to `false`

**Returns**

*( `File-Obj` )*: Itself

#### `MediaApiClient.stop()` **Not implemented yet**

Stop the signing/upload of a file

**Returns**

*( `File-Obj` )*: Itself

#### `MediaApiClient.cancel()` **Not implemented yet**

destroy the file

**Returns**

*( `File-Obj` )*: Itself

#### `MediaApiClient.getState()`

Returns the current state ( `new`, `start`, `signed`, `upload`, `progress`, `done`, `invalid`, `error` )

**Returns**

*( `String` )*: Current State

#### `MediaApiClient.getResult()`

The the Fileresult or `null` until it's not done.

**Returns**

*( `null|Object` )*: Returns `null` if file not done yet. Otherwise it retruned a result object ( `url`: The Url to the final file; `hash`: The filehash; `key`: The generated file key; `type`: The file mimetype ).

#### `MediaApiClient.getProgress( asFactor )`

Returns the current file progress state.

**Arguments**

* `asFactor` : *( `Boolean` default = `false` )*: Return the progress as factor from `0` to `1`. Otherwise it will return a precentage from `0` to `100`

**Returns**

*( `Number` )*: The factor or precentage

#### `MediaApiClient.getName()`

Returns the file name.

**Returns**

*( `String` )*: The file name


#### `MediaApiClient.getType()`

Returns the file type.

**Returns**

*( `String` )*: The file type

#### `MediaApiClient.getData()`

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

**`signed`** *()*: 
File has been signed

**`progress`** *( percent, event )*: 
File error
* `percent` *( Number )*: The uploaded progress in precent
* `event` *( Event )*: Xhr Event

**`done`** *()*: 
File upload done

**`invalid`** *( validation )*: 
File upload invalid
* `validation` *( Array )*: Array of invalid keys ( `maxsize`: File too big; `accept`: invalid type ) 

**`error`** *(  error )*: 
File error
* `error` *( Error )*: the error object


## OPEN Features

[ ] Cancel / Start / Stop buttons per file
[ ] Start / Cancel / Stop all button

## Release History
|Version|Date|Description|
|:--:|:--:|:--|
|v0.2.1|2014-06-11|Added details docs and some code optimisations|
|v0.2.0|2014-06-10|Gui less version|
|v0.1.0|2014-06-09|Initial version|
|v0.0.0|2014-06-09|Dev version|


## The MIT License (MIT)

Copyright © 2013 Mathias Peter, http://www.tcs.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
