define(["jQuery", "kendo"], function ($, kendo) {
    
var PDFManagerViewModel = kendo.data.ObservableObject.extend({
        
        open: function (){
           
            var infoDiv = document.getElementById("infoField");
            var path = this.getWorkingFolder() + "sample.pdf";
            infoDiv.innerText = path;          
            /*
            if (platformModule.id == 'android') 
                window.open(path, '_system');
            else 
                window.open(path, '_blank');
            */
            window.open(path, platformModule.id == 'android'? '_system': '_blank');

        },
        getWorkingFolder: function() {
        	var path = window.location.href.replace('index.html#tabstrip-pdf', 'data/');
            console.log(path)
        	return path;
        }
        
    });
    
    function onDeviceReady(){
       
        app.views.pdfManager.viewModel= new PDFManagerViewModel();
    }
    
    
    return {
        // inizializza l'app
        viewModel: null,
        init: function () {
            console.log('deviceready pdfmanager')
           document.addEventListener("deviceready", onDeviceReady, false);
        }
        
     
     }
    });