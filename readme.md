# CDN скрипт для "Еды на районе"

Скрипт автоматически подтягивает нужные зависимости (яндекс карты и jquery ui)

## Установка

В заголовок страницы в тильде вставить 

```html
<script>    
    $(document).ready(function (){
        $.ajax({
            url: 'https://raw.githubusercontent.com/kolei/edanarayone/master/js/enr.js',
            crossDomain: true,
            cache: false, 
            type: 'GET'
        }).done(function(rawData){
            let script = document.createElement("script");
            script.text = rawData;
            document.body.appendChild(script);
        });
    });
</script>    
```

,где **master** - название ветки в репозитории

# TODO

# Changelog

## 1.5

+ передрал обратно с кальяна