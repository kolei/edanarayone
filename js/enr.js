window.script_version = 92
var tilda_form_id = 'form347659861'
var DEV_MODE = true
var localAddressInfo = {changed:false}

class UserData {
    props = {
        _name: '',
        get name(){ 
            return decodeURIComponent( this._name );
        },
        set name(value){
            if(typeof value != 'undefined' && this._name != value){
                this._name = encodeURIComponent( value.trim() );
                $(`#${tilda_form_id} input[name='name']`).val(this.name);
                document.cookie = `name=${this._name}; max-age=31536000`;
            }
        },
        _phone: '',
        get phone(){ 
            return decodeURIComponent( this._phone );
        },
        set phone(value){
            if(typeof value != 'undefined' && this._phone != value){
                this._phone = encodeURIComponent( value.trim() );
                $(`#${tilda_form_id} input[name='phone']`).val(this.phone);
                document.cookie = `phone=${this._phone}; max-age=31536000`;
            }
        },
        _street: '',
        get street(){ 
            return decodeURIComponent( this._street ); 
        },
        set street(value){
            if(typeof value != 'undefined' && this._street != value){
                this._street = encodeURIComponent( value.trim() );
                $(`#${tilda_form_id} input[name='street']`).val(this.street);
                //document.cookie = `street=${this._street}; max-age=31536000`;
            }
        },
        _flat: '',
        get flat(){
            return decodeURIComponent( this._flat );
        },
        set flat(value){
            if(this._flat != value){
                this._flat = encodeURIComponent( value.trim() );
                $(`#${tilda_form_id} input[name='flat']`).val(this.flat);
                document.cookie = `flat=${this._flat}; max-age=31536000`;
            }
        },
        // _pass: '', // домофон
        // get pass(){
        //     return decodeURIComponent( this._pass );
        // },
        // set pass(value){
        //     if(typeof value != 'undefined' && this._pass != value){
        //         this._pass = encodeURIComponent( value.trim() );
        //         $(`#${tilda_form_id} input[name='pass']`).val(this.pass);
        //         document.cookie = `pass=${this._pass}; max-age=31536000`;
        //     }
        // },
        // _floor: '', // домофон
        // get floor(){
        //     return decodeURIComponent( this._floor );
        // },
        // set floor(value){
        //     if(typeof value != 'undefined' && this._floor != value){
        //         this._floor = encodeURIComponent( value.trim() );
        //         $(`#${tilda_form_id} input[name='floor']`).val(this.floor);
        //         document.cookie = `floor=${this._floor}; max-age=31536000`;
        //     }
        // },
        _jsonAddress: null, // хранит JSON объект возвращаемый geocode, либо NULL, если адрес меняли вручную
        get jsonAddress(){
            return this._jsonAddress;
        },
        set jsonAddress(value){
            if(typeof value != 'undefined' && this._jsonAddress != value){
                //console.log('adsress %s', value ? JSON.stringify(value) : 'invalid');
                this._jsonAddress = value;
            }
        },
        _suggestedAdres: '', // адрес, выбранный из предложений яндекса
        get suggestedAdres(){
            return decodeURIComponent( this._suggestedAdres );
        },
        set suggestedAdres(value){
            if(typeof value != 'undefined' && value != this._suggestedAdres){
                this._suggestedAdres = encodeURIComponent( value.trim() );
                document.cookie = `suggestedAdres=${this._suggestedAdres}; max-age=31536000`;
            }
        },
        department: null
    }
    
    /*
    связывает поле ввода (input) со свойством
    - при изменении записывается в куки
    - при создании считывает из куки
    */
    bindInput(propName, tag = 'input'){
        let element = $(`#${tilda_form_id} ${tag}[name='${propName}']`);
        
        if(element)
        try {
            let elementVal = element.val()

            if(typeof elementVal != 'undefined'){
                let value = elementVal.trim()

                // если поле пустое, то считать из куки
                this.props[propName] = value ? value : this.getCookie( propName )

                // при выходе с элемента запоминаю значение в куку
                $(`#${tilda_form_id} ${tag}[name='${propName}']`).blur((event)=>{ 
                    let value = $(event.currentTarget).val()
                    this.props[propName] = value
                    // console.log('property %s="%s"', propName, value)
                });
            }
        } catch (error) {
            DEV_MODE && console.log(error);            
        }
    }

    el(elementName, tag = 'input'){
        return $(`#${tilda_form_id} ${tag}[name='${elementName}']`);
    }

    //onChangeAddress = null;

    constructor(){
        this.bindInput('phone');
        this.bindInput('name');
        this.bindInput('street');
        this.bindInput('flat');
        // this.bindInput('pass');
        //this.bindInput('floor');

        this.props.suggestedAdres = this.getCookie('suggestedAdres');
        if(this.props.suggestedAdres)
            this.props.street = this.props.suggestedAdres;
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : '';
    }
}

// отслеживает появление элемента с заданным классом
class ElementWatcher {
    constructor(elementToWatch, classToWatch, callback) {
        this.elementToWatch = elementToWatch ? elementToWatch : document.body;
        this.classToWatch = classToWatch;
        this.callback = callback;
        this.observer = null
        this.init();
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer.observe(this.elementToWatch, { 
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    }

    mutationCallback = mutationsList => {
        for(let mutation of mutationsList) {
            // if (mutation.type === 'attributes') {
            //     if(mutation.target == this.elementToWatch)
            //         console.log('changed attribyte "%s" for target "%s"', mutation.attributeName, mutation.target);
            // }
            // else if (mutation.type === 'characterData') {
            //     console.log('changed element.data for target "%s"', mutation.target);
            // }
            // else 
            if (mutation.type === 'childList') {
                if(mutation.addedNodes && this.callback)
                    this.callback();
            }
            // else 
            //     console.log('unknown type "%s"', mutation.type);
        }
    }

}

class AttributeWatcher {
    constructor(targetNode, attributeToWatch, attributeChangedCallback) {
        this.targetNode = targetNode
        this.attributeToWatch = attributeToWatch
        this.attributeChangedCallback = attributeChangedCallback
        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this.targetNode, { attributes: true });
    }

    disconnect() {
        this.observer.disconnect();
        console.log('AttributeWatcher disconnected');
    }

    mutationCallback = mutationsList => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                console.log('attr changed: %s', mutation.attributeName);
            }
        }
    }
}

// отслеживает появление у элемента заданного класса
class ClassWatcher {
    constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
        this.targetNode = targetNode
        this.classToWatch = classToWatch
        this.classAddedCallback = classAddedCallback
        this.classRemovedCallback = classRemovedCallback
        this.observer = null
        this.lastClassState = targetNode.classList.contains(this.classToWatch)

        this.init()
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer.observe(this.targetNode, { attributes: true });
    }

    disconnect() {
        this.observer.disconnect()
    }

    mutationCallback = mutationsList => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClassState = mutation.target.classList.contains(this.classToWatch)
                if(this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState
                    if(currentClassState) {
                        this.classAddedCallback()
                    }
                    else {
                        //this.classRemovedCallback()
                    }
                }
            }
        }
    }
}

$(document).ready(function ()
{
    const moscowBound = [[55.142627, 36.803259],[56.021281, 37.967682]];

    var elementWatchers = [];

    window.BRAND_CODE = '100000012';

    // кириллические УРЛ-ы выглядят не так как пишутся...
    console.log('hostname: %s', window.location.hostname)

    let form = $('div.t706__cartwin-content form')
    if(form){
        try {
            tilda_form_id = form.get(0).id
            console.log('form id = %s', tilda_form_id)
        } catch (error) {
            console.log('not found form id')
        }
    }
    else
        console.log('not found form id')

    if( window.location.hostname.includes('xn--100-8cdjmfb4eicin5a1d.xn--p1ai')) //100процентоведа.рф
    {
        // отдельный проект, свой id формы
        window.CHAIHONA_HOST = 'https://chaihona1.ru'
        // DEV_MODE = false // !!
    }
    else if(window.location.hostname == 'eda_na_raione.ru'){
        window.CHAIHONA_HOST = 'https://kei.chaihona1.ru'
    }
    else {
        window.CHAIHONA_HOST = 'https://tilda.dev.chaihona1.ru'
    }

    console.log('v1.%s%s, CHAIHONA_HOST = %s, tilda form_id = %s', 
        window.script_version, 
        DEV_MODE ? '(dev)' : '',
        window.CHAIHONA_HOST, 
        tilda_form_id);

    DEV_MODE && console.log('PATH=%s', window.location.pathname);

    var ud = null
    var deliveryDays = []
    var selectedDeliveryDay = null
    var deliveryByWeekObj = null
    var dataDeliveryTime = null
    var selectedDeliveryTime = null
    var coords = null

    var errorSet = new Set()
   
    // if( window.location.pathname == '/' || 
    //     window.location.pathname == '/eda' || 
    //     window.location.pathname == '/express' ||
    //     window.location.pathname == '/express/') processRoot();
    if(window.location.pathname == '/success' || window.location.pathname == '/success/') processSuccess()
    else if(window.location.pathname == '/paymenterror' || window.location.pathname == '/paymenterror/') processPaymentError()
    else processRoot()

    function processRoot(){
        try {
            // скрываю кнопку, которая используется для вызова попапа "нет доставки на указанный адрес"
            $('#rec355751621').hide() // !!
            $('#rec355958602').hide()
        } catch (error) {}

        // запрашиваем актуальное меню
        $.ajax({
            url: `${window.CHAIHONA_HOST}/tilda-actual-menu`,
            type: 'GET',
            crossDomain: true,
            data: {brandCode: window.BRAND_CODE}
        }).done(function(rawData){

            // let actualSKU = rawData
            let actualSKU = JSON.parse(rawData)

            // console.log('actual sku: %s', JSON.stringify(actualSKU))

            if(typeof actualSKU == 'object'){
                // console.log('actual sku is object')
                $('.t-store__card').each(function(){
                    let SKU = $(this).find('.t-store__card__sku span').text()
                    // console.log('check SKU: %s', SKU)
                    if(SKU && actualSKU.findIndex(function(item){
                        return item == SKU
                    })==-1)
                    {
                        console.log('блюда нет в списке - скрываю: %s', SKU)
                        $(this).hide()
                    }
                })
            }
        })

        try {
            if($("input[name='street']").length==0){
                console.warn('не найдено поле street, определение адреса работать не будет')
            }
        } catch (error) {
            //
        }

        try {
            if($("{tilda_form_id}").length==0){
                console.warn('не найдена форма, скрипт не будет отрабатывать события')
            }
        } catch (error) {
            //
        }
        
        ud = new UserData();

        let cssId = 'jQueryUI_CSS';
        if (!document.getElementById(cssId))
        {
            let link  = document.createElement('link');
            link.id   = cssId;
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css';
            link.media = 'all';
            document.head.appendChild(link);
        }
    
        if(typeof jQuery.ui == 'undefined'){
            let script = document.createElement('script');
            script.async = false;
            script.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';
            document.head.appendChild(script);
        }
    
        if(typeof ymaps == 'undefined' || typeof ymaps.suggest == 'undefined'){
            //DEV_MODE && console.log('ymaps or ymaps.suggest undefined, load script');
            let script = document.createElement('script');
            script.async = false;
            script.onload = onYmapsReady;
            script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=9cf52b96-70cc-4eab-81a3-53ffdd4850e2';
            document.head.appendChild(script);
        } 
        else onYmapsReady();

        //TODO вывести информацию о невозможности оплаты онлайн - проверить

        try {
            //$('div[data-tooltip-hook="#popup:getadress"] button.t-submit').on('click', function(event){
            $('div[data-tooltip-hook="#popup:getadress"] form').on('submit', function(event){
                event.preventDefault()
                event.stopPropagation()

                DEV_MODE && console.log('try button click...')

                if(localAddressInfo.changed){
                    localAddressInfo.changed = false
                    checkLocalAddress(
                        localAddressInfo.fullAddress, 
                        localAddressInfo.lat, 
                        localAddressInfo.lon
                    ).then(res=>{
                        res = JSON.parse(res)
                        DEV_MODE && console.log('checkLocalAddress: %s', JSON.stringify(res))

                        // скрываю форму с адресом
                        $('div[data-tooltip-hook="#popup:getadress"] .t-popup__close').click()

                        if(typeof res.error == 'undefined'){
                            // доставка возможна - запоминаю адрес
                            ud.props.street = localAddressInfo.street
                        } else {
                            // показываю попап о том, что адрес не валидный
                            $('div[data-tooltip-hook="#popup:nodelivery"] .t390__descr')
                                .text(localAddressInfo.fullAddress)
                            $('#rec355751621 a[href="#popup:nodelivery"]').click()
                        }
                    })
                }                    
                return false
            })
        } catch (error) {}

        try {
            // очищаю время доставки
            $("select[name='time']").empty();

            // и дату
            $("select[name='time_2']").empty();
        } catch (error) {
            
        }

        try {
            $("div.t395__tab").not(".active").on("click", function(e){
                //console.log('кликнули по экспресс-меню')
                window.setTimeout(function(){
                    window.location.reload()
                }, 0)
            })
        } catch (error) {
            //
        }

        //01.10.2020 в поле телефон плейсхолдер +7(999)999-99-99, при фокусе автоматически вставлять +7
        ud.el('phone').attr('placeholder', '+7(999)999-99-99');
        ud.el('phone').focus(function(){
            if(this.value=='') this.value = '+7';
        });

        // тильда глючит - не пускает в редактирование CSS...
        // задаю стили для autocomplete
        let styleTag = $('<style>ul.ui-autocomplete { z-index: 10000000; } div.ui-menu-item-wrapper {line-height: 2em;}</style>');
        $('html > head').append(styleTag);

        setDeliveryTimeByWeek({
            "mon": "11:00-03:30",
            "tue": "11:00-03:30",
            "wed": "11:00-03:30",
            "thu": "11:00-03:30",
            "fri": "11:00-03:30",
            "sat": "11:00-03:30",
            "sun": "11:00-03:30"
        }, 60);

        // при входе на страницу скрываю блок с кнопкой "оплатить"
        // тильда походу не использует аттрибут action у кнопки submit, 
        // поэтому невозможно переопределить ее поведение

        $(`div.t-form__submit`).hide()

        // рисуем аналогичную кнопку для перехода на оплату в чайхону   
        $(`#${tilda_form_id} div.t-form__inputsbox`).append(`
            <div 
                id="chaihona_pay" 
                style="text-align:center;vertical-align:middle;height:100%;margin-top:30px;margin-bottom:10px;width:100%;">
                
                <button 
                    onclick="window.chaihona_pay_click();return false;"
                    style="font-family:'Manrope',Arial,sans-serif;text-align:center;height:60px;border:0 none;font-size:16px;padding-left:60px;padding-right:60px;font-weight:700;white-space:nowrap;background-image:none;cursor:pointer;margin:0;box-sizing:border-box;outline:none;background:transparent;position:relative;width:100%;color:#ffffff;background-color:#ff0044;border-radius:8px; -moz-border-radius:8px; -webkit-border-radius:8px;">
                    
                    Оформить
                    
                </button>
                
            </div>`);

        ud.el('street').change(function(){ 
            // при ручной корректировке инвалидирую адрес
            ud.props.jsonAddress = null; 
        });

        // при редактировании квартиры убираю и показываю ошибку
        ud.el('flat').on('input',function(e){
            if(ud.el('flat').val().trim().length == 0)
                showError(ud.el('flat'), 'Введите номер квартиры', 'js-rule-error-all');
            else
                hideError( ud.el('flat') );
        });

        // подписываюсь на события ухода с поля ввода адреса
        ud.el('street').blur(function(){ checkAdress(); })

        $('input').attr('autocomplete', 'new-password');

        // запрещаю автозаполнение
        // ud.el('street').focus(function(){this.setAttribute('autocomplete', 'none')})
        // $('input[name="adress"]').focus(function(){this.setAttribute('autocomplete', 'none')})

        // при смене типа оплаты меняю текст кнопки
        $('input:radio[name="paymentsystem"]').change(function() {
            if( $(this).val()=='cash' ) $('#chaihona_pay button').text('Оформить');
            else $('#chaihona_pay button').text('Оплатить');
        });

        $("select[name='time']").change(function(){
            onTimeChange()
        })

        $("select[name='time_2']").change(function(){
            onDateChange()
        })
        
        // скрываю блок со SKU, мне он нужен для идентификации блюд, но дизайнеру не нравится
        new ClassWatcher(
            document.getElementsByClassName('t706__cartwin')[0], 
            't706__cartwin_showed', 
            function(){
                // очищаю старые наблюдатели
                elementWatchers = [];

                hideSKU();

                // при удалении/изменении блюда пересоздается t706__cartwin-products
                // наблюдатели за конкретными элементами не работают - смотрю на весь список
                let cartWinProducts = $('div.t706__cartwin-products');
                if(cartWinProducts)
                    elementWatchers.push(
                        new ElementWatcher(cartWinProducts[0], null, function(){
                            //TODO в перспективе оптимизировать - вызывается много раз
                            //console.log('что-то изменилось в t706__cartwin-products, скрываю SKU');
                            hideSKU();
                        })
                    );
            }, null);

        // кликнули на оплатить, проверка полей и редирект в чайхону
        window.chaihona_pay_click = function()
        {
            console.log('chaihona_pay clicked...')
            if($('#chaihona_pay').attr('processing')) {
                alert('Заказ уже в обработке, ждите...')
                return;
            }

            hideAllErrors()
            hideBottomError('js-rule-error-all')
            hideBottomError('js-rule-error-string')

            let firstErrorElement = null;

            if(ud.props.jsonAddress && !ud.props.jsonAddress.house){
                showError(ud.el('street'), 'Введите номер дома', 'js-rule-error-all');
                firstErrorElement = firstErrorElement || ud.el('street');
            }

            if(!ud.props.jsonAddress){
                showError(ud.el('street'), 'Введите адрес доставки с номером дома', 'js-rule-error-all');
                firstErrorElement = firstErrorElement || ud.el('street');
            }

            // нигде больше квартира не присваивается...
            ud.props.flat = ud.el('flat').val()

            if(!ud.props.flat){
                showError(ud.el('flat'), 'Введите номер квартиры', 'js-rule-error-all');
                firstErrorElement = firstErrorElement || ud.el('flat');
            }

            let name = ud.el('name');
            if(/^[\S\s]+$/.test(name.val())){
                name.parent().find('div.t-input-error').hide();
                hideBottomError('js-rule-error-name');
            } else {
                showError(name, 'Введите Ваше имя', 'js-rule-error-name');
                firstErrorElement = firstErrorElement || name;
            }

            let phone = ud.el('phone');
            let purePhone = '';
            if(/^\+*[\d\(\)\-\s]+$/.test(phone.val())){
                purePhone = phone.val().replace(/[\(\)\+\s\-]/g, '');
                if(purePhone.length==11){
                    phone.parent().find('div.t-input-error').hide();
                    hideBottomError('js-rule-error-phone');
                } else {
                    showError(phone, 'Неверная длина номера телефона, должно быть 11 цифр с кодом страны', 'js-rule-error-phone');
                    firstErrorElement = firstErrorElement || phone;
                }
            } else {
                showError(phone, 'Неверный формат номера телефона', 'js-rule-error-phone');
                firstErrorElement = firstErrorElement || phone;
            }

            if (errorSet.size) {
                console.log('has errors: %s', JSON.stringify(errorSet))
                if(firstErrorElement){
                    $('div.t706__cartwin').animate({scrollTop: -100 });
                }
                return;
            }
            
            let payment = $(`#${tilda_form_id} input[name='paymentsystem']:checked`).val();
            let total_price = $('div.t706__cartwin-prodamount-wrap span.t706__cartwin-prodamount').text();
            let delivery_time = $(`#${tilda_form_id} select[name='time']`).val()

            // в тестовом проекте комментариев нет
            let comment=''
            try {
                comment = $(`#${tilda_form_id} textarea[name='comment']`).val()
            } catch (error) {
                comment = ''                
            }

            let params=`<input type="hidden" name="phone" value="${purePhone}"/>
                <input type="hidden" name="name" value="${ud.props.name}"/>
                <input type="hidden" name="city" value="${ud.props.jsonAddress.city}"/>
                <input type="hidden" name="street" value="${ud.props.jsonAddress.street}"/>
                <input type="hidden" name="house" value="${ud.props.jsonAddress.house}"/>
                <input type="hidden" name="flat" value="${ud.props.flat}"/>
                <input type="hidden" name="department" value="${ud.props.department}"/>
                <input type="hidden" name="total" value="${total_price}"/>
                <input type="hidden" name="payment" value="${payment}"/>
                <input type="hidden" name="delivery_time" value="${delivery_time}"/>
                <input type="hidden" name="lat" value="${ud.props.jsonAddress.lat}"/>
                <input type="hidden" name="lon" value="${ud.props.jsonAddress.lon}"/>
                <input type="hidden" name="coment" value="${comment}"/>
                <input type="hidden" name="fullAddress" value="${ud.props.jsonAddress.fullAddress}"/>
                <input type="hidden" name="brand" value="${window.BRAND_CODE}"/>`;

            $("div.t706__product").each(function(){
                let dish_name = $(this).find('div.t706__product-title a').text()
                dish_name = dish_name.replace(/\"/g, "'")
                if(dish_name) dish_name = dish_name.trim()
                
                // в эту же кучу добавился модификатор, SKU пока последним элементом
                let sku = $(this).find('div.t706__product-title__option:last-child').text();

                // ищу модификатор, он перед SKU
                let modif = $('div.t706__product-title__option > div', this).text();

                let quantity = $(this).find('div.t706__product-plusminus span.t706__product-quantity').text();
                let total = $(this).find('div.t706__product-amount').text();
                params += `<input type="hidden" name="dish[]" value="${sku}|${dish_name}|${quantity}|${total}|${modif}"/>`;
            });

            // запрет повторного клика
            $('#chaihona_pay').attr('processing','1')

            $(`<form action="${window.CHAIHONA_HOST}/eda-na-raione" method="POST">${params}</form>`).appendTo($(document.body)).submit();
        }
    }

    function hideSKU(){
        // блюд может быть несколько
        $('div.t706__product').each(function(){
            // SKU ПОКА последний div в куче
            $('div.t706__product-title div:last', this).hide();
        });
    }

    function processPaymentError(){
        let message = /message=([^&]+)/.exec(window.location.href)[1];
        if(message)
            $('div.t017__uptitle').text( decodeURI(message) );
    }

    function processSuccess(){
        // вручную чистим корзину:
        // - открываю корзину, блюда в нее добавляются только при открытии
        // - всем блюдам жму "удалить"
    
        let order = null

        try {
            order = /order=([^&]+)/.exec(window.location.href)[1];
        } catch (error) {
            //
        }
        if(order)
            $('div.t017__uptitle').text( `Оформлен заказ № ${decodeURI(order)}` );
        
        // если есть иконка корзины
        let cart_showed = $('div.t706__carticon.t706__carticon_showed');
    
        if(cart_showed.length)
            purgeBasket();
        else {
            DEV_MODE && console.log('Иконка корзины не найдена');
            new ElementWatcher(null, null, function(){
                let cart_showed = $('div.t706__carticon.t706__carticon_showed');
                if(cart_showed.length)
                    purgeBasket();
            });
        }
    }

    function purgeBasket(){
        DEV_MODE && console.log('Корзина найдена - запускаю очистку');
        new ClassWatcher(
            document.getElementsByClassName('t706__cartwin')[0], 
            't706__cartwin_showed', 
            function(){
                $('div.t706__product-del').each(function(){
                    $(this).click()
                })
                setTimeout(function(){
                    $('div.t706__cartwin-close').click()
                })
            }, null);

        // открываю корзину, чтобы прокликать на удаление все товары    
        $('div.t706__carticon').click();
    }

    async function ymapsSource(request, response){
        let items = await ymaps.suggest(request.term, { boundedBy: moscowBound, results: 7 });
        
        let arrayResult = [];
        let arrayPromises = [];

        items.forEach((element) => {
            if (!element.value.match(/.*подъезд.*/)) 
            {
                // можно и по одному await-ить, но параллельно быстрее
                arrayPromises.push( ymaps.geocode(element.value, { boundedBy: moscowBound }).then(gc=>{
                    let res = prepeareGC(gc, element.value);

                    if(res)
                        arrayResult.push( res );
                }));
            }
        });

        // ждем, пока все запросы не обработаются
        await Promise.all(arrayPromises).then(function(){
            return ymaps.vow.resolve(arrayResult);
        });

        //response( availableTags);
        response( arrayResult );
    }

    function onYmapsReady(){
        // DEV_MODE && console.log('ymaps loaded');
        ymaps.ready(async function () {
            // DEV_MODE && console.log('ymaps ready');

            $("input[name='street']").autocomplete({
                // вызывается при вводе более 3-х символов, список формирую из ответов яндекса
                source: ymapsSource,
                // при выборе варианта делю улицу и дом
                select: function(event, ui){
                    DEV_MODE && console.log('ui.item.jsonData = %s', JSON.stringify(ui.item.jsonData));

                    ud.props.street = ui.item.value;
                    if(ud.props.suggestedAdres != ui.item.value){
                        ud.props.suggestedAdres = ui.item.value;
                        ud.props.department = null;
                    }
                    if(ui.item.jsonData.house){
                        ud.props.jsonAddress = ui.item.jsonData;
                        checkAdress();
                    }
                },
                minLength: 3
            });

            // ручной ввод адреса в попапе
            $('div[data-tooltip-hook="#popup:getadress"] input[name="adress"]').autocomplete({
                source: ymapsSource,
                select: function(event, ui){
                    DEV_MODE && console.log('выбрали ручной адрес: ui.item.jsonData = %s', JSON.stringify(ui.item.jsonData));

                    $('div[data-tooltip-hook="#popup:getadress"] input[name="adress"]')
                        .val(ui.item.jsonData.fullAddress)
                        
                    // проверку запускать только при клике на кнопку
                    localAddressInfo = {
                        changed: true,
                        fullAddress: ui.item.jsonData.fullAddress,
                        street: ui.item.value,
                        lat: ui.item.jsonData.lat, 
                        lon: ui.item.jsonData.lon
                    }

                    // ud.props.street = ui.item.value;
                    // if(ud.props.suggestedAdres != ui.item.value){
                    //     ud.props.suggestedAdres = ui.item.value;
                    //     ud.props.department = null;
                    // }
                    // if(ui.item.jsonData.house){
                    //     ud.props.jsonAddress = ui.item.jsonData;
                    // }
                },
                minLength: 3
            })

            // при запуске suggestedAdres может быть уже заполнен из localstorage, переводим его в jsonAddress
            // if(ud.props.suggestedAdres){
            //     // разбираю запомненный адрес
            //     let gc = await ymaps.geocode( ud.props.suggestedAdres, { boundedBy: moscowBound } );
            //     let res = prepeareGC(gc, ud.props.suggestedAdres);
            //     if(res){
            //         // есть валидный адрес
            //         // DEV_MODE && console.log('prepared suggestedAdres: %s', JSON.stringify(res));
            //         if(res.jsonData.house){
            //             ud.props.jsonAddress = res.jsonData;
            //             checkAdress();
            //         }
            //     }
            // }

            if(coords == null){
                navigator.geolocation.getCurrentPosition(position => {
                    console.log('position: lat=%s, lon=%s', position.coords.latitude, position.coords.longitude)
                    coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    }
                    geocodeLocalCoordinates()
                }, error => {
                    DEV_MODE && console.log('getCurrentPosition error: %s %s', error.code, error.message)
                    // запрещено, не смог или таймаут - показываю попап с вводом адреса
                    try {
                        let getAdress = $('a[href="#popup:getadress"]')
                        if(getAdress.length){ 
                            DEV_MODE && console.log('found %s popups', getAdress.length)
                            getAdress.click()
                        }
                        else
                            DEV_MODE && console.log('не нашёл #popup:getadress')
                        
                    } catch (error) {
                        DEV_MODE && console.log('error1: %s', JSON.stringify(error))
                    }
                })
            } else {
                geocodeLocalCoordinates()
            }
        });
    }

    function geocodeLocalCoordinates(){
        DEV_MODE && console.log('geocodeLocalCoordinates: %s', JSON.stringify(coords))

        if(sessionStorage.getItem('badAddressWithCoordibates')){
            let badAddressWithCoordibates = JSON.parse(sessionStorage.getItem('badAddressWithCoordibates'))
            if(badAddressWithCoordibates.lat == coords.lat && badAddressWithCoordibates.lon==coords.lon){
                // этот адрес уже проверяли - сразу выкидываем ошибку
                DEV_MODE && console.log('координаты не изменились, показываю ошибку про старый адрес: %s',
                    badAddressWithCoordibates.fullAddress)
                showNoDeliveryPopup(badAddressWithCoordibates.fullAddress)
            }
        }

        ymaps.geocode([coords.lat, coords.lon]).then(res => {
            let fullAddress = res.geoObjects.get(0).getAddressLine()
            DEV_MODE && console.log('address by coord = %s', fullAddress)

            $('div[data-tooltip-hook="#popup:getadress"] input[name="adress"]')
                .val(fullAddress)

            checkLocalAddress(
                fullAddress, 
                coords.lat, 
                coords.lon
            ).then(res2=>{
                // {"error": "Обслуживающий ресторан найден (100000097), но в нем не поддерживается доставка"}
                res2 = JSON.parse(res2)
                DEV_MODE && console.log('checkLocalAddress: %s', JSON.stringify(res2))

                if(typeof res2.error != 'undefined'){
                    // запоминаю невалидный адрес, чтобы один и тот же запрос по кругу не гоняли
                    coords.fullAddress = fullAddress
                    sessionStorage.setItem('badAddressWithCoordibates', JSON.stringify(coords))
                    showNoDeliveryPopup(fullAddress)
                }
            })
        }, err => {
            DEV_MODE && console.log('address by coord error: %s', JSON.stringify(err))
        })
    }

    function showNoDeliveryPopup(fullAddress){
        // показываю попап о том, что адрес не валидный
        $('div[data-tooltip-hook="#popup:nodelivery"] .t390__descr')
            .text(fullAddress)
        $('#rec355751621 a[href="#popup:nodelivery"]').click()
    }

    function getCustomHouse(value){
        var result = value.match(/[0-9]{1,3}[0-9а-я\/]{1,4}/i);
        if(result)
            return result[0];
        return "";
    }

    function prepeareGC(gc, elementValue){
        let displayName = "";
        let value = elementValue;

        let geoObject = gc.geoObjects.get(0);

        if (geoObject && geoObject.getCountryCode() == "RU") {
            let city = geoObject.getLocalities()[0] || geoObject.getAdministrativeAreas()[0]
            let street = geoObject.getThoroughfare() || geoObject.getLocalities()[0]
            if(city == street && city != 'Зеленоград')
                street = geoObject.getLocalities()[2]
            
            let jsonData = {
                'city': city,
                'street': street ? street : '',
                'house': geoObject.getPremiseNumber() || getCustomHouse(value),
                'fullAddress':  geoObject.getAddressLine()
            };

            let coordinates = geoObject.geometry.getCoordinates();
            if (Array.isArray(coordinates) && coordinates.length > 1) {
              jsonData.lat = coordinates[0]
              jsonData.lon = coordinates[1]
            }
    
            value = value.replace(geoObject.getCountry()+", ", "");
            value = value.replace(geoObject.getAdministrativeAreas()[0]+", ", "");
            value = value.replace("undefined", "");
            // displayName = "<div class='yandex-map-address_info'>"+value+"</div><div class='yandex-map-localities_info'>"+geoObject.getCountry()+", "+geoObject.getLocalities()[0]+"</div>";
            // displayName = displayName.replace("undefined", "");

            // pushGeoData(displayName, value, jsonData);
            // function pushGeoData(displayName, value, jsonData) {
            return {displayName, value, jsonData};
            // }
        }
        return null;
    }

    function pad(n){ return ('00' + n).slice(-2); }

    /**
     * Проверка возможности доставки на текущие координаты
     * 
     * @param {String} fullAddress 
     * @param {Number} lat 
     * @param {Number} lon 
     */
    async function checkLocalAddress(fullAddress, lat, lon){
        return new Promise((resolve, reject)=>{
            let now = new Date()
            doc_date = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()} 18:00`

            $.ajax({
                url: `${window.CHAIHONA_HOST}/eda-na-raione`,
                type: 'GET',
                crossDomain: true,
                data: {
                    city: null,
                    street: null, 
                    house: null,
                    brand: window.BRAND_CODE,
                    fullAddress,
                    lat,
                    lon,
                    doc_date,
                    superBrand: 'eda_na_raione'
                },
                success: function(rawData){
                    resolve(rawData)    
                },
                error: function(err){
                    console.log('checkLocalAddress error: %s', JSON.stringify(err))
                    reject(err)
                }
            })
        })
    }

    // функция проверки адреса
    async function checkAdress(force = false, popup_on_error = false)
    {
        let address = ud.el('street').val();
        if(!force && ud.props.suggestedAdres == address && ud.props.jsonAddress && ud.props.department){
            DEV_MODE && console.log('адрес остался прежним, проверку не запускаю (1)');
            return;
        }

        // адрес изменили, но строка есть, возможно корректировали дом
        if(!ud.props.jsonAddress){

            if(address && typeof ymaps.geocode != 'undefined'){
                DEV_MODE && console.log('в адресе что-то изменилось, перепроверяю');
                let gc = await ymaps.geocode( address, { boundedBy: moscowBound } );
                let res = prepeareGC(gc, address);
                if(res){
                    if(ud.props.suggestedAdres == address){
                        // адрес не изменился, запоминаю и выхожу
                        ud.props.suggestedAdres = address;
                        if(res.jsonData.house){
                            ud.props.jsonAddress = res.jsonData;
                            DEV_MODE && console.log('адрес остался прежним, проверку не запускаю (2)');
                            return;
                        }
                    }

                    ud.props.suggestedAdres = address;
                    if(res.jsonData.house)
                        ud.props.jsonAddress = res.jsonData;
                }
            }
        }

        // если поля заполнены 
        if (ud.props.jsonAddress) {

            let doc_date = $("select[name='time']").val()

            if(doc_date=='now'){
                let now = new Date()
                doc_date = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`
            }

            let sentData = {
                city: ud.props.jsonAddress.city,
                street: ud.props.jsonAddress.street, 
                house: ud.props.jsonAddress.house,
                brand: window.BRAND_CODE,
                fullAddress: ud.props.jsonAddress.fullAddress,
                lat: ud.props.jsonAddress.lat,
                lon: ud.props.jsonAddress.lon,
                doc_date,
                superBrand: 'eda_na_raione'
            }

            // console.log(JSON.stringify(sentData))

            // перед новым запросом гашу старую ошибку
            ud.el('street').parent().find('div.t-input-error').hide()
            
            // запрашиваем возможность доставки у АПИ
            $.ajax({
                url: `${window.CHAIHONA_HOST}/eda-na-raione`,
                type: 'GET',
                crossDomain: true,
                data: sentData
            }).done(function(rawData){
                console.log('checkAddress: %s', rawData);
                let data = JSON.parse( rawData );
                let chaihona_pay = $('#chaihona_pay');
                if(data.error){
                    chaihona_pay.attr('allow_pay', 'false')
                    // реальную ошибку пишу в консоль, на экран всегда одну...
                    console.log(data.error)
                    showError(ud.el('street'), 'К сожалению, сейчас мы не доставляем по указанному адресу', 'js-rule-error-minlength')
                    if(popup_on_error){
                        let link = $('#rec355751621 a[href="#popup:nodelivery"]')
                        if(link.length){
                            $('div[data-tooltip-hook="#popup:nodelivery"] .t390__descr')
                                .text(ud.props.jsonAddress.fullAddress,)
                            link.click()
                        }
                    }
                }
                else if(data.message){
                    hideBottomError('js-rule-error-string');

                    //TODO где-то вписать сумму доставки
                    // формирую выпадающий список "доставить к"
                    work_time = data.work_time ? data.work_time : '11:00-05:00'

                    if(data.week_days){ 
                        setDeliveryTimeByWeek(data.week_days, parseInt(data.delivery_time));

                        // показываю СВОЮ кнопку "оплатить"
                        chaihona_pay.attr('allow_pay', 'true');
                        if(!data.online_payment){
                            $(`#${tilda_form_id} input[name='paymentsystem'][value='cash']`).prop('checked', true);
                            $(`#${tilda_form_id} input[name='paymentsystem'][value='cloudpayments']`).attr("disabled",true);
                        
                            showBottomError('Обслуживающий ресторан не поддерживает онлайн-оплату', 'js-rule-error-string');

                            $('#chaihona_pay button').text('Оформить');
                        }
                        ud.props.department = data.department;
                    }
                    else{
                        showBottomError('В ответе сервера нет времени работы ресторана', 'js-rule-error-string');
                    }
                }
            });
        }
    }

    function hideError(element){
        if(element){
            let errorElement = element.parent().find('div.t-input-error');
            if(errorElement)
                errorElement.hide();
        }
    }

    // показ ошибок в штатных местах - под полем и рядом с кнопкой оплатить
    function showError(element, errorText, bottomClass=null){
        if(element){
            let errorElement = element.parent().find('div.t-input-error')
            if(errorElement){
                console.log('показываю текст ошибки: "%s"', errorText)
                errorElement.html( errorText )
                errorElement.show()
            } else {
                console.log('не нашел t-input-error для вывода сообщения: "%s"', errorText)
            }
        } else {
            console.log('не нашел элемент для вывода сообщения: "%s"', errorText)
        }
        
        if(bottomClass){
            errorSet.add(bottomClass);
            // $('p.t-form__errorbox-item.'+bottomClass).show();
            // $('p.t-form__errorbox-item.'+bottomClass).html(errorText);
        }
        
        // if(errorSet.size)
        //     $('div.js-errorbox-all').show();
    }

    function showBottomError(errorText, bottomClass){
        //console.log('showBottomError: %s', errorText);
        errorSet.add(bottomClass);
        $('p.t-form__errorbox-item.'+bottomClass).show();
        $('p.t-form__errorbox-item.'+bottomClass).html(errorText);
        $('div.js-errorbox-all').show();
    }

    function hideBottomError(bottomClass){
        $('p.t-form__errorbox-item.'+bottomClass).hide();
        errorSet.delete(bottomClass);
        
        //if(errorSet.size==0)
        //console.log('hideBottomError: %s', bottomClass);
            $('div.js-errorbox-all').hide();
    }
    
    // скрывает все ошибки при клике на "оплатить"
    function hideAllErrors(){
        $('p.t-form__errorbox-item').each(function(){
            $(this).hide();
        });
    }

    /**
     * Формирую массив дней (+30)
     * 
     * @param {int} [count]
     */
    function getDeliveryDays(count = 7){
        let res = []
        let nextDate = new Date()
        let select = $("select[name='time_2']")

        if(select){
            select.empty()

            for (let i = 1; i < count; i++) {
            let y = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(nextDate);
            let m = new Intl.DateTimeFormat('ru', { month: '2-digit' }).format(nextDate);
            let d = new Intl.DateTimeFormat('ru', { day: '2-digit' }).format(nextDate);
    
            let number = new Intl.DateTimeFormat('ru', { day: 'numeric' }).format(nextDate);
            let month = new Intl.DateTimeFormat('ru', { month: 'long' }).format(nextDate);
            let weekDay = new Intl.DateTimeFormat('ru', { weekday: 'long' }).format(nextDate);
            
            // отображаемое значение селекта
            let showDate = res.length==0 ? 'Сегодня' : `${number} ${month}, ${weekDay}`;
    
            // значения формирую в ISO, чтобы потом парсером разобрало верно
            let id = `${y}-${m}-${d}T12:00:00.000Z`
    
            res.push( {
                name: showDate, 
                id: id //`${nextDate.toISOString()}`
            } );
    
            select.append(new Option(showDate, id, false, id==selectedDeliveryDay))

            // прибавляется день
            nextDate.setDate( nextDate.getDate()+1 )
            }
        }

        return res
    }

    function getWorkTime(){
        // возвращает рабочее время для выбранной даты дд.мм.гггг
        if(deliveryByWeekObj && selectedDeliveryDay){
          // есть информация по дням недели
          // console.log( 'formDeliveryDay = '+this.formDeliveryDay )
  
          let date = new Date(selectedDeliveryDay)
  
          switch (date.getDay()) {
            case 0:
              return deliveryByWeekObj.sun
            case 1:
              return deliveryByWeekObj.mon
            case 2:
              return deliveryByWeekObj.tue
            case 3:
              return deliveryByWeekObj.wed
            case 4:
              return deliveryByWeekObj.thu
            case 5:
              return deliveryByWeekObj.fri
            case 6:
              return deliveryByWeekObj.sat
            default:
              return '11:00-05:00'
          }
        }
        else
          return work_time ? work_time : '11:00-05:00'
    }
  

    function setDeliveryTimeByWeek(week_days = null, delivery_time = null){
        if(week_days) deliveryByWeekObj = week_days
        if(delivery_time) dataDeliveryTime = parseInt(delivery_time)
        let select = $("select[name='time']")
        if(select){
            select.empty()
    
            deliveryDays = getDeliveryDays()

            if(!selectedDeliveryDay)
                selectedDeliveryDay = deliveryDays[0].id

            let today = deliveryDays.findIndex((element)=>{
                //console.log(`${element.id} <> ${selectedDeliveryDay}`)
                return element.id == selectedDeliveryDay
            })==0;
        

            let now = new Date()
            let target = new Date(selectedDeliveryDay)
            let tomorrow = new Date(selectedDeliveryDay)
            tomorrow.setDate( tomorrow.getDate()+1 )
      
            work_time = getWorkTime()
            
            // console.log('work_time = %s', work_time)
      
            let match = work_time.match(/(\d+):(\d+)-(\d+):(\d+)/)
            
            let time_shift = dataDeliveryTime
      
            if(match){
              let start_time = parseInt(match[1])*60 + parseInt(match[2]) + time_shift
              let end_time = parseInt(match[3])*60 + parseInt(match[4]) + time_shift
      
              // 11:00-03:00
              if (end_time < start_time) end_time += 24*60
      
              let begin_time = 0
      
              if(today) {
                // к текущему времени сразу прибавляю время доставки
                begin_time = now.getHours()*60 + now.getMinutes() + time_shift
                // если доставка уже работает
                if (begin_time>=start_time)
                    select.append(new Option('Как можно быстрее', 'now', true))
              }
      
              for (let i = start_time; i < end_time; i+=30){
                if(i>=begin_time){
                    if(i>=24*60)
                    {
                        let value = `${pad(tomorrow.getDate())}.${pad(tomorrow.getMonth()+1)}.${tomorrow.getFullYear()} ${pad( Math.floor((i-24*60)/60) )}:${pad( i%60 )}`
                        if(!selectedDeliveryTime) selectedDeliveryTime = value
                        select.append(new Option(
                            `${pad( Math.floor((i-24*60)/60) )}:${pad( i%60 )} (${pad(tomorrow.getDate())}.${pad(tomorrow.getMonth()+1)})`, 
                            value, false, 
                            value.substr(-5) == selectedDeliveryTime.substr(-5)))
                    }
                    else {
                        let value = `${pad(target.getDate())}.${pad(target.getMonth()+1)}.${target.getFullYear()} ${pad( Math.floor(i/60) )}:${pad( i%60 )}`
                        if(!selectedDeliveryTime) selectedDeliveryTime = value
                        select.append(new Option(
                            `${pad( Math.floor(i/60) )}:${pad( i%60 )}`, 
                            value, false, 
                            value.substr(-5) == selectedDeliveryTime.substr(-5)))
                    }
                }
              }
            }
        }
    }

    /**
     * В выпадающем списке сменили время доставки - проверить ресторан (может быть ночная зона)
     */
    function onTimeChange(){
        selectedDeliveryTime = $("select[name='time']").val()
        //console.log('selectedDeliveryTime = %s', selectedDeliveryTime)
        checkAdress(true)
    }

    /**
     * В выпадающем списке сменили дату доставки - проверить ресторан (может быть ночная зона)
     */
    function onDateChange(){
        selectedDeliveryDay = $("select[name='time_2']").val()
        checkAdress(true)
    }
});

