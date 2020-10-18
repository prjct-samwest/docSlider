/**-----------------------

 docSlider.js - ver.3.0.1
 URL : https://prjct-samwest.github.io/docSlider/
 created by SamWest
 Copyright (c) 2020 SamWest.
 This plugin is released under the MIT License.

 -----------------------**/

const docSlider = (function () {

    let undefined;
    let sc, pcr;
    let d = {};

    const op = {
        speed        : 600,
        easing       : 'ease',
        pager        : true,
        horizontal   : false,
        startSpeed   : null,
        scrollReset  : false,
        complete     : function () {},
        beforeChange : function () {},
        afterChange  : function () {},
        setInitCss : function(index, horizontal){

            const point = horizontal ? 'left' : 'top';
            const style = {};

            style[point] = index * 100 + '%';

            return style;

        },
        setChangeCss   : function (index, currentIndex, speed, easing, horizontal) {

            const xy = horizontal ? 'X' : 'Y';
            const style = {};

            style.transitionProperty = 'transform';
            style.transitionDuration = speed + 'ms';
            style.transitionTimingFunction = easing;
            style.transform = 'translate' + xy + '(-' + currentIndex * 100 + '%)';

            return style;

        }
    };

    const f = {

        setOptions : function (options) {

            if(options === undefined)
                return;

            const keys = Object.keys(options);

            for(let i = 0; i < keys.length; i++){

                const key = keys[i];

                op[key] = options[key];

            }

            if(!op.pager)
                u.updatePager = function () {};

        },

        createInner : function(){

            const wrapper = document.querySelector('.docSlider');
            const inner   = document.createElement('div');
            const pages   = document.querySelectorAll('.docSlider > *:not(.docSlider-pager)');

            inner.classList.add('docSlider-inner');

            for(let i = 0; i < pages.length; i++){

                const page = pages[i];
                const prop = op.setInitCss(i,op.horizontal);

                for(let p = 0; p < Object.keys(prop).length; p++){

                    const key = Object.keys(prop)[p];

                    page.style[key] = prop[key];

                }

                page.classList.add('docSlider-page');
                page.classList.add('docSlider-scroll');
                page.setAttribute('data-ds-index',i.toString());
                page.setAttribute('tabindex','0');

                inner.appendChild(page);

            }

            wrapper.appendChild(inner);

        },

        createPager : function () {

            if(!op.pager)
                return;

            const pageLength = document.querySelectorAll('.docSlider-inner > *').length;

            if(document.querySelector('.docSlider-pager')){

                const buttons = document.querySelectorAll('.docSlider-button');

                for(let i = 0; i < buttons.length; i++){

                    let button = buttons[i];

                    button.setAttribute('data-ds-jump',i.toString());
                    button.setAttribute('tabindex','-1');

                }

            }else{
                const pager      = document.createElement('nav');

                pager.classList.add('docSlider-pager');

                for(let i = 0; i < pageLength; i++){

                    let button = document.createElement('button');

                    button.classList.add('docSlider-button');
                    button.setAttribute('data-ds-jump',i.toString());
                    button.setAttribute('tabindex','-1');

                    pager.appendChild(button);

                }

                document.querySelector('.docSlider').appendChild(pager);

            }

        },

        setData : function () {

            d.html    = document.documentElement;
            d.wrapper = document.querySelector('.docSlider');
            d.pages   = document.querySelectorAll('.docSlider-inner > *');
            d.pager   = document.querySelector('.docSlider-pager');
            d.buttons = document.querySelectorAll('.docSlider-pager .docSlider-button');
            d.length  = d.pages.length;
            d.now     = 0;
            d.past    = 0;
            d.xy      = op.horizontal ? 'X' : 'Y';
            d.yx      = !op.horizontal ? 'X' : 'Y';
            d.wheel   = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
            d.wheelTick   = true;
            d.wheelEnable = true;
            d.fromPoint   = 'elementsFromPoint' in document ? 'elementsFromPoint' : 'msElementsFromPoint';
            d.isTouch     = 'ontouchstart' in window;
            d.isMobile    = /iPhone|Android.+Mobile/.test(navigator.userAgent);
            d.resizeTimer = 0;
            d.speed       = null;
            d.easing      = null;
            d.enable      = true;
            d.type        = null;
            d.pastType    = null;
            d.active      = null;

            u.updatePager();
            u.updateClass();

            d.active = d.pages[d.now];
            d.pages[d.now].focus({preventScroll :false});

        },

        setEvent : function () {

            for(let i = 0; i < d.length; i++){

                const page   = d.pages[i];
                const button = d.buttons[i];

                page.addEventListener('focusin',u.focusin);

                if(button === undefined)
                    continue;

                button.addEventListener('click',u.pagerClick);

            }

            document.addEventListener('keyup',u.keyup);
            document.addEventListener(d.wheel,u.wheel);
            d.pages[0].addEventListener('transitionstart',u.transitionstart);
            d.pages[0].addEventListener('transitionend',u.transitionend);

            if(d.isTouch){

                d.touch = {
                    move  : false,
                    nextX : 'right',
                    prevX : 'left',
                    nextY : 'bottom',
                    prevY : 'top',
                    X : {},
                    Y : {}
                }

                d.wrapper.addEventListener('touchstart',u.touchstart,false);
                d.wrapper.addEventListener('touchmove',u.touchmove,false);
                d.wrapper.addEventListener('touchend',u.touchend,false);

            }

            if(d.isMobile){

                u.setFV();
                window.addEventListener('resize',u.resize);

            }

        },

        hashJump : function () {

            const to = u.hashToIndex(location.hash);

            if(to === d.now)
                return false;

            d.speed = op.startSpeed === null ? op.speed : op.startSpeed;
            d.type = 'anchor';

            if(d.speed){

                setTimeout(function () {

                    u.pageChange(to);

                },200)

            }else{

                u.pageChange(to);

            }

            return true;

        }

    };

    const u = {

        hashToIndex : function (hash) {

            return (function () {

                if(hash.length){

                    let page = document.querySelector(hash);

                    if(!page || !page.hasAttribute('data-ds-index'))
                        return 0;

                    return Number(page.getAttribute('data-ds-index'));

                }else{

                    return 0;

                }

            })();

        },

        indexCheck : function(num){

            return (num >= 0 && num < d.length) ? num : d.now;

        },

        pageChange : function(to){

            if(d.type !== 'focus')
                d.pages[to].focus();

            d.active = d.pages[to];

            if(to === d.now)
                return;

            d.type = d.type ? d.type : 'focus';
            d.past = d.now;
            d.now  = to;

            let speed  = d.speed  === null ? op.speed  : d.speed;

            const easing = d.easing === null ? op.easing : d.easing;

            for(let i = 0; i < d.length; i++){

                const page = d.pages[i];
                const prop = op.setChangeCss(i, d.now, speed, easing, op.horizontal);

                for(let p = 0; p < Object.keys(prop).length; p++){

                    const key = Object.keys(prop)[p];

                    page.style[key] = prop[key];

                }

            }

            if(!speed){

                if(op.scrollReset)
                    u.scrollReset(d.pages[d.now]);

                if(pcr)
                    u.animationReset(d.past);

                op.beforeChange(d.past, d.pages[d.past], d.now, d.pages[d.now], d.type);
                d.pastType = d.type;
                d.type = null;

                if(sc)
                    scrollCue._updateWithDocSlider();

                op.afterChange(d.now, d.pages[d.now], d.past, d.pages[d.past], d.pastType);
                d.pastType = null;

            }

            d.speed  = null;
            d.easing = null;

            u.updatePager();
            u.updateClass();

        },

        focusin : function(){

            const to = Number(this.getAttribute('data-ds-index'));

            d.type = d.type ? d.type : 'focus';

            u.pageChange(to);

        },

        focusinx : function(){

            const to = Number(this.getAttribute('data-ds-index'));

            d.active = d.pages[to];

            if(to === d.now)
                return;

            d.type = d.type ? d.type : 'focus';
            d.past = d.now;
            d.now  = to;

            let speed  = d.speed  === null ? op.speed  : d.speed;

            const easing = d.easing === null ? op.easing : d.easing;

            for(let i = 0; i < d.length; i++){

                const page = d.pages[i];
                const prop = op.setChangeCss(i, d.now, speed, easing, op.horizontal);

                for(let p = 0; p < Object.keys(prop).length; p++){

                    const key = Object.keys(prop)[p];

                    page.style[key] = prop[key];

                }

            }

            if(!speed){

                if(op.scrollReset)
                    u.scrollReset(d.pages[d.now]);

                if(pcr)
                    u.animationReset(d.past);

                op.beforeChange(d.past, d.pages[d.past], d.now, d.pages[d.now], d.type);
                d.pastType = d.type;
                d.type = null;

                if(sc)
                    scrollCue._updateWithDocSlider();

                op.afterChange(d.now, d.pages[d.now], d.past, d.pages[d.past], d.pastType);
                d.pastType = null;

            }

            d.speed  = null;
            d.easing = null;

            u.updatePager();
            u.updateClass();

        },

        pagerClick : function(){

            if(!d.enable)
                return;

            const to = Number(this.getAttribute('data-ds-jump'));

            d.type = 'pager';
            u.pageChange(to);

        },

        updatePager : function () {

            for(let i = 0; i < d.length; i++ ){

                const button = d.buttons[i];

                if(button === undefined)
                    continue;

                button.classList.remove('selected');

            }

            if(d.buttons[d.now] === undefined)
                return ;

            d.buttons[d.now].classList.add('selected');

        },

        updateClass : function(){

            const past      = d.pages[d.past];
            const pastIndex = past.getAttribute('data-ds-index');
            const pastPage  = Number(pastIndex) +1;
            const pastId    = past.hasAttribute('id') ? past.getAttribute('id') : false;

            const now = d.pages[d.now];
            const nowIndex = now.getAttribute('data-ds-index');
            const nowPage  = Number(nowIndex) +1;
            const nowId    = now.hasAttribute('id') ? now.getAttribute('id') : false;

            d.html.classList.remove('docSlider-index_' + pastIndex);
            d.html.classList.remove('docSlider-page_'  + pastPage);
            d.html.classList.remove('docSlider-id_'    + pastId);

            d.html.classList.add('docSlider-index_' + nowIndex);
            d.html.classList.add('docSlider-page_'  + nowPage);
            if(nowId) d.html.classList.add('docSlider-id_'    + nowId);

            d.pages[d.past].classList.remove('docSlider-current');
            d.pages[d.now].classList.add('docSlider-current');

        },

        keyup : function(e){

            if(!d.enable)
                return;

            if(d.pages[d.now] !== document.activeElement)
                return;

            let to;
            const key   = e.key;
            const shift = e.shiftKey;
            const page  = d.pages[d.now];

            if((shift && / |Spacebar/.test(key) || !shift && /ArrowUp|Up|PageUp/.test(key)) && u.scrollEnd(page,'top')){

                to = d.now - 1;

            }else if(!shift && / |Spacebar|ArrowDown|Down|PageDown/.test(key) && u.scrollEnd(page,'bottom')) {

                to = d.now + 1;

            }else if(!shift && key === 'Home'){

                to = 0;

            }else if(!shift && key === 'End'){

                to = d.length - 1;

            }else if(!shift && op.horizontal && /ArrowLeft|Left/.test(key)){

                to = d.now - 1;

            }else if(!shift && op.horizontal && /ArrowRight|Right/.test(key)){

                to = d.now + 1;

            }else{

                return;

            }

            if(u.indexCheck(to) === d.now)
                return;

            d.type = 'key';
            u.pageChange(to);

        },

        scrollEnd : function (element,direction) {

            switch (direction) {
                case 'top'    : return element.scrollTop  <= 0;
                case 'bottom' : return element.scrollTop  >= element.scrollHeight - element.clientHeight;
                case 'left'   : return element.scrollLeft <= 0;
                case 'right'  : return element.scrollLeft >= element.scrollWidth - element.clientWidth;
                default       : return direction;
            }

        },

        wheel : function (e) {

            if(!d.wheelTick)
                return;

            requestAnimationFrame(function () {

                d.wheelTick = true;

                if(!d.enable)
                    return;

                if(!d.wheelEnable)
                    return;

                const delta    = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
                const elms     = document[d.fromPoint](e.pageX,e.pageY);
                const distance = delta > 0 ? 'top' : 'bottom';
                const to       = u.indexCheck(distance === 'top' ? d.now - 1 : d.now + 1);

                if(d.active !== d.pages[d.now])
                    return;

                if(to === d.now)
                    return;

                for(let i = 0; i < elms.length; i ++){

                    const elm = elms[i];

                    if(elm.classList.contains('docSlider-scroll') && !u.scrollEnd(elm,distance))
                        return

                }

                d.type = 'scroll';
                u.pageChange(to);

            });

            d.wheelTick = false;

        },

        transitionstart : function () {

            d.wheelEnable = false;

            if(op.scrollReset)
                u.scrollReset(d.pages[d.now]);

            if(pcr)
                u.animationReset(d.past);

            op.beforeChange(d.past, d.pages[d.past], d.now, d.pages[d.now], d.type);
            d.pastType = d.type;
            d.type = null;

        },

        transitionend : function () {

            d.wheelEnable = true;

            if(sc)
                scrollCue._updateWithDocSlider();

            op.afterChange(d.now, d.pages[d.now], d.past, d.pages[d.past], d.pastType);
            d.pastType = null;

        },

        resize : function(){

            if(d.resizeTimer > 0)
                clearTimeout(d.resizeTimer);

            d.resizeTimer = setTimeout(u.setFV,200);

        },

        setFV : function () {

            d.wrapper.style.height = window.innerHeight + '';
            d.wrapper.style.height = window.innerHeight + 'px';

        },

        touchstart : function (e) {

            if(!d.enable)
                return;

            if(e.touches.length > 1)
                return;

            d.touch.move = false;
            d.touch.X.start = e.touches[0].pageX;
            d.touch.Y.start = e.touches[0].pageY;

        },

        touchmove : function (e) {

            if(!d.enable)
                return;

            if(e.touches.length > 1){
                e.preventDefault();
                return;
            }

            d.touch.move = true;
            d.touch.X.move = e.changedTouches[0].pageX;
            d.touch.Y.move = e.changedTouches[0].pageY;

        },

        touchend : function (e) {

            if(!d.enable)
                return;


            if(e.touches.length > 1)
                return;

            if(!d.touch.move)
                return;

            d.touch.X.distance = d.touch.X.move - d.touch.X.start;
            d.touch.Y.distance = d.touch.Y.move - d.touch.Y.start;

            if(Math.abs(d.touch[d.xy].distance) < Math.abs(d.touch[d.yx].distance))
                return;

            const np = d.touch[d.xy].distance < 0 ? 'next' : 'prev';
            const to = u.indexCheck(np === 'next' ? d.now + 1 : d.now - 1);

            if(to === d.now)
                return;

            if((d.now === 0 && np === 'prev') || (d.now === d.length-1 && np === 'next'))
                return;

            const direction = d.touch[np + d.xy];
            const elms      = document[d.fromPoint](d.touch.X.start,d.touch.Y.start);

            for(let i = 0; i < elms.length; i++){

                const elm = elms[i];

                if(elm.classList.contains('docSlider-scroll') && !u.scrollEnd(elm,direction))
                    return;

            }

            d.type = 'scroll';
            u.pageChange(to);

        },

        scrollReset : function (page){

            page.scrollTop = 0;
            page.scrollLeft = 0;

        },

        animationReset : function (index){

            let selector = '[data-scpage][data-show="true"]'
            let elms = document.querySelectorAll(selector);

            if(!elms.length)
                return false;

            for(let i=0; i < elms.length; i++){

                let elm = elms[i];
                let classes = elm.getAttribute('data-addClass');

                if(elm.getAttribute('data-scpage') === index+'')
                    continue;

                elm.removeAttribute('style');
                elm.removeAttribute('data-show');

                if(!classes)
                    continue;

                classes = classes.split(' ');

                for(let j=0; j<classes.length; j++){

                    let className = classes[j];

                    elm.classList.remove(className);

                }

            }

            scrollCue._searchElements();

        },

    };

    return {

        init : function (options) {

            let startHash;

            f.setOptions(options);
            f.createInner();
            f.createPager();
            f.setData();
            f.setEvent();
            startHash = f.hashJump();

            sc = typeof scrollCue === 'undefined' ? false : scrollCue._hasDocSlider();
            pcr = typeof scrollCue === 'undefined' ? false : scrollCue._hasPageChangeReset();

            if(sc){

                scrollCue._initWithDocSlider(startHash);

            }

            op.complete(op, docSlider.getElements());

        },

        jumpPage : function (to, speed, easing) {

            let index;

            if(to === undefined)
                return;

            if(isNaN(to)){

                index = u.hashToIndex('#'+to.replace('#',''));

            }else{

                index = u.indexCheck(to < 0 ? d.length + to : to);

            }

            d.speed  = speed  === undefined ? null : speed;
            d.easing = easing === undefined ? null : easing;
            d.type   = 'jumpPage';

            u.pageChange(index);

        },

        nextPage : function (speed, easing) {

            const index = u.indexCheck(d.now +1);

            d.speed  = speed  === undefined ? null : speed;
            d.easing = easing === undefined ? null : easing;
            d.type   = 'nextPage';

            u.pageChange(index);

        },

        prevPage : function (speed, easing) {

            const index = u.indexCheck(d.now -1);

            d.speed  = speed  === undefined ? null : speed;
            d.easing = easing === undefined ? null : easing;
            d.type   = 'prevPage';

            u.pageChange(index);

        },

        getOptions : function () {

            return op;

        },

        getElements : function () {

            return {
                wrapper : d.wrapper,
                pages   : d.pages,
                pager   : d.pager,
                buttons : d.buttons,
            };

        },

        getCurrentIndex : function () {

            return d.now;

        },

        getCurrentPage : function () {

            return d.pages[d.now];

        },

        enable : function (toggle) {

            d.enable = toggle === undefined ? !d.enable : toggle;

            const tabindex = d.enable ? '0' : '-1';

            for(let i = 0; i < d.length; i++){

                d.pages[i].setAttribute('tabindex',tabindex);

            }

        },
        _getWheelEnable : function (){

            return d.wheelEnable;

        }

    }


})();