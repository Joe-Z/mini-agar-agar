var Game = function() {
    
    this.vectorfield = new Vectorfield();    
    this.inputHandler = new InputHandler(this.vectorfield);
    this.controller = new Controller(this.vectorfield);
    
    this.stardust = new Stardust(this.vectorfield);
    
    this.state = "init";
    
    this.drawVectorfield = true;
    this.drawStardust = true;
    
    this.leukoInterval = null;
    this.particleInterval = null;
    this.devourerInterval = null;
    this.entropyInterval = null;
    
    this.entropyfiers = [];
    
};

Game.prototype = {
    
    particleCount : 20,
	particleRate : 1500,
    
    entropyRate : 6000,
    entropyAmount : 2,

    initialize : function(gl) {
        
        Particle.initialize(gl);
        
        Entropyfier.initialize(gl);
        
        this.initLevel();
        
        this.vectorfield.initialize(gl);
        this.inputHandler.initialize();
        this.stardust.initialize(gl);
        
        this.initBackground(gl);
		
		Entropyfier.add(game.entropyAmount, game.entropyfiers);
    
    },
    
    initBackground : function(gl) {
        
        gl.bindShader(gl.defaultShader);
        
        this.backgroundTexture = gl.loadTexture("textures/background.png");
        
        this.backgroundScale = [2, 2];
        
        if (canvas.width > canvas.height) {
            
            this.backgroundScale[1] *= canvas.width / canvas.height;
            
        } else {
            
            this.backgroundScale[0] *= canvas.height / canvas.width;
            
        }
        
    },
    
    update : function(dt) {
        
        Timer.update(dt);
        TWEEN.update( dt );
        
        this.vectorfield.update(dt);
        this.inputHandler.update(dt);
        
        Entropyfier.update(dt, this.entropyfiers);
        
        if (this.drawStardust) {
            
            this.stardust.update(dt);
            
        }
        
        if (this.state === "run") {
            
            this.controller.update(dt);
            
        }
        
    },
    
    draw : function(gl) {
        
        Entropyfier.draw(gl, this.entropyfiers);
        
        this.drawBackground(gl);
        
        if (this.drawStardust) {
            
            this.stardust.draw(gl);
            
        }
        
        if (this.drawVectorfield) {
            
            this.vectorfield.draw(gl);
            
        }
        
        this.controller.draw(gl);
        
    },
    
    drawBackground : function(gl) {
        
        var scale = this.backgroundScale;
        
        gl.bindShader(gl.textureShader);
        
        gl.pushMatrix();
        
        gl.matrix.identity();
        gl.scale( scale[0], scale[1] );
    
        gl.passMatrix();
    
        gl.passColor([0.0, 0.0, 0.0, 0.0]);
    
        gl.passTexture(this.backgroundTexture);
        gl.drawQuadTexture();
    
        gl.popMatrix();
        
    },
    
    initLevel : function() {
        
        this.resetLevel();
        
        this.controller.addInitialParticles(this.particleCount);
        
        this.initIntervals();
        
        this.state = "run";
        
    },
    
    initIntervals : function() {
        
        this.entropyInterval = Timer.setInterval(function() {
            
            Entropyfier.add(game.entropyAmount, game.entropyfiers);
            
        }, this.entropyRate);
        
        
        // FIXME: count particles in Cytoplast
        this.particleInterval = Timer.setInterval(function() {
            
            if (game.controller.particles.length < Particle.prototype.maxCount) {
            
                game.controller.addParticle();
                
            }
            
        }, this.particleRate);
        
    },
    
    resetLevel : function() {
        
        Timer.reset();
		
        TWEEN.removeAll();
        
        this.entropyfiers = [];
        
        this.controller.reset();
        this.vectorfield.reset();
        
        this.state = "init";
        
    }

};