define(["jQuery", "kendo"], function ($, kendo) {
    console.log('define cart')
    
    function onError(tx, e) {
	//console.log("Error: " + e.message);
       console.log("Error: " + e.message);
    } 
      
    function onSuccess (tx, r) {
    	//app.refresh();
    }
    function openDb() {
        console.log(app.views.cart)
        if(window.sqlitePlugin !== undefined) {
            console.log("Using SQLite Plugin DB");
            app.views.cart.db = window.sqlitePlugin.openDatabase("ShoppingListDB");
        } else {
            // For debuging in simulator fallback to native SQL Lite
            console.log("Use built in SQLite");
            app.views.cart.db = window.openDatabase("ShoppingListDB", "1.0", "Shopping List Demo", 200000);
        }
    }
    function createTable() {
        console.log('createtable')
        
        app.views.cart.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS shopping_list(id INTEGER PRIMARY KEY ASC, item_name TEXT, item_price REAL, is_done INTEGER)", [], onSuccess, onError);
        });
        
        console.log('createtable_ok')

    }
    function addItem(itemName, itemPrice){
        console.log('addItem-  internal: ' + itemName + ' price: ' + itemPrice)
        console.log('typeOf: ' + typeof(itemPrice))
        app.views.cart.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO shopping_list(item_name, item_price, is_done) VALUES (?,?,?)",
                          [itemName, itemPrice, 1],
                          onSuccess,
                          onError);
        });
    }
    
    function selectItem(itemId) {

        app.views.cart.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM shopping_list WHERE id = ?",
                          [itemId],
                          onSuccess,
                          onError);
        });
    }
    function removeItem(itemId){

        app.views.cart.db.transaction(function(tx) {
            tx.executeSql("DELETE FROM shopping_list WHERE id = ?",
                          [itemId],
                          onSuccess,
                          onError);
        });
    }    
    
    function clearCompleted() {
        
        app.views.cart.db.transaction(function(tx) {
            tx.executeSql("DELETE FROM shopping_list ",
                          [],
                          onSuccess,
                          onError);
        });
    }
    
    function onDeviceReady()
    {
        console.log('init_dbmanager')
        app.views.cart.completedListView = $("#cart-list").kendoMobileListView({
                                            template: $("#cart-list-template").html(),
                                            style: 'inset'
                                            }).data("kendoMobileListView");
        openDb();
        createTable();
    }
    
   
    
    return {
        // inizializza l'app
        completedListView: null,
        db: null,
        cartItemsCount: 0,
        cartItemsTotal: 0,
        clientId:  'APP-80W284485P519543T',
        clientEmail: "test@test.it",
        init: function () {
            console.log('deviceready cart')
           document.addEventListener("deviceready", onDeviceReady, false);
        },
        refreshListView: function(){
            console.log('refreshListView_cart')
            var render = function (tx,rs) {
    		
                var completedRows = new Array();
        
        		for (var i = 0; i < rs.rows.length; i++) {
                        completedRows.push(rs.rows.item(i));
        		}
                var dscomplete = new kendo.data.DataSource({ data: completedRows });
               
                app.views.cart.completedListView.setDataSource(dscomplete);
                dscomplete.aggregate([{ field: "id", aggregate: "count" },{ field: "item_price", aggregate: "sum" }]);
                
                /* gestione numero elementi carrello*/
                if (dscomplete.aggregates().id != undefined){
                    app.views.cart.cartItemsCount  = dscomplete.aggregates().id.count;
                    console.log(app.views.cart.cartItemsCount);
                    
                    $('#itemscount').text(app.views.cart.cartItemsCount)
                    $('.cart-badge').text(app.views.cart.cartItemsCount);
                    $('.cart-badge').show();
                }
                else{
                    $('#itemscount').text(0);
                    $('.cart-badge').text(0);
                    $('.cart-badge').hide();
                }
                
                /* gestione totale carrello*/
                if (dscomplete.aggregates().item_price != undefined){
                       app.views.cart.cartItemsTotal  = dscomplete.aggregates().item_price.sum;
                    console.log(app.views.cart.cartItemsTotal  );   
                    $('#carttotal').text(app.views.cart.cartItemsTotal)
                }
                else{
                    $('#carttotal').text(0);
                }                
        	}

        	app.views.cart.db.transaction(function(tx) {
        		tx.executeSql("SELECT * FROM shopping_list", [], render, app.onError);
    	    });
           
        },
        addCartItem: function (e){
            console.log('addItem: ' + $('#productHidden').val() + ' - price: ' + $('#productpriceHidden').val())
            addItem($('#productHidden').val(), $('#productpriceHidden').val())
            app.views.cart.refreshListView();
        },
        removeCartItem: function (e){
            var data = e.button.data();
            console.log('removeItem: ' + data.id)
            removeItem(data.id);
            app.views.cart.refreshListView();
        },
        completionCallback: function(proofOfPayment) {
            // TODO: Send this result to the server for verification;
            // see https://developer.paypal.com/webapps/developer/docs/integration/mobile/verify-mobile-payment/ for details.
            console.log("Proof of payment: " + JSON.stringify(proofOfPayment));
            alert("Proof of payment: " + JSON.stringify(proofOfPayment));
            
          $('#checkout_message').text('Pagamento accettato')
            clearCompleted();
        },
        cancelCallback:  function(reason) {
            var messsage = "Payment cancelled: " + reason;
            console.log(messsage);
            alert(messsage );
            $('#checkout_message').text(messsage);
        },
        showCheckout: function(){
            $('#name').val('')
            $('#surname').val('')
            $('#address').val('')
            $('#paymenttype').val('1')
            
        },
        checkout: function(){
            var result = true;
            if ($('#name').val()=='')
            {
                result = false;
                $('#name').addClass('error');
            }
            else
                $('#name').removeClass('error');
            
            console.log($('#name').val())
            console.log($('#surname').val())
            console.log($('#address').val())
            console.log($('#paymenttype').val())
            console.log(app.views.cart.cartItemsTotal)
            
            if (result)
            {
                if ($('#paymenttype').val()=="1")
                {
                    window.plugins.PayPalMobile.setEnvironment("PayPalEnvironmentSandbox");                   
                    var payment = new PayPalPayment(app.views.cart.cartItemsTotal.toString(), "EUR", "Test PayPalPlugin");
                    window.plugins.PayPalMobile.presentPaymentUI(app.views.cart.clientId, app.views.cart.clientEmail, "someuser@somedomain.com", payment, app.views.cart.completionCallback, app.views.cart.cancelCallback);            
                }
                else{ 
                    $('#checkout_message').text(' Ordine confermato')
                    clearCompleted();
                }
                app.views.cart.refreshListView();
                parent.location='#tabstrip-thanks';
            }
        },
        testPayPal: function(){
                alert('start test')
                try
                {
                    window.plugins.PayPalMobile.setEnvironment("PayPalEnvironmentSandbox");
                    //alert ('setEnvironment SUCCESS')
                    var payment = new PayPalPayment("1.99", "EUR", "Awesome saws");
                    //alert ('set PayPalPayment SUCCESS')
                    console.log('payment')
                    console.log(payment.amount)
                    console.log(payment.currency )
                    console.log(payment.shortDescription)

                    //alert(app.views.cart.clientId)
                    //alert(app.views.cart.clientEmail)
                      // launch UI, the PayPal UI will be present on screen until user cancels it or payment completed
                      window.plugins.PayPalMobile.presentPaymentUI(app.views.cart.clientId, app.views.cart.clientEmail, "someuser@somedomain.com", payment, app.views.cart.completionCallback, app.views.cart.cancelCallback);
                    console.log('presentPaymentUI correct')
                }                
                catch(e)
                {
                    alert ('testPayPal exp: '+ e.message)
                }
                
                alert('test passed');
            }
        
    }
});
