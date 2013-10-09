define(["jQuery", "kendo"], function ($, kendo) {
    console.log('define login')
    var LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
        password: "",

        onLogin: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

                return;
            }

            that.set("isLoggedIn", true);
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        }
    });
    
    function onDeviceReady()
    {
        
        app.views.login.viewModel= new LoginViewModel();
        kendo.bind($('#tabstrip-login'),app.views.login.viewModel);

    }
     return {
        // inizializza l'app
        viewModel: null,
        init: function () {
            console.log('deviceready login')
           document.addEventListener("deviceready", onDeviceReady, false);
        }
     
     }
    
    
});
