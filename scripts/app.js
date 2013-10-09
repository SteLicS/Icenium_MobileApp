define(["jQuery", "kendo","cart","cat", "location","login","products", "fileManager", "pdfManager"], function ($, kendo, cart, cat, location,login,products, fileManager,pdfManager) {
    console.log('define app')
    var _kendoApplication,mobileSkin = "";

    // PhoneGap is ready
    function onDeviceReady() {
        
        console.log("app initialization started");
        _kendoApplication = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout" });
        $('#current-culture').text(kendo.culture().name);
        app.views.cart.init();
        app.views.cart.refreshListView();
        console.log("app initialization finished");
        
        // check Connection
    }

    return {
        // inizializza l'app
        init: function () {
            console.log('return init app')
            document.addEventListener("deviceready", onDeviceReady, false);
        },
        // rendo disponibili le views nel namespace dell'app
        views: {
            cart: cart,
            cat: cat,
            location: location,
            login: login,
            products: products,
            fileManager: fileManager,
            pdfManager: pdfManager
        },        
        BaseUrl: "http://dev.stelics.it/icenium/", 
        IsConnected: true,
        changeSkin: function (e) {
            console.log('changeSkin');
            if (e.sender.element.text() === "Flat") {
                e.sender.element.text("Native");
                mobileSkin = "flat";
            }
            else {
                e.sender.element.text("Flat");
                mobileSkin = "";
            }
            app.getKendoApplication().skin(mobileSkin)
            
        },
        changeCulture: function(e) {
            if (kendo.culture().name=='en-US')
                kendo.culture('it-IT');
            else
                kendo.culture('en-US');
    
            console.log(kendo.culture());
            $('#current-culture').text(kendo.culture().name);
        },
        currentCulture: function(e){    
             return kendo.culture().name;   
        },
        checkConnection: function(e){
            _kendoApplication.IsConnected = navigator.onLine;
            if(_kendoApplication.IsConnected)
                app.showErrorMessage('connesso');
            else
                app.showErrorMessage('disconnesso');      
            
            console.log('init app.IsConnected');
            console.log(_kendoApplication.IsConnected);
        },
        showErrorMessage: function (message) {
            $("#error-view .message").text(message);
            $("#error-view").show().data().kendoMobileModalView.open();
        },
        closeErrorMessage: function () {
            $("#error-view").data().kendoMobileModalView.close();
        },
        getKendoApplication: function(){
            return _kendoApplication;
        },
        showLoading: function () {
            _kendoApplication.showLoading();
        },
        hideLoading: function () {
            _kendoApplication.hideLoading();
        },
        openPDF: function(){
            app.views.pdfManager.viewModel.open()
        }
    }
});