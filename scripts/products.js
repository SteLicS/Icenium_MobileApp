define(["jQuery", "kendo"], function ($, kendo) {

    function onDeviceReady()
    {
        app.views.products.viewModelList  = new kendo.data.ObservableObject({
            productListDataSource:  null,
            imageSource: null, 
            imageAlt: null,
            productAvailabilityLocal: null,
            productPriceLocal: null,
            init: function () 
                {
                    var that = this,dataSource;    
                    kendo.data.ObservableObject.fn.init.apply(that, []);
                    if(navigator.onLine)
                    {
                        console.log('externalJson_true')
                        console.log(app.BaseUrl)
                        dataSource = new kendo.data.DataSource({
                            transport: {
                                read: {
                                   url: app.BaseUrl + "productsdata",
                                   type: "GET",
        			               jsonpCallback: "callbackName",
                                   dataType: "jsonp",
                                   contentType: "application/json; charset=utf-8"
                                }
                            },
                             schema: {
                                        data: "products"
                                     }
                        });                    
                    }
                    else
                    {
                        console.log('externalJson_false')
                        dataSource = new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: "data/productsdata.json",
                                    dataType: "json"
                                }
                            },
                             schema: {
                                        data: "products"
                                     }
                        });  
                    }
                    console.log('dataSource')
                    console.log(dataSource)
                    that.set("productListDataSource", dataSource);  
                    
                 }    
            })


    }
    
    
     return {
        // inizializza l'app
        viewModelList: null,
        init: function () {
            console.log('deviceready product')
            document.addEventListener("deviceready", onDeviceReady, false);
            app.views.products.viewModelList.init();
        },
        refreshListView: function(e) {
            console.log('refreshListView')
            var element = e.view.element,
                listView = element.find("#products-listview").data('kendoMobileListView');
            listView.setDataSource(app.views.products.viewModelList.productListDataSource);
        },
        detailShow: function(e){
            console.log('detailShow')
            console.log('view')
            console.log(e.view)
            console.log('params')
            console.log(e.view.params)
            console.log('element')
            console.log(e.view.element)
            console.log('productListDataSource')
            console.log(app.views.products.viewModelList.productListDataSource)
            var model = app.views.products.viewModelList.productListDataSource.getByUid(e.view.params.uid);                
            app.views.products.viewModelList.imageSource = app.BaseUrl + model.productImage
            app.views.products.viewModelList.imageAlt = model.productImage
            app.views.products.viewModelList.productAvailabilityLocal = kendo.toString(kendo.parseDate(model.productAvailability),"d")
            app.views.products.viewModelList.productPriceLocal = kendo.toString(model.productPrice,"0.00")
             console.log('model.productColorsList')
             console.log(model.productColorsList)
             console.log(model.productColorsList[0].color)
            kendo.bind(e.view.element, model, kendo.mobile.ui);
            
        }
    }
});
