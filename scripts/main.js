// variabile esposta globalmente
var app;

requirejs.onError = function(err){
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }
}



require.config({
    paths: {        
        jQuery: "lib/jquery.min",
        kendo: "lib/kendo.mobile.min"
    },
    shim: {
        jQuery: {
            exports: "jQuery"
        },
        kendo: {
            deps: ["jQuery"],
            exports: "kendo"
        }
    },
    config:{
        i18n: {
            locale: 'it-it'
            //locale: 'en-US'
        }
    }

});



// percorsi relativi al main
require(["jQuery","app","i18n!nls/speak"], function ($, application, speak) {
    // Setup AJAX engine            
    console.log('require main')
    console.log('speak.locale: ' + speak.locale)
    if(speak.locale != "en"){
        // modifica le stringhe solo se necessario
        console.log("Apply translation globally");
        
        $('[data-localized-text]').each(function(){   
            var $this = $(this);
            var string = $this.data('localized-text');            
            $this.text(speak[string]);
        });    
    
        
    }
    $(function(){
        // assegno la variabile globale
        console.log('app.init')
        app = application;
        app.init();
        app.speak = speak;
        $.ajaxSetup({
           global: true 
        });
        
    });
});