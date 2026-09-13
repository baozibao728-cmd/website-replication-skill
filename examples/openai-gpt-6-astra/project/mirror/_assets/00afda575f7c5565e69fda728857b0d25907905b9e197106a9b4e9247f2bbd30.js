(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,947344,e=>{"use strict";let t;var r=e.i(409703),i=e.i(695418),o=e.i(361489),a=r;let n=`
  #include <common>
  uniform sampler2D inputBuffer;
  uniform vec2 sourceTexelSize;
  uniform float threshold;
  uniform float smoothing;
  varying vec2 vUv;
  void main() {
    vec2 offset = sourceTexelSize * 0.5;
    vec4 color = (
      texture2D(inputBuffer, vUv + vec2(-offset.x, -offset.y)) +
      texture2D(inputBuffer, vUv + vec2( offset.x, -offset.y)) +
      texture2D(inputBuffer, vUv + vec2(-offset.x,  offset.y)) +
      texture2D(inputBuffer, vUv + vec2( offset.x,  offset.y))
    ) * 0.25;
    gl_FragColor = color * smoothstep(threshold, threshold + smoothing, luminance(color.rgb));
  }
`,s=`
  uniform sampler2D source;
  uniform vec2 stepSize;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(source, vUv) * 0.2270270270;
    color += (texture2D(source, vUv + stepSize * 1.3846153846)
      + texture2D(source, vUv - stepSize * 1.3846153846)) * 0.3162162162;
    color += (texture2D(source, vUv + stepSize * 3.2307692308)
      + texture2D(source, vUv - stepSize * 3.2307692308)) * 0.0702702703;
    gl_FragColor = color;
  }
`;class l extends a.BloomEffect{sourceTexelSize=new i.Uniform(new i.Vector2);blurSource=new i.Uniform(null);blurStep=new i.Uniform(new i.Vector2);horizontalTarget=new i.WebGLRenderTarget(1,1,{type:i.HalfFloatType,depthBuffer:!1});verticalTarget=this.horizontalTarget.clone();reconstruction=new a.ShaderPass(new i.ShaderMaterial({uniforms:{source:this.blurSource,stepSize:this.blurStep},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = position.xy * 0.5 + 0.5;
          gl_Position = vec4(position.xy, 1.0, 1.0);
        }
      `,fragmentShader:s,blending:i.NoBlending,depthTest:!1,depthWrite:!1,toneMapped:!1}));constructor(e){super(e),this.luminanceMaterial.uniforms.sourceTexelSize=this.sourceTexelSize,this.luminanceMaterial.fragmentShader=n,this.luminanceMaterial.needsUpdate=!0,this.uniforms.set("map",new i.Uniform(this.verticalTarget.texture))}setSize(e,t){super.setSize(e,t);let r=Math.max(1,Math.round(.5*e)),i=Math.max(1,Math.round(.5*t));this.horizontalTarget?.setSize(r,i),this.verticalTarget?.setSize(r,i)}update(e,t,r){this.sourceTexelSize.value.set(1/t.width,1/t.height),super.update(e,t,r),this.blurSource.value=super.texture,this.blurStep.value.set(1/this.horizontalTarget.width,0),this.reconstruction.render(e,null,this.horizontalTarget),this.blurSource.value=this.horizontalTarget.texture,this.blurStep.value.set(0,1/this.verticalTarget.height),this.reconstruction.render(e,null,this.verticalTarget)}}var u=e.i(384051);class c{texture=new i.Uniform(null);sourceUvs=new Map;scene=new i.Scene;particles=[];materials=[];age=new i.Uniform(u.PARTICLE_MOTION_SETTLE_SECONDS);pointer=new i.Uniform(new i.Vector2);previous=new i.Uniform(new i.Vector2);impulse=new i.Uniform(new i.Vector2);clearColor=new i.Color;front;back;epoch=-1;initialized=!1;frame=-1;enabled=new i.Uniform(1);programs=null;prepared=!1;prepare(e,t){if(this.prepared)return!0;if(null===this.programs){let r=e.getRenderTarget(),o=new i.WebGLRenderTarget(1,1,{depthBuffer:!1,stencilBuffer:!1});try{e.setRenderTarget(o),e.compile(this.scene,t)}finally{e.setRenderTarget(r),o.dispose()}return this.programs=(e.info.programs??[]).map(e=>e.program),!1}let r=e.getContext(),o=e.extensions.get("KHR_parallel_shader_compile");return this.programs.every(e=>r.getProgramParameter(e,o.COMPLETION_STATUS_KHR))&&(this.prepared=!0,this.programs=[]),this.prepared}constructor(e){const t=[];e.group.traverse(e=>{e instanceof i.Points&&e.material instanceof i.ShaderMaterial&&t.push(e)});const r=Math.max(1,Math.ceil(t.reduce((e,t)=>e+t.geometry.getAttribute("position").count,0)/128));this.front=new i.WebGLRenderTarget(128,r,{type:i.HalfFloatType,minFilter:i.NearestFilter,magFilter:i.NearestFilter,depthBuffer:!1,stencilBuffer:!1}),this.back=this.front.clone(),this.texture.value=this.front.texture;let o=0;for(const a of t){const t=a.material,n=a.geometry.getAttribute("position").count,s=new Float32Array(3*n),l=a.geometry.getAttribute("starScale"),c=a.geometry.getAttribute("particleScale");for(let e=0;e<n;e++)s[3*e]=((o+e)%128+.5)/128,s[3*e+1]=(Math.floor((o+e)/128)+.5)/r,s[3*e+2]=(0,u.particleMotionMass)(l?.35+3.8*l.getX(e):1+1.35*c.getX(e));o+=n,a.geometry.setAttribute("particleMotionUv",new i.Float32BufferAttribute(s,3)),Object.assign(t.uniforms,{uParticleMotionEnabled:this.enabled,uParticleMotionTexture:this.texture,uParticleMotionAge:this.age,uParticleMotionPointer:this.pointer,uParticleMotionPrevious:this.previous,uParticleMotionImpulse:this.impulse}),t.needsUpdate=!0;const f=new i.ShaderMaterial({uniforms:t.uniforms,defines:{...t.defines,ASTRA_PARTICLE_SIMULATION:1},vertexShader:t.vertexShader,fragmentShader:"varying vec4 vParticleMotionState; void main() { gl_FragColor = vParticleMotionState; }",blending:i.NoBlending,depthTest:!1,depthWrite:!1,toneMapped:!1});this.materials.push(f);const h=new i.Points(a.geometry,f);h.matrixAutoUpdate=!1,h.frustumCulled=!1,this.scene.add(h),this.particles.push({source:a,simulation:h});const d=e.pathLayers.find(e=>e.starMaterial===t),p=a.geometry.getAttribute("starHero");if(d?.flareSource&&p){for(let e=0;e<p.count;e++)if(p.getX(e)>.5){this.sourceUvs.set(d.flareSource,new i.Vector3(s[3*e],s[3*e+1],s[3*e+2]));break}}}}reset(){this.initialized=!1,this.age.value=u.PARTICLE_MOTION_SETTLE_SECONDS}update(e,t,r){if(r.frame===this.frame||(this.frame=r.frame,(r.epoch!==this.epoch||r.remaining<=0)&&this.reset(),this.epoch=r.epoch,this.age.value=Math.min(u.PARTICLE_MOTION_SETTLE_SECONDS,this.age.value+Math.max(r.delta,0)),r.scrollCooldown>0||(r.active||r.remaining>0)&&!this.prepare(e,t)||1e-8>=r.impulse.lengthSq()))return;let i=e.getRenderTarget(),o=e.getClearAlpha();e.getClearColor(this.clearColor),e.setClearColor(0,0);try{for(let{source:t,simulation:i}of(this.initialized||(e.setRenderTarget(this.front),e.clear(),this.age.value=0,this.initialized=!0),this.pointer.value.copy(r.pointer),this.previous.value.copy(r.previous),this.impulse.value.copy(r.impulse),this.particles))t.updateWorldMatrix(!0,!1),i.matrix.copy(t.matrixWorld);e.setRenderTarget(this.back),e.render(this.scene,t),[this.front,this.back]=[this.back,this.front],this.texture.value=this.front.texture,this.age.value=0}finally{e.setRenderTarget(i),e.setClearColor(this.clearColor,o)}}dispose(){for(let e of(this.programs=[],this.front.dispose(),this.back.dispose(),this.materials))e.dispose();this.scene.clear(),this.sourceUvs.clear()}}var f=e.i(861045);function h(e,t,r){return Math.min(r,Math.max(t,e))}function d(e,t,r){let i=h((r-e)/(t-e),0,1);return i*i*(3-2*i)}function p(e,t){return void 0!==e&&Number.isFinite(e)?h(Math.floor(e),16,1024):t}function m(e,t,r){let i=new Float32Array(e*t);for(let e=0;e<i.length;e+=1)i[e]=r();return{columns:e,rows:t,values:i}}function v(e,t,r){let i=h(t,0,1)*(e.columns-1),o=h(r,0,1)*(e.rows-1),a=Math.floor(i),n=Math.floor(o),s=Math.min(a+1,e.columns-1),l=Math.min(n+1,e.rows-1),u=d(0,1,i-a),c=d(0,1,o-n);return(e.values[n*e.columns+a]*(1-u)+e.values[n*e.columns+s]*u)*(1-c)+(e.values[l*e.columns+a]*(1-u)+e.values[l*e.columns+s]*u)*c}function g(e){return(e()+e()+e()+e()+e()+e()-3)/3}function x(e,t,r,i,o,a,n,s){let l=Math.max(a,.5),u=Math.max(0,Math.floor(i-l-1)),c=Math.min(t-1,Math.ceil(i+l+1)),f=Math.max(0,Math.floor(o-l-1)),h=Math.min(r-1,Math.ceil(o+l+1));for(let r=f;r<=h;r+=1)for(let a=u;a<=c;a+=1){let u=Math.hypot(a-i,r-o)/l;if(u>=1)continue;let c=function(e,t,r){let i=Math.imul(e+31*r,0x466f45d);return i^=Math.imul(t+17*r,0x127409f),(((i=Math.imul(i^i>>>13,0x4bf19f61))^i>>>16)>>>0)/0x100000000}(a,r,s);if(u>.42&&c<.3+.24*u)continue;let f=.52+.48*c,h=n*(1-d(.48,1,u))*f,p=r*t+a;e[p]=Math.max(e[p],h)}}function M(e,t,r){let i=function(e,t,r){let i,o=(i=r>>>0,()=>{let e=i+=0x6d2b79f5;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}),a=m(13,10,o),n=m(47,35,o),s=Array.from({length:7},()=>{let e=o()*Math.PI;return{centerX:.08+.84*o(),centerY:.08+.84*o(),cosine:Math.cos(e),frequency:8+18*o(),phase:o()*Math.PI*2,radiusX:.08+.18*o(),radiusY:.035+.09*o(),sine:Math.sin(e),strength:.035+.075*o()}}),l=new Float32Array(e*t);for(let r=0;r<t;r+=1){let i=r/Math.max(t-1,1);for(let t=0;t<e;t+=1){let u=t/Math.max(e-1,1),c=v(a,u,i),f=v(n,u,i),h=o(),p=d(.43,.74,.68*c+.32*f),m=.018+.032*c+.022*f+.012*h+p*(.038+.032*h);for(let e of s){let t=u-e.centerX,r=i-e.centerY,o=(t*e.cosine+r*e.sine)/e.radiusX,a=(-t*e.sine+r*e.cosine)/e.radiusY,n=o*o+a*a;if(n>=1)continue;let s=1-d(.18,1,Math.sqrt(n)),l=Math.pow(.5+.5*Math.sin((.72*o+a)*e.frequency+e.phase),8);m+=e.strength*s*(.18+.82*l)*(.5+.5*h)}let g=o();g>.965&&(m+=.5*Math.pow((g-.965)/.035,1.8)),l[r*e+t]=m}}let u=Array.from({length:18},()=>({x:o()*e,y:o()*t,spreadX:e*(.022+.095*o()),spreadY:t*(.018+.075*o())})),c=Math.max(32,Math.round(e*t/58));for(let i=0;i<c;i+=1){let a=o()*e,n=o()*t;if(.58>o()){let e=u[Math.floor(o()*u.length)];a=e.x+g(o)*e.spreadX,n=e.y+g(o)*e.spreadY}x(l,e,t,a,n,.52+1.15*Math.pow(o(),3),.24+.7*Math.pow(o(),1.8),r+i)}let f=Math.max(6,Math.round(e*t/4e3));for(let i=0;i<f;i+=1){let a=o()*e,n=o()*t,s=2+Math.floor(4*o()),u=.28+.5*o();for(let c=0;c<s;c+=1)x(l,e,t,a+3.5*g(o),n+3.5*g(o),1.2+3.8*o(),u*(.55+.45*o()),r+7*i+c)}let h=Math.max(3,Math.round(e*t/2e4));for(let i=0;i<h;i+=1){let a=o()*e,n=o()*t,s=o()*Math.PI*2,u=e*(.08+.22*o()),c=Math.max(1,Math.ceil(u/.7)),f=.07+.15*o();for(let h=0;h<=c;h+=1){if(.28>o())continue;let d=h/c,p=.9*g(o);x(l,e,t,a+Math.cos(s)*u*d-Math.sin(s)*p,n+Math.sin(s)*u*d+Math.cos(s)*p,.45+.45*o(),f*(.55+.45*o()),r+131*i+h)}}return l}(e,t,r),o=new Uint8Array(e*t*4);for(let e=0;e<i.length;e+=1){let t=Math.round(255*Math.pow(h(i[e],0,1),.94)),r=4*e;o[r]=t,o[r+1]=t,o[r+2]=t,o[r+3]=255}return o}var S=r;Object.freeze({animated:!0,enabled:!0,ghosts:.1,halo:.12,intensity:.3,secondary:.25,streakLength:1,streaks:.18,verticalStreaks:0});let y=Object.freeze({distortion:.68,drift:!0,driftStrength:.28,enabled:!0,grain:.031,procedural:0,texture:0}),w=`
  uniform sampler2D uParticleMotionTexture;
  uniform float uParticleMotionAge;
  uniform vec3 uPrimaryMotionUv;
  uniform vec3 uSecondaryMotionUvs[5];
  varying vec2 vPrimaryMotion;
  varying vec2 vSecondaryMotion[5];
  ${u.PARTICLE_MOTION_COAST_GLSL}
  vec2 particleOffset(vec3 particleUv) {
    if (particleUv.x < 0.0 || uParticleMotionAge >= ${u.PARTICLE_MOTION_SETTLE_SECONDS}.0) return vec2(0.0);
    return astraCoast(texture2D(uParticleMotionTexture, particleUv.xy), particleUv.z, uParticleMotionAge).xy * 0.5;
  }
  void mainSupport() {
    vPrimaryMotion = particleOffset(uPrimaryMotionUv);
    for (int i = 0; i < 5; i++) vSecondaryMotion[i] = particleOffset(uSecondaryMotionUvs[i]);
  }
`,b=`
  uniform sampler2D uDirtTexture;
  varying vec2 vPrimaryMotion;
  varying vec2 vSecondaryMotion[5];
  uniform vec2 uCenter;
  uniform float uAnimated;
  uniform float uAspect;
  uniform float uDirtyGlassEnabled;
  uniform float uDistortion;
  uniform float uDirtTextureAspect;
  uniform vec2 uDirtTextureOffset;
  uniform float uDirtTextureRotation;
  uniform float uFlareEnabled;
  uniform float uGhosts;
  uniform float uGrain;
  uniform float uHalo;
  uniform float uIntensity;
  uniform float uProceduralDirt;
  uniform vec2 uSecondaryCenters[5];
  uniform float uSecondaryIntensity;
  uniform float uSecondaryVisibility[5];
  uniform float uStreakLength;
  uniform float uStreaks;
  uniform float uTime;
  uniform float uTextureDirt;
  uniform float uVerticalStreaks;
  uniform float uVisibility;

  float astraHash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float softDisc(vec2 point, float radius, float softness) {
    return 1.0 - smoothstep(radius - softness, radius + softness, length(point));
  }

  float softRing(vec2 point, float radius, float width) {
    float distanceToRing = abs(length(point) - radius);
    return 1.0 - smoothstep(width, width * 2.0, distanceToRing);
  }

  vec2 aspectCorrect(vec2 point) {
    point.x *= uAspect;
    return point;
  }

  vec2 coverTextureUv(vec2 uv, float viewportAspect, float textureAspect) {
    vec2 centeredUv = uv - 0.5;

    if (viewportAspect > textureAspect) {
      centeredUv.y *= textureAspect / viewportAspect;
    } else {
      centeredUv.x *= viewportAspect / textureAspect;
    }

    return centeredUv + 0.5;
  }

  float secondaryFlare(vec2 center, vec2 uv) {
    vec2 point = aspectCorrect(uv - center);
    float distanceToSource = length(point);
    // The matched particle and bloom already provide the sharp stellar core.
    // Optics should add only a soft halo and restrained glass streaks so a
    // tiny tracking difference can never read as a second, detached star.
    float nearHalo = exp(-distanceToSource * distanceToSource * 520.0) * 0.1;
    float halo = exp(-distanceToSource * 17.0) * 0.055;
    float horizontalWindow = 1.0 - smoothstep(
      uStreakLength * 0.72,
      uStreakLength,
      abs(point.x)
    );
    float verticalWindow = 1.0 - smoothstep(
      uStreakLength * 0.72,
      uStreakLength,
      abs(point.y)
    );
    horizontalWindow = mix(horizontalWindow, 1.0, step(0.99, uStreakLength));
    verticalWindow = mix(verticalWindow, 1.0, step(0.99, uStreakLength));
    float horizontalStreak = exp(-abs(point.y) * 360.0)
      * exp(-abs(point.x) * 10.0) * horizontalWindow * 0.24;
    float verticalStreak = exp(-abs(point.x) * 360.0)
      * exp(-abs(point.y) * 10.0) * verticalWindow * 0.24 * uVerticalStreaks;

    return nearHalo + halo + horizontalStreak + verticalStreak;
  }

  void mainImage(
    const in vec4 inputColor,
    const in vec2 uv,
    out vec4 outputColor
  ) {
    vec3 base = inputColor.rgb;
    vec2 movingCenter = uCenter + vPrimaryMotion;
    vec2 source = aspectCorrect(uv - movingCenter);
    float sourceDistance = length(source);

    float core = exp(-sourceDistance * sourceDistance * 480.0) * 0.18;
    float halo = exp(-sourceDistance * 11.5) * uHalo;
    halo += softRing(source, 0.105, 0.006) * 0.05 * uHalo;

    float horizontalWindow = 1.0 - smoothstep(
      uStreakLength * 0.72,
      uStreakLength,
      abs(source.x)
    );
    float verticalWindow = 1.0 - smoothstep(
      uStreakLength * 0.72,
      uStreakLength,
      abs(source.y)
    );
    horizontalWindow = mix(horizontalWindow, 1.0, step(0.99, uStreakLength));
    verticalWindow = mix(verticalWindow, 1.0, step(0.99, uStreakLength));
    float horizontalStreak = exp(-abs(source.y) * 310.0)
      * exp(-abs(source.x) * 7.5) * horizontalWindow;
    float softHorizontalStreak = exp(-abs(source.y) * 78.0)
      * exp(-abs(source.x) * 5.2) * horizontalWindow * 0.16;
    float verticalStreak = exp(-abs(source.x) * 310.0)
      * exp(-abs(source.y) * 7.5) * verticalWindow;
    float softVerticalStreak = exp(-abs(source.x) * 78.0)
      * exp(-abs(source.y) * 5.2) * verticalWindow * 0.16;
    float streak = (
      horizontalStreak +
      softHorizontalStreak +
      (verticalStreak + softVerticalStreak) * uVerticalStreaks
    ) * uStreaks;

    vec2 opticalAxis = vec2(0.5) - movingCenter;
    vec2 ghostA = aspectCorrect(uv - (movingCenter + opticalAxis * 0.82));
    vec2 ghostB = aspectCorrect(uv - (movingCenter + opticalAxis * 1.38));
    vec2 ghostC = aspectCorrect(uv - (movingCenter + opticalAxis * 1.82));
    float ghosts = 0.0;
    ghosts += softDisc(ghostA, 0.016, 0.014) * 0.18;
    ghosts += softRing(ghostB, 0.046, 0.006) * 0.11;
    ghosts += softDisc(ghostC, 0.025, 0.02) * 0.08;
    ghosts *= uGhosts;

    // Source motion owns the animation. An independent optical pulse made the
    // flare breathe against its matched particle and exposed tiny offsets.
    float flare = (core + halo + streak + ghosts) * uIntensity;
    float secondary = 0.0;
    float secondaryDirtHalo = 0.0;
    for (int i = 0; i < ASTRA_SECONDARY_SOURCES; i++) {
      vec2 secondaryCenter = uSecondaryCenters[i] + vSecondaryMotion[i];
      secondary += secondaryFlare(secondaryCenter, uv)
        * uSecondaryVisibility[i];
      secondaryDirtHalo += exp(
        -length(aspectCorrect(uv - secondaryCenter)) * 10.0
      ) * uSecondaryVisibility[i];
    }
    secondary *= uIntensity * uSecondaryIntensity;
    vec3 flareColor = vec3(0.956, 0.956, 0.956)
      * (flare * uVisibility + secondary) * uFlareEnabled;

    vec3 opticalColor = base + flareColor;
    float baseLuminance = dot(base, vec3(0.2126, 0.7152, 0.0722));
    float reveal = smoothstep(0.025, 0.72, baseLuminance);
    vec2 driftingDirtUv = uv - 0.5;
    float dirtRotationCos = cos(uDirtTextureRotation);
    float dirtRotationSin = sin(uDirtTextureRotation);
    driftingDirtUv = mat2(
      dirtRotationCos,
      -dirtRotationSin,
      dirtRotationSin,
      dirtRotationCos
    ) * driftingDirtUv;
    driftingDirtUv += uDirtTextureOffset;
    vec2 dirtTextureUv = clamp(coverTextureUv(
      driftingDirtUv + 0.5,
      uAspect,
      uDirtTextureAspect
    ), vec2(0.001), vec2(0.999));
    vec3 dirtTextureColor = texture2D(uDirtTexture, dirtTextureUv).rgb;
    float dirtTextureLuminance = dot(
      dirtTextureColor,
      vec3(0.2126, 0.7152, 0.0722)
    );
    float photographicDirt = smoothstep(0.1, 0.72, dirtTextureLuminance);
    // The generated map already contains broad clouds, wipe marks, and fine
    // grit. A softer transfer of the same field replaces two four-octave FBM
    // evaluations that previously repeated that work for every screen pixel.
    float proceduralDirt = smoothstep(0.025, 0.32, dirtTextureLuminance);
    float textureDirtAmount = uTextureDirt * uDirtyGlassEnabled;
    float proceduralDirtAmount = uProceduralDirt * uDirtyGlassEnabled;
    float dirtMask = clamp(
      photographicDirt * textureDirtAmount +
      proceduralDirt * proceduralDirtAmount,
      0.0,
      1.0
    );
    float dirtVariation = clamp(
      (photographicDirt - 0.4) * textureDirtAmount +
      (proceduralDirt - 0.4) * proceduralDirtAmount,
      -0.7,
      0.9
    );
    // Dirt responds to the rendered scene, not to the flare it is currently
    // generating. This removes the feedback-like pop at transition peaks.
    float dirtReveal = smoothstep(0.008, 0.2, baseLuminance)
      * (1.0 - smoothstep(0.9, 3.0, baseLuminance) * 0.68);
    float primaryDirtHalo = exp(-sourceDistance * 6.5) * uVisibility;
    float dirtHalo = (
      primaryDirtHalo + secondaryDirtHalo * uSecondaryIntensity
    ) * uIntensity * uFlareEnabled;

    #if ASTRA_DISTORTION == 1
    vec2 warpUvX = dirtTextureUv * vec2(0.72, 0.78) + vec2(0.17, 0.08);
    vec2 warpUvY = vec2(1.0 - dirtTextureUv.y, dirtTextureUv.x)
      * vec2(0.74, 0.7) + vec2(0.12, 0.16);
    float warpSampleX = texture2D(
      uDirtTexture,
      warpUvX
    ).r;
    float warpSampleY = texture2D(
      uDirtTexture,
      warpUvY
    ).r;
    vec2 warpField = clamp(
      (vec2(warpSampleX, warpSampleY) - dirtTextureLuminance) * 6.0,
      vec2(-0.5),
      vec2(0.5)
    );
    vec2 warp = warpField
      * vec2(1.0 / max(uAspect, 0.001), 1.0)
      * uDistortion * 0.004;
    vec3 warpedBase = texture2D(
      inputBuffer,
      clamp(uv + warp, vec2(0.001), vec2(0.999))
    ).rgb;
    opticalColor += (warpedBase - base)
      * reveal * uDirtyGlassEnabled * 0.55;
    #endif
    opticalColor *= 1.0 + dirtVariation
      * dirtReveal * 0.82;
    opticalColor += vec3(max(dirtVariation, 0.0))
      * dirtReveal
      * (0.022 + min(baseLuminance, 0.8) * 0.055);
    opticalColor += vec3(0.956)
      * dirtHalo
      * dirtMask * 0.14;

    float grain = astraHash(floor(uv * vec2(1536.0, 1024.0)));
    opticalColor += vec3((grain - 0.5) * uGrain)
      * (0.18 + reveal * 0.82) * uDirtyGlassEnabled;

    outputColor = vec4(max(opticalColor, vec3(0.0)), inputColor.a);
  }
`;function T(e){if(!Number.isFinite(e.x)||!Number.isFinite(e.y)||e.z<-1||e.z>1)return 0;let t=Math.max(Math.abs(e.x),Math.abs(e.y));return 1-i.MathUtils.smoothstep(t,.88,1.08)}function D(e,t,r){if(!t)return;let o=e.x,a=e.y,n=2*i.MathUtils.clamp(t.config.radius,32,360)/Math.max(r,1),s=Math.hypot(o-t.lensPointer.x,a-t.lensPointer.y),l=1+(1-i.MathUtils.smoothstep(s,0,n))*Math.max(t.lensStrength,0)*i.MathUtils.clamp(t.config.magnification,-.3,.8);e.x=t.lensPointer.x+(o-t.lensPointer.x)*l,e.y=t.lensPointer.y+(a-t.lensPointer.y)*l}class U extends S.Effect{parameters;dirtDriftOffset=new i.Vector2;dirtDriftRotation=0;projectedPosition=new i.Vector3;secondaryProjectedPositions=Array.from({length:5},()=>new i.Vector3);animated;viewportAspect=1;viewportHeight=1;constructor(e,t,r=y,o={}){const a=function(e,t,r){let o;return{uParticleMotionTexture:new i.Uniform(null),uParticleMotionAge:new i.Uniform(u.PARTICLE_MOTION_SETTLE_SECONDS),uPrimaryMotionUv:new i.Uniform(new i.Vector3(-1,-1,1)),uSecondaryMotionUvs:new i.Uniform(Array.from({length:5},()=>new i.Vector3(-1,-1,1))),uAnimated:new i.Uniform(Number(e.animated)),uAspect:new i.Uniform(1),uCenter:new i.Uniform(new i.Vector2(.5,.5)),uDirtTexture:new i.Uniform(t),uDirtTextureAspect:new i.Uniform((o=t.image,o?.width&&o.height?o.width/o.height:2/3)),uDirtTextureOffset:new i.Uniform(new i.Vector2),uDirtTextureRotation:new i.Uniform(0),uDirtyGlassEnabled:new i.Uniform(Number(r.enabled)),uDistortion:new i.Uniform(r.distortion),uFlareEnabled:new i.Uniform(Number(e.enabled)),uGhosts:new i.Uniform(e.ghosts),uGrain:new i.Uniform(r.grain),uHalo:new i.Uniform(e.halo),uIntensity:new i.Uniform(e.intensity),uProceduralDirt:new i.Uniform(r.procedural),uSecondaryCenters:new i.Uniform(Array.from({length:5},()=>new i.Vector2(-2,-2))),uSecondaryIntensity:new i.Uniform(e.secondary),uSecondaryVisibility:new i.Uniform(Array.from({length:5},()=>0)),uStreakLength:new i.Uniform(e.streakLength),uStreaks:new i.Uniform(e.streaks),uTime:new i.Uniform(0),uTextureDirt:new i.Uniform(r.texture),uVerticalStreaks:new i.Uniform(e.verticalStreaks),uVisibility:new i.Uniform(1)}}(e,t,r);super("AstraLensFlare",b,{blendFunction:S.BlendFunction.NORMAL,vertexShader:w,defines:function(e){var t;return new Map([["ASTRA_SECONDARY_SOURCES",String(void 0!==(t=e.secondarySourceCount)&&Number.isFinite(t)?i.MathUtils.clamp(Math.floor(t),0,5):5)],["ASTRA_DISTORTION",!1===e.distortion?"0":"1"]])}(o),uniforms:new Map(Object.entries(a))}),this.parameters=a,this.animated=e.animated}setConfig(e){this.animated=e.animated,this.uniform("uAnimated").value=Number(this.animated),this.uniform("uFlareEnabled").value=Number(e.enabled),this.uniform("uGhosts").value=e.ghosts,this.uniform("uHalo").value=e.halo,this.uniform("uIntensity").value=e.intensity,this.uniform("uSecondaryIntensity").value=e.secondary,this.uniform("uStreakLength").value=e.streakLength,this.uniform("uStreaks").value=e.streaks,this.uniform("uVerticalStreaks").value=e.verticalStreaks}setDirtyGlass(e){this.uniform("uDirtyGlassEnabled").value=Number(e.enabled),this.uniform("uDistortion").value=e.distortion,this.uniform("uGrain").value=e.grain,this.uniform("uProceduralDirt").value=e.procedural,this.uniform("uTextureDirt").value=e.texture}updateDirtDrift(e,t,r,o,a){let n=o.drift&&!a?i.MathUtils.clamp(o.driftStrength,0,1):0;this.dirtDriftOffset.set(-(.032*Math.sin(t+.35*r))*n,.032*Math.sin(e-.2*r)*n),this.dirtDriftRotation=-(.055*Math.sin(r+.5*t))*n,this.uniform("uDirtTextureOffset").value.copy(this.dirtDriftOffset),this.uniform("uDirtTextureRotation").value=this.dirtDriftRotation}setViewport(e,t){this.viewportAspect=Math.max(e,1)/Math.max(t,1),this.viewportHeight=Math.max(t,1),this.uniform("uAspect").value=this.viewportAspect}setParticleMotion(e,t,r,i){this.uniform("uParticleMotionTexture").value=e,this.uniform("uParticleMotionAge").value=t;let o=this.uniform("uPrimaryMotionUv").value;r?o.copy(r):o.set(-1,-1,1);for(let e=0;e<5;e++){let t=i[e],r=this.uniform("uSecondaryMotionUvs").value[e];t?r.copy(t):r.set(-1,-1,1)}}updateSources(e,t,r,o,a,n=1,s){r.updateMatrixWorld(),e.getWorldPosition(this.projectedPosition).project(r),D(this.projectedPosition,s,this.viewportHeight),this.uniform("uCenter").value.set(.5*this.projectedPosition.x+.5,.5*this.projectedPosition.y+.5),this.uniform("uTime").value=a?0:o,this.uniform("uAnimated").value=Number(!a&&this.animated),this.uniform("uVisibility").value=T(this.projectedPosition)*i.MathUtils.clamp(n,0,1)*i.MathUtils.clamp(e.scale.x,0,1);let l=this.uniform("uSecondaryCenters").value,u=this.uniform("uSecondaryVisibility").value;for(let e=0;e<5;e+=1){let o=t[e],a=this.secondaryProjectedPositions[e],n=l[e];if(!o){n.set(-2,-2),u[e]=0;continue}o.getWorldPosition(a).project(r),D(a,s,this.viewportHeight),n.set(.5*a.x+.5,.5*a.y+.5),u[e]=i.MathUtils.clamp(o.scale.x,0,1)*T(a)}}uniform(e){return this.parameters[e]}}function C(e,t,r,i){let[o,a]=e.getDpr(),n=Number.isFinite(a)?Math.min(1.5,Math.max(.1,a)):1;void 0!==r&&void 0!==i&&Number.isFinite(r)&&Number.isFinite(i)&&r>0&&i>0&&(n=Math.min(n,Math.max(.5,Math.sqrt(24e5/(r*i)))));let s=Number.isFinite(o)?Math.min(n,Math.max(.1,o)):Math.min(n,1),l=Math.min(n,Math.max(s,Number.isFinite(t)?t:1));return Math.min(n,Math.max(.1,Math.floor(100*l)/100))}function A(e){try{e?.dispose()}catch{}}function P(e){return Number.isFinite(e)?Math.max(1,Math.floor(e)):1}e.s(["createAstraRenderer",0,function(e,a,n,s={}){let u,h,d,m,v,g,x,S,y,w=()=>e.ownerDocument.defaultView?.devicePixelRatio??1,b=function(e,t=1,r,i){let o=e.canUseWebGL(),a=o?e.getPostprocessing():"none",n=o&&e.getAntialias(),s=e.getMaxParticleCount(),l=e.getMaxShaderSamples(),u="full"===a;return{available:o,tier:o?e.tier:0,pixelRatio:C(e,t,r,i),antialias:n,maxParticleCount:o&&Number.isFinite(s)?Math.max(0,Math.floor(s)):0,continuousMotion:o&&e.shouldUseContinuousMotion(),postprocessing:a,multisampling:"none"!==a&&n?2:0,bloomLevels:u?5:3*("selective"===a),bloomResolutionScale:u||"selective"===a?.5:0,optics:u?{secondarySourceCount:l>=16?5:l>=8?3:1,distortion:l>=16}:null}}(n,w(),e.clientWidth||void 0,e.clientHeight||void 0);if(!b.available)throw Error("Astra requires a supported WebGL renderer profile.");let T=!1,D=new Set,k=new Set,R=new WeakSet,L=new i.Scene,E=new i.Group,F=new i.Group,z=new i.OrthographicCamera(-1,1,1,-1,.1,40);z.position.set(0,1.2,12),L.background=new i.Color(0),L.add(E),E.add(F);let O=()=>{},I=new Promise(e=>{O=e});function N(e=!0){O(),e&&!T&&s.invalidate?.()}function _(){if(!T){for(let e of(T=!0,N(!1),D))A(e);for(let e of(D.clear(),A(h),h=void 0,A(d),[...k]))k.delete(e),R.has(e)||(R.add(e),A(e)),e.image=null;m=void 0,v=void 0,g=void 0,x=void 0,S=void 0,y=void 0,F.clear(),E.clear(),L.clear(),A(u)}}function V(e){return D.add(e),e}function W(e){if(h)try{h.addPass(e)}finally{h.passes.includes(e)&&D.delete(e)}}try{let s,A=u=new o.WebGLRenderer({canvas:e,alpha:!1,antialias:b.antialias,depth:!1,powerPreference:"high-performance"});A.debug.checkShaderErrors=!0,A.debug.onShaderError=(e,t,r,i)=>{let o=[e.getProgramInfoLog(t),e.getShaderInfoLog(r),e.getShaderInfoLog(i)].filter(Boolean).join("\n");throw Error(`Astra shader compilation failed. ${o}`)},A.outputColorSpace=i.SRGBColorSpace,A.toneMapping="none"===b.postprocessing?i.ACESFilmicToneMapping:i.NoToneMapping,A.toneMappingExposure=1,A.setClearColor(0,1),A.setPixelRatio(b.pixelRatio);let R=d=(0,f.generateAstraField)(a,{tier:b.tier,maxParticleCount:b.maxParticleCount,pixelRatio:b.pixelRatio,trackOpticalSources:null!==b.optics});for(let e of(F.add(R.group),R.pathLayers))e.starMaterial.uniforms.uBackgroundModelMatrix.value=E.matrixWorld;let O=A.extensions.has("EXT_color_buffer_float")&&A.extensions.has("KHR_parallel_shader_compile")?V(new c(R)):void 0,B=O?.sourceUvs.get(R.coreSource),H=R.secondarySources.map(e=>O?.sourceUvs.get(e));R.particleMotionEnabled=!!O;let j=!1;if("none"===b.postprocessing)for(let e of new Set([...R.pathLayers.flatMap(e=>e.dustMaterial?[e.starMaterial,e.dustMaterial]:[e.starMaterial])]))e.toneMapped=!0,e.fragmentShader=`${e.fragmentShader.replace("void main()","void astraLinearMain()")}
          void main() {
            astraLinearMain();
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `;if("none"!==b.postprocessing){h=new r.EffectComposer(A,{depthBuffer:!1,frameBufferType:i.HalfFloatType,multisampling:b.multisampling}),W(V(new r.RenderPass(L,z)));let e=[v=V(new l({blendFunction:r.BlendFunction.ADD,intensity:a.bloomIntensity,levels:b.bloomLevels,luminanceSmoothing:.18,luminanceThreshold:a.bloomThreshold,mipmapBlur:!0,radius:.72}))];if(b.optics){let r=function(e={}){let r=p(e.width,256),o=p(e.height,192),a=void 0!==e.seed&&Number.isFinite(e.seed)?Math.floor(e.seed):0xa57ad175,n=256===r&&192===o&&0xa57ad175===a?t??=M(r,o,a):M(r,o,a),s=new i.DataTexture(n,r,o,i.RGBAFormat);return s.name="Astra procedural lens dirt",s.colorSpace=i.NoColorSpace,s.flipY=!1,s.magFilter=i.LinearFilter,s.minFilter=i.LinearFilter,s.generateMipmaps=!1,s.wrapS=i.ClampToEdgeWrapping,s.wrapT=i.ClampToEdgeWrapping,s.needsUpdate=!0,s}();k.add(r),m=V(new U(a.lensFlare,r,a.dirtyGlass,b.optics)),e.push(m)}e.push(V(new r.ToneMappingEffect({mode:r.ToneMappingMode.ACES_FILMIC})));let o=V(new r.EffectPass(z,...e));for(let t of e)D.delete(t);W(o)}function G(e,t,r=w()){if(T)return;let i=P(e),o=P(t),a=C(n,r,i,o);for(let e of(A.setDrawingBufferSize(i,o,a),O?.reset(),z.left=-i/2,z.right=i/2,z.top=o/2,z.bottom=-o/2,z.updateProjectionMatrix(),h?.setSize(i,o,!1),v&&b.bloomResolutionScale<1&&v.setSize(P(i*a*b.bloomResolutionScale),P(o*a*b.bloomResolutionScale)),m?.setViewport(i,o),R.pathLayers))e.starMaterial.uniforms.uPixelRatio.value=a,e.dustMaterial&&(e.dustMaterial.uniforms.uPixelRatio.value=a)}return G(e.clientWidth,e.clientHeight),N(),{field:R,camera:z,animationRoot:E,spinRoot:F,quality:b,ready:I,resize:G,render:function(t,r,o=a,n=!b.continuousMotion){var l,u,c,f;if(T)return;let d=Number.isFinite(t)?i.MathUtils.clamp(t,0,.05):0;if(O&&r.particleMotion){s=r.particleMotion;let t=e.ownerDocument.defaultView;if(!j&&!n&&o.interaction.particleRepel&&"none"!==o.interactionMode&&t?.requestIdleCallback&&t.matchMedia?.("(any-hover: hover)")?.matches){j=!0;let r=t.requestIdleCallback(()=>{T||"visible"!==e.ownerDocument.visibilityState||s?.scrollCooldown!==0||O.prepare(A,z)});V({dispose:()=>t.cancelIdleCallback(r)})}O.update(A,z,r.particleMotion),m?.setParticleMotion(O.texture.value,O.age.value,B,H)}if(v&&(g!==o.bloomIntensity||x!==o.bloomThreshold)&&(g=o.bloomIntensity,x=o.bloomThreshold,v.intensity=o.bloomIntensity,v.luminanceMaterial.threshold=o.bloomThreshold),m&&(l=S,u=o.lensFlare,l?.animated!==u.animated||l.enabled!==u.enabled||l.ghosts!==u.ghosts||l.halo!==u.halo||l.intensity!==u.intensity||l.secondary!==u.secondary||l.streakLength!==u.streakLength||l.streaks!==u.streaks||l.verticalStreaks!==u.verticalStreaks)&&(m.setConfig(o.lensFlare),S={...o.lensFlare}),m&&(c=y,f=o.dirtyGlass,c?.distortion!==f.distortion||c.drift!==f.drift||c.driftStrength!==f.driftStrength||c.enabled!==f.enabled||c.grain!==f.grain||c.procedural!==f.procedural||c.texture!==f.texture)&&(m.setDirtyGlass(o.dirtyGlass),y={...o.dirtyGlass}),m){let e=i.MathUtils.clamp(r.scrollProgress,0,1),t=o.scrollEffects?i.MathUtils.smootherstep(e,.5,1):0;m.updateSources(R.coreSource,R.secondarySources,z,n?0:r.elapsed,n,o.showCenterCluster?1-t:0,{config:o.interaction,lensPointer:r.lensPointer,lensStrength:"depth-lens"===o.interactionMode?r.lensStrength:0}),m.updateDirtDrift(F.rotation.x,F.rotation.y,F.rotation.z,o.dirtyGlass,n)}h?h.render(d):A.render(L,z)},dispose:_}}catch(e){_();try{u?.forceContextLoss()}catch{}throw e}}],947344)}]);