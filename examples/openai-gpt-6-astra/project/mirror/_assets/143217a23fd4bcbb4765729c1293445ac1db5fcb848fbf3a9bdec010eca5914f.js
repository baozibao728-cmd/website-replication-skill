(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,248726,e=>{e.v({artwork:"SolAscii3DHeroBackdrop-module__TXmBpa__artwork",atmosphericBackdrop:"SolAscii3DHeroBackdrop-module__TXmBpa__atmosphericBackdrop",atmosphericBackdropReducedMotion:"SolAscii3DHeroBackdrop-module__TXmBpa__atmosphericBackdropReducedMotion",atmosphericBackdropVisible:"SolAscii3DHeroBackdrop-module__TXmBpa__atmosphericBackdropVisible",canvasLayer:"SolAscii3DHeroBackdrop-module__TXmBpa__canvasLayer",hitLayer:"SolAscii3DHeroBackdrop-module__TXmBpa__hitLayer",hitTarget:"SolAscii3DHeroBackdrop-module__TXmBpa__hitTarget",scene:"SolAscii3DHeroBackdrop-module__TXmBpa__scene"})},460207,e=>{e.q("/_next/static/immutable/media/bodyGlyphGeometry.worker.1ulxxrhv2m5sb.ts")},877475,e=>{"use strict";var t=e.i(724225),i=e.i(378939),a=e.i(364250),r=e.i(7284),o=e.i(741821),n=e.i(552297),l=e.i(215453),s=e.i(248726),c=e.i(540181);let u=1/30,d=3.5,f=()=>[0,0,0],m=e=>{let t=e*Math.PI/180;return[Math.sin(t),Math.cos(t),0]},p={sol:m(c.BODY_CONFIGS.sol.axialTiltDegrees),terra:m(c.BODY_CONFIGS.terra.axialTiltDegrees),luna:m(c.BODY_CONFIGS.luna.axialTiltDegrees)},h=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],y=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],v=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],g=(e,t)=>{let i=Math.hypot(e[0],e[1],e[2]);return 0===i||i<=t?[...e]:h(e,t/i)},x=(e,t)=>{if("sol"===e)return[...t];let i=p[e],a=t[0]*i[0]+t[1]*i[1]+t[2]*i[2];return h(i,a)},S=(e,t,i,a)=>{let r=Number.isFinite(t)?t:0,o=Number.isFinite(i)?i:0,n=Number.isFinite(a)?Math.max(0,a):0;if("sol"===e)return[o*n,r*n,0];let l=p[e],s=(r*l[1]+o*l[0])*n;return h(l,s)},w=e=>h(p[e],c.BODY_CONFIGS[e].baselineSpinRadiansPerSecond),b=(e,{reducedMotion:t=!1,maxReleaseSpeed:i=d}={})=>{let a=w(e.bodyId),r=Number.isFinite(i)?Math.max(0,i):d,o=g(x(e.bodyId,e.sampledAngularVelocity),r);return{...e,isDragging:!1,sampledAngularVelocity:f(),excessAngularVelocity:t?f():y(o,a)}},M=(e,t,i,a)=>{e[0]=t,e[1]=i,e[2]=a},A=(e,t,i,a)=>{let r=Number.isFinite(t)?Math.min(Math.max(0,t),u):0,o=p[e.bodyId],n=c.BODY_CONFIGS[e.bodyId].baselineSpinRadiansPerSecond,l=o[0]*n,s=o[1]*n,d=o[2]*n;if(a.deltaSeconds=r,i)return M(e.excessAngularVelocity,0,0,0),M(a.angularVelocity,0,0,0),M(a.rotationDelta,0,0,0),a;if(e.isDragging)return M(a.angularVelocity,...e.sampledAngularVelocity),M(a.rotationDelta,0,0,0),a;if(0===r)return M(a.angularVelocity,l+e.excessAngularVelocity[0],s+e.excessAngularVelocity[1],d+e.excessAngularVelocity[2]),M(a.rotationDelta,0,0,0),a;let f=Math.LN2/.85,m=Math.exp(-f*r),h=(1-m)/f,y=e.excessAngularVelocity[0],v=e.excessAngularVelocity[1],g=e.excessAngularVelocity[2],x=y*m,S=v*m,w=g*m;return M(e.excessAngularVelocity,x,S,w),M(a.angularVelocity,l+x,s+S,d+w),M(a.rotationDelta,l*r+y*h,s*r+v*h,d*r+g*h),a},F=1/60,P=1/240;function D({bodyId:e,controller:i,layout:a}){let r=(0,o.useRef)(null),n=(0,o.useRef)(null),l=a.bodies[e],c=(t,a)=>{let o=r.current;o&&o.pointerId===t.pointerId&&(r.current=null,t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId),i?.endDrag(e,a||!((e,t)=>{if(!Number.isFinite(e)||!Number.isFinite(t))return!1;let i=t-e;return i>=0&&i<=120})(o.time,t.timeStamp)))},u=(t,a)=>{let r=n.current;if(!r||r.pointerId!==t.pointerId)return;n.current=null;let o=t.timeStamp-r.time,l=Math.hypot(t.clientX-r.clientX,t.clientY-r.clientY),s=t.currentTarget.getBoundingClientRect(),c=Math.max(Math.abs(s.left-r.left),Math.abs(s.top-r.top),Math.abs(s.width-r.width),Math.abs(s.height-r.height));!(!a&&Number.isFinite(o))||o<0||o>500||l>12||c>2||i?.tapBody(e,r.normalizedOffsetX,r.normalizedOffsetY)};return(0,o.useEffect)(()=>()=>{let t=r.current;r.current=null,n.current=null,t&&i?.endDrag(e,!0)},[e,i]),(0,t.jsx)("div",{className:s.default.hitTarget,"data-ascii-body-hit-target":e,onPointerCancel:e=>{u(e,!0),c(e,!0)},onPointerDown:t=>{if(i&&t.isPrimary&&("touch"===t.pointerType||0===t.button)){if("mouse"!==t.pointerType){let e=t.currentTarget.getBoundingClientRect(),i=((e,t,i)=>{if(i.width<=0||i.height<=0)return null;let a=(e-(i.left+i.width/2))/(i.width/2),r=(t-(i.top+i.height/2))/(i.height/2),o=Math.hypot(a,r);return o>1&&(a/=o,r/=o),{x:a,y:r}})(t.clientX,t.clientY,e);if(!i)return;n.current={clientX:t.clientX,clientY:t.clientY,height:e.height,left:e.left,normalizedOffsetX:i.x,normalizedOffsetY:i.y,pointerId:t.pointerId,time:t.timeStamp,top:e.top,width:e.width};return}t.currentTarget.setPointerCapture(t.pointerId),r.current={clientX:t.clientX,clientY:t.clientY,pointerId:t.pointerId,time:t.timeStamp},i.startDrag(e)}},onLostPointerCapture:e=>{u(e,!0),c(e,!0)},onPointerMove:t=>{let a=n.current;if(a?.pointerId===t.pointerId){let o=t.clientX-a.clientX,l=t.clientY-a.clientY,s=12>=Math.hypot(o,l)?"pending":Math.abs(o)>1.2*Math.abs(l)?"drag":Math.abs(l)>1.2*Math.abs(o)?"scroll":"pending";if("scroll"===s){n.current=null;return}if("pending"===s||!i)return;n.current=null,t.currentTarget.setPointerCapture(t.pointerId),i.startDrag(e);let c=((e,t)=>{let i=Math.hypot(e,t);if(i<=12)return{deltaX:0,deltaY:0};let a=(i-12)/i;return{deltaX:e*a,deltaY:t*a}})(o,l),u=Math.max((t.timeStamp-a.time)/1e3,1/240);i.dragBy(e,c.deltaX,c.deltaY,u),r.current={clientX:t.clientX,clientY:t.clientY,pointerId:t.pointerId,time:t.timeStamp};return}let o=r.current;if(!i||!o||o.pointerId!==t.pointerId)return;let l=Math.max((t.timeStamp-o.time)/1e3,1/240);i.dragBy(e,t.clientX-o.clientX,t.clientY-o.clientY,l),r.current={clientX:t.clientX,clientY:t.clientY,pointerId:t.pointerId,time:t.timeStamp}},onPointerUp:e=>{u(e,!1),c(e,!1)},style:{height:l.height,left:l.x,top:l.y,width:l.width}})}function E({controller:e,layout:i}){let a=(0,o.useRef)(null);return!function({controller:e,height:t,layerRef:i,width:a}){let r=(0,o.useRef)(null);(0,o.useEffect)(()=>{r.current=null;let o=i.current?.getBoundingClientRect()??null,n=null,l=()=>{n=null,o=i.current?.getBoundingClientRect()??null,r.current=null},s=()=>{null===n&&(n=window.requestAnimationFrame(l))},c=e=>{var i,r,n;return o?(i=e.clientX,r=e.clientY,(n=o).width<=0||n.height<=0||a<=0||t<=0||i<n.left||i>n.right||r<n.top||r>n.bottom?null:{x:(i-n.left)/n.width*a,y:(r-n.top)/n.height*t}):null},u=t=>{if("mouse"!==t.pointerType)return;null!==n&&window.cancelAnimationFrame(n),l();let i=c(t);i&&t.isPrimary&&(r.current={localX:i.x,localY:i.y,pointerId:t.pointerId,timeStamp:t.timeStamp},e?.stirField(i.x,i.y,0,0,F,!0))},d=t=>{if("mouse"!==t.pointerType){r.current=null;return}let i=c(t);if(!i||!t.isPrimary){r.current=null;return}let a={localX:i.x,localY:i.y,pointerId:t.pointerId,timeStamp:t.timeStamp},o=((e,t)=>{if(!t||t.pointerId!==e.pointerId)return null;let i=(e.timeStamp-t.timeStamp)/1e3;return{deltaSeconds:Number.isFinite(i)&&i>0?Math.min(Math.max(i,P),.064):F,deltaX:e.localX-t.localX,deltaY:e.localY-t.localY}})(a,r.current);r.current=a,o&&(0!==o.deltaX||0!==o.deltaY)&&e?.stirField(i.x,i.y,o.deltaX,o.deltaY,o.deltaSeconds,!1)},f=e=>{r.current?.pointerId===e.pointerId&&(r.current=null)};return window.addEventListener("pointerdown",u,{passive:!0}),window.addEventListener("pointermove",d,{passive:!0}),window.addEventListener("pointercancel",f,{passive:!0}),window.addEventListener("pointerup",f,{passive:!0}),window.addEventListener("resize",s,{passive:!0}),window.addEventListener("scroll",s,{capture:!0,passive:!0}),()=>{null!==n&&window.cancelAnimationFrame(n),window.removeEventListener("pointerdown",u),window.removeEventListener("pointermove",d),window.removeEventListener("pointercancel",f),window.removeEventListener("pointerup",f),window.removeEventListener("resize",s),window.removeEventListener("scroll",s,!0)}},[e,t,i,a])}({controller:e,height:i.height,layerRef:a,width:i.width}),(0,t.jsx)("div",{ref:a,"aria-hidden":"true",className:s.default.hitLayer,children:i.visualLayerOrder.map(a=>(0,t.jsx)(D,{bodyId:a,controller:e,layout:i},a))})}let I=60,B=1e3/30;function C(){let e=(0,a.useThree)(e=>e.advance),t=(0,a.useThree)(e=>e.clock),i=(0,a.useThree)(e=>e.frameloop),r=(0,a.useThree)(e=>e.gl),n=(0,a.useThree)(e=>e.invalidate);return(0,o.useEffect)(()=>{if("never"!==i)return void n();let a=null,o=null,l=((e=0)=>({cadenceMs:null,consecutiveSlowFrames:0,lastFrameMs:null,syntheticTimeSeconds:Number.isFinite(e)?Math.max(e,0):0}))(t.elapsedTime),s=t=>{a=null,((e,t,i=I)=>null===t||!!Number.isFinite(e)&&!!Number.isFinite(t)&&!!Number.isFinite(i)&&!(i<=0)&&e-t>=1e3/i-1)(t,o)&&(o=t,e(((e,t)=>{if(!Number.isFinite(t))return e.syntheticTimeSeconds;if(null===e.lastFrameMs)return e.lastFrameMs=t,e.syntheticTimeSeconds;let i=Math.max(t-e.lastFrameMs,0);if(e.lastFrameMs=t,0===i)return e.syntheticTimeSeconds;if(null===e.cadenceMs)return e.cadenceMs=Math.min(i,B),e.syntheticTimeSeconds+=e.cadenceMs/1e3,e.syntheticTimeSeconds;let a=e.cadenceMs;i<.97*a&&(e.cadenceMs=i,e.consecutiveSlowFrames=0,a=i);let r=Math.min(i,a),o=i>1.03*a;if(e.consecutiveSlowFrames=o?e.consecutiveSlowFrames+1:0,!o||e.consecutiveSlowFrames>=3){let t=Math.min(i,2*a);e.cadenceMs+=(t-a)*.08}return e.syntheticTimeSeconds+=r/1e3,e.syntheticTimeSeconds})(l,t),!1),r.getContext().flush()),a=window.requestAnimationFrame(s)};return a=window.requestAnimationFrame(s),()=>{null!==a&&window.cancelAnimationFrame(a)}},[e,t,i,r,n]),null}var R=e.i(695418),T=o;class O extends T.Component{state={failed:!1,resetKey:this.props.resetKey};static getDerivedStateFromError(){return{failed:!0}}static getDerivedStateFromProps(e,t){return e.resetKey===t.resetKey?null:{failed:!1,resetKey:e.resetKey}}componentDidCatch(e,t){this.props.onError()}render(){return this.state.failed?this.props.fallback:this.props.children}}var z=e.i(218547);let N={glyphScaleByBody:{luna:.82,sol:.76,terra:.78},opacityByTheme:{dark:{luna:1,sol:1,terra:1.12},light:{luna:1,sol:1,terra:1}},surfaceSpacingScale:.76},V={bodyById:{luna:{delaySeconds:.08,fadeDurationSeconds:.5,revealOffsetSeconds:.08},sol:{delaySeconds:0,fadeDurationSeconds:.52,revealOffsetSeconds:0},terra:{delaySeconds:.12,fadeDurationSeconds:.49,revealOffsetSeconds:.12}},system:{durationSeconds:1.4,fieldFadeDelaySeconds:.94,fieldFadePortion:.3,fieldStartMotionScale:.12,orbitAxis:[0,.84,.54],startOrbitRadiansBySceneSize:{desktop:.085,mobile:.16},startScale:.97}},k={dark:{atmosphere:"#ff9147",atmosphereAccent:"#ffe092",luna:"#d5cedf",terra:"#bce5ff"},light:{atmosphere:"#9c6a22",atmosphereAccent:"#b68535",luna:"#50465d",terra:"#0868ba"}},_={emissionPulseLifetimeSeconds:5.2,glyphSizeBySceneSize:{desktop:8.2,mobile:7.8},opacity:.4,solRotationEmissionVelocityMultiplier:1.7},j={tintByTheme:{dark:{luna:{color:"#c5bdcd",opacity:.12},sol:{color:"#ffad24",opacity:.18},terra:{color:"#4aa2f5",opacity:.165}},light:{luna:{color:"#8d8394",opacity:.065},sol:{color:"#ffb52e",opacity:.11},terra:{color:"#3194df",opacity:.09}}},interactionResponseByBody:{luna:.06,sol:1,terra:.18},paletteByTheme:{dark:{luna:["#68616f","#aaa1b1","#ddd5e2","#f8f2fb"],sol:["#ff7b22","#ffad24","#ffd65a","#fff0a6"],terra:["#3478e5","#5bb9ff","#68d69b","#ecf8ff"]},light:{luna:["#211d27","#514a59","#8d8394","#c8becf"],sol:["#7a2f00","#d65300","#ff9d00","#ffd45f"],terra:["#092f94","#087bd3","#2b9a62","#d8efff"]}},rotationResponseByBody:{luna:.05,sol:1,terra:.16}},G=e=>Number.isFinite(e)?Math.min(Math.max(e,0),u):0,L=(e,t)=>Number.isFinite(e)?-Math.expm1(-Math.max(e,0)*G(t)):0,U=(e,t,i)=>Number.isFinite(e)?Number.isFinite(t)?e*Math.exp(-Math.max(t,0)*G(i)):e:0,Y=(e,t,i)=>{if(e)return 1;if(!Number.isFinite(i)||!t.every(Number.isFinite))return 0;let a=Math.min(Math.max(Math.hypot(...t)/Math.max(i,.001),0),1);return a<.01?0:a},W=15,X={width:1440,height:540,bodies:{sol:{radius:261},terra:{radius:128},luna:{radius:52.78}}},q=(e=1440)=>W*(0,c.getSurfaceGlyphScale)(e)*N.surfaceSpacingScale,K=e=>Number.isFinite(e)?Math.max(0,e):0,H=(e,t)=>{let i=Number.isFinite(t)?Math.max(0,Math.floor(t)):0;if(null===e||e<=0||0===i)return i;let a=Math.max(0,Math.floor(e)),r=Math.max(16,Math.ceil(.05*a));return Math.abs(i-a)<r?a:i},Q=(e,t=W)=>{let i=K(e),a=Number.isFinite(t)?Math.max(0,t):0;return 0===i||0===a?0:Math.max(1,Math.round(4*Math.PI*i*i/a**2))},$=e=>{let t=q(e.width),i=Object.fromEntries(c.BODY_IDS.map(i=>[i,Q(e.bodies[i].radius,t)])),a=Math.round(3*Math.round(K(e.width)*K(e.height)/1500+2*Math.PI*K(e.bodies.sol.radius)/4));return{bodies:i,emissions:a,total:Object.values(i).reduce((e,t)=>e+t,0)+a}},J=new WeakMap;function Z(e){let t=J.get(e);if(void 0!==t)return t;let i=e.getParameter(e.ALIASED_POINT_SIZE_RANGE),a=Number(i?.[1]),r=Number.isFinite(a)?Math.max(a,1):64;return J.set(e,r),r}let ee=`
  attribute float aElevation;
  attribute float aGlyphIndex;
  attribute float aRevealDelay;

  uniform float uDevicePixelRatio;
  uniform float uGlyphSize;
  uniform float uIntroOpacity;
  uniform float uMaxPointSize;
  uniform float uOpacity;
  uniform float uRadius;
  uniform float uReducedMotion;
  uniform float uRevealTimeOffset;
  uniform float uSurfaceFlowElevationAmplitude;
  uniform float uSurfaceFlowSpeed;
  // x: weighted rotation, y: weighted interaction.
  uniform vec2 uSurfaceDynamics;
  uniform vec3 uSurfaceInteractionDirection;
  uniform vec3 uSurfacePalette[4];
  uniform float uTime;
  uniform vec2 uViewportSize;

  varying float vGlyphAlphaScale;
  varying float vGlyphIndex;
  // right.xy, up.xy in point-sprite coordinates, with screen Y pointing up.
  varying vec4 vProjectedGlyphBasis;
  varying vec3 vSurfaceColor;

  float solarSurfaceFlow(vec3 normal, float time) {
    float broad = sin(dot(normal, vec3(4.8, -3.2, 5.7)) + time);
    float folding = sin(dot(normal, vec3(-8.1, 6.4, 3.5)) - time * 0.62);
    float detail = cos(dot(normal, vec3(13.7, 9.2, -7.4)) + time * 0.37);
    float cells = broad * folding;
    return broad * 0.34 + folding * 0.24 + detail * 0.12 + cells * 0.30;
  }

  vec3 safeNormalize(vec3 value) {
    return value * inversesqrt(max(dot(value, value), 0.000001));
  }

  float waveField(vec3 point, vec3 directionA, vec3 directionB) {
    float primary = sin(dot(point, directionA));
    float secondary = cos(dot(point, directionB));
    return primary * 0.58 + secondary * 0.42;
  }

  float phasedWaveField(
    vec3 point,
    vec3 directionA,
    vec3 directionB,
    vec2 phase
  ) {
    float primary = sin(dot(point, directionA) + phase.x);
    float secondary = cos(dot(point, directionB) + phase.y);
    return primary * 0.58 + secondary * 0.42;
  }

  float interactionInfluence(vec3 normal) {
    float energy = clamp(uSurfaceDynamics.y, 0.0, 1.0);
    if (energy <= 0.0) return 0.0;
    return smoothstep(
      -0.22,
      0.86,
      dot(normal, uSurfaceInteractionDirection)
    ) * energy;
  }

  vec3 interactionWarp(vec3 normal, float influence, float strength) {
    if (influence <= 0.0) return normal;
    vec3 tangent = cross(uSurfaceInteractionDirection, normal);
    float directionPhase = dot(normal, vec3(7.3, -5.1, 6.7));
    float pulse = sin(directionPhase + uTime * 0.34) * 0.5 + 0.5;
    return safeNormalize(
      normal + tangent * influence * strength * mix(0.65, 1.0, pulse)
    );
  }

  vec3 solSurfaceColor(vec3 normal) {
    float interaction = interactionInfluence(normal);
    float rotation = clamp(uSurfaceDynamics.x, 0.0, 1.0);
    // Keep the storm's spatial basis fixed in object space so it turns with
    // the glyph lattice. Rotation adds energy below; it must not accelerate
    // or reorient the mask while the body is being spun.
    vec3 warpedNormal = interactionWarp(normal, interaction, 0.14);
    float motion = 1.0 - uReducedMotion;
    // A complete cycle remains slow, but three seconds now advances the
    // object-space convection enough to reward an attentive viewer.
    float stormPhase = uTime * motion * 0.10;
    float broadBands = phasedWaveField(
      warpedNormal,
      vec3(7.6, -4.2, 6.1),
      vec3(-5.4, 8.3, 4.7),
      vec2(stormPhase, -stormPhase * 0.73)
    );
    float convection = 0.5 + broadBands * 0.5;

    #if SURFACE_SHADER_QUALITY >= 2
      float folding = phasedWaveField(
        warpedNormal,
        vec3(13.4, 9.7, -8.2),
        vec3(-11.3, 7.2, 12.6),
        vec2(stormPhase * 0.56, -stormPhase * 0.41)
      );
      convection = clamp(
        convection * 0.68 + (0.5 + folding * 0.5) * 0.32,
        0.0,
        1.0
      );
    #endif

    #if SURFACE_SHADER_QUALITY >= 3
      float filaments = sin(
        dot(warpedNormal, vec3(24.7, -18.9, 21.4)) +
          broadBands * 2.2 - stormPhase * 0.58
      ) * 0.5 + 0.5;
      convection = mix(convection, filaments, 0.14 + interaction * 0.08);
    #endif

    // Sol remains gently active at rest. Interaction raises the same energy
    // ramp that drives source-particle births and velocity, pulsing the
    // object-space cells without sliding a camera-fixed mask over them.
    float baselinePulse = 0.15 +
      0.035 * sin(uTime * motion * 0.31 + broadBands * 0.7);
    float rotationPulse = baselinePulse +
      rotation * (1.0 - baselinePulse) *
        (0.88 + 0.12 * sin(uTime * motion * 0.72));
    float stormEnergy = clamp(
      rotationPulse + interaction * 0.32,
      0.0,
      1.0
    );
    float stormContrast = 1.0 +
      rotationPulse * 0.34 + interaction * 0.18;
    convection = clamp(
      (convection - 0.5) * stormContrast + 0.5,
      0.0,
      1.0
    );
    float hotCell = smoothstep(
      mix(0.76, 0.67, stormEnergy),
      0.98,
      convection
    );
    vec3 color = mix(uSurfacePalette[0], uSurfacePalette[1], convection);
    color = mix(
      color,
      uSurfacePalette[2],
      smoothstep(0.48, 0.88, convection)
    );
    color = mix(color, uSurfacePalette[3], hotCell);
    float energizedGlow = stormEnergy *
      smoothstep(0.54, 0.93, convection) * 0.22;
    return mix(color, uSurfacePalette[3], energizedGlow);
  }

  vec3 terraSurfaceColor(vec3 normal, float elevation) {
    float interaction = interactionInfluence(normal);
    float rotation = clamp(uSurfaceDynamics.x, 0.0, 1.0);
    float continentField = waveField(
      normal,
      vec3(3.8, 5.3, -4.6),
      vec3(-6.7, 3.1, 5.8)
    );

    #if SURFACE_SHADER_QUALITY >= 2
      float coastDetail = waveField(
        normal,
        vec3(9.1, -7.4, 8.6),
        vec3(7.7, 10.3, -6.2)
      );
      continentField += coastDetail * 0.28;
    #endif
    continentField += elevation * 0.2;

    float land = smoothstep(0.08, 0.27, continentField);
    float oceanLight = smoothstep(-0.82, 0.48, normal.y * 0.4 - normal.z * 0.2);
    vec3 color = mix(
      uSurfacePalette[0],
      uSurfacePalette[1],
      oceanLight
    );
    color = mix(color, uSurfacePalette[2], land);

    #if SURFACE_SHADER_QUALITY >= 2
      float motion = 1.0 - uReducedMotion;
      vec3 cloudNormal = interactionWarp(normal, interaction, 0.32);
      // Activity modulates contrast below, never absolute-time phase. The old
      // time * changing-rate expression rephased the entire map on pointer
      // down, which read as a surface flicker instead of added energy.
      float cloudTime = uTime * motion * 0.018;
      float cloudField = waveField(
        cloudNormal,
        vec3(12.2, 3.7, -9.4) + vec3(cloudTime),
        vec3(-8.8, 5.1, 13.6) - vec3(cloudTime * 0.67)
      );
      float latitudeBands = sin(cloudNormal.y * 21.0 + cloudField * 1.8);
      float clouds = smoothstep(
        mix(0.67, 0.62, rotation),
        mix(0.94, 0.91, rotation),
        cloudField * 0.56 + latitudeBands * 0.44
      );
      color = mix(
        color,
        uSurfacePalette[3],
        clouds * mix(0.74, 0.82, rotation)
      );
    #endif

    return color;
  }

  vec3 lunaSurfaceColor(vec3 normal, float elevation) {
    float interaction = interactionInfluence(normal);
    float rotation = clamp(uSurfaceDynamics.x, 0.0, 1.0);
    vec3 mottledNormal = interactionWarp(normal, interaction, 0.16);
    float surfaceTime = uTime * (1.0 - uReducedMotion) * 0.006;
    float broadMottling = waveField(
      mottledNormal,
      vec3(5.7, -7.9, 4.3) + vec3(surfaceTime),
      vec3(-8.6, 4.8, 7.1) - vec3(surfaceTime * 0.71)
    ) * 0.5 + 0.5;
    float relief = clamp(elevation * 0.34 + 0.5, 0.0, 1.0);
    float maria = smoothstep(
      mix(0.58, 0.55, rotation),
      mix(0.82, 0.79, rotation),
      broadMottling - relief * 0.18
    );
    vec3 color = mix(uSurfacePalette[1], uSurfacePalette[2], relief);
    color = mix(color, uSurfacePalette[0], maria * 0.82);

    #if SURFACE_SHADER_QUALITY >= 2
      float craterField = waveField(
        mottledNormal,
        vec3(15.4, 11.8, -13.1),
        vec3(-12.7, 17.2, 9.6)
      ) * 0.5 + 0.5;
      float craterRim = smoothstep(0.72, 0.8, craterField) *
        (1.0 - smoothstep(0.8, 0.9, craterField));
      color = mix(color, uSurfacePalette[3], craterRim * 0.7);
    #endif

    return color;
  }

  vec3 proceduralSurfaceColor(vec3 normal, float elevation) {
    #if BODY_KIND == 0
      return solSurfaceColor(normal);
    #elif BODY_KIND == 1
      return terraSurfaceColor(normal, elevation);
    #else
      return lunaSurfaceColor(normal, elevation);
    #endif
  }

  void main() {
    // Each point is one surface glyph. The former instanced quad evaluated all
    // procedural surface work at each of its four corners even though every
    // corner shared the same normal, elevation, reveal, and color.
    // The worker emits analytic unit Fibonacci normals. Avoid normalizing the
    // same immutable attribute for every frame of every body.
    vec3 localNormal = position;
    vec3 viewNormal = normalize(normalMatrix * localNormal);

    // Collapse the hidden hemisphere before surface flow, topography, tangent,
    // and projection work so those glyph points never reach rasterization.
    if (viewNormal.z <= 0.0) {
      vGlyphAlphaScale = 0.0;
      vGlyphIndex = aGlyphIndex;
      vProjectedGlyphBasis = vec4(1.0, 0.0, 0.0, 1.0);
      vSurfaceColor = vec3(0.0);
      gl_PointSize = 1.0;
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }

    float surfaceActivity = step(
      0.00001,
      abs(uSurfaceFlowElevationAmplitude)
    );
    float animatedTime = uTime * (1.0 - uReducedMotion) * uSurfaceFlowSpeed;
    float surfaceFlow = 0.0;
    if (surfaceActivity > 0.0) {
      surfaceFlow = solarSurfaceFlow(localNormal, animatedTime);
    }
    float dynamicElevation = clamp(
      aElevation + surfaceFlow * uSurfaceFlowElevationAmplitude,
      -1.25,
      1.25
    );
    vec3 localCenter = localNormal * uRadius;
    vec4 viewCenter = modelViewMatrix * vec4(localCenter, 1.0);

    // A continuous typographic contour cue is deliberately carried in ink
    // rather than RGB. That keeps black-on-light and white-on-dark surfaces
    // perceptually symmetric, and avoids turning the ASCII body into a
    // conventionally shaded solid sphere. Four gently eased terraces produce
    // coherent plateaus without introducing hard thresholds that could pop on
    // Sol's moving surface.
    float reliefProgress = smoothstep(-0.72, 0.72, dynamicElevation);
    float terracedRelief = 0.25 * (
      smoothstep(0.12, 0.22, reliefProgress) +
      smoothstep(0.37, 0.47, reliefProgress) +
      smoothstep(0.62, 0.72, reliefProgress) +
      smoothstep(0.82, 0.92, reliefProgress)
    );
    float contourTerrace = 0.5 + 0.5 * cos(
      (dynamicElevation + 0.08) * 11.0
    );
    float topographyInk = clamp(
      0.72 +
        terracedRelief * 0.22 +
        contourTerrace * 0.03,
      0.72,
      1.0
    );

    vec3 glyphSurfaceNormal = viewNormal;
    vec3 tangentUp = vec3(0.0, 1.0, 0.0) -
      glyphSurfaceNormal * dot(
        vec3(0.0, 1.0, 0.0),
        glyphSurfaceNormal
      );
    if (dot(tangentUp, tangentUp) < 0.0001) {
      tangentUp = vec3(1.0, 0.0, 0.0) -
        glyphSurfaceNormal * dot(
          vec3(1.0, 0.0, 0.0),
          glyphSurfaceNormal
        );
    }
    tangentUp = normalize(tangentUp);
    vec3 tangentRight = cross(tangentUp, glyphSurfaceNormal);

    float spotPattern = -1.0;
    if (surfaceActivity > 0.0) {
      spotPattern = sin(dot(localNormal, vec3(10.4, -7.8, 6.1)) +
        animatedTime * 0.09);
      spotPattern *= cos(dot(localNormal, vec3(-5.7, 12.2, 8.6)) -
        animatedTime * 0.055);
    }

    // This projected affine basis is exact because the hero Canvas uses an
    // orthographic camera. A future perspective camera would require a
    // perspective-correct inverse map (or a different primitive).
    vec4 clipCenter = projectionMatrix * viewCenter;
    vec4 clipRight = projectionMatrix * vec4(
      tangentRight * uGlyphSize,
      0.0
    );
    vec4 clipUp = projectionMatrix * vec4(
      tangentUp * uGlyphSize,
      0.0
    );
    vec2 physicalViewport = max(uViewportSize, vec2(1.0)) *
      max(uDevicePixelRatio, 1.0);
    vec2 screenScale = physicalViewport * 0.5;
    vec2 projectedRight = clipRight.xy * screenScale;
    vec2 projectedUp = clipUp.xy * screenScale;
    vec2 projectedExtent = abs(projectedRight) + abs(projectedUp);
    float requestedPointSize = max(
      max(projectedExtent.x, projectedExtent.y),
      1.0
    );
    // The atlas glyphs occupy only the centered 78% of each cell. Crop the
    // transparent point footprint while preserving every visible glyph pixel.
    const float pointCropScale = 0.78;
    float pointSize = min(
      requestedPointSize,
      max(uMaxPointSize, 1.0)
    ) * pointCropScale;
    float croppedRequestedPointSize = requestedPointSize * pointCropScale;

    float revealTime = max(uTime - uRevealTimeOffset, 0.0);
    float reveal = smoothstep(
      aRevealDelay,
      aRevealDelay + ${c.GLYPH_REVEAL_FADE_SECONDS.toFixed(2)},
      revealTime
    );
    reveal = mix(reveal, 1.0, uReducedMotion);
    float limbOpacity = smoothstep(0.07, 0.43, viewNormal.z);
    float frontOpacity = mix(
      0.93,
      1.0,
      smoothstep(0.43, 0.78, viewNormal.z)
    );
    float surfacePulse = surfaceActivity *
      smoothstep(0.52, 0.94, spotPattern);
    float sunspot = 1.0 - surfacePulse * 0.16;
    vGlyphAlphaScale = limbOpacity * frontOpacity * topographyInk *
      sunspot * reveal * uOpacity * uIntroOpacity;

    // The point itself is an axis-aligned bounding square. The fragment shader
    // inverse-maps its coordinates through this projected tangent basis, which
    // preserves the old camera-upright orientation and limb foreshortening.
    vGlyphIndex = aGlyphIndex;
    vProjectedGlyphBasis = vec4(
      projectedRight / croppedRequestedPointSize,
      projectedUp / croppedRequestedPointSize
    );
    vSurfaceColor = proceduralSurfaceColor(localNormal, dynamicElevation);
    gl_PointSize = max(pointSize, 1.0);
    gl_Position = clipCenter;
  }
`,et=`
  uniform sampler2D uAtlas;

  varying float vGlyphAlphaScale;
  varying float vGlyphIndex;
  varying vec4 vProjectedGlyphBasis;
  varying vec3 vSurfaceColor;

  vec2 atlasUv(float glyphIndex, vec2 glyphUv) {
    const float atlasColumns = 3.0;
    const float cellPadding = 0.02;
    vec2 insetUv = mix(
      vec2(cellPadding),
      vec2(1.0 - cellPadding),
      glyphUv
    );

    return vec2(
      (glyphIndex + insetUv.x) / atlasColumns,
      insetUv.y
    );
  }

  void main() {
    if (vGlyphAlphaScale <= 0.0) discard;

    // gl_PointCoord starts at the point's upper-left. Convert to a centered,
    // screen-Y-up offset, then inverse-map through the projected tangent basis
    // authored by the vertex. Pixels outside the resulting parallelogram are
    // the transparent padding of the point's axis-aligned bounding square.
    vec2 pointOffset = vec2(
      gl_PointCoord.x - 0.5,
      0.5 - gl_PointCoord.y
    );
    vec2 projectedRight = vProjectedGlyphBasis.xy;
    vec2 projectedUp = vProjectedGlyphBasis.zw;
    float basisDeterminant = projectedRight.x * projectedUp.y -
      projectedUp.x * projectedRight.y;
    if (abs(basisDeterminant) < 0.00001) discard;
    vec2 glyphOffset = vec2(
      projectedUp.y * pointOffset.x - projectedUp.x * pointOffset.y,
      -projectedRight.y * pointOffset.x +
        projectedRight.x * pointOffset.y
    ) / basisDeterminant;
    if (max(abs(glyphOffset.x), abs(glyphOffset.y)) > 0.5) discard;
    vec2 glyphUv = glyphOffset + 0.5;

    float sampledAlpha = texture2D(
      uAtlas,
      atlasUv(vGlyphIndex, glyphUv)
    ).a;
    float glyphAlpha = smoothstep(0.025, 0.68, sampledAlpha);
    if (glyphAlpha < 0.015) discard;

    float alpha = glyphAlpha * vGlyphAlphaScale;
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(vSurfaceColor, alpha);
  }
`,ei=`
  attribute vec2 aEmissionSpawn;
  attribute vec3 aEffectSeed;
  attribute float aEffectKind;
  attribute float aGlyphIndex;
  attribute float aGlyphScale;
  attribute float aPhase;
  attribute float aSourceEmission;

  uniform float uBodyActivities[3];
  uniform float uBodyIntroOpacities[3];
  uniform vec3 uBodyPositions[3];
  uniform float uBodyRadii[3];
  uniform vec3 uBodyVelocities[3];
  uniform float uDevicePixelRatio;
  uniform float uEmissionPulseLifetime;
  uniform float uEmissionTime;
  uniform float uFieldOpacity;
  uniform float uFieldTime;
  uniform float uGlyphSize;
  uniform vec3 uInteractionAdvectiveVelocity;
  uniform float uInteractionEnergy;
  uniform vec3 uInteractionFlowAxis;
  uniform vec3 uInteractionPosition;
  uniform float uInteractionRadius;
  uniform float uInteractionWakeStrength;
  uniform float uMaxPointSize;
  uniform float uReducedMotion;
  uniform float uSystemScale;
  uniform float uSystemAxisAngle;
  uniform float uTrajectoryTime;
  uniform vec3 uVolumeCenter;
  uniform vec3 uVolumeSize;

  varying vec4 vBodyClearanceCorners;
  varying float vDensity;
  varying float vFieldMix;
  varying float vGlyphIndex;
  varying float vLifecycle;
  varying float vPulse;

  const float TAU = 6.28318530718;

  vec3 safeNormalize(vec3 value) {
    return value * inversesqrt(max(dot(value, value), 0.000001));
  }

  // Dynamic force fields must go to zero continuously at their centers.
  // Normalizing those vectors would make an arbitrarily small crossing flip
  // a particle from full force in one direction to full force in the other.
  vec3 softNormalize(vec3 value, float softening) {
    return value * inversesqrt(
      dot(value, value) + max(softening * softening, 0.000001)
    );
  }

  float bodyMassWeight(int index) {
    if (index == 0) return 1.0;
    if (index == 1) return 0.82;
    return 0.68;
  }

  float bodyIntroOpacity(int index) {
    if (index == 0) return uBodyIntroOpacities[0];
    if (index == 1) return uBodyIntroOpacities[1];
    return uBodyIntroOpacities[2];
  }

  float lifecycleFade(float progress) {
    return smoothstep(0.0, 0.12, progress) *
      (1.0 - smoothstep(0.86, 1.0, progress));
  }

  float diffuseWindRate() {
    return 0.011 + (aEffectSeed.x * 0.5 + 0.5) * 0.008;
  }

  float structuredWindRate() {
    return 0.016 + (aEffectSeed.z * 0.5 + 0.5) * 0.012;
  }

  float sourceEmissionProgress(float windRate) {
    // The birth clock is sampled from the same monotonically integrated wind
    // clock that advances ambient particles. This keeps old and new glyphs in
    // one advecting volume when Sol adds energy instead of creating a fast,
    // independently timed overlay.
    float travelAge = max(uTrajectoryTime - aEmissionSpawn.y, 0.0);
    return travelAge * windRate;
  }

  float sourceEmissionLifecycle(float progress) {
    float age = uEmissionTime - aEmissionSpawn.x;
    float spawned = step(0.0, aEmissionSpawn.x) * step(0.0, age);
    float travelEnvelope = smoothstep(0.0, 0.006, progress) *
      (1.0 - smoothstep(0.82, 1.0, progress));
    float ageEnvelope = 1.0 - smoothstep(
      uEmissionPulseLifetime * 0.72,
      uEmissionPulseLifetime,
      age
    );
    return spawned * travelEnvelope * ageEnvelope;
  }

  float resolveWindProgress(
    float windRate,
    bool isSourceEmission,
    out float lifecycle
  ) {
    if (isSourceEmission) {
      float sourceProgress = sourceEmissionProgress(windRate);
      lifecycle = sourceEmissionLifecycle(sourceProgress);
      return min(sourceProgress, 1.08);
    }

    float ambientProgress = fract(
      aPhase / TAU + uTrajectoryTime * windRate
    );
    lifecycle = lifecycleFade(ambientProgress);
    return ambientProgress;
  }

  vec3 radialDirection(float angle, float depth) {
    return safeNormalize(vec3(cos(angle), sin(angle), depth));
  }

  float structuredWindAngle() {
    const float spokeCount = 18.0;
    float spokeIndex = floor(
      (aEffectSeed.y * 0.5 + 0.5) * spokeCount
    );
    return spokeIndex / spokeCount * TAU + aEffectSeed.x * 0.035;
  }

  vec3 diffuseWindPosition(
    float time,
    float progress
  ) {
    float radius = max(uBodyRadii[0], 0.0001);
    float fullAngle = (aEffectSeed.y * 0.5 + 0.5) * TAU;
    float broadSystemFan = uSystemAxisAngle + aEffectSeed.y * 2.05;
    float fanSelector = fract(sin(
      aPhase * 12.9898 + aEffectSeed.z * 78.233
    ) * 43758.5453);
    float angle = mix(
      fullAngle,
      broadSystemFan,
      step(0.42, fanSelector)
    ) + aEffectSeed.x * 0.14;
    vec3 direction = radialDirection(angle, aEffectSeed.z * 0.045);
    vec3 tangent = safeNormalize(vec3(-direction.y, direction.x, 0.0));
    float travel = uVolumeSize.x * 1.16;
    float billow = sin(
      progress * 5.1 + aEffectSeed.x * 2.1 + time * 0.045
    );
    vec3 source = uBodyPositions[0] + direction * radius *
      (1.01 + (aEffectSeed.z * 0.5 + 0.5) * 0.12);
    return source + direction * travel * progress +
      tangent * radius * billow * (0.035 + progress * 0.1);
  }

  vec3 structuredWindPosition(
    float time,
    float progress
  ) {
    float radius = max(uBodyRadii[0], 0.0001);
    float angle = structuredWindAngle();
    vec3 direction = radialDirection(angle, aEffectSeed.z * 0.035);
    vec3 tangent = safeNormalize(vec3(-direction.y, direction.x, 0.0));
    float travel = uVolumeSize.x * 1.18;
    float streamWave = sin(
      progress * 5.8 + angle * 0.7 + aEffectSeed.x * 0.16 - time * 0.07
    );
    vec3 source = uBodyPositions[0] + direction * radius *
      (1.01 + (aEffectSeed.z * 0.5 + 0.5) * 0.08);
    return source + direction * travel * progress +
      tangent * radius * streamWave * (0.03 + progress * 0.075);
  }

  vec3 sharedCurlDisplacement(vec3 point, float time) {
    vec3 scale = max(uVolumeSize, vec3(1.0));
    vec3 p = (point - uVolumeCenter) / scale;
    float slowTime = time * 0.07;
    vec3 curlLike = vec3(
      sin(p.y * 7.1 + slowTime) - cos(p.z * 8.3 - slowTime * 0.71),
      sin(p.z * 6.7 - slowTime * 0.83) - cos(p.x * 7.7 + slowTime),
      sin(p.x * 8.9 + slowTime * 0.61) - cos(p.y * 6.3 - slowTime)
    ) * 0.5;
    vec3 solarDelta = point - uBodyPositions[0];
    vec3 solarDirection = safeNormalize(solarDelta);
    vec3 solarTangent = safeNormalize(vec3(
      -solarDirection.y,
      solarDirection.x,
      solarDirection.z * 0.16
    ));
    float radialPhase = length(solarDelta.xy) / max(scale.x, 1.0) * 18.0;
    float outwardWave = sin(
      radialPhase - time * 0.24 + aEffectSeed.y * 1.3
    );
    float xyAmplitude = min(uVolumeSize.x, uVolumeSize.y) * 0.034;
    float curlStrength = aEffectKind < 0.5 ? 1.12 : 0.92;
    return curlLike * vec3(xyAmplitude, xyAmplitude, uVolumeSize.z * 0.1) *
      curlStrength +
      solarTangent * xyAmplitude * outwardWave * 0.62 +
      solarDirection * xyAmplitude * cos(radialPhase - time * 0.18) * 0.16;
  }

  vec3 bodyDisturbance(vec3 point, float time, out float fieldEnergy) {
    vec3 displacement = vec3(0.0);
    fieldEnergy = 0.0;
    float solarRadius = max(uBodyRadii[0], 0.0001);
    vec3 flowDirection = softNormalize(
      point - uBodyPositions[0],
      solarRadius * 0.08
    );

    for (int index = 0; index < 3; index += 1) {
      float bodyPresence = clamp(bodyIntroOpacity(index), 0.0, 1.0);
      float radius = max(uBodyRadii[index], 0.0001);
      vec3 fromBody = point - uBodyPositions[index];
      vec3 toBody = -fromBody;
      float centerDistance = max(length(fromBody), 0.0001);
      float distanceFromSurface = max(centerDistance - radius, 0.0);
      vec3 attractionDirection = softNormalize(toBody, radius * 0.14);
      vec3 transverseAttraction = attractionDirection - flowDirection *
        dot(attractionDirection, flowDirection);
      float softenedRadius = radius * 0.52;
      float gravityKernel = radius * radius /
        (centerDistance * centerDistance + softenedRadius * softenedRadius);
      float sourceEscape = 1.0;
      if (index == 0) {
        sourceEscape = smoothstep(radius * 1.04, radius * 1.82, centerDistance);
      }
      float gravityStrength = radius * 0.44 * gravityKernel *
        bodyMassWeight(index) * sourceEscape * bodyPresence;
      displacement += (
        attractionDirection * 0.32 + transverseAttraction * 0.68
      ) * gravityStrength;
      float longitudinalDistance = dot(fromBody, flowDirection);
      vec3 transverseOffset = fromBody -
        flowDirection * longitudinalDistance;
      float lensEnvelope = exp(
        -abs(longitudinalDistance) / (radius * 2.6) -
          length(transverseOffset) / (radius * 1.6)
      );
      displacement += transverseAttraction * radius * 0.085 *
        lensEnvelope * bodyMassWeight(index) * sourceEscape * bodyPresence;

      float rotationActivity = clamp(uBodyActivities[index], 0.0, 1.0);
      vec3 boundedAngularVelocity = uBodyVelocities[index];
      vec3 radialDirection = softNormalize(fromBody, radius * 0.12);
      // omega x radius is both physically coherent and continuous. Keeping
      // its magnitude (instead of normalizing it) lets the wake pass through
      // rest smoothly when a drag reverses direction.
      vec3 rotationalFlow = cross(
        boundedAngularVelocity,
        radialDirection
      );
      float activeWakeReach = index == 0 ? 2.1 : 2.85;
      float rotationalFalloff = exp(-distanceFromSurface /
        (radius * mix(1.65, activeWakeReach, rotationActivity)));
      float downstreamWake = 0.72 + 0.28 * smoothstep(
        -0.6,
        2.4,
        longitudinalDistance / radius
      );
      float fieldBreathing = 0.92 + 0.08 * sin(time * 0.42 + aPhase * 0.2);
      float activeWakeStrength = index == 0 ? 0.5 : 1.15;
      displacement += rotationalFlow * radius * 0.14 *
        (1.0 + rotationActivity * activeWakeStrength) *
        rotationalFalloff * downstreamWake * fieldBreathing * bodyPresence;
      fieldEnergy += (
        gravityKernel * bodyMassWeight(index) * 0.58 +
        min(length(rotationalFlow) * 0.14, 0.32) * rotationalFalloff *
          (1.0 + rotationActivity * 0.55)
      ) * bodyPresence;
    }

    fieldEnergy = clamp(fieldEnergy, 0.0, 1.0);
    return displacement;
  }

  vec3 interactionDisturbance(
    vec3 point,
    float time,
    out float interactionFieldEnergy
  ) {
    vec3 delta = point - uInteractionPosition;
    float radius = max(uInteractionRadius * 1.12, 1.0);
    vec3 flowAxis = uInteractionFlowAxis;
    float downstreamDistance = dot(delta, flowAxis);
    vec3 lateralDelta = delta - flowAxis * downstreamDistance;
    float distanceRatio = length(delta) / radius;
    float headFalloff = exp(-distanceRatio * distanceRatio * 1.65);
    float tailProgress = max(downstreamDistance, 0.0) / (radius * 4.2);
    float tailWidth = radius * (0.62 + min(tailProgress, 1.0) * 0.25);
    float downstreamGate = smoothstep(
      -radius * 0.16,
      radius * 0.24,
      downstreamDistance
    );
    float tailFalloff = downstreamGate * exp(
      -tailProgress * 1.1 -
        dot(lateralDelta, lateralDelta) /
          max(tailWidth * tailWidth, 0.0001)
    );
    float fieldEnvelope = headFalloff + tailFalloff * 0.82 *
      (1.0 - headFalloff);
    vec3 advectiveVelocity = uInteractionAdvectiveVelocity;
    float wakeStrength = uInteractionWakeStrength;
    float ripple = 0.92 + 0.08 * sin(
      distanceRatio * 3.1 - time * 0.22
    );

    // Use the unnormalized offset for the local swirl so it has zero force at
    // the cursor rather than reversing a unit vector across it. The advective
    // term likewise carries velocity magnitude through zero continuously.
    vec3 normalizedOffset = delta / radius;
    vec3 localSwirl = cross(
      vec3(0.0, 0.0, 1.0),
      normalizedOffset
    ) * radius * 0.11 * ripple * headFalloff;
    vec3 advectiveWake = advectiveVelocity * radius * 0.18 *
      fieldEnvelope;
    vec3 solarDrift = flowAxis * radius * 0.035 * tailFalloff;

    interactionFieldEnergy = clamp(
      fieldEnvelope * uInteractionEnergy * (0.7 + wakeStrength),
      0.0,
      1.0
    );
    return (localSwirl + advectiveWake + solarDrift) * uInteractionEnergy;
  }

  vec4 projectedBodyClearanceCorners(vec3 viewCenter, vec2 halfGlyph) {
    vec4 clearance = vec4(1.0);
    vec4 cornerX = viewCenter.x + vec4(
      -halfGlyph.x,
      halfGlyph.x,
      halfGlyph.x,
      -halfGlyph.x
    );
    vec4 cornerY = viewCenter.y + vec4(
      -halfGlyph.y,
      -halfGlyph.y,
      halfGlyph.y,
      halfGlyph.y
    );

    for (int index = 0; index < 3; index += 1) {
      float bodyPresence = clamp(bodyIntroOpacity(index), 0.0, 1.0);
      float radius = max(
        uBodyRadii[index] * max(uSystemScale, 0.0001),
        0.0001
      );
      vec3 bodyViewPosition = (
        modelViewMatrix * vec4(uBodyPositions[index], 1.0)
      ).xyz;
      vec4 deltaX = cornerX - bodyViewPosition.x;
      vec4 deltaY = cornerY - bodyViewPosition.y;
      vec4 projectedDistance = sqrt(
        deltaX * deltaX + deltaY * deltaY
      );

      // Every free-space glyph passes through the body's visual atmosphere,
      // including glyphs in front of its nominal depth. This avoids a crisp
      // front-depth exception at the limb while still making particles behind
      // a body substantially more occluded. Keep the mask analytic and
      // body-scaled: Sol gets the broadest envelope, while the glyph-size floor
      // prevents the smaller bodies from exposing a one-character cutoff.
      float relativeHaloReach = index == 0
        ? 0.50
        : (index == 1 ? 0.42 : 0.36);
      float haloFeather = max(
        uGlyphSize * 1.8,
        radius * relativeHaloReach
      );
      vec4 radialClearance = smoothstep(
        vec4(radius),
        vec4(radius + haloFeather),
        projectedDistance
      );
      vec4 frontSurfaceDepth = bodyViewPosition.z + sqrt(max(
        vec4(radius * radius) - projectedDistance * projectedDistance,
        vec4(0.0)
      ));
      float depthFeather = max(uGlyphSize, uVolumeSize.z * 0.03);
      vec4 behindBody = vec4(1.0) - smoothstep(
        frontSurfaceDepth - depthFeather,
        frontSurfaceDepth + depthFeather,
        vec4(viewCenter.z)
      );
      vec4 atmosphericOcclusion = mix(
        vec4(0.98),
        vec4(1.0),
        behindBody
      );
      clearance *= mix(
        vec4(1.0),
        mix(vec4(1.0), radialClearance, atmosphericOcclusion),
        vec4(bodyPresence)
      );
    }

    return clearance;
  }

  void cullAtmospherePoint() {
    vBodyClearanceCorners = vec4(0.0);
    vDensity = 0.0;
    vFieldMix = 0.0;
    vGlyphIndex = 0.0;
    vLifecycle = 0.0;
    vPulse = 0.0;
    gl_PointSize = 1.0;
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }

  void main() {
    // The particle layer is exactly transparent during its intro delay. This
    // uniform branch keeps all vertices on one path and avoids evaluating a
    // volume that cannot contribute to the frame.
    if (uFieldOpacity <= 0.0) {
      cullAtmospherePoint();
      return;
    }

    // Most source-emission instances are dormant reservoir slots. Cull them
    // before evaluating curl, body wakes, interaction forces, or projection.
    // Ambient instances have aSourceEmission = 0.0 and always continue.
    if (aSourceEmission > 0.5) {
      float sourceAge = uEmissionTime - aEmissionSpawn.x;
      if (
        aEmissionSpawn.x < 0.0 ||
        sourceAge < 0.0 ||
        sourceAge >= uEmissionPulseLifetime
      ) {
        cullAtmospherePoint();
        return;
      }
    }

    float animatedTime = uFieldTime * (1.0 - uReducedMotion);
    vec3 seedPosition;
    float lifecycle = 1.0;
    bool isSourceEmission = aSourceEmission > 0.5;
    float sourceMix = isSourceEmission ? 1.0 : 0.0;
    float windRate = aEffectKind < 0.5
      ? diffuseWindRate()
      : structuredWindRate();
    float progress = resolveWindProgress(
      windRate,
      isSourceEmission,
      lifecycle
    );
    if (aEffectKind < 0.5) {
      seedPosition = diffuseWindPosition(
        uTrajectoryTime,
        progress
      );
      vDensity = 0.62;
    } else {
      seedPosition = structuredWindPosition(
        uTrajectoryTime,
        progress
      );
      vDensity = 0.76;
    }

    vec3 curlDisplacement = sharedCurlDisplacement(seedPosition, animatedTime);
    float bodyFieldEnergy;
    vec3 bodyField = bodyDisturbance(
      seedPosition + curlDisplacement,
      animatedTime,
      bodyFieldEnergy
    );
    vec3 preInteractionPosition = seedPosition + curlDisplacement + bodyField;
    float interactionFieldEnergy = 0.0;
    vec3 interactionField = vec3(0.0);
    // Pointer energy is a coherent uniform, so idle particles can all bypass
    // the interaction wake without introducing divergent per-point branches.
    if (uInteractionEnergy > 0.0001) {
      interactionField = interactionDisturbance(
        preInteractionPosition,
        animatedTime,
        interactionFieldEnergy
      );
    }
    vec3 effectPosition = preInteractionPosition + interactionField;

    vec4 viewCenter = modelViewMatrix * vec4(effectPosition, 1.0);
    float fieldScale = 1.0 +
      clamp(bodyFieldEnergy + interactionFieldEnergy, 0.0, 1.0) * 0.18;
    float glyphSize = uGlyphSize * aGlyphScale * fieldScale;
    const float pointCropScale = 0.78;
    float requestedPointSize = glyphSize * max(uDevicePixelRatio, 1.0);
    float fullPointSize = min(
      requestedPointSize,
      max(uMaxPointSize, 1.0)
    );
    float pointSize = fullPointSize * pointCropScale;
    float renderedGlyphSize = fullPointSize /
      max(uDevicePixelRatio, 1.0);
    vec2 halfGlyph = vec2(renderedGlyphSize * 0.5);
    vec4 clipCenter = projectionMatrix * viewCenter;

    // The scene camera is orthographic, so a view-space half-glyph projects to
    // one constant clip-space padding. Expand it slightly before rejecting a
    // center to keep every potentially visible point on-screen.
    vec2 clipPadding = abs((
      projectionMatrix * vec4(halfGlyph, 0.0, 0.0)
    ).xy) * 1.05 + vec2(0.002);
    vec2 centerNdc = clipCenter.xy / max(abs(clipCenter.w), 0.000001);
    if (any(greaterThan(
      abs(centerNdc),
      vec2(1.0) + clipPadding
    ))) {
      cullAtmospherePoint();
      return;
    }

    // Keep the approved continuous atmospheric fade without evaluating the
    // complete fluid field four times. A point vertex samples only the four
    // lightweight clearance corners; the fragment shader blends them across
    // the glyph just as the former quad's vertex varyings did.
    vBodyClearanceCorners = projectedBodyClearanceCorners(
      viewCenter.xyz,
      halfGlyph
    );
    vDensity *= 1.0 + bodyFieldEnergy * 0.22 +
      interactionFieldEnergy * 0.14;
    vFieldMix = clamp(
      bodyFieldEnergy * 0.68 + interactionFieldEnergy +
        (aEffectKind > 0.5 ? 0.26 : 0.12) + sourceMix * 0.16,
      0.0,
      1.0
    );
    vGlyphIndex = aGlyphIndex;
    vLifecycle = lifecycle;
    vPulse = 0.86 + 0.14 * sin(animatedTime * 0.7 + aPhase);
    gl_PointSize = max(pointSize, 1.0);
    gl_Position = clipCenter;
  }
`,ea=`
  uniform sampler2D uAtlas;
  uniform vec3 uAccentColor;
  uniform vec3 uColor;
  uniform float uFieldOpacity;
  uniform float uOpacity;

  varying vec4 vBodyClearanceCorners;
  varying float vDensity;
  varying float vFieldMix;
  varying float vGlyphIndex;
  varying float vLifecycle;
  varying float vPulse;

  vec2 atlasUv(float glyphIndex, vec2 glyphUv) {
    const float atlasColumns = 3.0;
    const float cellPadding = 0.02;
    vec2 insetUv = mix(
      vec2(cellPadding),
      vec2(1.0 - cellPadding),
      glyphUv
    );
    return vec2(
      (glyphIndex + insetUv.x) / atlasColumns,
      insetUv.y
    );
  }

  void main() {
    // Source particles outside their one-shot lifecycle cannot contribute.
    // Reject them before paying for the atlas texture lookup.
    if (vLifecycle <= 0.0) discard;
    // WebGL point coordinates start at the upper-left; flip Y to match the
    // atlas UV convention used by the former camera-facing quads.
    vec2 glyphUv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    const float pointCropScale = 0.78;
    vec2 uncroppedGlyphUv = vec2(0.5) +
      (glyphUv - vec2(0.5)) * pointCropScale;
    float sampledAlpha = texture2D(
      uAtlas,
      atlasUv(vGlyphIndex, uncroppedGlyphUv)
    ).a;
    if (sampledAlpha <= 0.02) discard;
    float lowerClearance = mix(
      vBodyClearanceCorners.x,
      vBodyClearanceCorners.y,
      uncroppedGlyphUv.x
    );
    float upperClearance = mix(
      vBodyClearanceCorners.w,
      vBodyClearanceCorners.z,
      uncroppedGlyphUv.x
    );
    float bodyClearance = mix(
      lowerClearance,
      upperClearance,
      uncroppedGlyphUv.y
    );
    float glyphAlpha = smoothstep(0.02, 0.62, sampledAlpha);
    float alpha = glyphAlpha * vPulse * vDensity * bodyClearance *
      vLifecycle * uOpacity * uFieldOpacity;
    if (alpha < 0.01) discard;
    vec3 color = mix(uColor, uAccentColor, 0.24 + vFieldMix * 0.58);
    gl_FragColor = vec4(color, alpha);
  }
`;function er(e,t){for(let[i,a]of Object.entries(e.attributes))t.setAttribute(i,a)}function eo({accentColor:e,atlasTexture:i,bodies:r,color:n,count:l,emissionPulseLifetimeSeconds:s,glyphSize:u,introMotion:d,introOpacityByBody:f,interaction:m,isVisible:p,opacity:h,reducedMotion:y,solRotationEmissionVelocityMultiplier:v,systemAxisAngle:g,volumeCenter:x,volumeSize:S}){let w=(0,a.useThree)(e=>e.gl),b=(0,a.useThree)(e=>e.viewport.dpr),M=(0,o.useRef)(null),A=((e,t)=>{let i=Number.isFinite(t)?Math.max(0,Math.floor(t)):0;if(null===e||e<=0||0===i)return i;let a=Math.max(0,Math.floor(e)),r=Math.max(64,Math.ceil(.08*a));return Math.abs(i-a)<r?a:i})(M.current,l);M.current=A;let F=(0,o.useMemo)(()=>(function(e){let t,i=Math.max(0,Math.floor(e)),a=Math.min(i,Math.ceil(i/3)),r=i-a,o=new R.BufferGeometry;o.setAttribute("position",new R.BufferAttribute(new Float32Array(3*i),3));let n=new Float32Array(3*i),l=new Float32Array(i),s=new Float32Array(i),c=new Float32Array(i),u=new Float32Array(i),d=new Float32Array(i),f=new Float32Array(2*i),m=(t=566,()=>(t=Math.imul(t,1664525)+0x3c6ef35f>>>0)/0x100000000);for(let e=0;e<i;e+=1){n[3*e]=2*m()-1,n[3*e+1]=2*m()-1,n[3*e+2]=2*m()-1,l[e]=.7>m()?0:1;let t=m();s[e]=t<.45?0:t<.55?1:2,c[e]=.94+.62*m(),u[e]=m()*Math.PI*2,d[e]=+(e>=a),f[2*e]=-1,f[2*e+1]=-1}o.setAttribute("aEffectSeed",new R.BufferAttribute(n,3)),o.setAttribute("aEffectKind",new R.BufferAttribute(l,1)),o.setAttribute("aGlyphIndex",new R.BufferAttribute(s,1)),o.setAttribute("aGlyphScale",new R.BufferAttribute(c,1)),o.setAttribute("aPhase",new R.BufferAttribute(u,1)),o.setAttribute("aSourceEmission",new R.BufferAttribute(d,1));let p=new R.BufferAttribute(f,2);p.setUsage(R.DynamicDrawUsage),o.setAttribute("aEmissionSpawn",p),o.setDrawRange(0,a);let h=new R.BufferGeometry,y=new R.BufferGeometry;return er(o,h),er(o,y),h.setDrawRange(a,0),y.setDrawRange(a,0),{ambientGeometry:o,reservoirCount:r,reservoirStartIndex:a,sourceGeometries:[h,y],spawnAttribute:p}})(A),[A]),{ambientGeometry:P,reservoirCount:D,reservoirStartIndex:E,sourceGeometries:I,spawnAttribute:B}=F,C=(0,o.useMemo)(()=>new R.ShaderMaterial({depthTest:!1,depthWrite:!1,fragmentShader:ea,toneMapped:!1,transparent:!0,uniforms:{uAccentColor:{value:new R.Color("#fff")},uAtlas:{value:i},uBodyPositions:{value:Array.from({length:3},()=>new R.Vector3)},uBodyActivities:{value:new Float32Array(3)},uBodyIntroOpacities:{value:new Float32Array([1,1,1])},uBodyRadii:{value:new Float32Array(3)},uBodyVelocities:{value:Array.from({length:3},()=>new R.Vector3)},uColor:{value:new R.Color("#fff")},uDevicePixelRatio:{value:1},uEmissionPulseLifetime:{value:3.2},uEmissionTime:{value:0},uFieldOpacity:{value:1},uFieldTime:{value:0},uGlyphSize:{value:5},uInteractionEnergy:{value:0},uInteractionAdvectiveVelocity:{value:new R.Vector3},uInteractionFlowAxis:{value:new R.Vector3},uInteractionPosition:{value:new R.Vector3},uInteractionRadius:{value:1},uInteractionWakeStrength:{value:0},uMaxPointSize:{value:64},uOpacity:{value:1},uReducedMotion:{value:0},uSystemScale:{value:1},uSystemAxisAngle:{value:0},uTrajectoryTime:{value:0},uVolumeCenter:{value:new R.Vector3},uVolumeSize:{value:new R.Vector3(1,1,1)}},vertexShader:ei}),[i]),T=(0,o.useRef)(0),O=(0,o.useRef)(0),N=(0,o.useRef)(0),V=(0,o.useRef)(0),k=(0,o.useRef)(0),_=(0,o.useRef)([null,null]),j=(0,o.useRef)(0),L=Number.isFinite(D)?Math.floor(.7*Math.max(0,D)):0;return(0,o.useLayoutEffect)(()=>()=>{P.dispose(),I.forEach(e=>e.dispose())},[P,I]),(0,o.useLayoutEffect)(()=>()=>C.dispose(),[C]),(0,o.useLayoutEffect)(()=>{let e=w.getContext();C.uniforms.uDevicePixelRatio.value=Math.max(b,1),C.uniforms.uMaxPointSize.value=Z(e)},[b,C,w]),(0,o.useLayoutEffect)(()=>{T.current=0,O.current=0,V.current=0,k.current=0},[F]),(0,o.useLayoutEffect)(()=>{if(C.uniforms.uAccentColor.value.set(e),C.uniforms.uAtlas.value=i,C.uniforms.uColor.value.set(n),C.uniforms.uEmissionPulseLifetime.value=Math.max(.5,Number.isFinite(s)?s:3.2),C.uniforms.uGlyphSize.value=u,C.uniforms.uInteractionRadius.value=Math.max(1,.3*Math.min(S[0],S[1])),y){C.uniforms.uInteractionEnergy.value=0;let e=C.uniforms.uBodyActivities.value,t=C.uniforms.uBodyVelocities.value;for(let i=0;i<t.length;i+=1)e[i]=0,t[i]?.set(0,0,0)}C.uniforms.uOpacity.value=h,C.uniforms.uReducedMotion.value=+!!y,C.uniforms.uSystemAxisAngle.value=Number.isFinite(g)?g:0,C.uniforms.uVolumeCenter.value.set(...x),C.uniforms.uVolumeSize.value.set(...S)},[e,i,n,s,u,C,h,y,g,x,S]),(0,z.useFrame)((e,t)=>{let i,a=C.uniforms.uBodyActivities.value,o=C.uniforms.uBodyIntroOpacities.value,n=C.uniforms.uBodyPositions.value,l=C.uniforms.uBodyRadii.value,u=C.uniforms.uBodyVelocities.value,h=C.uniforms.uInteractionPosition.value,g=C.uniforms.uInteractionAdvectiveVelocity.value,x=C.uniforms.uInteractionFlowAxis.value;r.forEach((e,t)=>{let i=c.BODY_IDS[t];if(n[t].copy(e.position),a[t]=e.rotationActivity,o[t]=i?Math.min(Math.max(f[i].value,0),1):1,l[t]=e.radius,y)u[t].set(0,0,0);else{let i=e.angularVelocity.length();u[t].copy(e.angularVelocity).divideScalar(1+i/1.8)}});let S=Math.max(1.12*C.uniforms.uInteractionRadius.value,1),w=y?0:Number.isFinite(i=a[0])?Math.min(Math.max(i??0,0),1):0;if(!y&&p){let e,i,a=G(t),r=a*d.fieldMotionScale;N.current+=r,j.current+=(e=Number.isFinite(w)?Math.min(Math.max(w,0),1):0,i=Number.isFinite(v)?Math.min(Math.max(v,1),3):1,G(r)*(1+e*(i-1)));let o=Math.max(.5,Number.isFinite(s)?s:3.2);O.current+=a,T.current=Math.min(L,T.current+(Number.isFinite(w)&&Number.isFinite(L)&&Number.isFinite(o)?Math.min(Math.max(w,0),1)*Math.max(Math.floor(L),0)/Math.max(o,.001):0)*a);let n=B.array,l=V.current;for(;l>0&&D>0;){let e=n[(E+(k.current-l+D)%D)*2]??-1;if(e>=0&&O.current-e<o)break;l-=1}let c=Math.floor(T.current),u=0,f=k.current;for(;c>0&&D>0;){let e=k.current,t=2*(E+e),i=n[t]??-1;if(i>=0&&O.current-i<o)break;n[t]=O.current,n[t+1]=j.current,k.current=(e+1)%D,l+=1,c-=1,u+=1}if(u>0){T.current-=u;let e=Math.min(u,D-f);B.addUpdateRange((E+f)*2,2*e);let t=u-e;t>0&&B.addUpdateRange(2*E,2*t),B.needsUpdate=!0}V.current=l;let m=function(e,t,i,a){if(t<=0||a<=0)return[{count:0,start:e},{count:0,start:e}];if(a>=t)return[{count:t,start:e},{count:0,start:e}];let r=(i-a+t)%t;return r<i?[{count:a,start:e+r},{count:0,start:e}]:[{count:i,start:e},{count:t-r,start:e+r}]}(E,D,k.current,l);I[0].setDrawRange(m[0].start,m[0].count),I[1].setDrawRange(m[1].start,m[1].count),_.current[0]&&(_.current[0].visible=m[0].count>0),_.current[1]&&(_.current[1].visible=m[1].count>0)}if(C.uniforms.uEmissionTime.value=O.current,C.uniforms.uFieldOpacity.value=d.fieldOpacity,C.uniforms.uFieldTime.value=N.current,C.uniforms.uSystemScale.value=d.scale,C.uniforms.uTrajectoryTime.value=j.current,y)g.set(0,0,0),x.set(0,0,0),C.uniforms.uInteractionWakeStrength.value=0,C.uniforms.uInteractionEnergy.value=0;else{h.copy(m.position);let e=Math.max(l[0],1);x.copy(m.position).sub(n[0]);let t=Math.max(.3*e,.12*S);x.multiplyScalar(1/Math.sqrt(x.lengthSq()+t*t));let i=m.velocity.length();g.copy(m.velocity).divideScalar(2.6*S+i),C.uniforms.uInteractionWakeStrength.value=g.length(),C.uniforms.uInteractionEnergy.value=Math.min(1,Math.max(0,m.energy))}},-2),(0,t.jsxs)("group",{children:[(0,t.jsx)("points",{dispose:null,frustumCulled:!1,geometry:P,material:C,renderOrder:5}),I.map((e,i)=>(0,t.jsx)("points",{ref:e=>{_.current[i]=e},dispose:null,frustumCulled:!1,geometry:e,material:C,renderOrder:5,visible:!1},i))]})}let en={luna:2,sol:0,terra:1},el=(0,o.forwardRef)(function({atlasTexture:e,bodyId:i,geometryData:r,glyphSize:n,introOpacityUniform:l,opacity:s,onAfterRender:c,position:u,radius:d,reducedMotion:f,renderOrder:m,revealTimeOffset:p,shaderQualityLevel:h,surfaceFlowElevationAmplitude:y,surfaceFlowSpeed:v,surfaceInteractionResponse:g,surfacePalette:x,surfaceRotationResponse:S,surfaceState:w,timeUniform:b},M){let A=(0,a.useThree)(e=>e.gl),F=(0,a.useThree)(e=>e.viewport.dpr),P=(0,a.useThree)(e=>e.size),D=(0,o.useMemo)(()=>{let e;return(e=new R.BufferGeometry).setAttribute("position",new R.BufferAttribute(r.surfaceNormals,3)),e.setAttribute("aElevation",new R.BufferAttribute(r.elevations,1)),e.setAttribute("aGlyphIndex",new R.BufferAttribute(r.glyphIndices,1)),e.setAttribute("aRevealDelay",new R.BufferAttribute(r.revealDelays,1)),e.setDrawRange(0,r.count),e},[r]),E=(0,o.useMemo)(()=>{var t,a,r,o,n;return t=e,a=b,r=l,o=h,n=i,new R.ShaderMaterial({defines:{BODY_KIND:en[n],SURFACE_SHADER_QUALITY:Math.min(Math.max(o,0),3)},depthTest:!1,depthWrite:!1,fragmentShader:et,toneMapped:!1,transparent:!0,uniforms:{uAtlas:{value:t},uDevicePixelRatio:{value:1},uGlyphSize:{value:1},uIntroOpacity:r,uMaxPointSize:{value:64},uOpacity:{value:1},uRadius:{value:1},uReducedMotion:{value:0},uRevealTimeOffset:{value:0},uSurfaceFlowElevationAmplitude:{value:0},uSurfaceFlowSpeed:{value:0},uSurfaceDynamics:{value:new R.Vector2},uSurfaceInteractionDirection:{value:new R.Vector3(0,0,1)},uSurfacePalette:{value:[new R.Color("#fff"),new R.Color("#fff"),new R.Color("#fff"),new R.Color("#fff")]},uTime:a,uViewportSize:{value:new R.Vector2(1,1)}},vertexShader:ee})},[e,i,l,h,b]);return(0,z.useFrame)(()=>{E.uniforms.uSurfaceInteractionDirection.value.copy(w.localInteractionDirection);let e=E.uniforms.uSurfaceDynamics.value;e.x=w.rotationActivity*S,e.y=w.interactionEnergy*g}),(0,o.useLayoutEffect)(()=>()=>D.dispose(),[D]),(0,o.useLayoutEffect)(()=>()=>E.dispose(),[E]),(0,o.useLayoutEffect)(()=>{let e=A.getContext();E.uniforms.uDevicePixelRatio.value=Math.max(F,1),E.uniforms.uMaxPointSize.value=Z(e),E.uniforms.uViewportSize.value.set(Math.max(P.width,1),Math.max(P.height,1))},[F,E,A,P.height,P.width]),(0,o.useLayoutEffect)(()=>{E.uniforms.uAtlas.value=e,E.uniforms.uGlyphSize.value=n,E.uniforms.uOpacity.value=s,E.uniforms.uRadius.value=d,E.uniforms.uReducedMotion.value=+!!f,E.uniforms.uRevealTimeOffset.value=p,E.uniforms.uSurfaceFlowElevationAmplitude.value=y,E.uniforms.uSurfaceFlowSpeed.value=v;for(let e=0;e<x.length;e+=1)E.uniforms.uSurfacePalette.value[e].set(x[e])},[e,n,E,s,d,f,p,y,v,x]),(0,t.jsx)("group",{ref:M,position:u,children:(0,t.jsx)("points",{dispose:null,frustumCulled:!1,geometry:D,material:E,onAfterRender:c,renderOrder:m})})}),es=()=>({fieldMotionScale:1,fieldOpacity:1,orbitRadians:0,scale:1}),ec=e=>Math.min(Math.max(e,0),1),eu=e=>e*e*e*(e*(6*e-15)+10),ed=(e,t,i,a)=>{if(a)return 1;let r=e.bodyById[t],o=(Number.isFinite(i)?Math.max(0,i):0)-r.delaySeconds;return 1-(1-(r.fadeDurationSeconds<=0?1:ec(o/r.fadeDurationSeconds)))**3},ef={width:1440,bodies:{sol:{width:522,height:538},terra:{width:256,height:264},luna:{width:91,height:95}}},em={width:390,bodies:{sol:{width:245,height:252},terra:{width:118,height:121},luna:{width:47,height:49}}},ep=e=>({...e,centerX:e.x+e.width/2,centerY:e.y+e.height/2,radius:Math.min(e.width,e.height)/2}),eh=e=>Math.min(Math.max(e,0),1),ey=e=>e*e*(3-2*e),ev={desktop:{luna:[.88,.17],sol:[.137,.526],terra:[.813,.604]},mobile:{luna:[.86,.15],sol:[.242,.27],terra:[.808,.63]}},eg={desktop:{luna:1.16,sol:1,terra:1},mobile:{luna:1.16,sol:1,terra:1}},ex=["sol","terra","luna"],eS=e=>e instanceof Error?e:Error("The ASCII body geometry worker failed to load."),ew={sol:1.15,terra:.9,luna:.72},eb=()=>({angularVelocity:new R.Vector3,position:new R.Vector3,radius:0,rotationActivity:0});function eM(e,t){let i=Math.hypot(...t);0!==i&&(e.rotationAxis.set(...t).multiplyScalar(1/i),e.deltaQuaternion.setFromAxisAngle(e.rotationAxis,i),e.quaternion.premultiply(e.deltaQuaternion).normalize())}let eA=(e,t)=>{let i=e.bodies[t];return new R.Vector3(i.centerX-e.width/2,e.height/2-i.centerY,0)},eF=(0,o.forwardRef)(function({atlasTexture:i,budget:r,darkMode:n,isVisible:l,layout:s,onIntroComplete:u,onReady:m,reducedMotion:M,shaderQualityLevel:F},P){let D=(0,a.useThree)(e=>e.invalidate),E=(0,o.useRef)(Object.fromEntries(c.BODY_IDS.map(e=>[e,{angularVelocity:new R.Vector3(...w(e)),deltaQuaternion:new R.Quaternion,group:null,interactionDirection:new R.Vector3(0,0,1),inverseQuaternion:new R.Quaternion,introOpacity:new R.Uniform(1),motion:{bodyId:e,isDragging:!1,sampledAngularVelocity:f(),excessAngularVelocity:f()},motionStep:{angularVelocity:f(),rotationDelta:f(),deltaSeconds:0},quaternion:new R.Quaternion,rotationAxis:new R.Vector3,surfaceState:{interactionEnergy:0,localInteractionDirection:new R.Vector3(0,0,1),rotationActivity:0},worldPosition:new R.Vector3}]))),I=(0,o.useRef)(null),B=(0,o.useMemo)(()=>new R.Uniform(0),[]),C=(0,o.useMemo)(es,[]),T=(0,o.useMemo)(()=>new R.Vector3(...V.system.orbitAxis).normalize(),[]),O=(0,o.useMemo)(()=>eA(s,"sol"),[s]),W=(0,o.useMemo)(()=>new R.Quaternion,[]),X=(0,o.useMemo)(()=>new R.Vector3,[]),K=(0,o.useMemo)(()=>({luna:E.current.luna.introOpacity,sol:E.current.sol.introOpacity,terra:E.current.terra.introOpacity}),[]),$=(0,o.useRef)(!1),J=(0,o.useRef)(!1),Z=(0,o.useMemo)(()=>new R.Vector3,[]),ee=(0,o.useMemo)(()=>new R.Vector3,[]),et=(0,o.useMemo)(()=>({energy:0,position:new R.Vector3,velocity:new R.Vector3}),[]),ei=(0,o.useMemo)(()=>({energy:0,position:new R.Vector3,velocity:new R.Vector3}),[]),ea=(0,o.useRef)({luna:null,sol:null,terra:null}),er=H(ea.current.sol,r.bodies.sol),en=H(ea.current.terra,r.bodies.terra),ef=H(ea.current.luna,r.bodies.luna);ea.current.sol=er,ea.current.terra=en,ea.current.luna=ef;let em=function(t){let i=`${t.sol}:${t.terra}:${t.luna}`,a=(0,o.useMemo)(()=>({counts:{luna:t.luna,sol:t.sol,terra:t.terra}}),[t.luna,t.sol,t.terra]),[r,n]=(0,o.useState)({error:null,geometry:null,key:null});if((0,o.useEffect)(()=>{let t,r=!0;try{t=e.r(655568)(Worker)}catch(e){n(t=>({error:eS(e),geometry:t.geometry,key:i}));return}let o=()=>{r&&(r=!1,t.terminate())};t.onmessage=e=>{r&&(o(),n({error:null,geometry:e.data.geometry,key:i}))},t.onerror=e=>{r&&(o(),n(t=>({error:eS(e.error),geometry:t.geometry,key:i})))},t.onmessageerror=()=>{r&&(o(),n(e=>({error:Error("The ASCII body geometry worker returned bad data."),geometry:e.geometry,key:i})))};try{t.postMessage(a)}catch(e){o(),n(t=>({error:eS(e),geometry:t.geometry,key:i}))}return o},[i,a]),r.key===i&&r.error)throw r.error;return r.geometry}({luna:ef,sol:er,terra:en}),ep=(0,o.useMemo)(()=>[eb(),eb(),eb()],[]),eh=(0,o.useMemo)(()=>Object.fromEntries(s.visualLayerOrder.map((e,t)=>[e,t])),[s.visualLayerOrder]),ey=(0,o.useMemo)(()=>Math.max(V.system.durationSeconds,...c.BODY_IDS.map(e=>{let t=V.bodyById[e];return t.delaySeconds+t.fadeDurationSeconds})),[]),ev=(0,o.useMemo)(()=>[0,0,4],[]),eg=(0,o.useMemo)(()=>{let e,t;return e=s.bodies.sol,t=s.bodies.terra,Math.atan2(e.centerY-t.centerY,t.centerX-e.centerX)},[s]),ex=(0,o.useMemo)(()=>[s.width,.86*s.height,.22*Math.min(s.width,s.height)],[s.height,s.width]);(0,o.useLayoutEffect)(()=>{c.BODY_IDS.forEach((e,t)=>{let i=ep[t];i.position.copy(eA(s,e)),i.radius=s.bodies[e].radius})},[ep,s]),(0,o.useEffect)(()=>{M&&(B.value=Math.max(B.value,ey),$.current||($.current=!0,u()))},[ey,u,M,B]),(0,o.useImperativeHandle)(P,()=>({startDrag(e){let t=E.current[e];t.motion={...t.motion,isDragging:!0,sampledAngularVelocity:f(),excessAngularVelocity:f()},t.angularVelocity.set(0,0,0)},dragBy(e,t,i,a){let r,o=E.current[e];if(!o.motion.isDragging)return;let n=Math.max(G(a),1/240),l=S(e,t,i,.006);eM(o,l),Z.set(...l).multiplyScalar(1/n);let s=o.motion.sampledAngularVelocity,c=L(29,n),u=[s[0]*(1-c)+Z.x*c,s[1]*(1-c)+Z.y*c,s[2]*(1-c)+Z.z*c];r=o.motion,o.motion={...r,sampledAngularVelocity:x(r.bodyId,u)},o.angularVelocity.set(...o.motion.sampledAngularVelocity),o.group?.quaternion.copy(o.quaternion)},endDrag(e,t=!1){let i=E.current[e];i.motion=b(i.motion,{reducedMotion:M||t})},tapBody(e,t,i){let a,r,o,n,l,c,u,m,b=E.current[e];if(b.motion.isDragging)return;let F=Number.isFinite(t)?Math.min(Math.max(t,-1),1):0,P=Number.isFinite(i)?Math.min(Math.max(i,-1),1):0;if(b.motion=((e,t,{maxAngularSpeed:i=d}={})=>{let a=w(e.bodyId),r=e.isDragging?x(e.bodyId,e.sampledAngularVelocity):v(a,e.excessAngularVelocity),o=t.map(e=>Number.isFinite(e)?e:0),n=Number.isFinite(i)?Math.max(0,i):d,l=g(x(e.bodyId,v(r,o)),n);return{...e,isDragging:!1,sampledAngularVelocity:f(),excessAngularVelocity:y(l,a)}})(b.motion,(n=Math.min(o=Math.hypot(a=Number.isFinite(F)?F:0,r=Number.isFinite(P)?P:0),1),o>1&&(a/=o,r/=o),l=S(e,a,r,1),c=(1-Math.min(n/.14,1))**2,u=v(l,h(p[e],c)),m=1/Math.max(n+c,1e-4),h(u,(1.05+.75*n)*m))),A(b.motion,0,M,b.motionStep),b.angularVelocity.set(...b.motionStep.angularVelocity),!M){let t=s.bodies[e],i=et.energy<.001&&ei.energy<.001;ei.position.set(t.centerX+F*t.radius-s.width/2,s.height/2-(t.centerY+P*t.radius),0),ei.velocity.set(0,0,0),ee.set(0,0,0),ei.energy=1,i&&(et.position.copy(ei.position),et.velocity.set(0,0,0))}},stirField(e,t,i,a,r,o){var n,l;if(!Number.isFinite(e)||!Number.isFinite(t)||!Number.isFinite(i)||!Number.isFinite(a)||!Number.isFinite(r)||M)return;let c=et.energy<.001&&ei.energy<.001;ei.position.set(e-s.width/2,s.height/2-t,0);let u=Math.max(G(r),1/240);o?ei.velocity.set(0,0,0):(ee.set(i,-a,0).multiplyScalar(.55/u).clampLength(0,1.5*Math.min(s.width,s.height)),ei.velocity.lerp(ee,L(4.5,u)));let d=(n=Math.hypot(i,a),l=u,Number.isFinite(n)&&Number.isFinite(.68)?Math.min(.68,.18+7e-4*(Math.max(n,0)/Math.max(G(l),1/240))):0);o?ei.energy=1:d>ei.energy&&(ei.energy+=(d-ei.energy)*L(7,u)),c&&(et.position.copy(ei.position),et.velocity.set(0,0,0))}}),[et,ei,ee,s.bodies,s.height,s.width,M,Z]),(0,o.useEffect)(()=>{if(M){for(let e of(et.energy=0,et.velocity.set(0,0,0),ei.energy=0,ei.velocity.set(0,0,0),c.BODY_IDS)){let t=E.current[e];t.motion=b(t.motion,{reducedMotion:!0}),t.angularVelocity.set(0,0,0)}for(let e of(D(),ep))e.angularVelocity.set(0,0,0),e.rotationActivity=0}},[ep,et,ei,D,M]);let eF=(0,o.useCallback)(()=>{J.current||(J.current=!0,m())},[m]);(0,z.useFrame)((e,t)=>{let i;if(!l||!em)return;let a=G(t);M||(B.value+=a);let r=M?1:L(1.8,a),o=M?1:L(1.4,a),n=M?1:L(3,a);et.position.lerp(ei.position,r),et.velocity.lerp(ei.velocity,o),et.energy+=(ei.energy-et.energy)*n,ei.energy=U(ei.energy,.55,a),ei.velocity.multiplyScalar(U(1,.75,a)),et.energy<.001&&(et.energy=0);let d=M?1:L(1.8,a);!$.current&&B.value>=ey&&($.current=!0,u()),((e,t,i,a,r)=>{let o=e.system;if(a)return r.fieldMotionScale=1,r.fieldOpacity=1,r.orbitRadians=0,r.scale=1;let n=Number.isFinite(i)?Math.max(0,i):0,l=eu(o.durationSeconds<=0?1:ec(n/o.durationSeconds)),s=o.durationSeconds*o.fieldFadePortion,c=s<=0?1:ec((n-o.fieldFadeDelaySeconds)/s);return r.fieldMotionScale=o.fieldStartMotionScale+(1-o.fieldStartMotionScale)*l,r.fieldOpacity=eu(c),r.orbitRadians=o.startOrbitRadiansBySceneSize[t]*(1-l),r.scale=o.startScale+(1-o.startScale)*l})(V,s.sceneSize,B.value,M,C),W.setFromAxisAngle(T,C.orbitRadians*("rtl"===s.direction?-1:1)),i=C.scale,X.copy(O).multiplyScalar(i).applyQuaternion(W).multiplyScalar(-1).add(O),I.current?.position.copy(X),I.current?.quaternion.copy(W),I.current?.scale.setScalar(C.scale);for(let e=0;e<c.BODY_IDS.length;e+=1){let i=c.BODY_IDS[e];if(!i)continue;let r=E.current[i],o=s.bodies[i],n=ed(V,i,B.value,M),l=A(r.motion,t,M,r.motionStep);r.motion.isDragging||(eM(r,l.rotationDelta),r.angularVelocity.set(...l.angularVelocity)),r.worldPosition.set(o.centerX-s.width/2,s.height/2-o.centerY,0),r.introOpacity.value=n,r.group?.quaternion.copy(r.quaternion);let u=ep[e];if(!u)continue;u.position.copy(r.worldPosition),u.radius=o.radius,u.angularVelocity.lerp(r.angularVelocity,d),u.rotationActivity=M?0:Y(r.motion.isDragging,r.motion.excessAngularVelocity,ew[i]);let f=r.surfaceState,m=r.interactionDirection.copy(et.position).sub(u.position),p=Math.hypot(m.x,m.y),h=Math.max(u.radius,1e-4),y=m.x/h,v=m.y/h,g=y*y+v*v;g>=1?r.interactionDirection.set(y,v,0).normalize():r.interactionDirection.set(y,v,Math.sqrt(1-g)),r.inverseQuaternion.copy(r.quaternion).invert(),f.localInteractionDirection.copy(r.interactionDirection).applyQuaternion(r.inverseQuaternion).normalize();let x=Math.exp(-Math.max(p-u.radius,0)/Math.max(.9*u.radius,1)),S=M?0:et.energy*x,w=S>f.interactionEnergy?4:2.4;f.interactionEnergy+=(S-f.interactionEnergy)*L(w,a);let b=M?0:u.rotationActivity,F=b>f.rotationActivity?6:3.4;f.rotationActivity+=(b-f.rotationActivity)*L(F,a)}},-3);let eP="mobile"===s.sceneSize,eD=n?"dark":"light",eE=k[eD];return em?(0,t.jsxs)("group",{ref:I,children:[c.BODY_IDS.map(e=>{var a,r;let o,n,l=c.BODY_CONFIGS[e],u=s.bodies[e],d=eA(s,e),f=eh[e],m=V.bodyById[e],p=E.current[e],h=(a=Q(u.radius,q(s.width)),r=em[e].count,o=Number.isFinite(a)?Math.max(0,a):0,n=Number.isFinite(r)?Math.max(0,r):0,0===o||0===n||n>=o?1:Math.min(Math.sqrt(o/n),1.28));return(0,t.jsx)(el,{ref:t=>{E.current[e].group=t},atlasTexture:i,bodyId:e,geometryData:em[e],glyphSize:(0,c.getBodyGlyphSize)(e,s.width)*N.glyphScaleByBody[e]*h,introOpacityUniform:p.introOpacity,onAfterRender:"sol"===e?eF:void 0,opacity:N.opacityByTheme[eD][e],position:[d.x,d.y,d.z],radius:u.radius,reducedMotion:M,renderOrder:f,revealTimeOffset:m.revealOffsetSeconds,shaderQualityLevel:F,surfaceFlowElevationAmplitude:l.surfaceFlowElevationAmplitude,surfaceFlowSpeed:l.surfaceFlowSpeed,surfaceInteractionResponse:j.interactionResponseByBody[e],surfacePalette:j.paletteByTheme[eD][e],surfaceRotationResponse:j.rotationResponseByBody[e],surfaceState:p.surfaceState,timeUniform:B},e)}),(0,t.jsx)(eo,{accentColor:eE.atmosphereAccent,atlasTexture:i,bodies:ep,color:eE.atmosphere,count:r.emissions,emissionPulseLifetimeSeconds:_.emissionPulseLifetimeSeconds,glyphSize:_.glyphSizeBySceneSize[eP?"mobile":"desktop"],interaction:et,introMotion:C,introOpacityByBody:K,isVisible:l,opacity:_.opacity,reducedMotion:M,solRotationEmissionVelocityMultiplier:_.solRotationEmissionVelocityMultiplier,systemAxisAngle:eg,volumeCenter:ev,volumeSize:ex})]}):null}),eP={luna:{extent:2,stops:[[1,1],[1.14,2.5],[1.4,1.3],[1.8,.3],[2,0]]},sol:{extent:3.8,stops:[[1,2.5],[1.08,6.2],[1.35,4],[2,1.2],[3,.35],[3.8,0]]},terra:{extent:2.7,stops:[[1,2.2],[1.12,5.6],[1.35,3],[2,.45],[2.7,0]]}};var eD=e.i(569976),eE=e.i(49585);function eI(){let{advance:e,clock:t,frameloop:i,gl:r,invalidate:n}=(0,a.useThree)();return(0,o.useEffect)(()=>{let a=r.domElement,o=null,l=()=>{null!==o&&window.cancelAnimationFrame(o),o=window.requestAnimationFrame(()=>{o=null,"never"===i?e(t.elapsedTime,!1):n()})};return a.addEventListener("webglcontextrestored",l),()=>{a.removeEventListener("webglcontextrestored",l),null!==o&&window.cancelAnimationFrame(o)}},[e,t,i,r,n]),null}function eB(){let{colorSchemeDark:e,reducedMotion:a}=(0,n.useDeviceInfo)(),{status:u}=(0,l.useGpuPerformance)(),d=(0,l.useRendererProfile)(),f=function(){let[e,t]=(0,o.useState)(null);return(0,o.useEffect)(()=>{let e;try{e=function(){let e=document.createElement("canvas");e.width=128*c.ASCII_GLYPHS.length,e.height=128;let t=e.getContext("2d");if(!t)throw Error("Unable to create a 2D context for the ASCII glyph atlas");t.clearRect(0,0,e.width,e.height),t.fillStyle="#fff",t.font="500 92px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",t.textAlign="center",t.textBaseline="middle",c.ASCII_GLYPHS.forEach((e,i)=>{t.fillText(e,128*i+64,66)});let i=new R.CanvasTexture(e);return i.colorSpace=R.NoColorSpace,i.generateMipmaps=!0,i.magFilter=R.LinearFilter,i.minFilter=R.LinearMipmapLinearFilter,i.wrapS=R.ClampToEdgeWrapping,i.wrapT=R.ClampToEdgeWrapping,i.needsUpdate=!0,i}()}catch{t(null);return}return t(e),()=>{e.dispose()}},[]),e}(),{isVisible:m,ref:p}=function(){let[e,t]=(0,eE.default)({rootMargin:"120px",threshold:.01}),i=(0,eD.usePageVisibility)();return{isVisible:e&&i,ref:t}}(),[h,y]=(0,o.useState)(null),[v,g]=(0,o.useState)("ltr"),[x,S]=(0,o.useState)(null),[w,b]=(0,o.useState)(!1),[M,A]=(0,o.useState)(!1),[F,P]=(0,o.useState)(!1),D=(0,o.useRef)(!1),I=function(e){let[t,i]=(0,o.useState)({height:0,width:0});return(0,o.useEffect)(()=>{if(!e)return;let t=()=>{let t=e.getBoundingClientRect(),a={height:Math.round(t.height),width:Math.round(t.width)};i(e=>e.height===a.height&&e.width===a.width?e:a)};if(t(),"u"<typeof ResizeObserver)return;let a=new ResizeObserver(t);return a.observe(e),()=>{a.disconnect()}},[e]),t}(h),B=(0,o.useMemo)(()=>(({width:e,height:t,direction:i="ltr"})=>{let a=Number.isFinite(e)?Math.max(0,e):0,r=Number.isFinite(t)?Math.max(0,t):0,o=a<=767?"mobile":"desktop",n=Object.fromEntries(c.BODY_IDS.map(e=>{let{height:t,width:i}=((e,t,i)=>{let a="mobile"===t?em:ef,r=a.bodies[e],o=Math.min(1,i/a.width),n=eg[t][e];if("desktop"===t||i<=em.width)return{height:r.height*o*n,width:r.width*o*n};let l=ey(eh((i-em.width)/(767-em.width))),s=ef.bodies[e],c=768/ef.width,u=eg.desktop[e],d=s.width*c*u,f=s.height*c*u,m=r.width*n,p=r.height*n;return{height:p+(f-p)*l,width:m+(d-m)*l}})(e,o,a),[n,l]=((e,t,i)=>{let a=ev[t][e];if("mobile"===t)return a;let r=ev.mobile[e],o=ey(eh((i-767)/(ef.width-767)));return[r[0]+(a[0]-r[0])*o,r[1]+(a[1]-r[1])*o]})(e,o,a);return[e,ep({x:n*a-i/2,y:l*r-t/2,width:i,height:t})]}));return{direction:i,width:a,height:r,sceneSize:o,visualLayerOrder:ex,bodies:"rtl"===i?Object.fromEntries(c.BODY_IDS.map(e=>{let t;return[e,(t=n[e],ep({...t,x:a-t.x-t.width}))]})):n}})({direction:v,height:I.height,width:I.width}),[v,I.height,I.width]),T=(0,o.useMemo)(()=>{var e;let t,i,a,r,o,n,l,s,u,f;return e=d.getMaxParticleCount(),t=$(B),i=Number.isFinite(e)?Math.max(0,Math.floor(e)):0,r=Math.min(a=Math.min(t.total,i),t.emissions),u=Math.round(Object.values(t.bodies).reduce((e,t)=>e+t,0)*(o=Number.isFinite(i)?Math.max(0,Math.floor(i)):0,l=Object.values((n=$(X)).bodies).reduce((e,t)=>e+t,0),s=Math.max(0,o-n.emissions),0===l?0:Math.min(1,s/l))),{bodies:f=((e,t)=>{let i=e.reduce((e,t)=>e+t.count,0),a=Math.min(i,Math.max(0,Math.floor(t)));if(a===i)return Object.fromEntries(e.map(({key:e,count:t})=>[e,t]));if(0===i)return Object.fromEntries(e.map(({key:e})=>[e,0]));let r=e.map(({key:e,count:t},r)=>{let o=t/i*a;return{key:e,count:Math.floor(o),remainder:o-Math.floor(o),index:r}}),o=a-r.reduce((e,t)=>e+t.count,0);return r.slice().sort((e,t)=>t.remainder-e.remainder||e.index-t.index).forEach(e=>{if(o<=0)return;let t=r[e.index];t&&(t.count+=1,o-=1)}),Object.fromEntries(r.map(({key:e,count:t})=>[e,t]))})(c.BODY_IDS.map(e=>({key:e,count:t.bodies[e]})),Math.min(a-r,u)),emissions:r,total:Object.values(f).reduce((e,t)=>e+t,0)+r}},[B,d]),z=(0,o.useMemo)(()=>{let t,i,a,r;return i=k[t=e?"dark":"light"],a=j.tintByTheme[t],r={luna:[i.luna,i.luna],sol:e?["#fff0c9","#f3a343"]:["#d9ad5c","#c78932"],terra:[i.terra,i.terra]},B.visualLayerOrder.slice().reverse().map(e=>{let t=B.bodies[e],i=eP[e],[o,n]=r[e],l=a[e],s=e=>`${e/i.extent*100}%`,c=(e,t)=>`color-mix(in srgb, ${l.color} ${e}%, var(--color-background)) ${s(t)}`,u=[c(100*l.opacity,0),c(100*l.opacity,.72),c(92*l.opacity,.88),c(45*l.opacity,.96)],d=i.stops.map(([e,t])=>{var i;let a;return i=e<=1.2?o:n,a=0===t?"transparent":`color-mix(in srgb, ${i} ${t}%, transparent)`,`${a} ${s(e)}`});return`radial-gradient(circle ${t.radius*i.extent}px at ${t.centerX}px ${t.centerY}px, ${u.join(", ")}, ${d.join(", ")})`}).join(", ")},[e,B]),N="ready"===u&&d.canUseWebGL()&&null!==f&&I.width>0&&I.height>0&&!F,V=`${d.tier}:${d.getShaderQualityLevel()}`,_=m&&d.shouldUseContinuousMotion(),G=(0,o.useCallback)(e=>{p.current=e,y(e)},[p]);(0,o.useEffect)(()=>{let e=()=>{(()=>{if("complete"!==document.readyState)return;let e=window.__next_f;if(!Array.isArray(e)||0!==e.length||!Object.hasOwn(e,"push")||"function"!=typeof e.push||e.push===Array.prototype.push)return;let t=0;return Array.from(document.scripts).forEach(e=>{let i;if(e.src||e.type)return;let a=e.textContent;a&&((i=a.trimStart()).startsWith("self.__next_f.push(")||i.startsWith("(self.__next_f=self.__next_f||[]).push("))&&(e.textContent="",t+=1)})})()};return"complete"===document.readyState?void e():(window.addEventListener("load",e,{once:!0}),()=>window.removeEventListener("load",e))},[]);let L=(0,o.useCallback)(()=>{D.current=!0,P(!0),A(!1),b(!1),S(null)},[]),U=(0,o.useCallback)(()=>{D.current||A(!0)},[]),Y=(0,o.useCallback)(()=>{D.current||b(!0)},[]);return(0,o.useEffect)(()=>{h&&g("rtl"===window.getComputedStyle(h).direction?"rtl":"ltr")},[h]),(0,o.useEffect)(()=>{D.current&&(D.current=!1,P(!1),A(!1),b(!1),S(null))},[V]),(0,t.jsxs)("div",{ref:G,"aria-hidden":"true",className:s.default.scene,"data-ascii-3d-hero":!0,"data-atlas-ready":f?"true":"false","data-gpu-status":u,"data-gpu-tier":d.tier,"data-intro-complete":w?"true":"false","data-renderer":N?"webgl":"none","data-scene-ready":M?"true":"false",children:[(0,t.jsx)("div",{className:s.default.artwork,children:N?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:(0,r.clsx)(s.default.atmosphericBackdrop,{[s.default.atmosphericBackdropVisible]:M&&w,[s.default.atmosphericBackdropReducedMotion]:a}),"data-atmospheric-backdrop":!0,"data-visible":M&&w?"true":"false",style:{backgroundImage:z}}),(0,t.jsx)(O,{fallback:null,onError:L,resetKey:V,children:(0,t.jsx)("div",{className:s.default.canvasLayer,children:(0,t.jsxs)(i.Canvas,{orthographic:!0,camera:{far:1600,near:.1,position:[0,0,800],zoom:1},dpr:d.getDpr(),frameloop:_?"never":"demand",gl:{alpha:!0,antialias:d.getAntialias(),depth:!1,powerPreference:"high-performance",stencil:!1},onCreated:({gl:e})=>{e.setClearColor(0,0),e.debug.checkShaderErrors=!0,e.debug.onShaderError=(e,t,i,a)=>{console.error("SolAscii3DHeroBackdrop shader failed to compile or link.",{fragment:e.getShaderInfoLog(a),program:e.getProgramInfoLog(t),vertex:e.getShaderInfoLog(i)}),L()}},children:[(0,t.jsx)(eI,{}),(0,t.jsx)(C,{}),(0,t.jsx)(eF,{ref:S,atlasTexture:f,budget:T,darkMode:e,isVisible:m,layout:B,onIntroComplete:Y,onReady:U,reducedMotion:a,shaderQualityLevel:d.getShaderQualityLevel()})]})})})]}):null}),N&&M&&w&&m&&!a?(0,t.jsx)(E,{controller:x,layout:B}):null]})}e.s(["default",0,function(){return(0,t.jsx)(l.GpuPerformanceProvider,{children:(0,t.jsx)(eB,{})})}],877475)},540181,e=>{"use strict";let t={sol:{seed:43,axialTiltDegrees:7.25,surfaceFlowElevationAmplitude:.016/.06,surfaceFlowSpeed:.07,baselineSpinRadiansPerSecond:.018},terra:{seed:131,axialTiltDegrees:23.44,surfaceFlowElevationAmplitude:0,surfaceFlowSpeed:0,baselineSpinRadiansPerSecond:.026},luna:{seed:269,axialTiltDegrees:6.68,surfaceFlowElevationAmplitude:0,surfaceFlowSpeed:0,baselineSpinRadiansPerSecond:.038}},i={sol:15.1,terra:14.4,luna:13.5},a=1440,r=(e=a)=>{let t=Number.isFinite(e)?Math.max(0,e):a;if(t<=390)return t/390*.8;let i=Math.min(Math.max((t-767)/(a-767),0),1);return .8+i*i*(3-2*i)*.19999999999999996},o=Math.PI*(3-Math.sqrt(5)),n={sol:.1876,terra:.192,luna:.198},l=(e,t,i)=>e+(t-e)*i,s=e=>e*e*(3-2*e),c=([e,t,i])=>{let a=Math.hypot(e,t,i);return a>0?[e/a,t/a,i/a]:[0,0,1]},u=(e,t,i,a)=>{let r=Math.imul(e,0x165667b1);return r^=Math.imul(t,0x27d4eb2f),r^=Math.imul(i,0x7fffffff),r^=Math.imul(a,0x4bf19f61),(((r=Math.imul(r^r>>>13,0x4bf19f61))^r>>>16)>>>0)/0xffffffff},d=(e,t,i,a)=>{let r=Math.floor(e),o=Math.floor(t),n=Math.floor(i),c=s(e-r),d=s(t-o),f=s(i-n),m=(e,t,i)=>2*u(r+e,o+t,n+i,a)-1,p=m(0,0,0),h=m(1,0,0),y=m(0,1,0),v=m(1,1,0),g=m(0,0,1),x=m(1,0,1),S=m(0,1,1),w=m(1,1,1),b=l(p,h,c),M=l(y,v,c),A=l(g,x,c),F=l(S,w,c),P=l(b,M,d),D=l(A,F,d);return l(P,D,f)},f=(e,t,i,a,r)=>r+d(e[0]*t,e[1]*t,e[2]*t,i)*a,m=e=>Math.tanh(1.28*e),p=[{center:c([.31,.54,.78]),depth:.62,rimDistance:.1},{center:c([-.72,.19,.66]),depth:.5,rimDistance:.14},{center:c([.58,-.7,.41]),depth:.56,rimDistance:.12},{center:c([-.15,-.83,.54]),depth:.42,rimDistance:.085},{center:c([.86,.38,-.34]),depth:.47,rimDistance:.17},{center:c([-.48,.7,-.52]),depth:.38,rimDistance:.075}],h=(e,i)=>{let a=t[i].seed;if("sol"===i){let t;return t=0,t=f(e,1.15,a,.52,0),t=f(e,2.55,a+101,.31,t),m(t=f(e,5,a+307,.17,t))}if("terra"===i){let t,i;return t=0,t=f(e,1.05,a,.55,0),t=f(e,2.4,a+101,.23,t),m(t+=.22*((i=Math.max(0,1-Math.abs(d(7.2*e[0],7.2*e[1],7.2*e[2],a+977))))*i*i*1.8-.75))}let r=0;for(let{center:t,depth:i,rimDistance:o}of(r=f(e,1.4,a,.22,0),r=f(e,4.2,a+101,.1,r),p)){let a=Math.max(0,1-(e[0]*t[0]+e[1]*t[1]+e[2]*t[2]))/o,n=Math.exp(-a*a*2.4),l=a-1;r+=i*(-n+.58*Math.exp(-(l*l)/(.34*.34)))}return m(r)},y=e=>{let t=Math.min(Math.max(e,-1),1);return Math.sign(t)*Math.pow(Math.abs(t),.62)},v=e=>l(.04,.3,(y(e)+1)/2),g=(e,t,i,a)=>{if(i)return 1;let r=l(.08,.92,(y(a)+1)/2);return 2*(u(e,t,29,t+947)<r)};e.s(["ASCII_GLYPHS",0,["5",".","6"],"BODY_CONFIGS",0,t,"BODY_IDS",0,["sol","terra","luna"],"GLYPH_REVEAL_FADE_SECONDS",0,.32,"createBodyGlyphGeometryData",0,(e,i)=>{let a=t[e],r=Number.isFinite(i)?Math.max(0,Math.floor(i)):0,l=u(a.seed,23,59,a.seed)*Math.PI*2,s=new Float32Array(r),c=new Float32Array(r),d=new Float32Array(r),f=new Float32Array(3*r),m=new Float64Array(r),p=new Float64Array(3*r),y=[0,0,1];for(let t=0;t<r;t+=1){let i=1-2*(t+.5)/r,n=Math.sqrt(Math.max(0,1-i*i)),c=t*o+l;y[0]=Math.cos(c)*n,y[1]=i,y[2]=Math.sin(c)*n;let v=h(y,e),g=3*t;p.set(y,g),m[t]=v,f.set(y,g),s[t]=v,d[t]=.48*u(t,a.seed,71,a.seed+1009)}let x=((e,t,i,a)=>{let r=t.length,n=new Uint8Array(r),l=Math.min(r,Math.round(r*a));if(0===l)return n;let s=Math.sqrt(4*Math.PI/r),c=1.255*s,d=c*c,f=Math.max(1,Math.ceil(2/c)),m=new Int32Array(f**3),p=new Int32Array(l),h=new Int32Array(l);m.fill(-1),h.fill(-1);let y=e=>Math.min(f-1,Math.max(0,Math.floor((e+1)*f/2))),g=(e,t,i)=>e+f*(t+f*i),x=t=>{let i=3*t,a=e[i]??0,r=e[i+1]??0,o=e[i+2]??0,n=y(a),l=y(r),s=y(o),c=1/0;for(let t=-1;t<=1;t+=1){let i=s+t;if(!(i<0)&&!(i>=f))for(let t=-1;t<=1;t+=1){let s=l+t;if(!(s<0)&&!(s>=f))for(let t=-1;t<=1;t+=1){let l=n+t;if(l<0||l>=f)continue;let u=m[g(l,s,i)]??-1;for(;u>=0;){let t=3*(p[u]??-1),i=(e[t]??0)-a,n=(e[t+1]??0)-r,l=(e[t+2]??0)-o;c=Math.min(c,i*i+n*n+l*l),u=h[u]??-1}}}}return c},S=Math.max(8,Math.ceil(Math.sqrt(r))),w=u(i,23,59,i)*Math.PI*2,b=new Int32Array(12),M=new Float64Array(b.length);for(let a=0;a<l;a+=1){let c=1-2*(a+.5)/l,f=Math.sqrt(Math.max(0,1-c*c)),A=a*o+w,F=Math.cos(A)*f,P=Math.sin(A)*f,D=Math.round((1-c)*r/2-.5),E=Math.max(0,D-S),I=Math.min(r,D+S+1);b.fill(-1),M.fill(1/0);for(let a=E;a<I;a+=1){if(n[a])continue;let r=(v(t[a]??0)-.04)/.26,o=3*a,l=(e[o]??0)-F,d=(e[o+1]??0)-c,f=(e[o+2]??0)-P,m=l*l+d*d+f*f;if(m>s*s*2.25)continue;let p=m-r*s*s*9.5+u(a,i,83,i+1333)*s*s*.035;if(p>=(M[M.length-1]??1/0))continue;let h=M.length-1;for(;h>0&&p<(M[h-1]??p);)M[h]=M[h-1]??1/0,b[h]=b[h-1]??-1,h-=1;M[h]=p,b[h]=a}let B=-1,C=1/0,R=-1/0;for(let e=0;e<b.length;e+=1){let t=b[e]??-1;if(t<0)continue;let i=M[e]??1/0,a=x(t),r=a>=d,o=R>=d;if((r&&!o||r&&o&&(i<C-1e-9||1e-9>=Math.abs(i-C)&&a>R)||!r&&!o&&(a>R+1e-9||1e-9>=Math.abs(a-R)&&i<C))&&(B=t,C=i,R=a),r)break}if(B<0)continue;n[B]=1,p[a]=B;let T=3*B,O=g(y(e[T]??0),y(e[T+1]??0),y(e[T+2]??0));h[a]=m[O]??-1,m[O]=a}return n})(p,m,a.seed,n[e]);for(let e=0;e<r;e+=1)c[e]=g(e,a.seed,1===x[e],m[e]??0);return{count:r,elevations:s,glyphIndices:c,revealDelays:d,surfaceNormals:f}},"getBodyGlyphSize",0,(e,t=a)=>i[e]*r(t),"getSurfaceGlyphScale",0,r])},510914,e=>{"use strict";e.s(["default",0,function(t,i){return(a,r)=>(function(t,i,a,r){let o="SharedWorker"===t.name,n=e.b,l=[a.map(t=>e.h("string"==typeof t?t:t.path,n)).reverse(),e.X,n],s=["NEXT_DEPLOYMENT_ID","NEXT_CLIENT_ASSET_SUFFIX"];for(let e=0;e<s.length;e++)l.push(globalThis[s[e]]);let c=new URL(e.h(i,n),location.origin),u=JSON.stringify(l);return o?c.searchParams.set("params",u):c.hash="#params="+encodeURIComponent(u),new t(c,r?{...r,type:void 0}:void 0)})(a,t,i,r)}])},655568,e=>{e.v(e.r(510914).default("static/immutable/chunks/turbopack-worker-2g80pj3ycf14_.js",["static/immutable/chunks/3mu9-0fjjgrfi.js","static/immutable/chunks/turbopack-0gfampnifec3f.js"]))}]);