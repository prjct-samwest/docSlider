/**-----------------------

 docSlider.js - ver.1.0.0
 URL : https://prjct-samwest.github.io/docSlider/

 created by SamWest
 Copyright (c) 2020 SamWest.
 This plugin is released under the MIT License.

 -----------------------**/

const docSlider = (function () {

    //-------------
    // VARIABLES
    //-------------
    let $options = {};
    const $elements = {};
    const $html = document.getElementsByTagName('html')[0];
    const $default_options = {
        speed : 600,
        startSpeed : null,
        easing : 'ease',
        pager : true,
        horizontal : false,
        complete : function (options) {},
        beforeChange : function (index,page,toIndex,toPage,type) {},
        afterChange : function (index,page,fromIndex,fromPage,type) {},
    };
    const $data = {
        enable : true,
        wheelEnable   : true,
        ticking : false,
        timer   : null,
        type    : null,
        pastType    : null,
        pastIndex : 0,
        currentIndex : 0,
        onWheel   : 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll',
        fromPoint   : 'elementsFromPoint' in document ? 'elementsFromPoint' : 'msElementsFromPoint',
        hash    : location.hash,
        id:[],
        page:[],
        i:[],
        isIOSChrome : /crios/.test(navigator.userAgent.toLocaleLowerCase()),
        isTouchDeice : ('maxTouchPoints' in navigator) ? navigator.maxTouchPoints : false,
        touch : {
            XY : 'Y',
            distance : false,
            start : {
                X : null,
                Y : null
            },
            move : {
                X : null,
                Y : null
            },
            pastMove : {
                X : null,
                Y : null
            }
        },
        distance : {
            top : {
                Y : 'top',
                X : 'left'
            },
            bottom : {
                Y : 'bottom',
                X : 'right'
            }
        }
    };

    //-------------
    // SET ELEMENTS
    //-------------
    {

        $elements.wrapper = document.querySelector('.docSlider');
        $elements.pages = document.querySelectorAll('.docSlider > *:not(.docSlider-pager)');
        $elements.pager = document.querySelector('.docSlider-pager');
        $elements.inner = document.createElement('div');
        $elements.inner.classList.add('docSlider-inner');

        for (let i=0; i<$elements.pages.length; i++){

            (function (i) {

                const page = $elements.pages[i];

                $data.page[i] = 'page_' + (i + 1);
                $data.id[i] = page.getAttribute('id') ? 'id_' + page.getAttribute('id') : 'id_';
                $data.i[i] = 'index_' + i;
                page.classList.add('docSlider-page');
                page.classList.add('docSlider-scroll');
                page.setAttribute('data-ds-index',i);
                page.setAttribute('tabindex',0);
                $elements.inner.appendChild( page );

            })(i);
        }

        $elements.wrapper.appendChild( $elements.inner );

        if(!$elements.pager){

            $elements.pager = document.createElement('nav');
            $elements.pager.classList.add('docSlider-pager');

            for (let i=0; i<$elements.pages.length; i++){

                (function (i) {

                    let buttons = document.createElement('button');
                    buttons.classList.add('docSlider-button');
                    buttons.setAttribute('tabindex','-1');
                    $elements.pager.appendChild( buttons );

                })(i);

            }

            $elements.wrapper.appendChild( $elements.pager );
            $elements.buttons = $elements.pager.childNodes;

        }else{

            $elements.buttons = document.querySelectorAll('.docSlider-button');

            for(let i=0; i<$elements.buttons.length; i++){

                (function (i) {
                    $elements.buttons[i].setAttribute('tabindex','-1');
                })(i);

            }

        }

        $html.classList.add($data.page[0]);
        $html.classList.add($data.i[0]);
        $html.classList.add($data.id[0]);
        $elements.buttons[0].classList.add('active');
        $elements.pages[0].focus();

    }


    //-------------
    // EVENTS
    //-------------
    const $e = {
        setCommon : function () {

            for(let i=0; i<$elements.pages.length; i++){

                (function (i) {

                    const page = $elements.pages[i];
                    const button = $elements.buttons[i];

                    page.addEventListener('focusin',{i:i, handleEvent:$e.tabFocus});
                    button.addEventListener('click',{i:i, handleEvent:$e.btnClick});

                })(i);

            }

            document.addEventListener('keyup',$e.keyup);
            $elements.wrapper.addEventListener($data.onWheel,$e.wheel);

        },
        setMobile : function(){

            $data.touch.XY = $options.horizontal ? 'X' : 'Y';

            if($data.isTouchDeice){

                $elements.inner.addEventListener('touchstart',$e.touchstart,false);
                $elements.inner.addEventListener('touchmove',$e.touchmove,false);
                $elements.inner.addEventListener('touchend',$e.touchend,false);

            }

        },
        tabFocus : function () {

            if(!$data.enable) return false;

            $f.jump(this.i,$options.speed,$options.easing);

        },
        btnClick : function () {

            if(!$data.enable) return false;

            $data.type = 'pager';
            $elements.pages[this.i].focus();

        },
        keyup : function (e) {

            if(!$data.enable) return false;

            const index = $data.currentIndex;
            const elm = $elements.pages[$data.currentIndex];
            const key = e.key;
            const shift = e.shiftKey;
            let jumpTo = false;

            if(document.activeElement !== $elements.pages[$data.currentIndex]){
                return false;
            }

            if(shift){

                if(/ |Spacebar/.test(key) && $f.isScrollEnd(elm,'top') && index > 0){
                    jumpTo = index - 1;
                }

            }else{

                if(/ |Spacebar|ArrowDown|Down|pageDown/.test(key) && $f.isScrollEnd(elm,'bottom') && index !== $elements.pages.length - 1){
                    jumpTo = index + 1;
                }else if(/ArrowUp|Up|pageUp/.test(key) && $f.isScrollEnd(elm,'top')  && index > 0){
                    jumpTo = index - 1;
                }else if(/Home/.test(key) && index !== 0){
                    jumpTo = 0;
                }else if(/End/.test(key) && index !== $elements.pages.length -1){
                    jumpTo = $elements.pages.length - 1;
                }

                if($options.horizontal){

                    if(/ArrowLeft|Left/.test(key) && index !== 0){
                        jumpTo = index - 1;
                    }else if(/ArrowRight|Right/.test(key) && index !== $elements.pages.length -1){
                        jumpTo = index + 1;
                    }

                }

            }

            if(jumpTo !== false){
                $data.type = 'key';
                $elements.pages[jumpTo].focus();
            }

        },
        wheel : function (e) {

            if(!$data.enable) return false;

            if(!$data.ticking && $data.wheelEnable) {

                requestAnimationFrame(function () {
                    $data.wheelEnable = false;

                    $data.ticking = false;
                    const delta = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
                    const elms = document[$data.fromPoint](e.pageX,e.pageY);
                    const distance = delta > 0 ? 'top' : 'bottom';
                    const jumpTo = distance === 'top' ? $f.toIndex($data.currentIndex - 1) : $f.toIndex($data.currentIndex + 1);

                    if(jumpTo === $data.currentIndex){
                        $data.wheelEnable = true;
                        return false;
                    }

                    for(let i=0; i<elms.length; i++){
                        if(elms[i].classList.contains('docSlider-scroll') && !$f.isScrollEnd(elms[i],distance)){
                            $data.wheelEnable = true;
                            return false;
                        }
                    }

                    $data.type = 'scroll';
                    $elements.pages[jumpTo].focus();

                });
                $data.ticking = true;

            }

        },
        touchstart : function (e) {

            if(!$data.enable) return false;

            $data.touch.start.Y = e.touches[0].pageY;
            $data.touch.start.X = e.touches[0].pageX;
            $data.touch.move.Y = $data.touch.start.Y;
            $data.touch.move.X = $data.touch.start.X;
            $data.touch.pastMove.Y = $data.touch.start.Y;
            $data.touch.pastMove.X = $data.touch.start.X;
        },
        touchmove : function (e) {

            if(!$data.enable) return false;

            if(e.touches.length > 1){
                e.preventDefault();
            }

            $data.touch.pastMove.Y = $data.touch.move.Y;
            $data.touch.pastMove.X = $data.touch.move.X;

            $data.touch.move.Y = e.changedTouches[0].pageY;
            $data.touch.move.X = e.changedTouches[0].pageX;

            if($data.touch.move[$data.touch.XY] > $data.touch.pastMove[$data.touch.XY]){

                $data.touch.distance = $data.distance.top[[$data.touch.XY]];

            }else{

                $data.touch.distance = $data.distance.bottom[[$data.touch.XY]];

            }

        },
        touchend : function (e) {

            if(!$data.enable) return false;

            const elms = document[$data.fromPoint]($data.touch.start.X,$data.touch.start.Y);
            const jumpTo = $data.touch.distance === $data.distance.top[[$data.touch.XY]] ? $f.toIndex($data.currentIndex - 1) : $f.toIndex(($data.currentIndex + 1));

            if($data.touch.move[$data.touch.XY] === $data.touch.pastMove[$data.touch.XY]){
                return false;
            }

            if($options.horizontal){

                if(Math.abs($data.touch.start.Y - $data.touch.move.Y) > Math.abs($data.touch.start.X - $data.touch.move.X)){
                    return false;
                }

            }else{

                if(Math.abs($data.touch.start.X - $data.touch.move.X) > Math.abs($data.touch.start.Y - $data.touch.move.Y)){
                    return false;
                }

            }

            if(!$f.isScrollEnd($elements.pages[$data.currentIndex],$data.touch.distance)){
                return false;
            }

            for(let i=0; i<elms.length; i++){
                if(elms[i].classList.contains('docSlider-scroll') && !$f.isScrollEnd(elms[i],$data.touch.distance)){
                    $data.wheelEnable = true;
                    return false;
                }
            }

            $data.type = 'scroll';
            $elements.pages[jumpTo].focus();

        }
    };


    //-------------
    // FUNCTIONS
    //-------------
    const $f = {
        setOptions : function (tgt,add) {

            let resultOptions = {};

            if(typeof tgt === 'undefined') return;

            Object.keys(tgt).forEach(function (key) {

                if(Object.prototype.toString.call(tgt[key]) === "[object Object]") {

                    resultOptions[key] = $f.setOptions(tgt[key],add[key]);

                }else{

                    resultOptions[key] = tgt[key];

                    if(typeof add !== 'undefined' && typeof add[key] !== 'undefined'){

                        resultOptions[key] = add[key]

                    }
                }

            });

            return resultOptions;
        },
        jump : function(index,speed,easing){

            if($data.currentIndex !== index){

                const spd = typeof speed === 'undefined' ? $options.speed : speed;
                const ease = typeof easing === 'undefined' ? $options.easing : easing;

                $data.type = $data.type ? $data.type : 'tab';
                $data.pastType = $data.type;
                $data.pastIndex = $data.currentIndex;
                $data.currentIndex = index;

                $options.beforeChange(
                    $data.pastIndex,
                    $elements.pages[$data.pastIndex],
                    $data.currentIndex,
                    $elements.pages[$data.currentIndex],
                    $data.type
                );

                $data.type = null;

                $f.setCss(index,spd,ease);
                $f.pagerUpdate();
                $f.classUpdate();

                if(RegExp('anchor|jumpPage|nextPage|prevPage').test($data.pastType)){
                    $elements.pages[$data.currentIndex].focus();
                }

                clearTimeout($data.timer);
                $data.timer = setTimeout(function () {

                    $data.wheelEnable = true;
                    $options.afterChange(
                        $data.currentIndex,
                        $elements.pages[$data.currentIndex],
                        $data.pastIndex,
                        $elements.pages[$data.pastIndex],
                        $data.pastType
                    );

                },spd);

            }else{
                $data.wheelEnable = true;
            }

        },
        setCss : function(index,spd,ease){

            for(let k=0; k<$elements.pages.length; k++){
                $elements.pages[k].style.transitionTimingFunction = ease;
                $elements.pages[k].style.transitionDuration = spd + 'ms';

                if($options.horizontal){

                    $elements.pages[k].style.position = 'absolute';
                    $elements.pages[k].style.marginLeft = (k * 100) + '%';

                    if($data.isIOSChrome){
                        $elements.pages[k].style.left = '-' + (100*index) + '%';
                    }else{
                        $elements.pages[k].style.transform = 'translateX(-' + 100*index+ '%)';
                    }

                }else{

                    if($data.isIOSChrome){
                        $elements.pages[k].style.top = '-' + (100*index) + '%';
                    }else{
                        $elements.pages[k].style.transform = 'translateY(-' + 100*index + '%)';
                    }

                }
            }
        },
        toIndex : function (jumpTo) {

            if(isNaN(jumpTo)){
                const elm = document.getElementById(jumpTo.replace('#',''));
                return elm ? elm.getAttribute('data-ds-index') ? Number(elm.getAttribute('data-ds-index')) : 0 : 0;
            }else{
                return jumpTo < 0 ? 0 : jumpTo > $elements.pages.length - 1 ? $elements.pages.length - 1 : jumpTo;
            }

        },
        isScrollEnd : function (element,distance) {
            let result;
            switch (distance) {
                case 'top':
                    result = element.scrollTop <= 0;
                    break;
                case 'bottom':
                    result = element.scrollTop >= element.scrollHeight - element.clientHeight;
                    break;
                case 'left':
                    result = element.scrollLeft <= 0;
                    break;
                case 'right':
                    result = element.scrollLeft >= element.scrollWidth - element.clientWidth;
                    break;
                default :
                    result = false;
            }
            return result;
        },
        pagerUpdate : function(){

            for(let i=0; i<$elements.buttons.length; i++){

                (function (i) {
                    $elements.buttons[i].classList.remove('active');
                })(i);

            }

            $elements.buttons[$data.currentIndex].classList.add('active');
        },
        classUpdate : function(){

            $html.classList.remove($data.page[$data.pastIndex]);
            $html.classList.remove($data.i[$data.pastIndex]);
            $html.classList.remove($data.id[$data.pastIndex]);

            $html.classList.add($data.page[$data.currentIndex]);
            $html.classList.add($data.i[$data.currentIndex]);
            $html.classList.add($data.id[$data.currentIndex]);

        }
    };

    //-------------
    // METHODS
    //-------------
    return {
        init: function (options) {

            $options = $f.setOptions($default_options, options);

            if (!$options.pager) {
                $elements.pager.style.display = 'none';
            }

            $f.setCss(0,$options.speed,$options.easing);
            $e.setCommon();
            $e.setMobile();

            window.addEventListener('load', function () {


                if ($data.hash) {
                    let spd = $options.startSpeed === null ? $options.speed : $options.startSpeed;
                    $data.type = 'anchor';
                    $f.jump($f.toIndex($data.hash), spd);
                }

                $options.complete($options);


            });

        },
        jumpPage: function (to, speed, easing) {

            const spd = speed ? speed : $options.speed;
            const ease = easing ? easing : $options.easing;

            $data.type = 'jumpPage';
            $f.jump($f.toIndex(to), spd, ease);

        },
        nextPage: function (speed, easing) {

            const spd = speed ? speed : $options.speed;
            const ease = easing ? easing : $options.easing;

            $data.type = 'nextPage';
            $f.jump($f.toIndex($data.currentIndex + 1), spd, ease);

        },
        prevPage: function (speed, easing) {

            const spd = speed ? speed : $options.speed;
            const ease = easing ? easing : $options.easing;

            $data.type = 'prevPage';
            $f.jump($f.toIndex($data.currentIndex - 1), spd, ease);

        },
        getOptions: function () {

            return $options;

        },
        getElements: function () {

            return $elements;

        },
        getCurrentIndex: function () {

            return $data.currentIndex;

        },
        getCurrentPage: function () {

            return $elements.pages[$data.currentIndex];

        },
        enable : function (toggle) {

            const bool = typeof toggle === 'undefined' ? true : toggle;
            const tabIndex = bool ? '0' : '-1';

            $data.enable = bool;

            for(let i=0; i<$elements.pages.length; i++){
                $elements.pages[i].setAttribute('tabindex',tabIndex);
            }

        }
    };

})();