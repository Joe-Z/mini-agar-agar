var Menu = {
    
    menuOpen : false,
    
    hideInfo : function() {
        
        $("#newgame_dialogue").hide();
		$("#instr_dialogue").hide();
        
    },

    toggle : function() {
        
        if(game.state === "init") {
            
            return;
            
        } else if (game.state === "over") {
            
            game.state = "pause";
            this.startNewGame();
            return;
            
        }

        $("#menu").slideToggle("fast");

        if(this.menuOpen){
            document.getElementById("playpause").style.backgroundImage = "url(images/pause.png)";
            document.getElementById("playpause").style.removeProperty("opacity");

            $("#overlay").fadeTo("slow", 0.0, function() {
                $("#overlay").hide();
            });

            game.state = "run";
            this.hideInfo();
			
        }
        else{
            document.getElementById("playpause").style.backgroundImage = "url(images/play.png)";
            document.getElementById("playpause").style.opacity = "0.4";

            $("#overlay").show();
            $("#overlay").fadeTo("slow", 0.7);

            game.state = "pause";
        }

        this.menuOpen = !this.menuOpen;

    },
    
    open : function() {
        
        if (!this.menuOpen) {
            
            this.toggle();
            
        }
        
    },
    
    close : function() {
        
        if (this.menuOpen) {
            
            this.toggle();
            
        }
        
    },
    
    initialize : function() {

        document.getElementById("playpause").onselectstart = function() {return false;};

        if (navigator.appVersion.indexOf("Mac") !== -1){
        
            document.getElementById("playpause").style.paddingTop = "5px";
        
        }
        
        $("#playpause").click(function () {
            Menu.toggle();
        });
        
        $("#newg").click(function() { 
            Menu.hideInfo();
            $("#newgame_dialogue").show();
        });

        $("#startnewgame").click(function() {
            Menu.startNewGame();
        });
		
		$("#instr").click(function() { 
            Menu.hideInfo();
            $("#instr_dialogue").show();
        });
        
        $("#overlay").click(function() {
            Menu.close();
        });
        
        $(".close").click(function () {
            Menu.close();
        });
        
    },
    
    startNewGame : function() {
        
        this.close();
        this.hideInfo();
        
        game.resetLevel();

        setTimeout(function() {
            game.initLevel();
        }, 1000);
        
    },
    
    showErrorScreen : function() {
        
        this.open();
        $("#error").show();
        
    }
};