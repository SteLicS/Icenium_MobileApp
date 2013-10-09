define(["jQuery", "kendo"], function ($, kendo) {
    console.log('define cat')

    
    function onDeviceReady()
    {
        app.views.cat.categories = new kendo.data.HierarchicalDataSource({
        transport: {
              read: {
                    url: "data/catdata.json",
                    dataType: "json"
                      }
                },
                schema: {
                    data: "cat",
                    model: {
                        id: "catId",
                        hasChildren: "hasSubCategories"
                    }
                }
        });

    }
    
    
    return {
        // inizializza l'app
        categories: null,
        init: function () {
            console.log('deviceready cat')
           document.addEventListener("deviceready", onDeviceReady, false);
        },
        refreshListView: function (e) {
            console.log('refreshListView')
            var categoryId = e.view.params.catId,
                parentcategoryId = e.view.params.parentcatId,
                element = e.view.element,
                backButton = element.find('#cat-back'),
                listView = element.find("#cat-listview").data('kendoMobileListView'),
                navBar = element.find('#cat-navbar').data('kendoMobileNavBar');
            
            console.log('categoryId: ' + categoryId)
            console.log('parentcategoryId: ' + parentcategoryId)
            
            if (categoryId) {
                app.views.cat.categories.fetch(function() {
                    var item = app.views.cat.categories.get(categoryId);
                    console.log('item')
                    console.log(item)
                    
                    if (parentcategoryId > 0)
                    {
                        var currItem = app.views.cat.categories.get(parentcategoryId)
                        var sub = currItem.subcat;
                        item = sub.find(function(e) {return e.catId===9;})
                    }
                    
                    if (item) {
                        backButton.show();
                        listView.setDataSource(item.subcat);
                        navBar.title(item.catTitle);
                    } else {
                        // redirect to root
                        setTimeout(function() {
                            kendo.mobile.application.navigate('#tabstrip-home');
                        }, 0);
                    }
                });
            } else {
               
                backButton.hide();
                navBar.title('Lista Categorie');
                listView.setDataSource(app.views.cat.categories);
            }
    
            e.view.scroller.scrollTo(0, 0);
        }
    }
});

