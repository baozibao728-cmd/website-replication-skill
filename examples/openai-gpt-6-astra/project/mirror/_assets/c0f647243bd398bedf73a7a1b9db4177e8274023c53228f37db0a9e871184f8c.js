(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,702794,e=>{"use strict";var t=e.i(724225),r=e.i(378939),a=e.i(218547),o=e.i(939951),l=e.i(7284),n=e.i(741821),i=e.i(695418),s=e.i(552297),c=e.i(215453),u=e.i(899457);let d=[.18,0,-.18],f=i.MathUtils.degToRad(12.5),p=[[-.5,.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]],g=p.slice(0,-1).map((e,t)=>{let r=p[t+1],a=Math.hypot(r[0]-e[0],r[1]-e[1],r[2]-e[2]);return{end:r,length:a,start:e}}),m=g.reduce((e,t)=>e+t.length,0),h={accent:"#ff9365",accentEdgeColorFloor:0,accentEdgeOpacityFloor:.28,accentEdgeRailRadius:0,edge:"#111111",edgeOpacity:.84,edgeRailRadius:0,fillTransparent:!0,faceGlowEdgeWidth:.18,faceGlowOpacityScale:1,faceGlowVariant:0,fill:"#ffffff",glowBlendMode:i.AdditiveBlending,glowAccent:"#ff9365",glowBase:"#000000",glowOpacityScale:1,glowShadowMix:0,platform:"#707070"},y=(e,t,r)=>e.getPropertyValue(t).trim()||r,w=e=>{let t=e.match(/^#([\da-fA-F]{3,4})$/);if(t){let[e,r,a]=t[1];return`#${e}${e}${r}${r}${a}${a}`}let r=e.match(/^#([\da-fA-F]{8})$/);return r?`#${r[1].slice(0,6)}`:e},v=[{id:"n-01",grid:[-2,0,0],entry:"left",delayMs:0,entryOffset:[-.55,.18,.3]},{id:"n-02",grid:[-1,0,-1],entry:"left",delayMs:110,entryOffset:[-.2,.06,-.18]},{id:"n-03",grid:[-1,0,0],entry:"left",delayMs:220,entryOffset:[-.38,.14,.12]},{id:"n-04",grid:[-1,0,1],entry:"left",delayMs:330,entryOffset:[-.1,.02,.42]},{id:"n-05",grid:[0,0,-2],entry:"top",delayMs:70,entryOffset:[-.24,.22,-.26]},{id:"n-06",grid:[0,0,-1],entry:"top",delayMs:180},{id:"n-07",grid:[0,0,0],entry:"top",delayMs:290},{id:"n-08",grid:[0,0,1],entry:"top",delayMs:400,entryOffset:[.16,.2,.28]},{id:"n-09",grid:[1,0,-2],entry:"right",delayMs:140,entryOffset:[.26,.08,-.3]},{id:"n-10",grid:[1,0,-1],entry:"right",delayMs:250},{id:"n-11",grid:[1,0,0],entry:"right",delayMs:360,entryOffset:[.22,.06,.18]},{id:"n-12",grid:[1,0,1],entry:"right",delayMs:470,entryOffset:[.42,.16,.28]},{id:"n-13",grid:[2,0,-2],entry:"right",delayMs:210,entryOffset:[.58,.18,-.14]},{id:"n-14",grid:[2,0,-1],entry:"right",delayMs:320,entryOffset:[.46,.12,.02]},{id:"n-15",grid:[2,0,0],entry:"right",delayMs:430,entryOffset:[.6,.2,.24]},{id:"n-16",grid:[-1,1,-1],entry:"top",delayMs:560},{id:"n-17",grid:[0,1,-1],entry:"top",delayMs:670,accent:!0,glowPattern:"counter-clockwise",glowPhaseOffset:.72,glowSpeedMultiplier:.82},{id:"n-18",grid:[0,1,-2],entry:"top",delayMs:780},{id:"n-19",grid:[1,1,-2],entry:"right",delayMs:890},{id:"n-20",grid:[-1,2,-2],entry:"top",delayMs:1040},{id:"n-21",grid:[0,2,-2],entry:"top",delayMs:1150},{id:"a-01",grid:[0,1,0],entry:"top",delayMs:1260,accent:!0,glowPattern:"clockwise",glowPhaseOffset:.64,glowSpeedMultiplier:1.08},{id:"a-02",grid:[1,1,-1],entry:"top",delayMs:1370,accent:!0,glowPattern:"counter-clockwise",glowPhaseOffset:1.2,glowSpeedMultiplier:.94},{id:"a-03",grid:[0,2,-1],entry:"top",delayMs:1480,accent:!0,leadAccent:!0,glowPattern:"pulse-drift",glowPhaseOffset:2.1,glowSpeedMultiplier:1.18}].map(e=>{let t=(([e,t,r])=>[+e,+t,(r+.5)*1])(e.grid);return{...e,entryPosition:((e,t,r=[0,0,0])=>{let[a,o,l]=e,[n,i,s]=r;return"left"===t?[a-15+n,o+.22+i,l-.12+s]:"right"===t?[a+15+n,o+.18+i,l+.12+s]:[a+n,o+14+i,l-.08+s]})(t,e.entry,e.entryOffset),targetPosition:t}}),M=e=>{let t=(e-Math.floor(e))*m;for(let e of g){if(t<=e.length){let r=0===e.length?0:t/e.length;return[i.MathUtils.lerp(e.start[0],e.end[0],r),i.MathUtils.lerp(e.start[1],e.end[1],r),i.MathUtils.lerp(e.start[2],e.end[2],r)]}t-=e.length}return p[0]},x=(e,t,r=0)=>"pulse-drift"===t?e+.075*Math.sin(r/540):e*("counter-clockwise"===t?-1:1),A=`
  varying vec3 vLocalPosition;

  void main() {
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,C=`
  uniform vec3 uAccentColor;
  uniform vec3 uGlowBaseColor;
  uniform float uIntensity;
  uniform float uOpacity;
  uniform float uShadowMix;
  uniform float uPatternBias;
  uniform float uTravel;

  varying vec3 vLocalPosition;

  const float PI = 3.14159265359;
  const float TAU = 6.28318530718;

  void main() {
    float angle = atan(vLocalPosition.z, vLocalPosition.x);
    float orbit = fract((angle + PI) / TAU);
    float travel = fract(uTravel + sin((orbit + uTravel) * TAU) * uPatternBias);
    float wrappedDistance = abs(orbit - travel);
    wrappedDistance = min(wrappedDistance, 1.0 - wrappedDistance);

    float sweep = 1.0 - smoothstep(0.0, 2.4, wrappedDistance);
    float hotCore = 1.0 - smoothstep(0.0, 0.34, wrappedDistance);
    float pulseBand = 0.5 + 0.5 * sin((orbit * 7.0 - travel * 4.5) * TAU);
    float ember = 0.64 + hotCore * 0.42 + pulseBand * 0.34;
    float verticalLift = 0.84 + 0.16 * clamp(vLocalPosition.y + 0.5, 0.0, 1.0);
    float glow = 0.12 + sweep * 0.72 + hotCore * 0.32;
    float alpha = uOpacity * glow * ember * verticalLift;
    vec3 accentColor =
      uAccentColor * (0.82 + sweep * 0.62 + hotCore * 0.68) * uIntensity;
    vec3 color = mix(
      accentColor,
      mix(uGlowBaseColor, accentColor, hotCore),
      uShadowMix
    );

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
  }
`,P=`
  uniform vec3 uAccentColor;
  uniform vec3 uGlowBaseColor;
  uniform float uFacePhaseBias;
  uniform float uFaceRimWidth;
  uniform float uFaceVariant;
  uniform float uOpacity;
  uniform float uShadowMix;
  uniform float uPatternBias;
  uniform float uTravel;

  varying vec3 vLocalPosition;

  const float PI = 3.14159265359;
  const float TAU = 6.28318530718;

  void main() {
    float faceThreshold = 0.495;
    bool onXAxisFace = abs(vLocalPosition.x) >= faceThreshold;
    bool onYAxisFace = abs(vLocalPosition.y) >= faceThreshold;
    bool onZAxisFace = abs(vLocalPosition.z) >= faceThreshold;

    float xFaceRim = 1.0 - smoothstep(
      0.0,
      uFaceRimWidth,
      min(0.5 - abs(vLocalPosition.y), 0.5 - abs(vLocalPosition.z))
    );
    float yFaceRim = 1.0 - smoothstep(
      0.0,
      uFaceRimWidth,
      min(0.5 - abs(vLocalPosition.x), 0.5 - abs(vLocalPosition.z))
    );
    float zFaceRim = 1.0 - smoothstep(
      0.0,
      uFaceRimWidth,
      min(0.5 - abs(vLocalPosition.x), 0.5 - abs(vLocalPosition.y))
    );
    float faceBleed =
      (onXAxisFace ? xFaceRim : 0.0) +
      (onYAxisFace ? yFaceRim : 0.0) +
      (onZAxisFace ? zFaceRim : 0.0);
    faceBleed = min(faceBleed, 1.0);

    float angle = atan(vLocalPosition.z, vLocalPosition.x);
    float orbit = fract((angle + PI) / TAU);
    float faceTravel = fract(uTravel + uFacePhaseBias * uFaceVariant);
    float travel = fract(faceTravel + sin((orbit + faceTravel) * TAU) * uPatternBias);
    float wrappedDistance = abs(orbit - travel);
    wrappedDistance = min(wrappedDistance, 1.0 - wrappedDistance);

    float sweep = 1.0 - smoothstep(0.0, 2.4, wrappedDistance);
    float hotCore = 1.0 - smoothstep(0.0, 0.34, wrappedDistance);
    float pulseBand =
      0.5 +
      0.5 *
        sin(
          (
            orbit * 7.0 -
            travel * 4.5 +
            uFacePhaseBias * 1.7 * uFaceVariant
          ) *
            TAU
        );
    float ember = 0.62 + hotCore * 0.34 + pulseBand * 0.28;
    float verticalLift = 0.84 + 0.16 * clamp(vLocalPosition.y + 0.5, 0.0, 1.0);
    float alpha =
      uOpacity *
      faceBleed *
      (sweep * 0.74 + hotCore * 0.26) *
      ember *
      verticalLift;
    vec3 baseAccentColor =
      uAccentColor * (0.34 + sweep * 0.28 + hotCore * 0.34);
    vec3 radiantAccent = mix(
      uAccentColor,
      vec3(1.0, 0.78, 0.52),
      hotCore * 0.58
    );
    vec3 boostedAccentColor =
      radiantAccent * (0.48 + sweep * 0.56 + hotCore * 0.78);
    vec3 accentColor = mix(
      baseAccentColor,
      boostedAccentColor,
      uFaceVariant
    );
    vec3 color = mix(
      accentColor,
      mix(uGlowBaseColor, accentColor, hotCore),
      uShadowMix
    );

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
  }
`,R=`
  varying vec2 vRailUv;

  void main() {
    vRailUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,b=`
  uniform vec3 uAccentColor;
  uniform float uOpacity;
  uniform float uPatternBias;
  uniform float uTravel;

  varying vec2 vRailUv;

  const float TAU = 6.28318530718;

  void main() {
    float orbit = fract(vRailUv.y);
    float travel = fract(uTravel + sin((orbit + uTravel) * TAU) * uPatternBias);
    float wrappedDistance = abs(orbit - travel);
    wrappedDistance = min(wrappedDistance, 1.0 - wrappedDistance);

    float sweep = 1.0 - smoothstep(0.0, 2.4, wrappedDistance);
    float hotCore = 1.0 - smoothstep(0.0, 0.26, wrappedDistance);
    float laserCore = 1.0 - smoothstep(0.0, 0.12, wrappedDistance);
    float pulseBand = 0.5 + 0.5 * sin((orbit * 7.0 - travel * 4.5) * TAU);
    float edgeGlint =
      smoothstep(
        0.58,
        1.0,
        0.5 + 0.5 * sin((orbit * 11.0 - travel * 8.5) * TAU)
      ) *
      (0.24 + sweep * 0.76);
    float flare = laserCore * (0.72 + pulseBand * 0.52);
    float ember =
      0.62 + hotCore * 0.34 + pulseBand * 0.26 + flare * 0.42 + edgeGlint * 0.18;
    float cylindricalLift = 0.94 + 0.06 * sin(vRailUv.x * TAU);
    float glow =
      0.1 + sweep * 0.58 + hotCore * 0.42 + flare * 0.66 + edgeGlint * 0.24;
    float intensity = clamp(
      uOpacity * glow * ember * cylindricalLift,
      0.0,
      1.0
    );
    vec3 color =
      uAccentColor *
      (0.78 + sweep * 0.48 + hotCore * 0.54 + flare * 0.88 + edgeGlint * 0.28);
    vec3 moltenBase = uAccentColor * 0.74;
    vec3 lightModeColor = mix(moltenBase, color, intensity);
    float railEdgeSoftness =
      smoothstep(0.0, 0.12, vRailUv.x) *
      smoothstep(0.0, 0.12, 1.0 - vRailUv.x);
    vec3 antialiasedColor = mix(moltenBase, lightModeColor, railEdgeSoftness);

    gl_FragColor = vec4(antialiasedColor, 1.0);
  }
`,B=`
  uniform vec3 uAccentColor;
  uniform float uOpacity;
  uniform float uPatternBias;
  uniform float uTravel;

  varying vec2 vRailUv;

  const float TAU = 6.28318530718;

  void main() {
    float orbit = fract(vRailUv.y);
    float travel = fract(uTravel + sin((orbit + uTravel) * TAU) * uPatternBias);
    float wrappedDistance = abs(orbit - travel);
    wrappedDistance = min(wrappedDistance, 1.0 - wrappedDistance);

    float sweep = 1.0 - smoothstep(0.0, 2.4, wrappedDistance);
    float hotCore = 1.0 - smoothstep(0.0, 0.28, wrappedDistance);
    float laserCore = 1.0 - smoothstep(0.0, 0.14, wrappedDistance);
    float pulseBand = 0.5 + 0.5 * sin((orbit * 7.0 - travel * 4.5) * TAU);
    float edgeGlint =
      smoothstep(
        0.6,
        1.0,
        0.5 + 0.5 * sin((orbit * 11.0 - travel * 8.5) * TAU)
      ) *
      (0.18 + sweep * 0.82);
    float flare = laserCore * (0.7 + pulseBand * 0.46);
    float ember =
      0.58 + hotCore * 0.28 + pulseBand * 0.22 + flare * 0.34 + edgeGlint * 0.14;
    float cylindricalLift = 0.9 + 0.1 * sin(vRailUv.x * TAU);
    float intensity = clamp(
      uOpacity *
        (sweep * 0.34 + hotCore * 0.28 + flare * 0.42 + edgeGlint * 0.18) *
        ember *
        cylindricalLift,
      0.0,
      1.0
    );
    vec3 color =
      uAccentColor *
      (0.34 + sweep * 0.28 + hotCore * 0.38 + flare * 0.6 + edgeGlint * 0.24);
    vec3 moltenBase = uAccentColor * 0.34;
    vec3 lightModeColor = mix(moltenBase, color, intensity);
    float railEdgeSoftness =
      smoothstep(0.0, 0.18, vRailUv.x) *
      smoothstep(0.0, 0.18, 1.0 - vRailUv.x);
    vec3 antialiasedColor = mix(moltenBase, lightModeColor, railEdgeSoftness);

    gl_FragColor = vec4(antialiasedColor, 1.0);
  }
`;function O({accent:e,animationStartMsRef:r,leadAccent:o,phaseOffset:l=0,pattern:s,speedMultiplier:c=1}){let d=(0,n.useRef)(null),f=(0,n.useMemo)(()=>{let e=new i.BufferGeometry;return e.setAttribute("position",new i.BufferAttribute(new Float32Array(21),3)),e},[]),p=(0,n.useMemo)(()=>new i.Color(e),[e]);return(0,n.useEffect)(()=>()=>{f.dispose()},[f]),(0,a.useFrame)(e=>{let t=d.current,a=f.getAttribute("position");if(!t||!(a instanceof i.BufferAttribute))return;let n=r.current;if(null===n)return;let g=1e3*e.clock.elapsedTime-n,m=(0,u.getAccentRevealProgress)(g),h=x((0,u.getAccentGlowOrbitProgress)(g,l,c),s,g),y=a.array;for(let e=0;e<7;e+=1){let t=M(h-.028*e),r=3*e;y[r]=t[0],y[r+1]=t[1],y[r+2]=t[2]}a.needsUpdate=!0,t.opacity=g<u.ACCENT_GLOW_DELAY_MS?0:m*(o?.92:.72),t.color.copy(p).multiplyScalar(o?4.4:3.65)}),(0,t.jsx)("points",{geometry:f,frustumCulled:!1,renderOrder:3,children:(0,t.jsx)("pointsMaterial",{ref:d,blending:i.AdditiveBlending,color:e,depthWrite:!1,opacity:0,size:o?.16:.13,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})}function S({accent:e=!1,animationStartMsRef:r,color:o,edgeGeometry:l,edgeOpacity:s,edgeRailRadius:c,reducedMotion:d,groupRef:f,phaseOffset:p=0,patternBias:g=.03,pattern:m,position:h,speedMultiplier:y=1}){let w=(0,n.useRef)([]),v=(0,n.useMemo)(()=>{if(c<=0)return[];let t=l.getAttribute("position");if(!(t instanceof i.BufferAttribute))return[];let r=[],a=new i.Vector3,o=new i.Vector3,n=new i.Vector3,s=new i.Vector3,u=new i.Vector3(0,1,0);for(let l=0;l<t.count;l+=2){a.fromBufferAttribute(t,l),o.fromBufferAttribute(t,l+1),n.copy(a).add(o).multiplyScalar(.5),s.copy(o).sub(a);let d=new i.CylinderGeometry(c,c,s.length(),8),f=e?new i.CylinderGeometry(2.35*c,2.35*c,s.length(),8):null,p=new i.Quaternion().setFromUnitVectors(u,s.clone().normalize());r.push({geometry:d,haloGeometry:f,midpoint:n.clone(),quaternion:p})}return r},[e,l,c]),M=(0,n.useMemo)(()=>v.map(()=>({core:{uAccentColor:{value:new i.Color(o)},uOpacity:{value:0},uPatternBias:{value:g},uTravel:{value:0}},halo:{uAccentColor:{value:new i.Color(o)},uOpacity:{value:0},uPatternBias:{value:g},uTravel:{value:0}}})),[o,g,v]);return((0,n.useEffect)(()=>{let e=w.current;return()=>{v.forEach(e=>{e.geometry.dispose(),e.haloGeometry?.dispose()}),e.forEach(e=>e?.dispose())}},[v]),(0,a.useFrame)(t=>{if(!e)return;let a=r.current;if(null===a)return;let o=1e3*t.clock.elapsedTime-a,l=x((0,u.getAccentGlowOrbitProgress)(o,p,y,d),m,o);w.current.forEach(e=>{e&&(e.uniforms.uTravel.value=l)})}),c<=0||0===v.length)?null:(0,t.jsx)("group",{ref:f,position:h,children:v.map((r,a)=>e?(0,t.jsxs)("group",{position:r.midpoint,quaternion:r.quaternion,children:[r.haloGeometry?(0,t.jsx)("mesh",{geometry:r.haloGeometry,frustumCulled:!1,renderOrder:1,children:(0,t.jsx)("shaderMaterial",{ref:e=>{w.current[2*a]=e},blending:i.NormalBlending,depthWrite:!1,fragmentShader:B,toneMapped:!1,transparent:!0,uniforms:M[a].halo,vertexShader:R})}):null,(0,t.jsx)("mesh",{geometry:r.geometry,frustumCulled:!1,renderOrder:2,children:(0,t.jsx)("shaderMaterial",{ref:e=>{w.current[2*a+1]=e},blending:i.NormalBlending,depthWrite:!1,fragmentShader:b,toneMapped:!1,transparent:!0,uniforms:M[a].core,vertexShader:R})})]},`${r.midpoint.x}-${r.midpoint.y}-${r.midpoint.z}-${a}`):(0,t.jsx)("mesh",{geometry:r.geometry,position:r.midpoint,quaternion:r.quaternion,frustumCulled:!1,renderOrder:1,children:(0,t.jsx)("meshBasicMaterial",{color:o,depthWrite:!1,opacity:0,toneMapped:!1,transparent:!0})},`${r.midpoint.x}-${r.midpoint.y}-${r.midpoint.z}-${a}`))})}function F({animationStartMsRef:e,block:r,cubeGeometry:o,edgeGeometry:l,onReady:s,palette:c,reducedMotion:d}){let f=(0,n.useRef)(null),p=(0,n.useRef)(null),g=(0,n.useRef)(null),m=(0,n.useRef)(null),h=(0,n.useRef)(null),y=(0,n.useRef)(null),w=(0,n.useRef)(null),v=(0,n.useRef)(null),M=(0,n.useMemo)(()=>new i.Color(c.edge),[c.edge]),R=(0,n.useMemo)(()=>new i.Color(c.accent),[c.accent]),b=(0,n.useMemo)(()=>r.accent?new i.ShaderMaterial({blending:c.glowBlendMode,depthWrite:!1,fragmentShader:C,toneMapped:!1,transparent:!0,uniforms:{uAccentColor:{value:new i.Color(c.glowAccent)},uGlowBaseColor:{value:new i.Color(c.glowBase)},uIntensity:{value:r.leadAccent?1.16:.98},uOpacity:{value:0},uPatternBias:{value:"pulse-drift"===r.glowPattern?.08:.03},uShadowMix:{value:c.glowShadowMix},uTravel:{value:r.glowPhaseOffset??0}},vertexShader:A}):null,[r.accent,r.glowPhaseOffset,r.glowPattern,r.leadAccent,c.glowAccent,c.glowBase,c.glowBlendMode,c.glowShadowMix]),B=(0,n.useMemo)(()=>r.accent?new i.ShaderMaterial({blending:c.glowBlendMode,depthWrite:!1,fragmentShader:P,side:i.FrontSide,toneMapped:!1,transparent:!0,uniforms:{uAccentColor:{value:new i.Color(c.glowAccent)},uGlowBaseColor:{value:new i.Color(c.glowBase)},uFacePhaseBias:{value:(r.glowPhaseOffset??0)*.13},uFaceRimWidth:{value:c.faceGlowEdgeWidth},uFaceVariant:{value:c.faceGlowVariant},uOpacity:{value:0},uPatternBias:{value:"pulse-drift"===r.glowPattern?.08:.03},uShadowMix:{value:c.glowShadowMix},uTravel:{value:r.glowPhaseOffset??0}},vertexShader:A}):null,[r.accent,r.glowPhaseOffset,r.glowPattern,c.glowAccent,c.glowBase,c.glowBlendMode,c.glowShadowMix,c.faceGlowEdgeWidth,c.faceGlowVariant]);return(0,n.useEffect)(()=>()=>{b?.dispose(),B?.dispose()},[B,b]),(0,n.useEffect)(()=>{let e=f.current;e&&(e.position.set(r.entryPosition[0],r.entryPosition[1],r.entryPosition[2]),e.scale.setScalar(.7))},[r.entryPosition]),(0,n.useEffect)(()=>{let e=f.current,t=p.current,a=g.current,o=m.current,l=h.current,n=y.current,i=w.current,u=v.current,d=r.accent?c.accentEdgeRailRadius>0:c.edgeRailRadius>0,M=!r.accent||null!==l&&null!==n&&null!==b&&null!==B,x=!d||null!==t&&t.children.length>0;e&&a&&o&&i&&u&&x&&M&&s(r.id)},[r.accent,r.id,B,b,s,c.accentEdgeRailRadius,c.edgeRailRadius]),(0,a.useFrame)(t=>{let a=f.current,o=p.current,l=w.current,n=v.current;if(!a||!l||!n)return;let s=e.current;if(null===s)return;let g=1e3*t.clock.elapsedTime-s,m=(0,u.getBlockEntryProgress)(g,r.delayMs,d),h=(0,u.getBlockVisibilityProgress)(m,d),y=r.accent?(0,u.getAccentRevealProgress)(g,d):0,A=Math.max(y,c.accentEdgeColorFloor),C=h*(c.accentEdgeOpacityFloor+y*(.94-c.accentEdgeOpacityFloor));a.position.set(i.MathUtils.lerp(r.entryPosition[0],r.targetPosition[0],m),i.MathUtils.lerp(r.entryPosition[1],r.targetPosition[1],m),i.MathUtils.lerp(r.entryPosition[2],r.targetPosition[2],m));let P=.7+.3*m;a.scale.setScalar(P);let O=i.MathUtils.clamp(h,0,1);if(l.opacity=c.fillTransparent?O:1,n.opacity=r.accent?C:h*c.edgeOpacity,r.accent){n.color.copy(M).lerp(R,A);let e=x((0,u.getAccentGlowOrbitProgress)(g,r.glowPhaseOffset,r.glowSpeedMultiplier,d),r.glowPattern,g);if(o&&o.traverse(e=>{if(!(e instanceof i.Mesh))return;let t=e.material;if(t instanceof i.MeshBasicMaterial){t.color.copy(M).lerp(R,A),t.opacity=C;return}t instanceof i.ShaderMaterial&&(t.uniforms.uAccentColor.value.copy(R),t.uniforms.uOpacity.value=C)}),b){let t=Math.min(1,(r.leadAccent?.94:.78)*c.glowOpacityScale);b.uniforms.uOpacity.value=h*y*t,b.uniforms.uTravel.value=e}if(B){let t=(r.leadAccent?.34:.24)*c.glowOpacityScale*c.faceGlowOpacityScale;B.uniforms.uOpacity.value=h*y*t,B.uniforms.uTravel.value=e}}else n.color.copy(M),o&&o.traverse(e=>{if(!(e instanceof i.Mesh))return;let t=e.material;t instanceof i.MeshBasicMaterial&&(t.color.copy(M),t.opacity=h*c.edgeOpacity)})}),(0,t.jsxs)("group",{ref:f,children:[(0,t.jsx)("mesh",{ref:g,geometry:o,frustumCulled:!1,children:(0,t.jsx)("meshBasicMaterial",{ref:w,color:c.fill,opacity:0,depthWrite:!0,toneMapped:!1,transparent:c.fillTransparent,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1})}),(0,t.jsx)("lineSegments",{ref:m,geometry:l,frustumCulled:!1,renderOrder:1,children:(0,t.jsx)("lineBasicMaterial",{ref:v,color:c.edge,transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})}),(0,t.jsx)(S,{accent:r.accent,animationStartMsRef:e,color:r.accent?c.accent:c.edge,edgeGeometry:l,edgeOpacity:c.edgeOpacity,edgeRailRadius:r.accent?c.accentEdgeRailRadius:c.edgeRailRadius,groupRef:p,pattern:r.glowPattern,patternBias:"pulse-drift"===r.glowPattern?.08:.03,phaseOffset:r.glowPhaseOffset,reducedMotion:d,speedMultiplier:r.glowSpeedMultiplier}),r.accent?(0,t.jsxs)(t.Fragment,{children:[B?(0,t.jsx)("mesh",{ref:h,geometry:o,frustumCulled:!1,renderOrder:2,children:(0,t.jsx)("primitive",{attach:"material",object:B})}):null,(0,t.jsx)("lineSegments",{ref:y,geometry:l,frustumCulled:!1,renderOrder:3,children:b?(0,t.jsx)("primitive",{attach:"material",object:b}):null}),d?null:(0,t.jsx)(O,{accent:c.glowAccent,animationStartMsRef:e,leadAccent:r.leadAccent,phaseOffset:r.glowPhaseOffset,pattern:r.glowPattern,speedMultiplier:r.glowSpeedMultiplier})]}):null]})}function T({hostVisible:e,hoverTiltRef:r,onSceneReady:o,palette:l,reducedMotion:s}){let c=(0,n.useRef)(new Set),p=(0,n.useRef)(null),g=(0,n.useRef)(!1),m=(0,n.useRef)(!1),h=(0,n.useRef)(null),y=(0,n.useRef)(null),w=(0,n.useRef)(null),M=(0,n.useRef)(new i.Vector2),x=(0,n.useMemo)(()=>new i.Color(l.platform),[l.platform]),A=(0,n.useRef)(new i.Quaternion),C=(0,n.useRef)(new i.Quaternion),P=(0,n.useRef)(new i.Quaternion),R=(0,n.useRef)(new i.Quaternion),b=(0,n.useMemo)(()=>new i.BoxGeometry(1,1,1),[]),B=(0,n.useMemo)(()=>new i.EdgesGeometry(b,18),[b]),O=(0,n.useMemo)(()=>{let e=new i.BufferGeometry;return e.setFromPoints([new i.Vector3(-2.8,-.62,-2.8),new i.Vector3(2.8,-.62,-2.8),new i.Vector3(2.8,-.62,-2.8),new i.Vector3(2.8,-.62,2.8),new i.Vector3(2.8,-.62,2.8),new i.Vector3(-2.8,-.62,2.8),new i.Vector3(-2.8,-.62,2.8),new i.Vector3(-2.8,-.62,-2.8)]),e},[]);(0,n.useEffect)(()=>()=>{b.dispose(),B.dispose(),O.dispose()},[b,B,O]);let E=(0,n.useCallback)(e=>{c.current.add(e)},[]);return(0,n.useEffect)(()=>{if(!e){m.current=!1;return}let t=window.requestAnimationFrame(()=>{m.current=!0});return()=>{window.cancelAnimationFrame(t),m.current=!1}},[e]),(0,a.useFrame)(t=>{let a=h.current,n=y.current,d=w.current,b=l.edgeRailRadius<=0||null!==d,B=c.current.size===v.length;if(!a||!n||!b||!B)return;if(!g.current){t.gl.compile(t.scene,t.camera),g.current=!0,o();return}if(!e||!m.current)return;if(null===p.current){p.current=1e3*t.clock.elapsedTime,a.visible=!0;return}let O=1e3*t.clock.elapsedTime-p.current,S=(0,u.getSceneRotationRadians)(O,s),F=M.current,T=r.current??[0,0],E=s?0:T[1]*f*.5,U=s?0:T[0]*f*.5;F.x=i.MathUtils.lerp(F.x,E,.08),F.y=i.MathUtils.lerp(F.y,U,.08);let j=new i.Vector3(1,0,0).applyQuaternion(t.camera.quaternion).normalize(),G=new i.Vector3(0,1,0).applyQuaternion(t.camera.quaternion).normalize(),L=A.current,V=C.current,D=P.current,_=R.current;L.setFromAxisAngle(new i.Vector3(0,1,0),S),D.setFromAxisAngle(j,F.x),_.setFromAxisAngle(G,F.y),V.copy(_).multiply(D),a.quaternion.copy(V).multiply(L),n.color.copy(x);let W=.72*(0,u.getPlatformFadeProgress)(O,s);n.opacity=W,d&&d.children.forEach(e=>{if(!(e instanceof i.Mesh))return;let t=e.material;t instanceof i.MeshBasicMaterial&&(t.color.copy(x),t.opacity=W)})}),(0,t.jsxs)("group",{ref:h,position:[-.08,-.32,-.08],visible:!1,children:[(0,t.jsx)("lineSegments",{geometry:O,position:d,children:(0,t.jsx)("lineBasicMaterial",{ref:y,color:l.platform,transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})}),(0,t.jsx)(S,{animationStartMsRef:p,color:l.platform,edgeGeometry:O,edgeOpacity:.72,edgeRailRadius:2*l.edgeRailRadius,groupRef:w,position:d,reducedMotion:s}),(0,t.jsx)("group",{position:[0,-.08,0],children:v.map(e=>(0,t.jsx)(F,{animationStartMsRef:p,block:e,cubeGeometry:b,edgeGeometry:B,onReady:E,palette:l,reducedMotion:s},e.id))})]})}function E(){let e=(0,n.useRef)(null),{colorSchemeDark:a,isDesktop:u,isMobile:d,isTablet:f}=(0,s.useDeviceInfo)(),p=(0,c.useRendererProfile)(),g=p.canUseWebGL(),m="none"!==p.getPostprocessing(),v=!p.shouldUseContinuousMotion(),M=(0,n.useRef)([0,0]),[x,A]=(0,n.useState)(null),[C,P]=(0,n.useState)(!1),[R,b]=(0,n.useState)(!1),B="desktop",O=94,S="50%",F="52%";return d?(B="mobile",O=48,S="47%",F="50%"):f&&R?(B="compact-split",O=70,S="52%"):u||f?f&&(B="tablet",O=58,S="50%",F="50%"):(B="split",O=90,S="56%"),(0,n.useEffect)(()=>{let t=e.current;if(t){let e;P(!1),A({accent:w(y(e=window.getComputedStyle(t),"--color-orange-60",h.accent)),accentEdgeColorFloor:+!a,accentEdgeOpacityFloor:a?.28:.74,accentEdgeRailRadius:.0075*!a,edge:a?w(y(e,"--color-primary-100",h.edge)):"#8F8F8F",edgeOpacity:a?.84:1,edgeRailRadius:.001*!a,fillTransparent:a,faceGlowEdgeWidth:a?.18:.045,faceGlowOpacityScale:a?1:.58,faceGlowVariant:+!a,fill:w(y(e,"--color-secondary-100",h.fill)),glowBlendMode:a?i.AdditiveBlending:i.NormalBlending,glowAccent:a?"#F56C24":"#FFAF00",glowBase:a?"#000000":"#FFAF00",glowOpacityScale:a?1:1.72,glowShadowMix:.18*!a,platform:a?h.platform:"#333333"})}},[a]),(0,n.useEffect)(()=>{let t=e.current;if(!t)return;let r=()=>{b("split"===getComputedStyle(t).getPropertyValue("--guaranteed-capacity-artwork-layout").trim())};r();let a=new ResizeObserver(r);return a.observe(t),()=>{a.disconnect()}},[]),(0,n.useEffect)(()=>{M.current=[0,0],P(!1)},[B]),(0,n.useEffect)(()=>{g||(M.current=[0,0],P(!1))},[g]),(0,t.jsx)("div",{"aria-hidden":"true",className:"relative mx-auto aspect-2/1 w-full max-w-264 @sm:aspect-12/5 @lg:aspect-2/1",onPointerLeave:()=>{M.current=[0,0]},onPointerMove:t=>{let r=e.current;if(!r||v){M.current=[0,0];return}let a=r.getBoundingClientRect(),o=t.clientX-a.left,l=t.clientY-a.top,n=.48*a.width,s=.46*a.height,c=.5*a.width,u=.47*a.height;if(Math.hypot(o-c,l-u)>1.2*Math.max(n,s)){M.current=[0,0];return}M.current=[i.MathUtils.clamp((o-c)/n,-1,1),i.MathUtils.clamp((l-u)/s,-1,1)]},ref:e,children:(0,t.jsx)("div",{className:"pointer-events-none absolute size-[320%] -translate-inline-1/2 -translate-y-1/2 [&_canvas]:pointer-events-none [&_div]:pointer-events-none",style:{insetBlockStart:F,insetInlineStart:S},children:x&&g?(0,t.jsxs)(r.Canvas,{className:(0,l.clsx)({invisible:!C,visible:C}),orthographic:!0,dpr:p.getDpr(),gl:{alpha:!0,antialias:p.getAntialias(),powerPreference:"high-performance"},camera:{far:100,near:.1,position:[6.8,6.4,7.2],zoom:O},children:[(0,t.jsx)(T,{hostVisible:C,hoverTiltRef:M,onSceneReady:()=>{P(!0)},palette:x,reducedMotion:v}),m?(0,t.jsx)(o.EffectComposer,{multisampling:0,children:(0,t.jsx)(o.SMAA,{})}):null]},[B,a?"dark":"light",p.tier].join("-")):null})})}e.s(["default",0,function(){return(0,t.jsx)(c.GpuPerformanceProvider,{children:(0,t.jsx)(E,{})})}])},703815,e=>{"use strict";var t=e.i(724225),r=e.i(7284),a=e.i(813432);let o="bg-background text-primary-100 @container relative isolate overflow-hidden";e.s(["default",0,({children:e,globalBannerOwner:l})=>{let n=(0,a.useGlobalBannerSlot)({globalBannerOwner:l});return null===n?(0,t.jsx)("section",{className:o,children:e}):(0,t.jsxs)("section",{className:(0,r.clsx)(o,"-mt-[calc(var(--page-top-gap,0px)+40px)] flex flex-col gap-4"),"data-global-banner-owner":"guaranteed-capacity-hero",children:[n,(0,t.jsx)("div",{className:"w-full overflow-hidden",children:e})]})}])},210441,e=>{"use strict";var t=e.i(724225),r=e.i(7284),a=e.i(741821),o=e.i(552297),l=e.i(899457);e.s(["default",0,function({headline:e,highlightText:n}){let{reducedMotion:i}=(0,o.useDeviceInfo)(),s=(0,a.useMemo)(()=>((e,t)=>{if(!t)return null;let r=e.indexOf(t);return -1===r?null:{after:e.slice(r+t.length),before:e.slice(0,r),highlight:t}})(e,n),[e,n]),[c,u]=(0,a.useState)(!1);return((0,a.useEffect)(()=>{if(!s)return void u(!1);if(i)return void u(!0);u(!1);let e=window.setTimeout(()=>{u(!0)},l.ACCENT_REVEAL_DELAY_MS);return()=>{window.clearTimeout(e)}},[s,i]),s)?(0,t.jsxs)(t.Fragment,{children:[s.before,(0,t.jsx)("span",{className:(0,r.clsx)("transition-colors motion-reduce:text-[#F46920] motion-reduce:transition-none",c?"text-[#F46920]":"text-primary-100"),"data-accented":c,style:{transitionDuration:`${l.ACCENT_REVEAL_DURATION_MS}ms`},children:s.highlight}),s.after]}):(0,t.jsx)(t.Fragment,{children:e})}])},899457,e=>{"use strict";let t=710,r=Math.PI/4,a=(e,t,r)=>Math.min(Math.max(e,t),r),o=(e,t,r)=>a((e-t)/r,0,1),l=e=>1-(1-a(e,0,1))**3,n=e=>a(e,0,1)**3;e.s(["ACCENT_GLOW_DELAY_MS",0,t,"ACCENT_REVEAL_DELAY_MS",0,426,"ACCENT_REVEAL_DURATION_MS",0,284,"getAccentGlowOrbitProgress",0,(e,r=0,a=1,o=!1)=>{if(o||e<t)return 0;let l=(e-t)/2926*a+r;return l-Math.floor(l)},"getAccentRevealProgress",0,(e,t=!1)=>{let r;return t?1:(r=a(o(e,426,284),0,1))<.5?4*r**3:1-Math.pow(-2*r+2,3)/2},"getBlockEntryProgress",0,(e,t,r=!1)=>r?1:l(o(e,0+t,571)),"getBlockVisibilityProgress",0,(e,t=!1)=>t?1:n(o(e,.12,.88)),"getPlatformFadeProgress",0,(e,t=!1)=>t?1:n(o(e,0,132)),"getSceneRotationRadians",0,(e,t=!1)=>t?0:r*(1-l(o(e,0,1803)))])}]);