Media-API Client
---

## HTML Structure

```
<label id="clientEl" class="mediaapiclient" for="clientElselect">
	<b class="dropactive"><span>click to select or drop files here</span></b>
	<b class="dropfallback"><span>Your Browser is not supported. Please use a modern Browser.</span></b>
	<input type="file" id="clientElselect" name="clientEl" multiple="multiple" />
	<div class="results"></div>
</label>
```

## JS Init

```
new window.MediaAPICli( "#clientEl", { host: "@@host", domain: "@@domain", accesskey: "@@accesskey" } );
```

```
window.MediaAPICli.defaults( { host: "@@host", domain: "@@domain", accesskey: "@@accesskey" } )
	
new window.MediaAPICli( "#clientEl" )
new window.MediaAPICli( "#clientEl2" )
```

**Note:** You have to replace the placeholders beginning with `@@`

## Options

Options can be used as JS options or data attributes. Expect the function options

* **host** ( `String`, **required** ): The media Api host
* **domain** ( `String`, **required** ): The domain to upload to
* **accesskey** ( `String`, **required** ): The domains access key 
* **maxsize** ( `Number`, *default `0`* ): Maximum size of a file. `0` means no restriction.
* **maxcount** ( `Number`, *default `0`*  ): Maximum count of files. `0` means no restriction.
* **accept** ( `String` ): Mimetyps to accept.
* **keyprefix** ( `String` *default `clientupload`* ): Key prefix 
* **autostart** ( `Boolean`, *default `true`* ): Start upload on drop/change
* **requestSignFn** ( `Function` ): Function to generate the signature
* **resultTemplateFn** ( `Function` ): Template Fucntion to display the File state.




## OPEN Features

[x] disable()
[x] enable()
[x] option.maxsize
[x] option.maxcount
[x] option.accept
[-] support for non FileAPI Browsers 