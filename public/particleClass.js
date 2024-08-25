export class LinearSpline {
    constructor(lerp) {
      this._points = [];
      this._lerp = lerp;
    }
  
    AddPoint(t, d) {
      this._points.push([t, d]);
    }
  
    Get(t) {
      let p1 = 0;
  
      for (let i = 0; i < this._points.length; i++) {
        if (this._points[i][0] >= t) {
          break;
        }
        p1 = i;
      }
  
      const p2 = Math.min(this._points.length - 1, p1 + 1);
  
      if (p1 == p2) {
        return this._points[p1][1];
      }
  
      return this._lerp(
          (t - this._points[p1][0]) / (
              this._points[p2][0] - this._points[p1][0]),
          this._points[p1][1], this._points[p2][1]);
    }
  }
  
export class ParticleSystem {
    constructor(params) {
      const uniforms = {
          diffuseTexture: {
              value: new THREE.TextureLoader().load('./map/fire.png')
          },
          pointMultiplier: {
              value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
          }

      };
 
    
      this._material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: _VS,
          fragmentShader: _FS,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          transparent: true,
          vertexColors: true
      });
    
      this._camera = params.camera;
      this._particles = [];
      this.id2 = params.id;

      this._geometry = new THREE.BufferGeometry();
      this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
      this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
      this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
      this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));
  
      this._points = new THREE.Points(this._geometry, this._material);
      this._points.frustumCulled = false;
      params.parent.add(this._points);
  
      this._alphaSpline = new LinearSpline((t, a, b) => {
        return a + t * (b - a);
      });
      this._alphaSpline.AddPoint(0.0, 0.0);
      this._alphaSpline.AddPoint(0.1, 1.0);
      this._alphaSpline.AddPoint(0.6, 1.0);
      this._alphaSpline.AddPoint(1.0, 0.0);
  
      this._colourSpline = new LinearSpline((t, a, b) => {
        const c = a.clone();
        return c.lerp(b, t);
      });
      this._colourSpline.AddPoint(0.0, new THREE.Color(0xFFFF80));
      this._colourSpline.AddPoint(1.0, new THREE.Color(0xFF8080));
  
      this._sizeSpline = new LinearSpline((t, a, b) => {
        return a + t * (b - a);
      });
      this._sizeSpline.AddPoint(0.0, 1.0);
      this._sizeSpline.AddPoint(0.5, 5.0);
      this._sizeSpline.AddPoint(1.0, 1.0);
  
      document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    
      this._UpdateGeometry();
    }

    


    _onKeyUp(event) {

    }
  
    _AddParticles(timeElapsed, word) {
      if (!this.gdfsghk) {
        this.gdfsghk = 0.0;
      }
      const id2 = word;
      this.gdfsghk += timeElapsed;
      const n = Math.floor(this.gdfsghk * 75.0);
      this.gdfsghk -= n / 75.0;
  

      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); // 90 degrees

    
    let partStartX = 0, partStartY = 0, partStartZ =0;

   
    
   

      for (let i = 0; i < n; i++) {
        let life = 0, velo;


        if ((id2=='livicRHand')||(id2=='livicLHand')){
        life = (Math.random() * 0.75 + 0.25) * 4;
        velo = new THREE.Vector3(0,1,0);
    }
        this._particles.push({
            position: new THREE.Vector3(
                (Math.random() * 2 - 1) * 1.0+partStartX,
                (Math.random() * 2 - 1) * 1.0+partStartY,
                (Math.random() * 2 - 1) * 1.0+partStartZ),
            size: (Math.random() * 0.5 + 0.5) * 4.0,
            colour: new THREE.Color(),
            alpha: 1.0,
            life: life,
            maxLife: life,
            rotation: Math.random() * 2.0 * Math.PI,
            velocity: velo
        });
      }
      particleSize = this._particles.length;
    }
  
    _UpdateGeometry() {
      const positions = [];
      const sizes = [];
      const colours = [];
      const angles = [];
  
      for (let p of this._particles) {
        positions.push(p.position.x, p.position.y, p.position.z);
        colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
        sizes.push(p.currentSize);
        angles.push(p.rotation);
      }
  
      this._geometry.setAttribute(
          'position', new THREE.Float32BufferAttribute(positions, 3));
      this._geometry.setAttribute(
          'size', new THREE.Float32BufferAttribute(sizes, 1));
      this._geometry.setAttribute(
          'colour', new THREE.Float32BufferAttribute(colours, 4));
      this._geometry.setAttribute(
          'angle', new THREE.Float32BufferAttribute(angles, 1));
    
      this._geometry.attributes.position.needsUpdate = true;
      this._geometry.attributes.size.needsUpdate = true;
      this._geometry.attributes.colour.needsUpdate = true;
      this._geometry.attributes.angle.needsUpdate = true;
    }
  
    _UpdateParticles(timeElapsed) {
      for (let p of this._particles) {
        p.life -= timeElapsed;
      }
  
      this._particles = this._particles.filter(p => {
        return p.life > 0.0;
      });
  
      for (let p of this._particles) {
        const t = 1.0 - p.life / p.maxLife;
  
        p.rotation += timeElapsed * 0.5;
        p.alpha = this._alphaSpline.Get(t);
        p.currentSize = p.size * this._sizeSpline.Get(t);
        p.colour.copy(this._colourSpline.Get(t));
  
        p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));
  
        const drag = p.velocity.clone();
        drag.multiplyScalar(timeElapsed * 0.1);
        drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
        drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
        drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
        p.velocity.sub(drag);
      }
  
      this._particles.sort((a, b) => {
        const d1 = this._camera.position.distanceTo(a.position);
        const d2 = this._camera.position.distanceTo(b.position);
  
        if (d1 > d2) {
          return -1;
        }
  
        if (d1 < d2) {
          return 1;
        }
  
        return 0;
      });
    }
  
    Step(timeElapsed, id2) {
        
       
            
      this._AddParticles(timeElapsed, id2);
      this._UpdateParticles(timeElapsed);
        
      this._UpdateGeometry();
    }
  }
  
export class BBox{

  constructor(x,y,z,x2,y2,z2,parent){
     this.x = x;
     this.y = y;
     this.z = z;
    let minX, maxX, minY, minZ, maxY, maxZ;

     if ((y2==undefined)&&(z2==undefined)&&(parent==undefined)){ 

      this.x2 = x2;
      this.minX = x - x2;

      this.maxX = x + x2;
      this.minY = y ;
      this.maxY = y + x2+x2;
      this.minZ = z - x2;
      this.maxZ = z + x2;
      this.parent = null;

     }
     else if ((z2==undefined)&&(z2==undefined)&&(parent==undefined)){

      this.minX = x - x2;
      this.maxX = x + x2;
      this.minY = y - 1000 ;
      this.maxY = y + 1000;
      this.minZ = z - y2;
      this.maxZ = z + y2;
      this.parent = null;
     } 
     else if ((x2)&&(z2)&&(y2)&&(parent)){
      this.minX = x - x2;
      this.maxX = x + x2;
      this.minY = y;
      this.maxY = y + y2+y2;
      this.minZ = z - z2;
      this.maxZ = z + z2;
      this.parent = parent;
      this.x2 = x2;
      this.y2 = y2;
      this.z2 = z2;
     }
  }
  set(x1,y1,z1){
    this.x = x1;
    this.y = y1;
    this.z = z1;
  }
  meet(object, grounded){
    if (object){

    if ((object.position.x>this.minX)&&(object.position.x<=this.maxX)&&(object.position.y>this.minY)&&(object.position.y<=this.maxY)&&(object.position.z>this.minZ)&&(object.position.z<=this.maxZ)&&(grounded==1)){

      return true;}
    else
    return false;}
  }
  step(){
    if (parent){
    this.set(parent.position.x, parent.position.y, parent.position.z);
    minX = x - x2;
    maxX = x + x2;
    minY = y;
    maxY = y + y2+y2;
    minZ = z - z2;
    maxZ = z + z2;
    }
  }
}