# docSlider.js
docSlider.js is a JavaScript plugin that works without jQuery.<br>
Change the entire web page to the slide contents.

## Demo
+ [https://prjct-samwest.github.io/docSlider/](https://prjct-samwest.github.io/docSlider/)

## Usage
### Step.1 - Include CSS and Javascript file
Add a CSS link to ```<head>``` tag.
```html
<link rel="stylesheet" href="docSlider.css">
```
Add a JavaScript link to just before the ```</body>``` tag.
```html
<script src="docSlider.min.js"></script>
```
### Step.2 - HTML Mark up
```html
<div class="docSlider">
  <section>...</section>
  <section>...</section>
  <section>...</section>
</div>
```
### Step.3 - Initialize docSlider
```javascript
docSlider.init();
```

## Options
|Option|Type|Default|    Description  |
| ---- | ---- |---- |--------|
|speed|int|600|Page change speed (ms)|
|startSpeed|int|null|Page change speed (ms)<br> When jumping from an external page using a hashtag.<br>If not set, it will be the same value as speed.|
|easing|string|'ease'|Page change easing animation.<br>Equivalent to the CSS property "transition-timing-function".|
|pager|boolean|true|Show pager button.|
|horizontal|boolean|false|Move the page horizontally.|
|complete|function| |Callback function. See below for further details.|
|beforeChange|function| |Callback function. See below for further details.|
|afterChange|function| |Callback function. See below for further details.|

|Callback|Params|Description|
|----|----|----|
|complete|options|Triggered after the docSlider has been initialized.|
|beforeChange|index, page, toIndex, toPage, type|Triggered before the page changes.|
|afterChange|index, page, fromIndex, fromPage, type|Triggered after the page has changed.|

#### speed and easing change example 
```javascript
docSlider.init({
    speed : 400,
    easing : 'ease-in-out'
});
```
#### callback example 
```javascript
docSlider.init({
    afterChange : function(index){
        console.log('current index is ' + index);
    }
});
```

## Methods
|Method|Arguments|Description|
|----|----|----|
|init|options : object|Initialize docSlider.|
|jumpPage|to : int or string,<br>speed : int,<br>easing : string|Jump to any page.|
|nextPage|speed : int,<br>easing : string|Jump to next page.|
|prevPage|speed : int,<br>easing : string|Jump to previous page.|
|getOptions| |Gets an options object value.|
|getElements| |Gets docSlider's Elements object value.|
|getCurrentIndex| |Gets an current page index value.|
|getCurrentPage| |Gets an current page element.|
|enable|toggle : boolean|Enable / disable all docSlider's operations.|

#### jumpPage method example 
```javascript
docSlider.init(2);  // Jumps to the page with index number 2 (page 3).
```
#### jumpPage method example (using a hashtag)
```javascript
docSlider.init('foo');  // Jumps to the page with id name 'foo' (page 2).
```
When using the hash tag jump, it is necessary to set the ID name as necessary.
```html
<div class="docSlider">
  <section id="hoge">...</section>
  <section id="foo">...</section>
  <section id="bar">...</section>
</div>
```

## Other features
### 1. Jump from external site to any page
```html
<a href="index.html#foo">jump to #foo page</a>
```
Just link like you would a normal anchor link.<br>
When using the hash tag jump, it is necessary to set the ID name as necessary.

### 2. Supports scroll elements
You can avoid the mouse wheel event conflict by simply adding the class name `"docslider-scroll"` to the scroll element.
```html
<div class="docSlider-scroll">
  ....
  ....
  ....
</div>
```
### 3. Supports key-press
|Key|Description|
|----|----|
|[ Space ] / [ PageDown ] / [ ArrowDown ]|Scroll down / jump to next page.|
|[ Shift ] + [ Space ] / [ PageUp ] / [ ArrowUp ]|Scroll up / jump to previous page.|
|[ End ]|Jump to last page.|
|[ Home ]|Jump to first page.|
|[ Tab ]|Jump to next page.|
|[ Shift ] + [ Tab ]|Jump to previous page.|
|[ ArrowRight ]|Jump to next page.(horizontal mode only)|
|[ ArrowLeft ]|Jump to previous page.(horizontal mode only)|

## Browser support
docSlider.js works on modern browser as Chrome, Firefox, Safari, Edge, IE11.
## License
Created by SamWest.<br>
Copyright (c) 2020 SamWest.<br>
This plugin is released under the MIT License.