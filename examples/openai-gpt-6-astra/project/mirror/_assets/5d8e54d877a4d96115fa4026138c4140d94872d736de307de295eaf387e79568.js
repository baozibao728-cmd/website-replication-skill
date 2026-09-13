(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,949201,e=>{"use strict";var t=e.i(724225),a=e.i(378939),o=e.i(218547),i=e.i(364250),r=e.i(939951),n=e.i(741821),s=e.i(695418),l=e.i(552297);let c={coronaIntensityScale:.86,coronaSizeScale:1,dialSettledBokehScale:0,moteCameraDistanceOffsetWorld:2.91,particleBokehFalloffWorld:7.2,particleBokehStrengthMultiplier:2.41,settledBokehScale:1.5,settledCameraFov:39,settledFocusOffsetWorld:4,settledFocusRange:.58},u=.22+.58,d={height:10.2,width:14.2},h=.04-1.9,p=2*Math.PI,f=1.75*Math.PI,m=[{bokehScale:32,cameraFov:43.2,dialBokehScale:32,dialRotation:-0,elapsedSeconds:0,focusDistance:1.55,focusRange:.05},{bokehScale:30,cameraFov:42.8,dialBokehScale:30,dialRotation:-.001260000000000001,elapsedSeconds:.22,focusDistance:1.62,focusRange:.052},{bokehScale:24,cameraFov:42,dialBokehScale:24,dialRotation:-.018539999999999997,elapsedSeconds:.56,focusDistance:2.58,focusRange:.07},{bokehScale:c.settledBokehScale+5.2,cameraFov:39.4,dialBokehScale:c.dialSettledBokehScale+5.2,dialRotation:-.19728,elapsedSeconds:1.22,focusDistance:12.510000000000002,focusRange:.16},{bokehScale:c.settledBokehScale+1.16,cameraFov:38.32,dialBokehScale:c.dialSettledBokehScale+1.16,dialRotation:-.23022,elapsedSeconds:1.62,focusDistance:14.340000000000002,focusRange:.28},{bokehScale:c.settledBokehScale+.3,cameraFov:39.08,dialBokehScale:c.dialSettledBokehScale+.3,dialRotation:-.22158,elapsedSeconds:2.2199999999999998,focusDistance:13.860000000000001,focusRange:.5},{bokehScale:c.settledBokehScale+.06,cameraFov:38.98,dialBokehScale:c.dialSettledBokehScale+.06,dialRotation:-.22383,elapsedSeconds:2.5,focusDistance:13.985000000000001,focusRange:.55},{bokehScale:c.settledBokehScale,cameraFov:c.settledCameraFov,dialBokehScale:c.dialSettledBokehScale,dialRotation:-.22338,elapsedSeconds:2.7199999999999998,focusDistance:13.96,focusRange:c.settledFocusRange}],g={backbones:64e3,bonds:2e4,motes:7600},v={backbones:44e3,bonds:14200,motes:5e3},S={backbones:38e3,bonds:12200,motes:4200},x=(e,t=0,a=1)=>Math.min(a,Math.max(t,e));function M(e){return 2*e()-1}function y(e){return Math.sqrt(-2*Math.log(Math.max(e(),Number.EPSILON)))*Math.cos(p*e())}function b(e,t){let a=43758.5453123*Math.sin(127.1*e+311.7*t);return(a-Math.floor(a))*2-1}function P(e,t){let a=Math.floor(e),o=e-a,i=b(a,t)*o;return(i+(b(a+1,t)*(o-1)-i)*(o*o*o*(o*(6*o-15)+10)))*2}function w(e,t){return x(.68*P(e,t)+.23*P(2.07*e,t+17)+.09*P(4.11*e,t+43),-1,1)}let R=[{angleOffset:-4.99,depth:-5.8,depthEnd:7.2,helixTurns:42,interactive:!0,motionPhase:.42,offsetX:.08,offsetY:-.04,opacity:.82,particleWeight:5,radiusScale:.64,radiusScaleEnd:1.48,sampleMultiplier:4.15,tunnelTurns:-6.4}],D=[{angleOffset:0,depth:.83,depthEnd:.38,helixTurns:1.05,interactive:!0,mobilePath:{curvature:.045,rotation:-(27*Math.PI)/180,slope:-.075,y:.3},motionPhase:.36,offsetX:-2.03,offsetY:.27,opacity:1,particleWeight:6,railDepthScale:1.7,railRadiusScale:2.65,radiusScale:1,sampleMultiplier:1.65},{angleOffset:0,depth:.45,depthEnd:0,helixTurns:.92,interactive:!0,mobilePath:{curvature:-.045,rotation:-(13*Math.PI)/180,slope:.065,y:-.3},motionPhase:.36,offsetX:0,offsetY:0,opacity:1,particleWeight:6,railDepthScale:1.65,railRadiusScale:2.35,radiusScale:.98,sampleMultiplier:1.65}],F=D.map(e=>({rotationDegrees:(e.mobilePath?.rotation??0)*180/Math.PI,x:e.offsetX,y:e.offsetY,z:e.depth}));function A(e){return e?{height:Math.max(1,e.height+.84),width:Math.max(1,e.width+.84)}:d}function C([e,t,a]){let o=Math.max(Math.hypot(e,t,a),1e-4);return[e/o,t/o,a/o]}function E([e,t,a],[o,i,r]){return[e+o,t+i,a+r]}function k([e,t,a],o){return[e*o,t*o,a*o]}function B(e,t,a){let o=x((a-e)/(t-e));return o*o*(3-2*o)}function T(e,t,a,o,i,r){let n=3*t,s=[e.nodeRenderPositions[n],e.nodeRenderPositions[n+1],e.nodeRenderPositions[n+2]],l=[e.nodeCenterlinePositions[n],e.nodeCenterlinePositions[n+1],e.nodeCenterlinePositions[n+2]],c=C([e.nodeTangentDirections[n],e.nodeTangentDirections[n+1],e.nodeTangentDirections[n+2]]),u=e.nodeStrandPhases[t],d=(.24*i*(.74+.26*e.nodeLayerOpacities[t])+.045*Math.sin(.1*i+u))*r,h=E(l,function([e,t,a],[o,i,r],n){let s=Math.cos(n),l=Math.sin(n),c=o*e+i*t+r*a;return[e*s+(i*a-r*t)*l+o*c*(1-s),t*s+(r*e-o*a)*l+i*c*(1-s),a*s+(o*t-i*e)*l+r*c*(1-s)]}(E(s,k(l,-1)),c,d)),p=r?h:s,f=.52+1.06*B(-1.2,1.2,s[2]),m=.18*i+u,g=e.nodeMotionScales[t];p[0]+=.026*Math.cos(m)*f*r*g+a,p[1]+=.022*Math.sin(.83*m)*f*r*g+o,p[2]+=.06*Math.sin(.71*m)*r*g;let v=X(i,!1).dialRotation*(1-g)*r,S=Math.cos(v),x=Math.sin(v),M=p[0]*S-p[1]*x;p[1]=p[0]*x+p[1]*S,p[0]=M;let y=10/(10-p[2]);return[p[0]*y,p[1]*y]}function I(e,t,a,o,i,r){if(e.nodeApertureRimStrengths[t]){let n=T(e,t-2,a,o,i,r),s=T(e,t-1,a,o,i,r);return[(n[0]+s[0])/2,(n[1]+s[1])/2]}return T(e,t,a,o,i,r)}function W(e,t,a){return[e[0]+(t[0]-e[0])*a,e[1]+(t[1]-e[1])*a,e[2]+(t[2]-e[2])*a]}function O(e,t,a){if(a.mobilePath){let o=2*e-1,i=o*t.width*.95,r=t.height*(a.mobilePath.y+o*a.mobilePath.slope+(1-o*o)*a.mobilePath.curvature),n=a.mobilePath.rotation??0,s=Math.cos(n),l=Math.sin(n);return[a.offsetX+i*s-r*l,a.offsetY+i*l+r*s,a.depth+((a.depthEnd??a.depth)-a.depth)*e]}let o=a.tunnelTurns??1,i=Math.sign(o),r=function(e,t){let a=(t.depthEnd??t.depth)-t.depth;if(t.aperture||0===a)return e;let o=x((.68-t.depth)/a);if(e<=o)return e;let i=(e-o)/(1-o);return o+(.91*i+.08999999999999997*(1-Math.pow(1-i,3))/3)*(1-o)}(e,a),n=a.aperture?0:B(2.75,3.3,t.width/t.height),s=B(.82,1,e),l=a.depth+((a.depthEnd??a.depth)-a.depth)*e,c=r*p*o-Math.PI/2+a.angleOffset+n*s*p*1*i,u=B(0,1,e),d=a.radiusScale+((a.radiusScaleEnd??a.radiusScale)-a.radiusScale)*u,f=(a.depthEnd??a.depth)-a.depth,m=B(0===f?1:x((.04-a.depth)/f),1,e),g=B(.6,1,e),v=a.aperture?0:B(h,-1.06,l)*(1-B(4.1,4.8,l))*.25,S=a.aperture?0:w(7.2*e,a.motionPhase+23)*m*(.14+.42*g),M=c+(a.aperture?0:w(7.2*e*.83+3.4,a.motionPhase+13)*m*(.07+.28*g)),y=a.aperture?1:(1-.54*m)*(1+1.76*g),b=a.aperture?1:1-Math.max(0,Math.cos(M))*g*.32,P=a.aperture?1:1-Math.max(0,Math.cos(M))*B(.7,.78,e)*(1-B(.82,.9,e))*.13,R=a.aperture?1:1+Math.max(0,Math.cos(M))*B(.9,1,e)*.16,D=a.aperture?0:B(h,-1.06,l)*(1-B(4.1,4.8,l)),F=a.aperture?1:1-Math.cos(M)*D*.1,A=Math.min(.39*t.height,.5*t.width)*d*y*b*P*R*F*(1+v)*(1+n*s*.48)*(1+S);return[a.offsetX+Math.cos(M)*A,a.offsetY+Math.sin(M)*A,l]}function N(e,t,a,o,i,r={}){e.push({aperture:i.aperture??!1,canTear:i.interactive,end:a,kind:o,layerOpacity:i.opacity,motionPhase:i.motionPhase,motionScale:i.motionScale??1,particleWeight:r.particleWeight??i.particleWeight,start:t,thicknessScale:r.thicknessScale??1})}function z(e,t){if(e.aperture)return e.particleWeight;let a=1-B(0,1.35,Math.abs(t- -1.06));return Math.round(e.particleWeight*(1+1.65*a))}function H(e,t=0){let a=A(e),o=.5*Math.max(0,t)*.9960000000000001;return Math.max(.9122*Math.min(.39*a.height,.5*a.width),o)}function X(e,t,a=c){if(t)return{bokehScale:a.settledBokehScale,cameraFov:a.settledCameraFov,dialBokehScale:a.dialSettledBokehScale,dialRotation:0,focusDistance:9.96+a.settledFocusOffsetWorld,focusRange:a.settledFocusRange,opacity:1};let o=function(e){let t=x(e,0,2.7199999999999998),a=m.findIndex(({elapsedSeconds:e})=>e>=t);if(a<=0)return m[0];if(-1===a)return m[m.length-1];let o=a-1,i=m[o],r=m[a],n=m[Math.max(o-1,0)],s=m[Math.min(a+1,m.length-1)],l=(t-i.elapsedSeconds)/(r.elapsedSeconds-i.elapsedSeconds),c=e=>{var t,a,o,c;let u,d;return t=n[e],a=i[e],o=r[e],c=s[e],(2*(d=(u=l*l)*l)-3*u+1)*a+(o-t)/2*.38*(d-2*u+l)+(-2*d+3*u)*o+(c-a)/2*.38*(d-u)};return{bokehScale:c("bokehScale"),cameraFov:c("cameraFov"),dialBokehScale:c("dialBokehScale"),dialRotation:c("dialRotation"),elapsedSeconds:t,focusDistance:c("focusDistance"),focusRange:c("focusRange")}}(e),i=B(2.2199999999999998,2.7199999999999998,e),r=a.settledFocusOffsetWorld-4,n=B(0,u,e);return{bokehScale:o.bokehScale+(a.settledBokehScale-c.settledBokehScale)*i,cameraFov:o.cameraFov+(a.settledCameraFov-c.settledCameraFov)*i,dialBokehScale:o.dialBokehScale+(a.dialSettledBokehScale-c.dialSettledBokehScale)*i,dialRotation:o.dialRotation+-.018*r*i,focusDistance:o.focusDistance+r*i,focusRange:o.focusRange+(a.settledFocusRange-c.settledFocusRange)*i,opacity:n}}function L(e,t){return{...e,focusDistance:x(e.focusDistance-1.35*Math.abs(t),0,e.focusDistance)}}function G({enabled:e}){return null}var Y=e.i(215453),U=e.i(759075);function j(e,t){if(!e.ready||"visible"!==e.visibility)return e.elapsedSeconds;let a=e.lastClockElapsedSeconds;return void 0===a||(e.elapsedSeconds+=t>=a?t-a:t),e.lastClockElapsedSeconds=t,e.elapsedSeconds}var _=e.i(536925);let V=4*Math.PI;function K(e,t){return t||e?1.65:1.75}let Z={glowScale:1,impulseScale:.62,maxImpulse:1,radiusWorld:.115},$={glowScale:0,impulseScale:.16,maxImpulse:.32,radiusWorld:2.4},q=`
  attribute vec3 aCenterlinePosition;
  attribute float aKind;
  attribute float aLayerOpacity;
  attribute float aScale;
  attribute float aSeed;
  attribute float aStrandPhase;
  attribute vec3 aTangentDirection;
  attribute float aElasticEdgeIndex;
  attribute float aElasticEndNodeIndex;
  attribute float aElasticProgress;
  attribute float aElasticStartNodeIndex;
  attribute vec2 aFlowDirection;

  uniform float uMotion;
  uniform float uApertureRadius;
  uniform float uIntroOpacity;
  uniform float uPixelRatio;
  uniform float uPointSize;
  uniform float uTime;
  uniform float uMoteOpacityScale;
  uniform float uStructureOpacityScale;
  uniform sampler2D uDisturbanceMap;
  uniform sampler2D uTetherMap;
  uniform vec2 uCopyCenter;
  uniform vec2 uCopySize;
  uniform vec2 uClusterSize;
  uniform vec2 uFieldSize;
  uniform float uHorizontalEdgeFade;
  uniform float uHideMotesInsideAperture;
  uniform float uFocusDialRotation;
  uniform float uFocusPlaneZ;
  uniform float uMoteCameraDistanceOffsetWorld;
  uniform float uParticleBokehFalloffWorld;
  uniform float uParticleBokehStrengthMultiplier;
  uniform sampler2D uElasticNodeMap;
  uniform sampler2D uElasticNodePositionMap;
  uniform float uElasticNodeTextureWidth;
  uniform sampler2D uElasticBondMap;
  uniform float uElasticBondTextureWidth;

  varying float vKind;
  varying float vGlow;
  varying float vApertureStrength;
  varying float vApertureWrapStrength;
  varying float vCenterAttenuation;
  varying float vDepthBlur;
  varying float vParticleBokeh;
  varying float vOpacity;
  varying float vPulse;
  varying float vSeed;

  vec2 getElasticNodeDisplacement(float nodeIndex) {
    if (nodeIndex < 0.0) return vec2(0.0);

    return texture2D(
      uElasticNodeMap,
      vec2((nodeIndex + 0.5) / uElasticNodeTextureWidth, 0.5)
    ).rg;
  }

  vec3 getElasticNodePosition(float nodeIndex) {
    return texture2D(
      uElasticNodePositionMap,
      vec2((nodeIndex + 0.5) / uElasticNodeTextureWidth, 0.5)
    ).rgb;
  }

  vec2 getElasticBondState(float edgeIndex) {
    if (edgeIndex < 0.0) return vec2(1.0, 0.0);

    return texture2D(
      uElasticBondMap,
      vec2((edgeIndex + 0.5) / uElasticBondTextureWidth, 0.5)
    ).rg;
  }

  float random(float value) {
    return fract(sin(value) * 43758.5453123);
  }

  vec3 rotateAroundAxis(vec3 value, vec3 axis, float angle) {
    return
      value * cos(angle) +
      cross(axis, value) * sin(angle) +
      axis * dot(axis, value) * (1.0 - cos(angle));
  }

  void main() {
    float isBackbone = 1.0 - step(0.5, aKind);
    float isBond = step(0.5, aKind) * (1.0 - step(1.5, aKind));
    float isMote = step(1.5, aKind);
    float isStructure = 1.0 - isMote;
    float apertureStrength = isStructure * step(0.5, aFlowDirection.x);
    float apertureWrapStrength = apertureStrength * step(0.5, aFlowDirection.y);
    float apertureRimStrength = apertureStrength * (1.0 - apertureWrapStrength);
    float structureMotionScale = 1.0 - apertureStrength;
    float depthParallax = clamp(1.0 + position.z * 0.38, 0.55, 1.9);
    float depthGlow = mix(0.82, 1.16, smoothstep(-3.8, 4.8, position.z));
    float depthDrift = mix(0.52, 1.58, smoothstep(-1.2, 1.2, position.z));
    vec2 bondState = getElasticBondState(aElasticEdgeIndex);
    float bondStrength = bondState.r;
    float bondBreak = 1.0 - bondStrength;
    float spinSpeed = mix(0.74, 1.0, aLayerOpacity);
    float spinAngle =
      (uTime * 0.24 * spinSpeed +
        sin(uTime * 0.1 + aStrandPhase) * 0.045) *
      uMotion;
    vec3 radialPosition = position - aCenterlinePosition;
    vec3 spunPosition =
      aCenterlinePosition +
      rotateAroundAxis(radialPosition, normalize(aTangentDirection), spinAngle);
    vec3 resolvedPosition = mix(position, spunPosition, isStructure);
    vec3 rimFirstRailRestingPosition = mix(
      getElasticNodePosition(aElasticStartNodeIndex - 2.0),
      getElasticNodePosition(aElasticEndNodeIndex - 2.0),
      aElasticProgress
    );
    vec3 rimSecondRailRestingPosition = mix(
      getElasticNodePosition(aElasticStartNodeIndex - 1.0),
      getElasticNodePosition(aElasticEndNodeIndex - 1.0),
      aElasticProgress
    );
    vec3 rimFirstRailPosition =
      aCenterlinePosition +
      rotateAroundAxis(
        rimFirstRailRestingPosition - aCenterlinePosition,
        normalize(aTangentDirection),
        spinAngle
      );
    vec3 rimSecondRailPosition =
      aCenterlinePosition +
      rotateAroundAxis(
        rimSecondRailRestingPosition - aCenterlinePosition,
        normalize(aTangentDirection),
        spinAngle
      );
    vec2 rimFirstRailElasticDisplacement = mix(
      getElasticNodeDisplacement(aElasticStartNodeIndex - 2.0),
      getElasticNodeDisplacement(aElasticEndNodeIndex - 2.0),
      aElasticProgress
    );
    vec2 rimSecondRailElasticDisplacement = mix(
      getElasticNodeDisplacement(aElasticStartNodeIndex - 1.0),
      getElasticNodeDisplacement(aElasticEndNodeIndex - 1.0),
      aElasticProgress
    );
    rimFirstRailPosition.xy += rimFirstRailElasticDisplacement;
    rimSecondRailPosition.xy += rimSecondRailElasticDisplacement;
    rimFirstRailPosition.z = max(
      rimFirstRailPosition.z,
      ${(.04+.035).toFixed(3)}
    );
    rimSecondRailPosition.z = max(
      rimSecondRailPosition.z,
      ${(.04+.035).toFixed(3)}
    );
    float centerlinePerspectiveScale =
      10.0 /
      max(10.0 - aCenterlinePosition.z, 0.001);
    float rimFirstRailPerspectiveScale =
      10.0 /
      max(10.0 - rimFirstRailPosition.z, 0.001);
    float rimSecondRailPerspectiveScale =
      10.0 /
      max(10.0 - rimSecondRailPosition.z, 0.001);
    vec2 rimProjectedMidpoint =
      (
        rimFirstRailPosition.xy * rimFirstRailPerspectiveScale +
        rimSecondRailPosition.xy * rimSecondRailPerspectiveScale
      ) *
      0.5;
    vec3 rimPosition = vec3(
      rimProjectedMidpoint / centerlinePerspectiveScale,
      aCenterlinePosition.z
    );
    resolvedPosition = mix(
      resolvedPosition,
      rimPosition,
      apertureRimStrength
    );

    float strandDriftPhase = uTime * 0.18 + aStrandPhase;
    resolvedPosition.x += cos(strandDriftPhase) * 0.026 * depthDrift * isStructure * uMotion * structureMotionScale;
    resolvedPosition.y += sin(strandDriftPhase * 0.83) * 0.022 * depthDrift * isStructure * uMotion * structureMotionScale;
    resolvedPosition.z += sin(strandDriftPhase * 0.71) * 0.06 * isStructure * uMotion * structureMotionScale;
    float bundleRipplePhase =
      uTime * (0.42 + aSeed * 0.12) +
      position.x * 4.6 +
      position.y * 3.8 +
      aSeed * 8.0;
    resolvedPosition.xy +=
      vec2(sin(bundleRipplePhase), cos(bundleRipplePhase * 0.86)) *
      0.008 *
      isStructure *
      uMotion *
      structureMotionScale;

    float moteTravelPhase = uTime * (0.22 + aSeed * 0.16) + aSeed * 19.0;
    float moteTravel = sin(moteTravelPhase) * (0.09 + aSeed * 0.08) * depthDrift * isMote * uMotion;
    vec2 moteNormal = vec2(-aFlowDirection.y, aFlowDirection.x);
    float moteHover = sin(moteTravelPhase * 1.7 + aSeed * 25.0) * 0.018 * isMote * uMotion;
    resolvedPosition.xy +=
      aFlowDirection * moteTravel + moteNormal * moteHover * depthDrift;
    resolvedPosition.z -= uMoteCameraDistanceOffsetWorld * isMote;

    vec2 elasticDisplacement = mix(
      mix(
        getElasticNodeDisplacement(aElasticStartNodeIndex),
        getElasticNodeDisplacement(aElasticEndNodeIndex),
        aElasticProgress
      ),
      vec2(0.0),
      apertureRimStrength
    );
    vec2 restingCopyPosition = (position.xy - uCopyCenter) / max(uCopySize * 0.5, vec2(0.001));
    float restingApertureAttenuation = smoothstep(
      uApertureRadius * 0.84,
      uApertureRadius * 0.96,
      length(position.xy)
    );
    float structureInteractionAttenuation =
      min(
        smoothstep(0.72, 1.32, length(restingCopyPosition)),
        restingApertureAttenuation
      );
    float interactionAttenuation = mix(structureInteractionAttenuation, 0.48, isMote);
    float depthInteractionScale = mix(
      0.82,
      1.24,
      smoothstep(-2.6, 2.6, position.z)
    );
    float disturbanceProjectionScale = 10.0 / max(10.0 - resolvedPosition.z, 0.001);
    vec2 disturbanceUv = clamp(((resolvedPosition.xy + elasticDisplacement) * disturbanceProjectionScale) / uFieldSize + 0.5, vec2(0.0), vec2(1.0));
    vec4 disturbance = texture2D(uDisturbanceMap, disturbanceUv);
    float touchGlow = disturbance.a * uMotion * interactionAttenuation;
    vec2 velocityImpulse =
      disturbance.rg *
      uMotion *
      interactionAttenuation *
      depthInteractionScale;
    vec2 tetherDisplacement =
      texture2D(uTetherMap, disturbanceUv).rg *
      uMotion *
      interactionAttenuation *
      depthInteractionScale;
    float impulseStrength = min(length(velocityImpulse), 1.0);
    float scatterInfluence = impulseStrength * impulseStrength * (3.0 - 2.0 * impulseStrength);
    vec2 gustDirection = velocityImpulse / max(impulseStrength, 0.0001);
    vec2 gustNormal = vec2(-gustDirection.y, gustDirection.x);
    vec2 elasticTug = velocityImpulse * (0.08 + aSeed * 0.025);
    vec2 attachedBend = tetherDisplacement * (0.46 + aSeed * 0.05);
    vec2 scatteredDust = gustDirection * (0.4 + aSeed * 0.38);
    scatteredDust += gustNormal * sin(aSeed * 89.0 + uTime * 3.2) * 0.33;
    scatteredDust += vec2(cos(aSeed * 47.0), sin(aSeed * 53.0)) * 0.2;
    resolvedPosition.xy += elasticTug;
    resolvedPosition.xy += attachedBend;
    resolvedPosition.xy += scatteredDust * scatterInfluence;
    resolvedPosition.xy += elasticDisplacement;
    float burstProgress = smoothstep(0.0, 1.0, bondState.g);
    float burstEnvelope = 1.0 - pow(1.0 - burstProgress, 3.0);
    float release = smoothstep(0.04, 0.72, bondBreak) * burstEnvelope * isStructure;
    float bondSeed = random(aElasticEdgeIndex * 19.73 + 3.17);
    float particleSeed = random(aSeed * 191.3 + aElasticEdgeIndex * 7.91);
    float releaseAngle = particleSeed * 6.28318530718;
    float releaseRadius = mix(
      0.16,
      0.72,
      sqrt(random(aSeed * 269.7 + aElasticEdgeIndex * 2.23))
    );
    vec2 releaseDirection = vec2(cos(releaseAngle), sin(releaseAngle));
    float orbitPhase =
      uTime * mix(0.28, 0.72, bondSeed) +
      random(aSeed * 331.1 + aElasticEdgeIndex) * 6.28318530718;
    vec2 releaseOrbit =
      vec2(cos(orbitPhase), sin(orbitPhase * 1.13)) *
      mix(0.055, 0.2, random(aSeed * 401.9 + bondSeed));
    vec2 releasedDrift = vec2(
      sin(uTime * (0.42 + particleSeed * 0.36) + aSeed * 59.0),
      cos(uTime * (0.36 + bondSeed * 0.4) + aSeed * 71.0)
    ) * mix(0.045, 0.16, random(aSeed * 449.3));
    float dispersalPhase =
      uTime * mix(0.18, 0.48, particleSeed) +
      random(aSeed * 523.7 + bondSeed) * 6.28318530718;
    vec2 dispersedWander =
      vec2(sin(dispersalPhase * 1.17), cos(dispersalPhase * 0.91)) *
      mix(0.035, 0.15, random(aSeed * 613.1 + bondSeed)) *
      burstProgress;
    resolvedPosition.xy +=
      (releaseDirection * releaseRadius +
        releaseOrbit +
        releasedDrift +
        dispersedWander) *
      release;
    resolvedPosition.z +=
      release *
      mix(-0.18, 0.34, random(aSeed * 503.9 + aElasticEdgeIndex * 0.47));
    resolvedPosition.z += scatterInfluence * (0.07 + aSeed * 0.07);
    float focusDialRotation = uFocusDialRotation * apertureStrength;
    float focusDialCosine = cos(focusDialRotation);
    float focusDialSine = sin(focusDialRotation);
    vec2 focusDialPosition = resolvedPosition.xy;
    resolvedPosition.xy = vec2(
      focusDialPosition.x * focusDialCosine -
        focusDialPosition.y * focusDialSine,
      focusDialPosition.x * focusDialSine +
        focusDialPosition.y * focusDialCosine
    );
    resolvedPosition.z = mix(
      resolvedPosition.z,
      max(resolvedPosition.z, ${(.04+.035).toFixed(3)}),
      apertureStrength
    );

    vec4 viewPosition = modelViewMatrix * vec4(resolvedPosition, 1.0);
    float focusDistance = abs(resolvedPosition.z - uFocusPlaneZ);
    float focusBlur = smoothstep(
      0.72,
      max(uParticleBokehFalloffWorld, 0.721),
      focusDistance
    );
    float depthBlur = focusBlur * (1.0 - apertureStrength);
    float particleBokeh =
      clamp(
        pow(focusBlur, 1.34) * uParticleBokehStrengthMultiplier,
        0.0,
        1.0
      ) *
      (1.0 - apertureStrength);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aScale * uPointSize * uPixelRatio * (8.2 / -viewPosition.z) * depthParallax * mix(1.0, mix(0.28, 0.46, apertureWrapStrength), apertureStrength) * mix(1.0, 4.2, particleBokeh) * (1.0 + scatterInfluence * 0.2 + touchGlow * 0.3);

    float pulse = pow(max(sin(uTime * (0.58 + aSeed * 0.52) + aSeed * 41.0), 0.0), 14.0);
    pulse = pulse * (0.26 + aSeed * 0.34) * (1.0 - apertureStrength) * uMotion;
    pulse = max(pulse, touchGlow * (0.18 + aSeed * 0.1));
    vec2 clusterPosition = position.xy / max(uClusterSize * 0.5, vec2(0.001));
    float horizontalEdgeFade = 1.0 - smoothstep(0.92, 1.0, abs(clusterPosition.x));
    float clusterFade = mix(1.0, horizontalEdgeFade, uHorizontalEdgeFade);
    vec2 copyPosition = (resolvedPosition.xy - uCopyCenter) / max(uCopySize * 0.5, vec2(0.001));
    float copyAttenuation = smoothstep(0.72, 1.32, length(copyPosition));
    float apertureExteriorVisibility = mix(
      1.0,
      smoothstep(
        uApertureRadius - 0.035,
        uApertureRadius + 0.09,
        length(resolvedPosition.xy)
      ),
      apertureWrapStrength
    );
    float moteApertureVisibility = mix(
      1.0,
      smoothstep(
        uApertureRadius,
        uApertureRadius + 0.04,
        length(resolvedPosition.xy)
      ),
      isMote * uHideMotesInsideAperture
    );
    vKind = aKind;
    vGlow = touchGlow;
    vApertureStrength = apertureStrength;
    vApertureWrapStrength = apertureWrapStrength;
    vCenterAttenuation = mix(mix(0.015, 1.0, copyAttenuation), mix(0.18, 1.0, copyAttenuation), isMote);
    vDepthBlur = depthBlur;
    vParticleBokeh = particleBokeh * 0.65;
    float brokenSegmentVisibility = mix(1.0, 0.32 + (1.0 - release) * 0.68, isStructure);
    float apertureDefinition = mix(1.0, 0.98, apertureStrength);
    vOpacity = uIntroOpacity * clusterFade * brokenSegmentVisibility * aLayerOpacity * apertureDefinition * apertureExteriorVisibility * moteApertureVisibility * mix(1.0, depthGlow, isStructure * (1.0 - apertureStrength)) * mix(1.0, uStructureOpacityScale, isStructure) * mix(1.0, uMoteOpacityScale, isMote) * (0.45 + isBackbone * 0.23 - isBond * 0.04 - isMote * 0.12 + pulse * 0.36);
    vPulse = pulse;
    vSeed = aSeed;
  }
`,J=`
  varying float vKind;
  varying float vGlow;
  varying float vApertureStrength;
  varying float vApertureWrapStrength;
  varying float vCenterAttenuation;
  varying float vDepthBlur;
  varying float vParticleBokeh;
  varying float vOpacity;
  varying float vPulse;
  varying float vSeed;

  void main() {
    float isMote = step(1.5, vKind);
    vec2 centered = gl_PointCoord - vec2(0.5);
    float radius = length(centered);
    float dustCore = pow(max(1.0 - radius / 0.34, 0.0), 1.8);
    float dustHalo = pow(max(1.0 - radius / 0.52, 0.0), 2.65);
    float apertureCore = pow(max(1.0 - radius / 0.49, 0.0), 1.7);
    float apertureHalo = pow(max(1.0 - radius / 0.52, 0.0), 4.4) * 0.26;
    float core = mix(dustCore, apertureCore, vApertureStrength);
    float halo = mix(dustHalo, apertureHalo, vApertureStrength);
    float depthSoftCore = pow(max(1.0 - radius / 0.46, 0.0), 2.2) * 0.38;
    float depthSoftHalo = pow(max(1.0 - radius / 0.52, 0.0), 1.52);
    core = mix(core, depthSoftCore, vDepthBlur);
    halo = mix(halo, depthSoftHalo, vDepthBlur);
    core *= mix(1.0, 0.08, vParticleBokeh);
    halo = mix(
      halo,
      pow(max(1.0 - radius / 0.52, 0.0), 0.52),
      vParticleBokeh
    );

    if (halo <= 0.001) discard;

    vec3 structureColor = vec3(0.82);
    vec3 moteColor = vec3(0.46);
    vec3 color = mix(structureColor, moteColor, isMote);
    float particleVariation = mix(0.34, 1.52, pow(vSeed, 1.82));
    float bioGlow = smoothstep(0.015, 0.82, vGlow);
    float copyContrast = pow(vCenterAttenuation, 1.9);
    float interactionCopyContrast = mix(copyContrast, 1.0, bioGlow);
    vec3 baseLight = color * (0.93 + core * 0.5 + vPulse * 0.46) * copyContrast * mix(1.0, mix(1.2, 1.7, vApertureWrapStrength), vApertureStrength) * particleVariation * mix(1.0, 0.76, vDepthBlur) * mix(1.0, 0.52, vParticleBokeh);
    vec3 monochromeHalo = vec3(0.84, 0.96, 1.0);
    vec3 interactionHalo = monochromeHalo * bioGlow * halo * 0.62 * interactionCopyContrast;
    float hotCore = bioGlow * pow(core, 1.55);
    vec3 monochromeCore = vec3(0.9, 0.99, 1.0);
    vec3 activeCore = monochromeCore * hotCore * 1.28 * interactionCopyContrast;
    float restingCore = 0.84;
    float restingHalo = 0.16;
    float copyAlphaFloor = 0.14;
    float copyAlpha = mix(copyAlphaFloor, 1.0, copyContrast);
    float alpha = (core * (restingCore + vPulse * 0.45 + hotCore * 0.48) + halo * (restingHalo + vPulse * 0.21 + bioGlow * 0.28)) * vOpacity * mix(copyAlpha, 1.0, bioGlow) * mix(1.0, mix(1.04, 1.42, vApertureWrapStrength), vApertureStrength) * mix(0.36, 1.18, particleVariation) * mix(1.0, 0.48, vDepthBlur) * mix(1.0, 0.22, vParticleBokeh);

    gl_FragColor = vec4(min(baseLight + interactionHalo + activeCore, vec3(1.0)), alpha);
  }
`,Q=`
  #ifdef FRAMEBUFFER_PRECISION_HIGH
    uniform mediump sampler2D nearColorBuffer;
    uniform mediump sampler2D farColorBuffer;
  #else
    uniform lowp sampler2D nearColorBuffer;
    uniform lowp sampler2D farColorBuffer;
  #endif
  uniform lowp sampler2D farCoCBuffer;
  uniform lowp sampler2D nearCoCBuffer;
  uniform float scale;
  uniform float uDialBokehScale;
  uniform float uDialDepth;
  uniform float uDialDepthTolerance;
  uniform float uInvert;
  const float LIGHT_MODE_EXPOSURE = 5.0;

  void mainImage(
    const in vec4 inputColor,
    const in vec2 uv,
    const in float depth,
    out vec4 outputColor
  ) {
    vec4 colorNear = texture2D(nearColorBuffer, uv);
    vec4 colorFar = texture2D(farColorBuffer, uv);
    float dialMask =
      1.0 -
      smoothstep(
        uDialDepthTolerance * 0.5,
        uDialDepthTolerance,
        abs(depth - uDialDepth)
      );
    float resolvedScale = mix(scale, uDialBokehScale, dialMask);
    #if MASK_FUNCTION == 1 || MASK_FUNCTION == 2
      vec2 cocNearFar = vec2(texture2D(nearCoCBuffer, uv).r, colorFar.a);
      float resolvedFarCoC =
        min(texture2D(farCoCBuffer, uv).g * resolvedScale, 1.0);
      float farContributionScale =
        cocNearFar.y > 0.00001 ? resolvedFarCoC / cocNearFar.y : 0.0;
      // Reweight the pre-masked far buffer so a local scale of zero restores input color.
      cocNearFar = vec2(min(cocNearFar.x * resolvedScale, 1.0), resolvedFarCoC);
      colorFar.rgb *= farContributionScale;
      colorFar.a = resolvedFarCoC;
    #else
      vec2 cocNearFar = vec2(texture2D(nearCoCBuffer, uv).r, texture2D(farCoCBuffer, uv).g);
      cocNearFar = min(cocNearFar * resolvedScale, 1.0);
      colorFar.a *= cocNearFar.y;
    #endif
    vec4 result = inputColor * (1.0 - cocNearFar.y) + colorFar;
    result = mix(result, colorNear, cocNearFar.x);
    vec3 invertedColor = vec3(1.0) - min(result.rgb * LIGHT_MODE_EXPOSURE, vec3(1.0));
    outputColor = vec4(
      mix(result.rgb, invertedColor, uInvert),
      mix(result.a, 1.0, uInvert)
    );
  }
`,ee=`
  varying float vAngle;
  varying float vRadius;

  void main() {
    vAngle = atan(position.y, position.x);
    vRadius = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,et=`
  uniform float uApertureRadius;
  uniform float uCoronaIntensityScale;
  uniform float uCoronaSizeScale;
  uniform float uOpacity;
  uniform float uTime;

  varying float vAngle;
  varying float vRadius;

  void main() {
    float distanceFromRim = vRadius - uApertureRadius;
    float flareDistanceFromRim =
      distanceFromRim / max(uCoronaSizeScale, 0.001);
    float broadArc = 0.5 + 0.5 * sin(vAngle * 13.0 - uTime * 0.16);
    float fineArc = 0.5 + 0.5 * sin(vAngle * 29.0 + uTime * 0.11 + 1.7);
    float flareShape = pow(broadArc, 5.0) * 0.82 + pow(fineArc, 11.0) * 0.18;
    float glassArc =
      pow(max(cos(vAngle - 0.78), 0.0), 8.0) +
      pow(max(cos(vAngle + 2.18), 0.0), 12.0) * 0.82 +
      pow(max(cos(vAngle - 2.72), 0.0), 18.0) * 0.42;
    float glassGlint =
      pow(max(cos(vAngle * 3.0 + 0.64), 0.0), 22.0) *
      (0.6 + fineArc * 0.4);
    float outerReach = mix(0.034, 0.076, flareShape);
    float outerMask =
      smoothstep(-0.012, 0.018, flareDistanceFromRim) *
      (1.0 - smoothstep(0.02, outerReach, flareDistanceFromRim));
    float innerMask =
      smoothstep(-0.12, -0.012, distanceFromRim) *
      (1.0 - smoothstep(-0.012, 0.018, distanceFromRim));
    float innerGlow =
      smoothstep(-0.16, -0.02, flareDistanceFromRim) *
      (1.0 - smoothstep(-0.02, 0.018, flareDistanceFromRim));
    float hairline = 1.0 - smoothstep(0.0, 0.024, abs(distanceFromRim));
    float innerRefraction =
      1.0 - smoothstep(0.0, 0.014, abs(distanceFromRim + 0.022));
    float lensDepth = clamp(-distanceFromRim / max(uApertureRadius, 0.001), 0.0, 1.0);
    float convexEdge = pow(1.0 - lensDepth, 4.2);
    float convexMargin = 1.0 - smoothstep(0.08, 0.24, lensDepth);
    float convexHighlight =
      pow(max(cos(vAngle - 0.68), 0.0), 5.0) *
      convexEdge *
      convexMargin *
      smoothstep(0.08, 0.88, lensDepth);
    float convexCounterReflection =
      pow(max(cos(vAngle + 2.46), 0.0), 7.0) *
      convexEdge *
      convexMargin *
      smoothstep(0.06, 0.72, lensDepth);
    float wideHalo =
      smoothstep(-0.018, 0.032, flareDistanceFromRim) *
      (1.0 - smoothstep(0.028, 0.078, flareDistanceFromRim));
    float glassIntensity =
      hairline * (0.075 + glassArc * 0.22 + glassGlint * 0.11) +
      innerMask * (0.035 + glassArc * 0.13 + glassGlint * 0.055) +
      innerRefraction * (0.018 + glassArc * 0.035);
    float flareIntensity =
      outerMask * (0.045 + flareShape * 0.08) +
      innerGlow * (0.025 + glassArc * 0.09) +
      convexHighlight * 0.16 +
      convexCounterReflection * 0.055 +
      wideHalo * 0.025;
    float intensity = glassIntensity + flareIntensity * uCoronaIntensityScale;

    if (intensity <= 0.001) discard;

    gl_FragColor = vec4(vec3(0.9, 0.98, 1.0) * intensity, intensity * uOpacity);
  }
`,ea=`
  uniform float uApertureRadius;
  uniform float uFlareRotation;
  uniform float uOpacity;
  uniform float uTime;

  varying float vAngle;
  varying float vLensAngle;
  varying float vRadius;

  float getComplementaryBase(float base) {
    return mod(base + 2.0, 4.0);
  }

  void main() {
    const float notchCount = 48.0;
    const float pairedNotchCount = notchCount * 0.5;
    float notchProgress =
      (vAngle + 3.14159265359) / 6.28318530718 * notchCount;
    float notchIndex = floor(notchProgress);
    float notchOffset =
      (fract(notchProgress) - 0.5) *
      6.28318530718 /
      notchCount *
      vRadius;
    float distanceInsideRim = uApertureRadius - vRadius;
    float pairedNotchIndex = mod(notchIndex, pairedNotchCount);
    float base = mod(
      pairedNotchIndex * 3.0 + floor(pairedNotchIndex / 3.0) * 2.0,
      4.0
    );

    // The second half mirrors the first with valid DNA mates: A-T and C-G.
    if (notchIndex >= pairedNotchCount) {
      base = getComplementaryBase(base);
    }

    float halfWidth = 0.044;
    float outerGap = 0.074;
    float roundedOuterCap =
      1.0 - smoothstep(
        halfWidth,
        halfWidth + 0.014,
        length(vec2(notchOffset, distanceInsideRim - outerGap - 0.042))
      );
    float pillBody =
      (1.0 - smoothstep(halfWidth, halfWidth + 0.012, abs(notchOffset))) *
      smoothstep(outerGap, outerGap + 0.012, distanceInsideRim) *
      (1.0 - smoothstep(0.27, 0.282, distanceInsideRim));
    float tipEnvelope =
      smoothstep(0.26, 0.272, distanceInsideRim) *
      (1.0 - smoothstep(0.362, 0.374, distanceInsideRim));
    float flatTipMask =
      tipEnvelope *
      (1.0 - smoothstep(halfWidth, halfWidth + 0.012, abs(notchOffset)));
    float roundedTipMask =
      smoothstep(0.26, 0.272, distanceInsideRim) *
      (
        1.0 -
        smoothstep(
          halfWidth,
          halfWidth + 0.012,
          length(vec2(notchOffset, max(distanceInsideRim - 0.322, 0.0)))
        )
      );
    float pointedTipMask =
      tipEnvelope *
      (
        1.0 -
        smoothstep(
          0.0,
          0.018,
          abs(notchOffset) -
            mix(halfWidth, 0.0, smoothstep(0.27, 0.374, distanceInsideRim))
        )
      );
    float notchedTipMask =
      tipEnvelope *
      (1.0 - smoothstep(halfWidth, halfWidth + 0.012, abs(notchOffset))) *
      smoothstep(
        0.0,
        0.015,
        abs(notchOffset) -
          mix(0.0, halfWidth, smoothstep(0.27, 0.374, distanceInsideRim))
      );
    float concaveTipMask =
      flatTipMask *
      smoothstep(
        0.0,
        0.015,
        length(
          vec2(
            notchOffset,
            distanceInsideRim - 0.374
          )
        ) -
          halfWidth
      );
    float tipMask = mix(
      mix(notchedTipMask, roundedTipMask, step(0.5, base)),
      mix(pointedTipMask, concaveTipMask, step(2.5, base)),
      step(1.5, base)
    );
    float lensAngle = vLensAngle - uFlareRotation;
    float broadArc = 0.5 + 0.5 * sin(lensAngle * 13.0 - uTime * 0.16);
    float fineArc = 0.5 + 0.5 * sin(lensAngle * 29.0 + uTime * 0.11 + 1.7);
    float flareShape = pow(broadArc, 5.0) * 0.82 + pow(fineArc, 11.0) * 0.18;
    float lensLighting =
      pow(max(cos(lensAngle - 0.78), 0.0), 8.0) +
      pow(max(cos(lensAngle + 2.18), 0.0), 12.0) * 0.82 +
      pow(max(cos(lensAngle - 2.72), 0.0), 18.0) * 0.42 +
      pow(max(cos(lensAngle * 3.0 + 0.64), 0.0), 22.0) *
        (0.6 + fineArc * 0.4) *
        0.46 +
      flareShape * 0.08;
    float toothMask = min(roundedOuterCap + pillBody + tipMask, 1.0);
    float intensity =
      toothMask *
      (0.012 + lensLighting * 0.19);

    if (intensity <= 0.001) discard;

    gl_FragColor = vec4(vec3(0.9, 0.98, 1.0) * intensity, intensity * uOpacity);
  }
`,eo=`
  varying float vAngle;
  varying float vLensAngle;
  varying float vRadius;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vAngle = atan(position.y, position.x);
    vLensAngle = atan(worldPosition.y, worldPosition.x);
    vRadius = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function ei({visibility:e,timeline:t}){let a=(0,i.useThree)(e=>e.clock),o=(0,i.useThree)(e=>e.invalidate);return(0,n.useLayoutEffect)(()=>{var i,r;i=t.current,r=a.elapsedTime,i.ready=!0,i.visibility=e,i.lastClockElapsedSeconds="visible"===e?r:void 0,"visible"===e&&o()},[a,o,t,e]),null}function er(e){return e.dragging||Math.abs(e.rotation)>=1e-4||Math.abs(e.velocity)>=.001}function en(e,t,a=!1){if(!e.dial.dragging)return!1;let o=Math.max((t-e.dial.timestamp)/1e3,0);return e.dial.velocity=a?0:e.dial.velocity*Math.exp(-(22*o))*.78,e.dial.dragging=!1,e.dial.pointerAngle=void 0,e.hovering=!1,e.pointerId=void 0,!0}function es(e,t,a,o){return L(X(e,t,o),a.current.dial.rotation)}function el(e,t){return e*(t?.apertureWidthRatio??0)}function ec(e,t,a){let o=document.createElement("div");o.style.position="absolute",o.style.visibility="hidden",o.style.width=t,e.appendChild(o);let i=o.getBoundingClientRect().width;return o.remove(),i||a}function eu(){let e=new Float32Array(40960),t=new s.DataTexture(e,128,80,s.RGBAFormat,s.FloatType);return t.magFilter=s.LinearFilter,t.minFilter=s.LinearFilter,t.generateMipmaps=!1,t.needsUpdate=!0,{data:e,texture:t}}function ed(e,t,a,o,i=o,r){for(let n=0;n<t.length;n+=2){let s=t[n],l=t[n+1],c=2*s,u=2*l,d=4*s,h=4*l,p=e.graph.nodePositions[u]+e.displacements[h]-e.graph.nodePositions[c]-e.displacements[d],f=e.graph.nodePositions[u+1]+e.displacements[h+1]-e.graph.nodePositions[c+1]-e.displacements[d+1],m=Math.max(Math.hypot(p,f),1e-4),g=m-a[n/2],v=g*(g<0?i:o)*(r?.[n/2]??1),S=p/m*v,x=f/m*v;e.forces[c]+=S,e.forces[c+1]+=x,e.forces[u]-=S,e.forces[u+1]-=x}}function eh(e,t,a,o,i){let[r,n]=o,l=t.x*a.width*.5,c=t.y*a.height*.5;if(Math.abs(l)>r/2+i.radiusWorld||Math.abs(c)>n/2+i.radiusWorld)return;let u=(l/r+.5)*127,d=(c/n+.5)*79,h=Math.ceil(i.radiusWorld/r*256),p=Math.ceil(i.radiusWorld/n*160);for(let a=Math.max(0,Math.floor(d)-p);a<=Math.min(79,Math.ceil(d)+p);a+=1)for(let o=Math.max(0,Math.floor(u)-h);o<=Math.min(127,Math.ceil(u)+h);o+=1){let l=(o-u)/128*r,c=(a-d)/80*n,h=Math.exp(-(l*l+c*c)/(i.radiusWorld*i.radiusWorld)),p=(128*a+o)*4,f=h*t.glowStrength*i.glowScale,m=h*t.impulseStrength*i.impulseScale;e[p+3]=Math.max(e[p+3],f),e[p]=s.MathUtils.clamp(e[p]+t.gustX*m,-i.maxImpulse,i.maxImpulse),e[p+1]=s.MathUtils.clamp(e[p+1]+t.gustY*m,-i.maxImpulse,i.maxImpulse)}}function ep({pointerState:e,reducedMotion:t}){return(0,o.useFrame)((a,o)=>{let i=e.current.dial;if(i.dragging)return;if(t){i.rotation=0,i.velocity=0;return}let r=function(e,t){let a=Math.max(1,Math.ceil(Math.max(t,0)/(1/120))),o=Math.min(Math.max(t,0)/a,1/120),{rotation:i,velocity:r}=e;for(let e=0;e<a;e+=1)r+=-(18*i)*o,r*=Math.exp(-4.8*o),i+=r*o;return 1e-4>Math.abs(i)&&.001>Math.abs(r)?{rotation:0,velocity:0}:{rotation:i,velocity:r}}(i,o);i.rotation=r.rotation,i.velocity=r.velocity},-2),null}function ef({colorSchemeDark:e,compact:a,copyBounds:r,mobileLayout:l,fieldWidthScale:u,focusTuning:h,horizontalEdgeFadeEnabled:f,maxParticleCount:m,mobileSpecimens:b,pointerState:P,reducedMotion:w,timeline:F}){let T=(0,i.useThree)(e=>e.viewport.height),L=(0,i.useThree)(e=>e.viewport.width),G=(0,n.useMemo)(()=>({height:T,width:L}),[T,L]),Y=(0,n.useMemo)(()=>({height:G.height,width:G.width*u}),[u,G.height,G.width]),U=l?0:el(G.width,r),_=(0,n.useMemo)(()=>(function(e=g,t,a=t,o={}){let i,r=A(t),n=A(a),s=e.backbones+e.bonds+e.motes,l=H(a,o.minimumApertureDiameter),c=new Float32Array(s),u=new Float32Array(3*s),d=new Float32Array(s).fill(-1),h=new Float32Array(s).fill(-1),f=new Float32Array(s),m=new Float32Array(s).fill(-1),v=new Float32Array(2*s),S=new Float32Array(s),b=new Float32Array(s),P=new Float32Array(3*s),w=new Float32Array(s),F=new Float32Array(s),T=new Float32Array(s),I=new Float32Array(3*s),X=(i=1952,()=>(i=1664525*i+0x3c6ef35f>>>0)/0x100000000),L=Array.from({length:15},()=>{let e=(.5>X()?-1:1)*(.9+4.2*Math.pow(X(),.72)),t=.48+1.42*X(),a=.42+1.22*X();return{depth:e,radiusX:t,radiusY:a,radiusZ:.72+.16*Math.abs(e)+.24*a,x:M(X)*r.width*.5,y:M(X)*r.height*.5}}),G=function(e,t="default",a){let o={braceEdges:[],edges:[],networkBraceEdges:[],nodes:[]},i="mobile"===t?204:178;return("mobile"===t?D.map((e,t)=>{let o=a?.[t];if(!o)return e;let i=o.z-e.depth;return{...e,depth:o.z,depthEnd:(e.depthEnd??e.depth)+i,mobilePath:e.mobilePath?{...e.mobilePath,rotation:o.rotationDegrees*Math.PI/180}:void 0,offsetX:o.x,offsetY:o.y}}):R).forEach(t=>{!function(e,t,a,o){let i=[],r=[],n=Math.round((o.helixTurns??10.25)*10),s=new Set(Array.from({length:n},(e,t)=>Math.round((t+.5)/n*(a-1)))),l=.36*Math.min(1.12,o.radiusScale)*(o.railRadiusScale??1),c=.48*Math.min(1.08,o.radiusScale)*(o.railDepthScale??1);for(let n=0;n<a;n+=1){let u=n/(a-1),{position:d,tangent:h}=function(e,t,a){let o=O(e,t,a),i=O(Math.max(0,e-.0018726591760299626),t,a),r=O(Math.min(1,e+.0018726591760299626),t,a);return{position:o,tangent:C([r[0]-i[0],r[1]-i[1],r[2]-i[2]])}}(u,t,o),f=C([-h[1],h[0],0]),m=C([h[1]*f[2]-h[2]*f[1],h[2]*f[0]-h[0]*f[2],h[0]*f[1]-h[1]*f[0]]),g=1+(1.34-1)*Math.pow(o.aperture?0:B(.68,7.7,d[2]),1.08),v=u*p*(o.helixTurns??10.25)+o.motionPhase,S=E(k(f,Math.cos(v)*l*g),k(m,Math.sin(v)*c*g)),x=e.nodes.length;e.nodes.push({aperture:o.aperture??!1,apertureWrap:o.aperture??!1,centerline:d,layerOpacity:o.opacity,motionScale:o.motionScale??1,position:E(d,S),strandPhase:v,tangent:h});let M=e.nodes.length;if(e.nodes.push({aperture:o.aperture??!1,apertureWrap:o.aperture??!1,centerline:d,layerOpacity:o.opacity,motionScale:o.motionScale??1,position:E(d,k(S,-1)),strandPhase:v,tangent:h}),r.push([x,M]),o.aperture){let t=e.nodes.length;e.nodes.push({aperture:!0,apertureWrap:!1,centerline:d,layerOpacity:o.opacity,motionScale:0,position:d,strandPhase:v,tangent:h}),i.push(t)}if(n>0){let t=r[n-1],a=z(o,d[2]);N(e.edges,t[0],x,"backbone",o,{particleWeight:a}),N(e.edges,t[1],M,"backbone",o,{particleWeight:a}),o.aperture&&N(e.edges,i[n-1],i[n],"backbone",o,{particleWeight:o.rimParticleWeight,thicknessScale:.24})}if(s.has(n)&&N(e.edges,x,M,"bond",o,{particleWeight:z(o,d[2])}),n>1){let t=r[n-2];e.braceEdges.push([t[0],x],[t[1],M])}if(o.interactive&&n>7){let t=r[n-8];e.networkBraceEdges.push([t[0],x],[t[1],M])}}}(o,e,Math.round(i*(t.sampleMultiplier??1)),t)}),o}(n,o.layout,o.mobileSpecimens),Y={braceEdges:Uint32Array.from(G.braceEdges.flat()),edgeCanTear:Uint8Array.from(G.edges.map(({canTear:e})=>+!!e)),edges:Uint32Array.from(G.edges.flatMap(({start:e,end:t})=>[e,t])),networkBraceEdges:Uint32Array.from(G.networkBraceEdges.flat()),nodeAnchorStrengths:Float32Array.from(G.nodes.map(({centerline:[e,t]})=>.14+.86*x((Math.max(Math.abs(e)/(n.width/2),Math.abs(t)/(n.height/2))-.48)/.5))),nodeApertureRimStrengths:Float32Array.from(G.nodes.map(({aperture:e,apertureWrap:t})=>e&&!t?1:0)),nodeCenterlinePositions:Float32Array.from(G.nodes.flatMap(({centerline:e})=>e)),nodeLayerOpacities:Float32Array.from(G.nodes.map(({layerOpacity:e})=>e)),nodeMotionScales:Float32Array.from(G.nodes.map(({motionScale:e})=>e)),nodePositions:Float32Array.from(G.nodes.flatMap(({position:[e,t]})=>[e,t])),nodeRenderPositions:Float32Array.from(G.nodes.flatMap(({position:e})=>e)),nodeStrandPhases:Float32Array.from(G.nodes.map(({strandPhase:e})=>e)),nodeTangentDirections:Float32Array.from(G.nodes.flatMap(({tangent:e})=>e))},U=e=>G.edges.flatMap((t,a)=>t.kind===e?Array.from({length:t.particleWeight},()=>({edge:t,edgeIndex:a})):[]),j=U("backbone"),_=U("bond"),V=(e,t,a)=>e["mobile"===o.layout?Math.floor(t/a*e.length):t%e.length],K=0,Z=(e,t,a,o)=>{let i=G.edges[e],r=G.nodes[i.start],n=G.nodes[i.end],s=X(),l=W(r.position,n.position,s),p=W(r.centerline,n.centerline,s),g=C(W(r.tangent,n.tangent,s)),x=C([-g[1],g[0],0]),M=C([g[1]*x[2]-g[2]*x[1],g[2]*x[0]-g[0]*x[2],g[0]*x[1]-g[1]*x[0]]),R=i.aperture?.76:1,D=y(X)*a*i.thicknessScale*R,A=y(X)*a*i.thicknessScale*R,E=3*K;P[E]=l[0]+x[0]*D+M[0]*A,P[E+1]=l[1]+x[1]*D+M[1]*A,P[E+2]=l[2]+x[2]*D+M[2]*A,u[E]=p[0],u[E+1]=p[1],u[E+2]=p[2],I[E]=g[0],I[E+1]=g[1],I[E+2]=g[2],d[K]=e,m[K]=i.start,h[K]=i.end,f[K]=s,c[K]=+!!i.aperture,v[2*K]=+!!i.aperture,v[2*K+1]=i.aperture&&i.thicknessScale>.5?1:0,S[K]=t,b[K]=i.layerOpacity,w[K]=o,F[K]=X(),T[K]=r.strandPhase+(n.strandPhase-r.strandPhase)*s,K+=1};for(let t=0;t<e.backbones;t+=1)Z(V(j,t,e.backbones).edgeIndex,0,.026,.14+.76*Math.pow(X(),2.4)+(.045>X()?.4+.52*X():0));for(let t=0;t<e.bonds;t+=1)Z(V(_,t,e.bonds).edgeIndex,1,.018,.1+.5*Math.pow(X(),2.5)+(.025>X()?.22+.3*X():0));for(let t=0;t<e.motes;t+=1){let e,t=3*K,a=X()*p,i="mobile"===o.layout?.32:.022,n="mobile"===o.layout?1.08:.78,s=X()<i,c=X(),d="mobile"===o.layout&&!s&&c<.1,h="mobile"===o.layout&&s,f=c<.2,m=L[Math.floor(X()*L.length)],g=X()*p,R=Math.sqrt(X())*l*n;e=d?[r.width*(.16+.38*X()),r.height*(.12+.36*X()),-1.8+3.6*X()]:s?[Math.cos(g)*R,Math.sin(g)*R,.04+.14+.34*X()]:f?[M(X)*r.width*.5,M(X)*r.height*.5,4.8*M(X)]:[x(m.x+y(X)*m.radiusX,-(.54*r.width),.54*r.width),x(m.y+y(X)*m.radiusY,-(.54*r.height),.54*r.height),m.depth+Math.tanh(.68*y(X))*m.radiusZ*1.65],P[t]=e[0],P[t+1]=e[1],P[t+2]=e[2],u[t]=P[t],u[t+1]=P[t+1],u[t+2]=P[t+2],I[t+2]=1,v[2*K]=Math.cos(a),v[2*K+1]=Math.sin(a),S[K]=2;let D=.34+.4*X(),A=x((P[t+2]-.8)/2.8),C=.16+1.18*Math.pow(X(),2.05)+A*(.46+1.16*X())+(.04>X()?1.34+2.24*X():0);b[K]=h?Math.min(1,D+.22):D,w[K]=h?.12+.42*Math.min(C,1.6):C,F[K]=X(),T[K]=X()*p,K+=1}return{apertureRadius:l,apertureStrengths:c,centerlinePositions:u,count:s,elasticEdgeIndices:d,elasticEndNodeIndices:h,elasticGraph:Y,elasticProgresses:f,elasticStartNodeIndices:m,fieldSize:[r.width,r.height],flowDirections:v,kinds:S,layerOpacities:b,positions:P,scales:w,seeds:F,strandPhases:T,tangentDirections:I}})(function(e,t){let a=e.backbones+e.bonds+e.motes;if(t<=0)return{backbones:0,bonds:0,motes:0};if(a<=t)return e;let o=t/a;return{backbones:Math.floor(e.backbones*o),bonds:Math.floor(e.bonds*o),motes:Math.floor(e.motes*o)}}(function(e,t,a=!1){let o=g;a?o=S:e&&(o=v);let i=A(t),r=i.width*i.height/(d.width*d.height);return{backbones:Math.round(o.backbones*r),bonds:Math.round(o.bonds*r),motes:Math.round(o.motes*r)}}(a,G,l),m),G,Y,{layout:l?"mobile":"default",minimumApertureDiameter:U,mobileSpecimens:b}),[a,m,l,U,b,G,Y]),V=(0,n.useMemo)(()=>{let e=new s.BufferGeometry;return e.setAttribute("position",new s.Float32BufferAttribute(_.positions,3)),e.setAttribute("aCenterlinePosition",new s.Float32BufferAttribute(_.centerlinePositions,3)),e.setAttribute("aKind",new s.Float32BufferAttribute(_.kinds,1)),e.setAttribute("aLayerOpacity",new s.Float32BufferAttribute(_.layerOpacities,1)),e.setAttribute("aScale",new s.Float32BufferAttribute(_.scales,1)),e.setAttribute("aSeed",new s.Float32BufferAttribute(_.seeds,1)),e.setAttribute("aStrandPhase",new s.Float32BufferAttribute(_.strandPhases,1)),e.setAttribute("aTangentDirection",new s.Float32BufferAttribute(_.tangentDirections,3)),e.setAttribute("aFlowDirection",new s.Float32BufferAttribute(_.flowDirections,2)),e.setAttribute("aElasticEdgeIndex",new s.Float32BufferAttribute(_.elasticEdgeIndices,1)),e.setAttribute("aElasticStartNodeIndex",new s.Float32BufferAttribute(_.elasticStartNodeIndices,1)),e.setAttribute("aElasticEndNodeIndex",new s.Float32BufferAttribute(_.elasticEndNodeIndices,1)),e.setAttribute("aElasticProgress",new s.Float32BufferAttribute(_.elasticProgresses,1)),e.computeBoundingSphere(),e},[_]),Q=(0,n.useMemo)(()=>eu(),[]),ee=(0,n.useMemo)(()=>(function(e){let t=e.nodePositions.length/2,a=e.edges.length/2,o=new Float32Array(e.braceEdges.length/2),i=new Float32Array(e.networkBraceEdges.length/2),r=new Float32Array(4*t),n=new Float32Array(4*t),l=new Float32Array(a),c=new Float32Array(a),u=new Float32Array(a),d=new Float32Array(a).fill(1),h=new Int32Array(a).fill(-1),p=new Float32Array(a).fill(1),f=new Float32Array(a),m=new Float32Array(4*Math.max(a,1)),g=new Float32Array(2*t),v=new Float32Array(2*t),S=new Float32Array(e.edges.length/2),x=new Float32Array(e.edges.length/2),M=new s.DataTexture(r,Math.max(t,1),1,s.RGBAFormat,s.FloatType),y=new s.DataTexture(m,Math.max(a,1),1,s.RGBAFormat,s.FloatType),b=new Float32Array(4*Math.max(t,1)),P=new s.DataTexture(b,Math.max(t,1),1,s.RGBAFormat,s.FloatType);for(let a=0;a<t;a+=1)b[4*a]=e.nodeRenderPositions[3*a],b[4*a+1]=e.nodeRenderPositions[3*a+1],b[4*a+2]=e.nodeRenderPositions[3*a+2];for(let t=0;t<e.edges.length;t+=2){let a=2*e.edges[t],o=2*e.edges[t+1];x[t/2]=Math.hypot(e.nodePositions[o]-e.nodePositions[a],e.nodePositions[o+1]-e.nodePositions[a+1]),S[t/2]=.68*x[t/2]}for(let t=0;t<e.braceEdges.length;t+=2){let a=2*e.braceEdges[t],i=2*e.braceEdges[t+1];o[t/2]=Math.hypot(e.nodePositions[i]-e.nodePositions[a],e.nodePositions[i+1]-e.nodePositions[a+1])}for(let t=0;t<e.networkBraceEdges.length;t+=2){let a=2*e.networkBraceEdges[t],o=2*e.networkBraceEdges[t+1];i[t/2]=Math.hypot(e.nodePositions[o]-e.nodePositions[a],e.nodePositions[o+1]-e.nodePositions[a+1])}for(let e=0;e<a;e+=1)m[4*e]=1;return M.magFilter=s.NearestFilter,M.minFilter=s.NearestFilter,M.generateMipmaps=!1,M.needsUpdate=!0,y.magFilter=s.NearestFilter,y.minFilter=s.NearestFilter,y.generateMipmaps=!1,y.needsUpdate=!0,P.magFilter=s.NearestFilter,P.minFilter=s.NearestFilter,P.generateMipmaps=!1,P.needsUpdate=!0,{braceRestLengths:o,displacements:r,dragStartDisplacements:n,draggingLastFrame:!1,edgeRepairDurations:l,edgeRepairDelayTimes:c,edgeRepairElapsedTimes:u,edgeRepairStartStrengths:d,edgeRepairTouchSessionIds:h,edgeBurstProgresses:f,edgeStrengths:p,edgeStrengthTexture:y,edgeStrengthTextureData:m,forces:g,graph:e,networkBraceRestLengths:i,nodePositionTexture:P,restLengths:S,texture:M,touchElapsedSeconds:0,touchSessionId:0,velocities:v,bondDurabilityRestLengths:x}})(_.elasticGraph),[_.elasticGraph]),et=(0,n.useMemo)(()=>eu(),[]),ea=(0,n.useMemo)(()=>new s.ShaderMaterial({blending:s.AdditiveBlending,depthWrite:!1,fragmentShader:J,transparent:!0,uniforms:{uApertureRadius:{value:_.apertureRadius},uIntroOpacity:{value:X(0,w).opacity},uMotion:{value:+!w},uMoteOpacityScale:{value:e||l?1:.82},uPixelRatio:{value:Math.min(window.devicePixelRatio,K(a,l))},uPointSize:{value:l?2.48:a?2.78:2.92},uTime:{value:0},uStructureOpacityScale:{value:l?1.62:a?1.14:1},uDisturbanceMap:{value:Q.texture},uElasticNodeMap:{value:ee.texture},uElasticNodePositionMap:{value:ee.nodePositionTexture},uElasticNodeTextureWidth:{value:Math.max(_.elasticGraph.nodePositions.length/2,1)},uElasticBondMap:{value:ee.edgeStrengthTexture},uElasticBondTextureWidth:{value:Math.max(_.elasticGraph.edges.length/2,1)},uTetherMap:{value:et.texture},uCopyCenter:{value:new s.Vector2(L*(r?.centerXRatio??0),-T*(r?.centerYRatio??0))},uCopySize:{value:new s.Vector2(L*(r?.widthRatio??0),T*(r?.heightRatio??0))},uClusterSize:{value:new s.Vector2(G.width,G.height)},uFieldSize:{value:new s.Vector2(..._.fieldSize)},uHorizontalEdgeFade:{value:+!!f},uHideMotesInsideAperture:{value:+!l},uFocusDialRotation:{value:X(0,w).dialRotation},uFocusPlaneZ:{value:10-X(0,w).focusDistance},uMoteCameraDistanceOffsetWorld:{value:c.moteCameraDistanceOffsetWorld},uParticleBokehFalloffWorld:{value:c.particleBokehFalloffWorld},uParticleBokehStrengthMultiplier:{value:c.particleBokehStrengthMultiplier}},vertexShader:q}),[a,e,l,r?.centerXRatio,r?.centerYRatio,r?.heightRatio,r?.widthRatio,Q.texture,ee.edgeStrengthTexture,ee.nodePositionTexture,ee.texture,f,_.apertureRadius,_.elasticGraph.edges.length,_.elasticGraph.nodePositions.length,_.fieldSize,G.height,G.width,w,et.texture,T,L]);return(0,o.useFrame)(({clock:e,viewport:t},a)=>{let o=w?0:j(F.current,e.elapsedTime),i=+!w,r=P.current.pendingInteractions;!function(e,t){let a=Math.exp(-(1.15*t)),o=Math.exp(-(1.55*t));for(let t=0;t<e.length;t+=4)e[t]*=a,e[t+1]*=a,e[t+3]*=o,Math.abs(e[t])+Math.abs(e[t+1])<5e-4&&(e[t]=0,e[t+1]=0)}(Q.data,a);var n=et.data;let l=Math.exp(-(6.4*a));for(let e=0;e<n.length;e+=4)n[e]*=l,n[e+1]*=l,Math.abs(n[e])+Math.abs(n[e+1])<5e-4&&(n[e]=0,n[e+1]=0);P.current.dragging&&!ee.draggingLastFrame&&(ee.touchElapsedSeconds=0,ee.touchSessionId+=1),P.current.dragging&&(ee.touchElapsedSeconds+=a),r.forEach(e=>{!function(e,t,a,o,i){if(!t.tearsBonds||!t.impulseStrength)return;let r=t.x*a.width*.5,n=t.y*a.height*.5;for(let a=0;a<e.graph.edges.length;a+=2){let l=a/2;if(!e.graph.edgeCanTear[l])continue;let c=e.graph.edges[a],u=e.graph.edges[a+1],d=2*c,h=2*u,p=4*c,f=4*u,[m,g]=I(e.graph,c,e.displacements[p],e.displacements[p+1],o,i),[v,S]=I(e.graph,u,e.displacements[f],e.displacements[f+1],o,i),M=function(e,t,a,o,i,r){let n=i-a,l=r-o,c=n*n+l*l,u=c>0?s.MathUtils.clamp(((e-a)*n+(t-o)*l)/c,0,1):0;return Math.hypot(e-(a+n*u),t-(o+l*u))}(r,n,m,g,v,S),y=e.edgeStrengths[l],b=x(y-Math.exp(-(M*M)/.0144)*t.impulseStrength*.92,.14,1),P=y-b;if(e.edgeStrengths[l]=b,P<=0)continue;y>=1&&(e.edgeBurstProgresses[l]=0),e.edgeRepairDurations[l]=2.4+(2*Math.abs(43758.5453*Math.sin(12.9898*l+78.233)%1)-1)*.333,e.edgeRepairTouchSessionIds[l]!==e.touchSessionId&&(e.edgeRepairDelayTimes[l]=1.25*(1-Math.exp(-Math.max(0,e.touchElapsedSeconds)/1.5)),e.edgeRepairTouchSessionIds[l]=e.touchSessionId),e.edgeRepairElapsedTimes[l]=0,e.edgeRepairStartStrengths[l]=b;let w=Math.max(Math.hypot(v-m,S-g),1e-4),R=1.35*P,D=(v-m)/w*R,F=(S-g)/w*R;e.velocities[d]-=D,e.velocities[d+1]-=F,e.velocities[h]+=D,e.velocities[h+1]+=F}}(ee,e,t,o,i),e.paintsDisturbanceField&&(eh(Q.data,e,t,_.fieldSize,Z),eh(et.data,e,t,_.fieldSize,$))}),r.length=0,function(e,t,a){if(!a)for(let a=0;a<e.edgeStrengths.length;a+=1){if(e.edgeStrengths[a]>=1)continue;let o=e.edgeRepairDurations[a],i=e.edgeRepairDelayTimes[a],r=Math.min(e.edgeRepairElapsedTimes[a]+t,i+o);e.edgeRepairElapsedTimes[a]=r,e.edgeStrengths[a]=function(e,t,a){let o=x(t/Math.max(a,.001));return e+o*o*(3-2*o)*(1-e)}(e.edgeRepairStartStrengths[a],Math.max(0,r-i),o)}}(ee,a,P.current.dragging);for(let e=0;e<ee.edgeBurstProgresses.length;e+=1){if(ee.edgeStrengths[e]>=1){ee.edgeBurstProgresses[e]=0;continue}ee.edgeBurstProgresses[e]=Math.min(ee.edgeBurstProgresses[e]+a/.24,1)}for(let e=0;e<ee.edgeStrengths.length;e+=1)ee.edgeStrengthTextureData[4*e]=ee.edgeStrengths[e],ee.edgeStrengthTextureData[4*e+1]=ee.edgeBurstProgresses[e];ee.edgeStrengthTexture.needsUpdate=!0;let c=P.current.hovering&&!P.current.dragging&&performance.now()>=P.current.hoverSuppressedUntil&&!er(P.current.dial);!function(e,t,a,o,i,r,n,s,l){let c=e.graph.nodePositions.length/2,u=t.anchorX*r.width*.5,d=t.anchorY*r.height*.5,h=t.offsetX*r.width*.5,p=t.offsetY*r.height*.5,f=Math.hypot(h,p),m=.62*(1-Math.exp(-f/1.1)),g=f?m/f:0,v=h*g,S=p*g,x=o.anchorX*r.width*.5,M=o.anchorY*r.height*.5,y=o.offsetX*r.width*.5,b=o.offsetY*r.height*.5,P=Math.hypot(y,b),w=P>.22?.22/P:1,R=y*w,D=b*w,F=Math.min(n,1/30)/32,A=Math.exp(-11*F);a&&!e.draggingLastFrame&&e.dragStartDisplacements.set(e.displacements),e.draggingLastFrame=a;for(let t=0;t<32;t+=1){e.forces.fill(0),ed(e,e.graph.edges,e.restLengths,2700,6480,e.edgeStrengths),ed(e,e.graph.edges,e.bondDurabilityRestLengths,0,14e3,e.edgeStrengths),ed(e,e.graph.braceEdges,e.braceRestLengths,980,2352),ed(e,e.graph.networkBraceEdges,e.networkBraceRestLengths,2250,3150);for(let t=0;t<c;t+=1){let o=2*t,r=4*t,n=e.displacements[r],c=e.displacements[r+1],h=e.graph.nodeAnchorStrengths[t];if(e.forces[o]-=16*n*h,e.forces[o+1]-=16*c*h,a){let a=e.dragStartDisplacements[r],i=e.dragStartDisplacements[r+1],[h,p]=I(e.graph,t,a,i,s,l),f=Math.exp(-((h-u)*(h-u)+(p-d)*(p-d))/(1.36*1.36));e.forces[o]+=(a+v-n)*720*f,e.forces[o+1]+=(i+S-c)*720*f}if(i){let[a,i]=I(e.graph,t,n,c,s,l),r=Math.exp(-((a-x)*(a-x)+(i-M)*(i-M))/.6084);e.forces[o]+=360*R*r,e.forces[o+1]+=360*D*r}e.velocities[o]=(e.velocities[o]+e.forces[o]*F)*A,e.velocities[o+1]=(e.velocities[o+1]+e.forces[o+1]*F)*A;let p=Math.hypot(e.velocities[o],e.velocities[o+1]),f=p>3.4?3.4/p:1;e.velocities[o]*=f,e.velocities[o+1]*=f;let m=n+e.velocities[o]*F,g=c+e.velocities[o+1]*F,y=Math.hypot(m,g),b=y>1.48?1.48/y:1;e.displacements[r]=m*b,e.displacements[r+1]=g*b}}e.texture.needsUpdate=!0}(ee,P.current.meshDrag,P.current.dragging,P.current.meshHover,c,t,a,o,i);let u=Math.exp(-(9*a));P.current.meshHover.offsetX*=u,P.current.meshHover.offsetY*=u,Q.texture.needsUpdate=!0,et.texture.needsUpdate=!0,ea.uniforms.uTime.value=o;let d=es(o,w,P,h);ea.uniforms.uIntroOpacity.value=d.opacity,ea.uniforms.uFocusDialRotation.value=d.dialRotation,ea.uniforms.uFocusPlaneZ.value=10-d.focusDistance,ea.uniforms.uMoteCameraDistanceOffsetWorld.value=h.moteCameraDistanceOffsetWorld,ea.uniforms.uParticleBokehFalloffWorld.value=h.particleBokehFalloffWorld,ea.uniforms.uParticleBokehStrengthMultiplier.value=h.particleBokehStrengthMultiplier}),(0,n.useEffect)(()=>()=>{V.dispose(),ea.dispose(),Q.texture.dispose(),ee.edgeStrengthTexture.dispose(),ee.nodePositionTexture.dispose(),ee.texture.dispose(),et.texture.dispose()},[Q.texture,ee.edgeStrengthTexture,ee.nodePositionTexture,ee.texture,V,ea,et.texture]),(0,t.jsx)("points",{geometry:V,material:ea,position:[0,0,0],frustumCulled:!1})}function em({copyBounds:e,fieldWidthScale:a,focusTuning:r,pointerState:l,reducedMotion:u,timeline:d}){let h=(0,i.useThree)(e=>e.viewport.height),p=(0,i.useThree)(e=>e.viewport.width),f=(0,i.useThree)(e=>e.invalidate),m=(0,n.useRef)(null),g=(0,n.useRef)(null),v=(0,n.useRef)(null),S=(0,n.useRef)(null),x=(0,n.useRef)(null),M=(0,n.useRef)(0),y=(0,n.useRef)(void 0),b=(0,n.useRef)(0),P=(0,n.useRef)(0),w=(0,n.useMemo)(()=>H({height:h,width:p*a},el(p,e)),[e,a,h,p]),R=(0,n.useMemo)(()=>({baseMask:new s.RingGeometry(w-.086,w,192),corona:new s.RingGeometry(w-.72,w+.72,192),depthSupport:new s.RingGeometry(w,w+.42,192),lensMask:new s.CircleGeometry(w,192),notches:new s.RingGeometry(w-.385,w-.068,288)}),[w]);return(0,n.useEffect)(()=>{let e=v.current;e&&(e.uniforms.uApertureRadius.value=w,e.uniforms.uCoronaIntensityScale.value=r.coronaIntensityScale,e.uniforms.uCoronaSizeScale.value=r.coronaSizeScale,f())},[w,r.coronaIntensityScale,r.coronaSizeScale,f]),(0,n.useEffect)(()=>()=>{Object.values(R).forEach(e=>e.dispose())},[R]),(0,o.useFrame)(({clock:e},t)=>{if(!g.current)return;let a=u?0:j(d.current,e.elapsedTime),o=X(a,u,r),i=L(o,l.current.dial.rotation),n=l.current,c=er(n.dial);if(g.current.rotation.z=o.dialRotation,u)M.current=0,y.current=void 0,b.current=0,P.current=0;else if(c)y.current=void 0;else if(P.current=s.MathUtils.lerp(P.current,0,1-Math.exp(-(4.6*t))),n.dialHovering&&Math.hypot(n.x,n.y)>=.16){let e=Math.atan2(n.y,n.x),t=y.current;if(void 0!==t){let a=Math.atan2(Math.sin(e-t),Math.cos(e-t));P.current=s.MathUtils.clamp(P.current+.1*a,-.14,.14)}y.current=e}else y.current=void 0;u||!(a>2.7199999999999998)||n.dialHovering||c||(M.current+=-.1*t),c||(b.current=s.MathUtils.lerp(b.current,P.current,1-Math.exp(-(8*t)))),m.current&&(m.current.rotation.z=b.current),x.current&&(x.current.rotation.z=18*o.dialRotation+M.current+n.dial.rotation),S.current&&(S.current.uniforms.uApertureRadius.value=w,S.current.uniforms.uFlareRotation.value=g.current.rotation.z+b.current,S.current.uniforms.uOpacity.value=i.opacity,S.current.uniforms.uTime.value=a),v.current&&(v.current.uniforms.uApertureRadius.value=w,v.current.uniforms.uOpacity.value=i.opacity,v.current.uniforms.uTime.value=a)}),(0,t.jsxs)("group",{ref:g,children:[(0,t.jsx)("mesh",{geometry:R.lensMask,position:[0,0,.04],renderOrder:-1,children:(0,t.jsx)("meshBasicMaterial",{color:"#000000",depthTest:!0,depthWrite:!0,toneMapped:!1})}),(0,t.jsx)("mesh",{geometry:R.depthSupport,position:[0,0,-1.91],renderOrder:-1,children:(0,t.jsx)("meshBasicMaterial",{colorWrite:!1,depthTest:!0,depthWrite:!0})}),(0,t.jsx)("mesh",{ref:m,geometry:R.corona,position:[0,0,.04+.018],renderOrder:2,children:(0,t.jsx)("shaderMaterial",{ref:v,blending:s.AdditiveBlending,depthTest:!1,depthWrite:!0,fragmentShader:et,toneMapped:!1,transparent:!0,uniforms:{uApertureRadius:{value:w},uCoronaIntensityScale:{value:c.coronaIntensityScale},uCoronaSizeScale:{value:c.coronaSizeScale},uOpacity:{value:0},uTime:{value:0}},vertexShader:ee})}),(0,t.jsx)("mesh",{ref:x,geometry:R.notches,position:[0,0,.04+.012],renderOrder:0,children:(0,t.jsx)("shaderMaterial",{ref:S,blending:s.AdditiveBlending,depthTest:!1,depthWrite:!1,fragmentShader:ea,toneMapped:!1,transparent:!0,uniforms:{uApertureRadius:{value:w},uFlareRotation:{value:0},uOpacity:{value:0},uTime:{value:0}},vertexShader:eo})}),(0,t.jsx)("mesh",{geometry:R.baseMask,position:[0,0,.054],renderOrder:1,children:(0,t.jsx)("meshBasicMaterial",{color:"#000000",depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0})})]})}function eg({colorSchemeDark:e,compact:a,mobileLayout:l,focusTuning:c,postprocessingEnabled:u,postprocessingResolutionScale:d,pointerState:h,reducedMotion:p,timeline:f}){let m=(0,i.useThree)(e=>e.camera),g=(0,n.useMemo)(()=>X(0,p,c),[c,p]),v=(0,n.useRef)(null),S=(0,n.useMemo)(()=>new s.Vector3,[]),x=(0,n.useMemo)(()=>new s.Vector3(0,0,10-g.focusDistance),[g.focusDistance]),M=l?.9:a?.96:1,y=!e,b=u||y,P=u?g.bokehScale*M:0,w=u?g.dialBokehScale*M:0;return(0,n.useLayoutEffect)(()=>{let e=v.current;if(!e)return;let t=e.uniforms.get("uInvert"),a=e.uniforms.get("uDialBokehScale"),o=e.uniforms.get("uDialDepth"),i=e.uniforms.get("uDialDepthTolerance");t||(t=new s.Uniform(0),e.uniforms.set("uInvert",t)),a||(a=new s.Uniform(0),e.uniforms.set("uDialBokehScale",a)),o||(o=new s.Uniform(1),e.uniforms.set("uDialDepth",o)),i||(i=new s.Uniform(12e-5),e.uniforms.set("uDialDepthTolerance",i)),e.setFragmentShader(Q),a.value=w,S.set(0,0,.04).project(m),o.value=.5*S.z+.5,t.value=+!!y},[M,m,a,S,w,l,u,y]),(0,o.useFrame)(({clock:e})=>{let t=v.current,a=es(p?1/0:j(f.current,e.elapsedTime),p,h,c);if(t){t.bokehScale=u?a.bokehScale*M:0;let e=t.uniforms.get("uDialBokehScale"),o=t.uniforms.get("uDialDepth");e&&(e.value=u?a.dialBokehScale*M:0),o&&(S.set(0,0,.04).project(m),o.value=.5*S.z+.5),t.cocMaterial.focusRange=a.focusRange,x.z=10-a.focusDistance,t.target?.copy(x)}m instanceof s.PerspectiveCamera&&Math.abs(m.fov-a.cameraFov)>.001&&(m.fov=a.cameraFov,m.updateProjectionMatrix())}),b?(0,t.jsx)(r.EffectComposer,{multisampling:0,children:(0,t.jsx)(r.DepthOfField,{ref:v,bokehScale:P,focusRange:g.focusRange,resolutionScale:u?(l?.68:a?.84:1)*d:.25,target:x})}):null}function ev(){let{colorSchemeDark:e,isMobile:o,isTablet:i,reducedMotion:r}=(0,l.useDeviceInfo)(),u=(0,Y.useRendererProfile)(),d=u.canUseWebGL(),h=u.getMaxParticleCount(),p=u.getPostprocessing(),{focusTuning:m,inspectionCameraEnabled:g,mobileSpecimens:v,panel:S}={focusTuning:c,inspectionCameraEnabled:!1,mobileSpecimens:F,panel:null},[x,M]=(0,n.useState)({compact:o||i,mobileLayout:o}),{compact:y,mobileLayout:b}=x,P=K(y,b),w=u.getDpr(),R=[w[0],Math.min(w[1],P)],[D,A]=(0,n.useState)(),[C,E]=(0,n.useState)(!1),[k,B]=(0,n.useState)(!1),[T,I]=(0,n.useState)(1),[W,O]=(0,n.useState)(1),[N,z]=(0,n.useState)(!1),H=(0,n.useRef)(null),X=(0,n.useRef)(null),L=(0,n.useRef)({elapsedSeconds:0,lastClockElapsedSeconds:void 0,ready:!1,visibility:"unknown"}),{hasBeenVisible:j,ref:Z,visibility:$}=function(){let[e,t]=(0,n.useState)("unknown"),[a,o]=(0,n.useState)(!1),i=(0,n.useCallback)(e=>{t(e?"visible":"hidden"),e&&o(!0)},[]),{ref:r}=(0,_.useIntersectionObserver)({initialIsIntersecting:!1,onChange:i});return{hasBeenVisible:a,ref:r,visibility:e}}(),q=(0,n.useCallback)(e=>{H.current=e,Z(e)},[Z]),J=(0,n.useRef)({dial:{dragging:!1,rotation:0,timestamp:0,velocity:0},dialHovering:!1,dragging:!1,hoverSuppressedUntil:0,hovering:!1,meshDrag:{anchorX:0,anchorY:0,offsetX:0,offsetY:0},meshHover:{anchorX:0,anchorY:0,offsetX:0,offsetY:0},pendingInteractions:[],timestamp:0,x:0,y:0});function Q(e){let t=X.current?.getBoundingClientRect()??e.currentTarget.getBoundingClientRect();return{x:(e.clientX-t.left)/t.width*2-1,y:-((e.clientY-t.top)/t.height*2-1)}}function ee(){let e=X.current?.getBoundingClientRect();return e?.height?e.width/e.height:1}function et(e,t){return!b&&.78>=Math.hypot(e*ee(),t)}function ea(e,t,a,o=0,i=0,r=0,n=!0,s=!0){J.current.pendingInteractions.push({glowStrength:a,gustX:o,gustY:i,impulseStrength:r,paintsDisturbanceField:s,tearsBonds:n,x:e,y:t})}function eo(e,t,a,{strength:o=1,tearsBonds:i=!0}={}){let r=J.current.x,n=J.current.y,s=Math.hypot(e-r,t-n);if(!s)return;let l=(e-r)/s,c=(t-n)/s,{glowStrength:u,impulseStrength:d}=function(e,t){if(e<=0)return{glowStrength:0,impulseStrength:0};let a=1-Math.exp(-(e/Math.max(t,1/120)*.45));return{glowStrength:Math.min(.82,.08+.78*a),impulseStrength:Math.min(.9,.94*a)}}(s,(a-J.current.timestamp)/1e3),h=Math.max(1,Math.ceil(s/.035));for(let a=1;a<=h;a+=1){let s=a/h;ea(r+(e-r)*s,n+(t-n)*s,u*o,l,c,d*o,i)}}function es(){let e=J.current.pendingTouch;e&&(clearTimeout(e.timeoutId),J.current.pendingTouch=void 0)}function el(e,t,a,o,i){es(),J.current.timestamp=i,J.current.x=a,J.current.y=o,ea(a,o,.9,0,0,.9,!0,!1),e.setPointerCapture(t),J.current.meshDrag.anchorX=a,J.current.meshDrag.anchorY=o,J.current.meshDrag.offsetX=0,J.current.meshDrag.offsetY=0,J.current.meshHover.offsetX=0,J.current.meshHover.offsetY=0,J.current.dialHovering=!1,J.current.dragging=!0,J.current.hovering=!0,J.current.pointerId=t,B(!0)}function eu(e){let t=J.current;if(t.pointerId===e.pointerId){if(e.currentTarget.hasPointerCapture(e.pointerId)&&e.currentTarget.releasePointerCapture(e.pointerId),t.dial.dragging){en(t,e.timeStamp)&&E(!1);return}t.dragging=!1,t.hoverSuppressedUntil=e.timeStamp+4200,t.hovering=!1,t.meshHover.offsetX=0,t.meshHover.offsetY=0,t.pointerId=void 0,t.meshDrag.offsetX=0,t.meshDrag.offsetY=0,B(!1)}}return(0,n.useEffect)(()=>{let e=J.current;return()=>{let t=e.pendingTouch;t&&clearTimeout(t.timeoutId)}},[]),(0,n.useEffect)(()=>{if(d)return;let e=J.current;e.pendingTouch&&(clearTimeout(e.pendingTouch.timeoutId),e.pendingTouch=void 0),e.pendingInteractions=[],e.dragging=!1,e.dial.dragging=!1,e.dial.velocity=0,e.dialHovering=!1,e.hovering=!1,e.pointerId=void 0,E(!1),B(!1)},[d]),(0,n.useEffect)(()=>{let e=(e,t,a=!1)=>{let o=H.current,i=J.current;void 0!==e&&i.pointerId===e&&i.dial.dragging&&(o?.hasPointerCapture(e)&&o.releasePointerCapture(e),en(i,t,a)&&(a&&(i.dialHovering=!1),E(!1)))},t=e=>{var t;let a,o,i,r,n,l,c=J.current;if(!c.dial.dragging||c.pointerId!==e.pointerId)return;let u=X.current?.getBoundingClientRect();if(!u?.width||!u.height)return;e.preventDefault();let d=(e.clientX-u.left)/u.width*2-1,h=-((e.clientY-u.top)/u.height*2-1),p=Math.atan2(h,d*(u.width/u.height));c.dialHovering=.78>=Math.hypot(d*(u.width/u.height),h),t=e.timeStamp,a=c.dial.pointerAngle??p,o=Math.atan2(Math.sin(p-a),Math.cos(p-a)),i=function e(t,a){if(0===a)return 0;let o=Math.sign(t),i=Math.sign(a);if(0!==o&&o!==i){let o=i*Math.min(Math.abs(a),Math.abs(t)),r=a-o;return o+(0===r?0:e(0,r))}let r=f*Math.expm1(Math.abs(t)/f);return i*(f*Math.log1p((r+Math.abs(a))/f)-Math.abs(t))}(c.dial.rotation,o),r=Math.max((t-c.dial.timestamp)/1e3,1/120),n=s.MathUtils.clamp(i/r,-14,14),l=1-Math.exp(-(22*r)),c.dial.rotation=s.MathUtils.clamp(c.dial.rotation+i,-V,V),c.dial.velocity=s.MathUtils.lerp(c.dial.velocity,n,l),c.dial.pointerAngle=p,c.dial.timestamp=t,c.timestamp=t,c.x=d,c.y=h},a=t=>{e(t.pointerId,t.timeStamp)},o=t=>{e(t.pointerId,t.timeStamp,!0)},i=()=>{e(J.current.pointerId,"u"<typeof performance?Date.now():performance.now(),!0)};return window.addEventListener("pointermove",t,{capture:!0,passive:!1}),window.addEventListener("pointerup",a,!0),window.addEventListener("pointercancel",o,!0),window.addEventListener("blur",i),()=>{window.removeEventListener("pointermove",t,!0),window.removeEventListener("pointerup",a,!0),window.removeEventListener("pointercancel",o,!0),window.removeEventListener("blur",i)}},[]),(0,n.useEffect)(()=>{let e,t=H.current,a=X.current,o=t?.parentElement?.querySelector("[data-rosalind-copy]");if(!t||!a||!o)return;let i=()=>{let e=t.getBoundingClientRect(),i=a.getBoundingClientRect(),r=o.getBoundingClientRect(),n={compact:!window.matchMedia(`(min-width: ${U.styles.screens.lg})`).matches,mobileLayout:!window.matchMedia(`(min-width: ${U.styles.screens.md})`).matches},l=ec(t,"4rem",64),c=ec(t,"var(--max-width-fullbleed)",window.innerWidth),u=Math.min(window.innerWidth,c);if(!i.width||!i.height)return;M(e=>e.compact===n.compact&&e.mobileLayout===n.mobileLayout?e:n);let d=r.height+2*l,h=r.width+2*l,p=Math.min(h,1.72*d),f={apertureWidthRatio:h/i.width,centerXRatio:(r.left+r.width/2-i.left)/i.width-.5,centerYRatio:(r.top+r.height/2-i.top)/i.height-.5,heightRatio:d/i.height,widthRatio:p/i.width};A(e=>e&&.001>Math.abs(e.apertureWidthRatio-f.apertureWidthRatio)&&.001>Math.abs(e.centerXRatio-f.centerXRatio)&&.001>Math.abs(e.centerYRatio-f.centerYRatio)&&.001>Math.abs(e.heightRatio-f.heightRatio)&&.001>Math.abs(e.widthRatio-f.widthRatio)?e:f),I(e=>{let t=b?1:Math.max(1,u/i.width);return .001>Math.abs(e-t)?e:t}),O(e=>{let t=function(e,t){if(t)return 1;let a=s.MathUtils.clamp((e-920)/400,0,1);return s.MathUtils.lerp(.8,1,a)}(i.width,b);return .001>Math.abs(e-t)?e:t}),z(e.width>=c-1)},r=()=>{clearTimeout(e),e=setTimeout(i,250)};if(i(),window.addEventListener("resize",r),"u"<typeof ResizeObserver)return()=>{clearTimeout(e),window.removeEventListener("resize",r)};let n=new ResizeObserver(i);return n.observe(t),n.observe(a),n.observe(o),()=>{clearTimeout(e),n.disconnect(),window.removeEventListener("resize",r)}},[b]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{ref:q,"aria-hidden":"true",className:"absolute inset-0 cursor-pointer touch-pan-y mask-[linear-gradient(to_bottom,#000_0%,#000_92%,transparent_100%)] select-none [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_92%,transparent_100%)] md:mask-[linear-gradient(to_bottom,#000_0%,#000_76%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_76%,transparent_100%)]","data-dialing":C?"true":"false","data-inspection-camera":g||void 0,"data-palette":"monochrome","data-testid":"rosalind-artwork",draggable:!1,onDragStart:e=>e.preventDefault(),onPointerCancel:function(e){d&&!g&&(J.current.pendingTouch?.pointerId===e.pointerId&&es(),J.current.dial.dragging&&(J.current.dial.velocity=0),eu(e))},onPointerDown:function(e){if(!d||g||"mouse"===e.pointerType&&0!==e.button)return;let{x:t,y:a}=Q(e);if(J.current.timestamp=e.timeStamp,J.current.x=t,J.current.y=a,et(t,a)){var o,i,r,n,s;let l;e.preventDefault(),o=e.currentTarget,i=e.pointerId,r=t,n=a,s=e.timeStamp,es(),l=J.current,o.setPointerCapture(i),l.dial.dragging=!0,l.dialHovering=!0,l.dial.pointerAngle=Math.atan2(n,r*ee()),l.dial.timestamp=s,l.dial.velocity=0,l.dragging=!1,l.hovering=!0,l.meshDrag.offsetX=0,l.meshDrag.offsetY=0,l.meshHover.offsetX=0,l.meshHover.offsetY=0,l.pointerId=i,l.timestamp=s,l.x=r,l.y=n,E(!0),B(!1);return}if("touch"===e.pointerType){let o=e.currentTarget,{pointerId:i,timeStamp:r}=e,n={clientX:e.clientX,clientY:e.clientY,pointerId:i,timestamp:r,timeoutId:setTimeout(()=>{J.current.pendingTouch?.pointerId===i&&el(o,i,t,a,r)},90),x:t,y:a};es(),J.current.pendingTouch=n;return}e.preventDefault(),el(e.currentTarget,e.pointerId,t,a,e.timeStamp)},onPointerLeave:function(e){d&&!g&&(J.current.pendingTouch?.pointerId===e.pointerId&&es(),J.current.dragging||J.current.dial.dragging||(J.current.dialHovering=!1,J.current.hovering=!1,J.current.meshHover.offsetX=0,J.current.meshHover.offsetY=0))},onPointerMove:function(e){if(!d||g)return;let{x:t,y:a}=Q(e),o=J.current.pendingTouch;if(o?.pointerId===e.pointerId){var i,r;let t=8>Math.hypot(i=e.clientX-o.clientX,r=e.clientY-o.clientY)?"pending":Math.abs(r)>Math.abs(i)?"scroll":"touch";if("pending"===t)return;if("scroll"===t)return void es();el(e.currentTarget,e.pointerId,o.x,o.y,o.timestamp)}let n=J.current;if(!n.dial.dragging){if(!n.dragging){if("touch"===e.pointerType)return;let o=er(n.dial),i=et(t,a);if(n.dialHovering=i,o||i){n.hovering=!o,n.meshHover.anchorX=t,n.meshHover.anchorY=a,n.meshHover.offsetX=0,n.meshHover.offsetY=0,n.timestamp=e.timeStamp,n.x=t,n.y=a;return}e.timeStamp<n.hoverSuppressedUntil?(n.meshHover.anchorX=t,n.meshHover.anchorY=a,n.meshHover.offsetX=0,n.meshHover.offsetY=0):n.hovering?(n.meshHover.anchorX=t,n.meshHover.anchorY=a,n.meshHover.offsetX+=t-n.x,n.meshHover.offsetY+=a-n.y,eo(t,a,e.timeStamp,{strength:.18,tearsBonds:!1})):(n.meshHover.anchorX=t,n.meshHover.anchorY=a,n.meshHover.offsetX=0,n.meshHover.offsetY=0),n.hovering=!0,n.timestamp=e.timeStamp,n.x=t,n.y=a;return}n.pointerId===e.pointerId&&(e.preventDefault(),n.meshDrag.offsetX=t-n.meshDrag.anchorX,n.meshDrag.offsetY=a-n.meshDrag.anchorY,eo(t,a,e.timeStamp),n.timestamp=e.timeStamp,n.x=t,n.y=a)}},onPointerUp:function(e){if(!d||g)return;let t=J.current.pendingTouch;if(t?.pointerId===e.pointerId){es(),ea(t.x,t.y,.9,0,0,.9);return}eu(e)},style:g?{cursor:"grab"}:C?{cursor:"grabbing"}:k?{cursor:"url('/rosalind/touch-cursor.svg') 16 30, pointer"}:void 0,children:(0,t.jsxs)("div",{ref:X,className:"absolute inset-x-0 top-1/2 h-full -translate-y-1/2 md:h-[920px]",children:[b||g?null:(0,t.jsx)("div",{className:"pointer-events-auto absolute inset-s-1/2 top-1/2 z-10 aspect-square -translate-1/2 cursor-grab touch-none rounded-full","data-rosalind-dial-touch-target":!0,style:{cursor:C?"grabbing":void 0,height:`${78*W}%`}}),j&&d?(0,t.jsxs)(a.Canvas,{camera:{far:40,fov:39,near:.1,position:[0,0,10]},dpr:R,frameloop:r||"visible"!==$?"demand":"always",gl:{alpha:!0,antialias:u.getAntialias(),powerPreference:"high-performance"},children:[(0,t.jsx)("color",{attach:"background",args:["#000000"]}),b?null:(0,t.jsx)(ep,{pointerState:J,reducedMotion:r}),(0,t.jsxs)("group",{scale:W,children:[b?null:(0,t.jsx)(em,{copyBounds:D,fieldWidthScale:T,focusTuning:m,pointerState:J,reducedMotion:r,timeline:L}),(0,t.jsx)(ef,{colorSchemeDark:e,compact:y,copyBounds:D,mobileLayout:b,fieldWidthScale:T,focusTuning:m,horizontalEdgeFadeEnabled:N,maxParticleCount:h,mobileSpecimens:v,pointerState:J,reducedMotion:r,timeline:L})]}),(0,t.jsx)(eg,{colorSchemeDark:e,compact:y,mobileLayout:b,focusTuning:m,postprocessingEnabled:"none"!==p,postprocessingResolutionScale:"selective"===p?.75:1,pointerState:J,reducedMotion:r,timeline:L}),(0,t.jsx)(ei,{timeline:L,visibility:$}),(0,t.jsx)(G,{enabled:g})]}):null]})}),S]})}e.s(["default",0,function(){return(0,t.jsx)(Y.GpuPerformanceProvider,{children:(0,t.jsx)(ev,{})})}],949201)}]);