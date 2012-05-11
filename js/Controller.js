var Controller = function(vectorfield) {

    this.vectorfield = vectorfield;

    this.particles = [];
    
    this.vector = new Vector();

};

Controller.prototype = {

	separationRadius : 0.3,
	
	cohesionRadius : 2,
    
    cooldownTime : 30000,

    update : function(dt) {

        this.updateParticles(dt);

    },

    draw : function(gl) {
        
        Particle.drawEnqueue(this.particles);
        Particle.draw(gl);

    },

    updateParticles : function(dt) {

        var particleDistances = Particle.getParticleDistances(this.particles),
            particleCount = this.particles.length,
            i, neighborCount, maxNeighborCount = 0, swarmParticle;

        for (i = 0; i < particleCount; i++) {

            var particle = this.particles[i];

            particle.applyForce(
                this.vectorfield.getVector(particle.position)
            );

            neighborCount = Particle.applySwarmBehaviour(
				particleDistances[i],
				this.particles,
				particle,
				particleCount,
				this.separationRadius,
				this.cohesionRadius
			);

            particle.checkBoundary(this.vectorfield);

            particle.update(dt);

        }
		
    },

    reset : function() {

        this.particles = [];

    },

    getRandomInsidePosition : function() {

        var pos = new Vector(),
            entropyRadius = Entropyfier.prototype.entropyRadius;
        
        do {
            
            var minDistance = Infinity;
            
            pos.x = rand( entropyRadius, this.vectorfield.cols - entropyRadius);
            pos.y = rand( entropyRadius, this.vectorfield.rows - entropyRadius);
            
            for (var i = 0; i < game.entropyfiers.length; i++ ) {
                
                var dist = game.entropyfiers[i].position.sub(pos).norm();
                
                if (dist < minDistance) {
                    
                    minDistance = dist;
                    
                }
                
            }
            
        } while ( minDistance < entropyRadius );

        return pos;

    },

    addInitialParticles : function(amount) {

        for (var i = 0; i < amount; i++) {

            this.particles.push( new Particle( new Vector(
                Math.random() * this.vectorfield.cols,
                Math.random() * this.vectorfield.rows
            )));

        }

    },
    
    addParticle : function() {
        
        this.particles.push( new Particle( new Vector(
            Math.random() * this.vectorfield.cols,
            Math.random() * this.vectorfield.rows
        )).fadeIn( 1000 ) );

    },

    addParticlesAt : function(amount, position, radius) {

        var offset = new Vector(radius, 0, 0);

        for (var i = 0; i < amount; i++) {

            offset.rotate2DSelf( rand(0, Math.PI * 2) );
            this.particles.push( new Particle( position.add(offset) ).fadeIn( 500 ) );

        }

    }

};
