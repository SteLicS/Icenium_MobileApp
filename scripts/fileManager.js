define(["jQuery", "kendo"], function ($, kendo) {

    var FileManagerViewModel = kendo.data.ObservableObject.extend({
    	fileSystemHelper: null,
	    fileNameField: null,
	    textField: null,
        run: function(){
                         $("#result").text('run');
            var that = this,
    		writeFileButton = $("#writeFileButton"),
    		readFileButton = $("#readFileButton"),
    		deleteFileButton = $("#deleteFileButton");
        
    		that.fileNameField = $("#fileNameInput");
            
    		that.textField = $("#textInput");
            
            writeFileButton.click(function() { 
                that._writeTextToFile.call(that)
            });
            
            readFileButton.click(function() { 
                that._readTextFromFile.call(that)
            });
            
            deleteFileButton.click(function() { 
                that._deleteFile.call(that)
            });
           
            //app.views.fileManager.viewModel.fileSystemHelper = new FileSystemHelper();
    		that.fileSystemHelper = new FileSystemHelper();
        },
    
    	_deleteFile: function () {
                      		var that = this,
    		    fileName = that.fileNameField.val();
            
    		if (that._isValidFileName(fileName)) {
    			that.fileSystemHelper.deleteFile(fileName, that._onSuccess, that._onError);
    		}
    		else {
    			var error = { code: 44, message: "Invalid filename"};
    			that._onError(error);
    		}
    	},
        
    	_readTextFromFile: function() {
                        
    		var that = this,
    		    fileName = that.fileNameField.val();
            
    		if (that._isValidFileName(fileName)) {
    			that.fileSystemHelper.readTextFromFile(fileName, that._onSuccess, that._onError);
    		}
    		else {
    			var error = { code: 44, message: "Invalid filename"};
    			that._onError(error);
    		}
    	},
        
    	_writeTextToFile: function() {
            $("#result").text('_writeTextToFile');
    		var that = this,
        		fileName = that.fileNameField.val(),
        		text = that.textField.val();
    		if (that._isValidFileName(fileName)) {
                try{                
                    $("#result").text('_writeTextToFile_try');
    			    that.fileSystemHelper.writeLine(fileName, text, that._onSuccess, that._onError)
                }
                catch(e){
                    $("#result").text('_writeTextToFile_exp: ' + e.message);
                    alert('writeLine ex ' + ex.message)
                }
                $("#result").text('_writeTextToFile_end');
    		}
    		else {
    			var error = { code: 44, message: "Invalid filename"};
    			that._onError(error);
            }
    	},
        
    	_onSuccess: function(value) {
                		var notificationBox = $("#result");
    		notificationBox.text(value);
    	},
        
    	_onError: function(error) {
                        
            var errorCodeDiv = $('<div> Error code:' + error.code +' </div>');
            var errorMessageDiv  = $('<div> Message:' + error.message +' </div>');
    		var notificationBox = $("#result");
            
    		notificationBox.text("");
    		notificationBox.append(errorCodeDiv);
    		notificationBox.append(errorMessageDiv);
    	},
        
    	_isValidFileName: function(fileName) {
    		//var patternFileName = /^[\w]+\.[\w]{1,5}$/;
    		return fileName.length > 2;
    	}
    });
    
function onDeviceReady()
    {        
        app.views.fileManager.viewModel= new FileManagerViewModel();
       app.views.fileManager.viewModel.run();

    }
     return {
        // inizializza l'app
        viewModel: null,
        init: function () {
            $("#result").text('init');
            console.log('deviceready filemanager')
           document.addEventListener("deviceready", onDeviceReady, false);
        }
     
     }
    
    
    
});