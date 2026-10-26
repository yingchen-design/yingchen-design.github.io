/* A tessellated cylindrical image belt. HTML links remain the accessible interaction layer. */
window.CurvedGallery = class CurvedGallery {
  constructor(stage, cards, invalidate) {
    this.stage=stage; this.cards=cards; this.invalidate=invalidate; this.ready=false;
    this.canvas=document.createElement('canvas');
    this.canvas.className='curved-gallery-canvas';this.canvas.setAttribute('aria-hidden','true');
    stage.prepend(this.canvas);
    this.gl=this.canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
    if (!this.gl) {this.canvas.remove();return;}
    try {this.init();} catch(error) {console.warn('Curved gallery unavailable:',error.message);this.gl=null;this.canvas.remove();return;}
    this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.ready=false;this.presented=false;document.documentElement.classList.add('gallery-boot');document.documentElement.classList.remove('gallery-webgl');document.body.classList.remove('curved-ready');});
    this.canvas.addEventListener('webglcontextrestored',()=>{try{this.init();this.load();}catch(_){document.body.classList.remove('curved-ready');}});
    this.load();
  }
  init() {
    const gl=this.gl;
    const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
    const vertex=shader(gl.VERTEX_SHADER,`
      attribute vec2 aUV;
      uniform vec2 uViewport;
      uniform vec2 uCard;
      uniform float uOffset;
      uniform float uRadius;
      uniform float uFocal;
      uniform vec2 uHover;
      uniform float uLift;
      varying vec2 vUV;
      void main(){
        float localX=(aUV.x-0.5)*uCard.x;
        float edge=(aUV.x-0.5)*2.0;
        // Flat at rest. On hover the centre recedes, opposite to the old convex belt.
        float z=-uLift*(1.0-edge*edge)*uCard.x*0.065;
        float projection=uFocal/(uFocal-z);
        float x=uOffset+localX*projection;
        float y=(aUV.y-0.5)*uCard.y*projection;
        gl_Position=vec4(x*2.0/uViewport.x,y*2.0/uViewport.y,0.0,1.0);
        vUV=aUV;
      }`);
    const fragment=shader(gl.FRAGMENT_SHADER,`
      precision mediump float;
      uniform sampler2D uImage;
      uniform float uSaturation;
      varying vec2 vUV;
      void main(){vec4 color=texture2D(uImage,vUV);float gray=dot(color.rgb,vec3(0.2126,0.7152,0.0722));gl_FragColor=vec4(mix(vec3(gray),color.rgb,uSaturation),color.a);}
    `);
    this.program=gl.createProgram();gl.attachShader(this.program,vertex);gl.attachShader(this.program,fragment);gl.linkProgram(this.program);
    if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(this.program));
    gl.useProgram(this.program);gl.deleteShader(vertex);gl.deleteShader(fragment);
    const verts=[],indices=[],nx=80,ny=8;
    for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++)verts.push(x/nx,y/ny);
    for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*(nx+1)+x;indices.push(i,i+1,i+nx+1,i+1,i+nx+2,i+nx+1);}
    this.vertices=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.vertices);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
    this.indices=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);this.indexCount=indices.length;
    this.uv=gl.getAttribLocation(this.program,'aUV');gl.enableVertexAttribArray(this.uv);gl.vertexAttribPointer(this.uv,2,gl.FLOAT,false,0,0);
    this.uniforms={};for(const name of ['uViewport','uCard','uOffset','uRadius','uFocal','uImage','uSaturation','uHover','uLift'])this.uniforms[name]=gl.getUniformLocation(this.program,name);
    gl.uniform1i(this.uniforms.uImage,0);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.clearColor(0,0,0,0);this.textures=[];this.sources=[];this.composites=[];this.videoFrames=[];this.colors=[];this.hoverStates=[];this.presented=false;
  }
  async load() {
    try {
      await Promise.all(this.cards.map(async(card,i)=>{
        const image=card.querySelector('img');await image.decode();
        this.sources[i]=image;
        const gl=this.gl,texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        this.textures[i]=texture;
      }));
      this.resize();this.ready=true;this.invalidate();
    } catch(error) {console.warn('Using the HTML gallery:',error.message);document.body.classList.remove('curved-ready');document.documentElement.classList.remove('gallery-boot');}
  }
  compose(index,source) {
    const card=this.cards[index],media=card.querySelector('.slide-media');
    const w=Math.min(1800,Math.round(media.clientWidth*Math.min(devicePixelRatio||1,2))),h=Math.round(w*media.clientHeight/media.clientWidth);
    const textureCanvas=this.composites[index] || (this.composites[index]=document.createElement('canvas'));
    if(textureCanvas.width!==w || textureCanvas.height!==h){textureCanvas.width=w;textureCanvas.height=h;}
    const ctx=textureCanvas.getContext('2d');
    ctx.fillStyle=getComputedStyle(media).backgroundColor;ctx.fillRect(0,0,w,h);
    const padding=card.classList.contains('advisor') ? w*.06 : 0;
    const boxW=w-padding*2,boxH=h-padding*2;
    const sourceW=source.videoWidth||source.naturalWidth,sourceH=source.videoHeight||source.naturalHeight;
    const contain=card.classList.contains('advisor');
    const scale=contain ? Math.min(boxW/sourceW,boxH/sourceH) : Math.max(boxW/sourceW,boxH/sourceH);
    const pos=card.classList.contains('mde') && innerWidth>600 ? .67 : .5;
    ctx.drawImage(source,padding+(boxW-sourceW*scale)*.5,padding+(boxH-sourceH*scale)*pos,sourceW*scale,sourceH*scale);
    return textureCanvas;
  }
  resize() {
    if(!this.gl||!this.sources||this.cards.some((_,i)=>!this.sources[i]||!this.textures[i]))return;
    const dpr=Math.min(devicePixelRatio||1,2);this.w=this.stage.clientWidth;this.h=this.stage.clientHeight;this.mediaHeight=this.cards[0].querySelector('.slide-media').clientHeight;
    this.canvas.width=Math.round(this.w*dpr);this.canvas.height=Math.round(this.h*dpr);
    this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
    this.sources.forEach((source,i)=>{
      const artwork=this.compose(i,source);artwork.className='flat-artwork';artwork.setAttribute('aria-hidden','true');
      const media=this.cards[i].querySelector('.slide-media');if(!artwork.isConnected)media.prepend(artwork);
      this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures[i]);this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,artwork);
    });
  }
  draw(current,width,stride) {
    if(!this.ready)return;
    const gl=this.gl;this.animating=false;gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vertices);gl.vertexAttribPointer(this.uv,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indices);
    gl.uniform2f(this.uniforms.uViewport,this.w,this.h);
    gl.uniform2f(this.uniforms.uCard,width,this.mediaHeight);
    // Planar cards drift across the viewport; only the hovered card bends inward.
    const radius=this.w*2.5,focal=this.w*.7;
    gl.uniform1f(this.uniforms.uRadius,radius);gl.uniform1f(this.uniforms.uFocal,focal);
    this.cards.forEach((card,i)=>{
      const count=this.cards.length,delta=((i-current+count/2)%count+count)%count-count/2;
      if(Math.abs(delta)>1.65)return;
      const blend=Math.min(Math.abs(delta),1);
      const sideScale=1-.10*blend*blend*(3-2*blend);
      gl.uniform2f(this.uniforms.uCard,width*sideScale,this.mediaHeight*sideScale);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.textures[i]);
      const video=card.querySelector('video');
      if(video && !video.paused && video.readyState>=2 && this.videoFrames[i]!==Math.floor(video.currentTime*30)){
        this.videoFrames[i]=Math.floor(video.currentTime*30);
        // Video already fills the same Wasabi frame; sample it directly, using the image's cover crop.
        const videoRatio=video.videoWidth/video.videoHeight,frameRatio=width/this.mediaHeight;
        if(Math.abs(videoRatio-frameRatio)<.015)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,video);
        else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.compose(i,video));
      } else if(video && video.paused && this.videoFrames[i]!=null) {
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.compose(i,this.sources[i]));this.videoFrames[i]=null;
      }
      let saturation=1;
      if(card.hasAttribute('data-color-reveal')) {
        const touch=matchMedia('(hover: none)').matches;
        const goal=(card.matches(':hover,:focus-within') || (touch && card.classList.contains('is-active'))) ? 1 : 0;
        const previous=this.colors[i] == null ? 0 : this.colors[i];
        saturation=matchMedia('(prefers-reduced-motion: reduce)').matches ? goal : previous+(goal-previous)*.1;
        if(Math.abs(goal-saturation)<.002)saturation=goal;else this.animating=true;
        this.colors[i]=saturation;
      }
      const hovered=!matchMedia('(hover: none)').matches && card.matches(':hover,:focus-within') && !this.stage.classList.contains('is-dragging');
      const pointer=card._galleryPointer || {x:0,y:0};
      const goal=hovered && !document.body.classList.contains('site-motion-paused') && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;
      const state=this.hoverStates[i] || (this.hoverStates[i]={lift:0,x:0,y:0});
      for(const [key,value] of Object.entries({lift:goal,x:pointer.x*goal,y:pointer.y*goal})){
        state[key]+=(value-state[key])*.12;
        if(Math.abs(value-state[key])<.001)state[key]=value;else this.animating=true;
      }
      gl.uniform2f(this.uniforms.uHover,state.x,state.y);
      gl.uniform1f(this.uniforms.uLift,state.lift);
      gl.uniform1f(this.uniforms.uSaturation,saturation);
      gl.uniform1f(this.uniforms.uOffset,delta*stride);gl.drawElements(gl.TRIANGLES,this.indexCount,gl.UNSIGNED_SHORT,0);
    });
    if(!this.presented){
      this.presented=true;gl.finish();
      document.documentElement.classList.add('gallery-webgl');
      document.body.classList.add('curved-ready');
      requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.remove('gallery-boot')));
    }
  }
};
