# docSlider.js
docSlider.js is a JavaScript plugin that works without jQuery.  
Change the web sections to a one-page scroll.

***
### TOC
- [Demo](#Demo)
- [Install](#Install)
    - [npm Install](#npm-Install)
    - [File Download](#File-Download)
- [Usage](#Usage)
- [Options](#Options)
- [Methods](#Methods)
- [Other Features](#Other-Features)
- [Browser support](#Browser-support)
- [Version](#Version)
- [License](#License)
***



## Demo
https://prjct-samwest.github.io/docSlider/

## Install
Install it from npm or download the file.

### npm Install
```npm
npm install docslider
```

### File Download
https://github.com/prjct-samwest/docSlider/archive/v2.0.4.zip

## Usage

### Step1 - Include the CSS and JavaScript files
Add a CSS to the `<head>` tag.
```html
<link rel="stylesheet" href="docSlider.css">
```
Add a JavaScript to just before the `</body>` tag.
```html
<script src="docSlider.min.js"></script>
```

### Step2 - HTML markup
```html
<div class="docSlider">
    <section>...</section>
    <section>...</section>
    <section>...</section>
</div>
```

### Step3 - Initialize docSlider
```javascript
docSlider.init();
```

## Options
|Option|Type|Default|Description|
|---|---|---|---|
|speed|int|600|Page change speed.(ms)|
|easing|string|"ease"|Page change easing animation. <br> It corresponds to the CSS property `"transition-timing-function"`.|
|pager|boolean|true|Show pager button.|
|horizontal|boolean|false|Horizontal scroll mode.|
|startSpeed|int|null|Page change speed when jumping from an external page using a hashtag. (ms) <br> If not set, it will be set to the same value as `"speed"`.|
|complete|function||Callback function. See below for details.|
|beforeChange|function||Callback function. See below for details.|
|afterChange|function||Callback function. See below for details.|
|setInitCss|function||CSS setting function. See below for details.|
|setChangeCss|function||CSS setting function. See below for details.|

#### Examples
```javascript
// change the speed
docSlider.init({
    speed : 500
});

// change the speed and easing
docSlider.init({
    speed : 500,
    easing : 'ease-in-out'
});
```

### Callback functions
|function|Params|Description|
|---|---|---|
|complete|options, elements|Triggered after the docSlider.js has been initialized.|
|beforeChange|index, page, toIndex, toPage, type|Triggered before the page changes.|
|afterChange|index, page, fromIndex, fromPage, type	|Triggered after the page changes.|

#### Params
```
options   : options object value.
elements  : docSlider's elements object. {wrapper, pages, pager, buttons}
index     : current page index value.
page      : current page element.
toIndex   : destination page index value.
toPage    : destination page element.
fromIndex : source page index value.
fromPage  : source page element.
type      : page change type. 
            "scroll" / "pager" / "anchor" / "key" / "focus" / "jumpPage" / "nextPage" / "prevPage"
```

#### Examples
```javascript
docSlider.init({
    beforeChange : function(index){
        console.log('current index is ' + index);
    }
});
```

### CSS setting functions
If you want to change the initial placement of the page or the CSS settings for page changes, please use it.

|function|Params|Description|
|---|---|---|
|setInitCss|index, horizontal|Invoked to initialize each page. <br> Function to set the initial position CSS of the page.|
|setChangeCss|index, currentIndex, speed, easing, horizontal|Invoked to change each page. <br> Function to set the 'transition' of each page.|

#### Params
```
index        : page element's index value.
currentIndex : current page element's index value.
horizontal   : horizontal mode boolean value.
speed        : option's speed values
easing       : option's easing values
```

#### setInitCss
By default settings, the "top" or "left" property is used to place each page.
```javascript
 function(index, horizontal){

    const point = horizontal ? 'left' : 'top';
    const style = {};

    style[point] = index * 100 + '%';

    return style;

}
```

#### setChangeCss
By default settings, the "transition" property is used to make moves on each page.
```javascript
function (index, currentIndex, speed, easing, horizontal) {

    const xy = horizontal ? 'X' : 'Y';
    const style = {};

    style.transitionProperty = 'transform';
    style.transitionDuration = speed + 'ms';
    style.transitionTimingFunction = easing;
    style.transform = 'translate' + xy + '(-' + currentIndex * 100 + '%)';

    return style;

}
```

## Methods
|Method|Arguments|Description|
|---|---|---|
|init|options|Initialize docSlider.js.|
|jumpPage|to, speed, easing|Jump to any page.|
|nextPage|speed, easing|Jump to next page.|
|prevPage|speed, easing|Jump to previous page.|
|getOptions|-|Gets an options object value.|
|getElements|-|Gets docSlider.js's Elements object value.|
|getCurrentIndex|-|Gets an current page index value.|
|getCurrentPage|-|Gets an current page element.|
|enable|toggle|Enable / disable all docSlider.js's operations.|

#### jumpPage method Example
```javascript
docSlider.jumpPage(2);  // Jumps to the page with index number 2 (page 3).
```

#### jumpPage method example (using a hashtag)
```javascript
docSlider.jumpPage('foo');  // Jumps to the page with id name 'foo' (page 2).
```
If you want to use hashtag jump, you need to set the ID name if necessary.
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
If you want to use hashtag jump, you need to set the ID name if necessary.

### 2. Supports scroll elements
You can avoid mouse wheel event conflicts by simply adding the class name `"docSlider-scroll"` to the scrolling element.
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
|[ ArrowRight ]|Jump to next page. (horizontal mode only)|
|[ ArrowLeft ]|Jump to previous page. (horizontal mode only)|

## Browser support
docSlider.js works on modern browser as Chrome, Firefox, Safari, Edge, IE11.

## Version
The latest version is 2.0.4

## License
Created by SamWest.  
Copyright (c) 2020 SamWest.  
This plugin is released under the MIT License.