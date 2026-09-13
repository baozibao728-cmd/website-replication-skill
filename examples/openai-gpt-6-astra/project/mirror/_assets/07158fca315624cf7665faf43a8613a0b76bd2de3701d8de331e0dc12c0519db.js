(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,471772,t=>{"use strict";var e=t.i(695418);let a=2*Math.PI;t.s(["ASTRA_AMBIENT_DRIFT_MAX",0,.12,"ASTRA_AMBIENT_DRIFT_MIN",0,.035,"ASTRA_AMBIENT_SPEED_MAX",0,.8,"ASTRA_AMBIENT_SPEED_MIN",0,.4,"ASTRA_PARALLAX_MAX",0,.28,"ASTRA_PARALLAX_MIN",0,.08,"getAstraDispersedMotionOffset",0,function(t,r,o,i,s,n,l){let u=e.MathUtils.clamp(s,0,1),c=e.MathUtils.clamp(l,0,1);if(0===c)return t.set(0,0);let h=e.MathUtils.lerp(.4,.8,u),p=e.MathUtils.lerp(.035,.12,u)*c,f=o*a+2.7*i,d=i*a+3.1*s,m=n*e.MathUtils.lerp(.08,.28,u*u)*c;return t.set((Math.sin(f+r*h)-Math.sin(f))*p,(Math.cos(d+r*h*.73)-Math.cos(d))*p+m)}])},861045,t=>{"use strict";var e=t.i(695418),a=t.i(63295),r=t.i(396522),o=t.i(384051),i=t.i(642671),s=t.i(83007),n=t.i(471772);let l=`
  varying float vParticleDiameter;
  float astraCubicCoverage(float coordinate) {
    float x = abs(coordinate);
    if (x < 1.0) return (4.0 - 6.0 * x * x + 3.0 * x * x * x) / 6.0;
    float tail = max(2.0 - x, 0.0);
    return tail * tail * tail / 6.0;
  }
  float astraFilteredCore(vec2 pixel, float area) {
    return astraCubicCoverage(pixel.x) * astraCubicCoverage(pixel.y)
      * area * vParticleDiameter * vParticleDiameter;
  }
`,u=`
  vec2 astraDispersedMotion(
    float time,
    float scatterX,
    float scatterY,
    float scatterZ,
    float scrollDrift,
    float strength
  ) {
    float depth = clamp(scatterZ, 0.0, 1.0);
    float motion = clamp(strength, 0.0, 1.0);
    float speed = mix(
      ${n.ASTRA_AMBIENT_SPEED_MIN},
      ${n.ASTRA_AMBIENT_SPEED_MAX},
      depth
    );
    float amount = mix(
      ${n.ASTRA_AMBIENT_DRIFT_MIN},
      ${n.ASTRA_AMBIENT_DRIFT_MAX},
      depth
    ) * motion;
    float phaseX = scatterX * 6.28318530718 + scatterY * 2.7;
    float phaseY = scatterY * 6.28318530718 + scatterZ * 3.1;
    float parallax = scrollDrift * mix(
      ${n.ASTRA_PARALLAX_MIN},
      ${n.ASTRA_PARALLAX_MAX},
      depth * depth
    ) * motion;

    return vec2(
      (sin(phaseX + time * speed) - sin(phaseX)) * amount,
      (cos(phaseY + time * speed * 0.73) - cos(phaseY)) * amount
        + parallax
    );
  }
`,c=`
  attribute vec3 particleMotionUv;
  uniform sampler2D uParticleMotionTexture;
  uniform float uParticleMotionEnabled;
  uniform float uParticleMotionAge;
  uniform vec2 uParticleMotionPointer;
  uniform vec2 uParticleMotionPrevious;
  uniform vec2 uParticleMotionImpulse;
  varying vec4 vParticleMotionState;

  ${o.PARTICLE_MOTION_COAST_GLSL}
  void astraParticleMotion(inout vec4 clipPosition) {
    if (uParticleMotionEnabled < 0.5 || uParticleMotionAge >= ${o.PARTICLE_MOTION_SETTLE_SECONDS}.0) return;
    float mass = particleMotionUv.z;
    vec4 state = astraCoast(texture2D(uParticleMotionTexture, particleMotionUv.xy), mass, uParticleMotionAge);
    #ifdef ASTRA_PARTICLE_SIMULATION
      float aspect = max(uViewportAspect, 0.0001);
      vec2 scale = vec2(aspect, 1.0);
      vec2 current = (clipPosition.xy / clipPosition.w + state.xy) * scale;
      vec2 start = uParticleMotionPrevious * scale;
      vec2 segment = (uParticleMotionPointer - uParticleMotionPrevious) * scale;
      float t = clamp(dot(current - start, segment) / max(dot(segment, segment), 0.000001), 0.0, 1.0);
      float radius = max(uPointerRepelRadius * 0.5, 0.025);
      float weight = pow(1.0 - smoothstep(0.0, radius, length(current - start - segment * t)), 2.0);
      vec2 impulse = uParticleMotionImpulse * scale;
      impulse *= min(1.0, 0.18 / max(length(impulse), 0.00001));
      // Individual momentum, with no positional spring pulling toward a cursor.
      state.zw += impulse / scale * weight * 5.4 / mass;
      float speed = length(state.zw * scale);
      state.zw *= min(1.0, 0.5 / max(speed, 0.00001));
      vParticleMotionState = state;
      gl_PointSize = 1.0;
      clipPosition = vec4(particleMotionUv.xy * 2.0 - 1.0, 0.0, 1.0);
    #else
      clipPosition.xy += state.xy * clipPosition.w;
    #endif
  }

`,h=`
  float astraParticleRevealProgress(float progress, float seed) {
    float delay = seed * 0.015;
    return smoothstep(delay, 0.14 + delay, progress)
      * mix(0.2, 1.0, smoothstep(0.2, 1.0, progress));
  }
`,p=`
  vec3 astraTiltSpiral(vec3 position, float angle) {
    float cosine = cos(angle);
    float sine = sin(angle);
    return vec3(
      position.x,
      position.y * cosine - position.z * sine,
      position.y * sine + position.z * cosine
    );
  }
`,f=`
  attribute float driftPhase;
  attribute vec3 driftTangent;
  attribute float orbitProgress;
  attribute float particleOpacity;
  attribute float particleScale;

  uniform float uDirection;
  uniform float uDispersedMotion;
  uniform float uDriftDistance;
  uniform float uDriftSpeed;
  uniform float uAccretionRatio;
  uniform float uAmbientPulse;
  uniform float uCoreIntensity;
  uniform float uExhaleStrength;
  uniform float uFormationEnabled;
  uniform float uFormationProgress;
  uniform float uGrowthEnabled;
  uniform float uGrowthProgress;
  uniform float uGrowthRadius;
  uniform float uGrowthSoftness;
  uniform float uHeadProgress;
  uniform float uInwardStrength;
  uniform float uIntensity;
  uniform float uIntroProgress;
  uniform float uLightReach;
  uniform float uPixelRatio;
  uniform float uStarBrightness;
  uniform float uStarVisibility;
  uniform float uTrailEnabled;
  uniform float uTrailLength;
  uniform float uTime;
  uniform float uPropagationSoftness;
  uniform float uSettleRatio;
  uniform float uLensActive;
  uniform float uLensDepth;
  uniform float uLensIllumination;
  uniform float uLensMagnification;
  uniform vec2 uLensPointer;
  uniform float uLensRadius;
  uniform float uPointerRepelRadius;
  uniform vec2 uScatterSize;
  uniform float uScrollDrift;
  uniform float uScrollScatter;
  uniform float uScrollPositionProgress;
  uniform float uSpiralTilt;
  uniform float uViewportAspect;

  varying float vBrightness;
  varying float vLens;
  varying float vOpacity;
  varying float vParticleDiameter;

  ${c}
  ${h}
  ${u}
  ${s.ASTRA_INTRO_MOTION_GLSL}
  ${p}

  void main() {
    float distanceToStar = abs(orbitProgress - uHeadProgress);
    float illumination = 1.0 - smoothstep(
      uLightReach * 0.08,
      uLightReach,
      distanceToStar
    );
    illumination *= illumination * uStarVisibility;

    float distanceBehind = uDirection > 0.0
      ? uHeadProgress - orbitProgress
      : orbitProgress - uHeadProgress;
    if (distanceBehind < 0.0) {
      distanceBehind += 1.0;
    }

    float trailIllumination = 1.0 - smoothstep(
      0.0,
      max(uTrailLength, 0.0001),
      distanceBehind
    );
    trailIllumination *= trailIllumination
      * uTrailEnabled
      * uStarVisibility;
    illumination = max(illumination, trailIllumination * 0.68);

    vBrightness = uIntensity * (
      0.16 + illumination * uStarBrightness * 3.6
    );
    vOpacity = particleOpacity * (0.22 + illumination * 0.78);
    float driftActive = step(0.0001, uDriftSpeed);
    float driftCycle = fract(driftPhase + uTime * uDriftSpeed);
    float driftFade = smoothstep(0.0, 0.1, driftCycle)
      * (1.0 - smoothstep(0.9, 1.0, driftCycle));
    vOpacity *= mix(1.0, driftFade, driftActive);
    vec3 basePosition = position + driftTangent
      * (driftCycle - 0.5)
      * uDriftDistance
      * uDirection
      * driftActive;
    float radialDistance = length(basePosition.xy);
    float localProgress = clamp(
      uFormationProgress
        - radialDistance * uPropagationSoftness * 0.018,
      0.0,
      1.0
    );
    float accretionEnd = clamp(uAccretionRatio, 0.12, 0.72);
    float settleStart = max(accretionEnd + 0.08, 1.0 - uSettleRatio);
    float inward = smoothstep(0.0, accretionEnd, localProgress);
    float exhale = smoothstep(accretionEnd, settleStart, localProgress);
    vec2 radialDirection = basePosition.xy / max(radialDistance, 0.0001);
    vec3 farPosition = basePosition;
    farPosition.xy += radialDirection * uInwardStrength * (2.0 + radialDistance * 0.28);
    farPosition.z += uInwardStrength * 0.8;
    vec3 condensedPosition = vec3(
      basePosition.xy * 0.045,
      basePosition.z * 0.12
    );
    vec3 formedPosition = mix(farPosition, condensedPosition, inward);
    formedPosition = mix(formedPosition, basePosition, exhale);
    formedPosition.xy += radialDirection
      * sin(exhale * 3.14159265359)
      * (1.0 - exhale)
      * uExhaleStrength;
    float formationVisibility = mix(0.08, 0.56, inward);
    formationVisibility = mix(formationVisibility, 1.0, exhale);
    float coreBurst = exp(-pow((localProgress - accretionEnd) * 11.0, 2.0));
    vBrightness *= mix(
      1.0,
      uAmbientPulse + coreBurst * (uCoreIntensity - 1.0),
      uFormationEnabled
    );
    vOpacity *= mix(1.0, formationVisibility, uFormationEnabled);
    vec3 animatedPosition = mix(basePosition, formedPosition, uFormationEnabled);
    float scatterX = fract(sin(
      dot(vec2(orbitProgress, driftPhase), vec2(127.1, 311.7))
    ) * 43758.5453);
    float scatterY = fract(sin(
      dot(vec2(driftPhase, particleScale), vec2(269.5, 183.3))
    ) * 43758.5453);
    float scatterZ = fract(sin(
      dot(vec2(orbitProgress, particleOpacity), vec2(419.2, 371.9))
    ) * 43758.5453);
    vec3 scatteredPosition = vec3(
      (scatterX - 0.5) * uScatterSize.x,
      (scatterY - 0.5) * uScatterSize.y,
      (scatterZ - 0.5) * 0.5
    );
    vec3 introScattered = vec3(
      scatteredPosition.x,
      (fract(scatterY) - 0.5) * uScatterSize.y,
      scatteredPosition.z
    );
    vec2 dispersedOffset = astraDispersedMotion(
      uTime,
      scatterX,
      scatterY,
      scatterZ,
      uScrollDrift,
      uDispersedMotion
    );
    scatteredPosition.x += dispersedOffset.x;
    scatteredPosition.y = mod(
      scatteredPosition.y + dispersedOffset.y + uScatterSize.y * 0.5,
      uScatterSize.y
    ) - uScatterSize.y * 0.5;
    scatteredPosition.y -= sin(uScrollPositionProgress * 3.14159265359)
      * (0.7 + scatterZ * 1.4);
    animatedPosition = astraTiltSpiral(animatedPosition, uSpiralTilt);
    animatedPosition = mix(
      animatedPosition,
      scatteredPosition,
      uScrollPositionProgress
    );
    animatedPosition = astraIntroMotion(
      animatedPosition, introScattered, uIntroProgress,
      scatterZ, scatterY
    );
    float growthVisibility = (
      1.0 - smoothstep(
        uGrowthProgress,
        uGrowthProgress + max(uGrowthSoftness, 0.001),
        radialDistance / max(uGrowthRadius, 0.001)
      )
    ) * smoothstep(0.0, 0.025, uGrowthProgress);
    vOpacity *= mix(1.0, growthVisibility, uGrowthEnabled);
    // Reveal the dispersed field before pulling its stars into place.
    float introLocalProgress = astraParticleRevealProgress(
      uIntroProgress,
      scatterZ
    );
    float introParticleScale = sqrt(introLocalProgress);
    vOpacity *= smoothstep(
      0.0,
      ${i.ASTRA_PARTICLE_OPACITY_REVEAL_END},
      introLocalProgress
    );
    gl_PointSize = uPixelRatio * (
      1.0 + particleScale * 1.35 + illumination * 1.25
    ) * mix(1.0, 1.0 + coreBurst * 0.35, uFormationEnabled)
      * mix(1.0, 0.3 + growthVisibility * 0.7, uGrowthEnabled)
      * introParticleScale;

    vec4 viewPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    vec4 clipPosition = projectionMatrix * viewPosition;
    vec2 ndc = clipPosition.xy / max(clipPosition.w, 0.0001);
    vLens = 0.0;
    if (uLensActive > 0.0) {
      float lensDistance = length(ndc - uLensPointer);
      vLens = (1.0 - smoothstep(0.0, uLensRadius, lensDistance))
        * uLensActive;
      viewPosition.z += vLens * uLensDepth;
      clipPosition = projectionMatrix * viewPosition;
      clipPosition.xy = uLensPointer * clipPosition.w
        + (clipPosition.xy - uLensPointer * clipPosition.w)
        * (1.0 + vLens * uLensMagnification);
    }
    vBrightness *= 1.0 + vLens * uLensIllumination;
    gl_PointSize *= 1.0 + vLens * uLensMagnification * 0.7;
    vParticleDiameter = gl_PointSize;
    gl_PointSize = max(gl_PointSize, 4.0);
    astraParticleMotion(clipPosition);
    gl_Position = clipPosition;
  }
`,d=`
  varying float vBrightness;
  varying float vLens;
  varying float vOpacity;
  ${l}

  void main() {
    vec2 pixel = (gl_PointCoord - vec2(0.5)) * max(vParticleDiameter, 4.0);
    float distanceToCenter = length(pixel) * 2.0 / max(vParticleDiameter, 0.0001);
    float disc = 1.0 - smoothstep(0.22, 1.0, distanceToCenter);
    float core = mix(astraFilteredCore(pixel, 0.256408), pow(disc, 1.5),
      smoothstep(2.0, 4.0, vParticleDiameter));
    float alpha = core * vOpacity;

    if (alpha <= 0.0) {
      discard;
    }

    gl_FragColor = vec4(vec3(vBrightness), alpha);
  }
`,m=`
  attribute float orbitProgress;
  attribute float starAcrossOffset;
  attribute float starBrightness;
  attribute vec3 starColor;
  attribute float starDepthOffset;
  attribute float starHero;
  attribute float starBackground;
  attribute float starOpacity;
  attribute float starScale;
  attribute float twinklePhase;
  attribute float twinkleRate;

  uniform float uIntensity;
  uniform float uIntroProgress;
  uniform float uBackgroundStarsEnabled;
  uniform mat4 uBackgroundModelMatrix;
  uniform float uAccretionRatio;
  uniform float uAmbientPulse;
  uniform float uCoreIntensity;
  uniform float uDensityFalloff;
  uniform float uDispersedMotion;
  uniform float uFlowSpeed;
  uniform float uExhaleStrength;
  uniform float uFormationEnabled;
  uniform float uFormationProgress;
  uniform float uGrowthEnabled;
  uniform float uGrowthDirection;
  uniform float uGrowthProgress;
  uniform float uGrowthRadius;
  uniform float uGrowthSoftness;
  uniform float uInwardStrength;
  uniform float uLensActive;
  uniform float uLensDepth;
  uniform float uLensIllumination;
  uniform float uLensMagnification;
  uniform vec2 uLensPointer;
  uniform float uLensRadius;
  uniform float uPointerRepelRadius;
  uniform vec2 uPathShapeCenter;
  uniform float uPathShapeBrightRetention;
  uniform float uPathShapeDepth;
  uniform float uPathShapeDepthPhase;
  uniform float uPathShapeMotion;
  uniform float uPathShapeProgress;
  uniform float uPathShapePositionProgress;
  uniform vec2 uPathShapeRotation;
  uniform float uPathShapeScatter;
  uniform float uPathShapeSampleCount;
  uniform vec2 uPathShapeSize;
  uniform vec2 uPathShapeTrackedScatter;
  uniform float uPathShapeTrackedSeed;
  uniform float uPathShapeTrackingEnabled;
  uniform float uTrackedClearanceSeed;
  uniform vec3 uTrackedScatter;
  uniform sampler2D uPathShapeTexture;
  uniform vec2 uScatterSize;
  uniform float uScrollDrift;
  uniform float uScrollScatter;
  uniform float uScrollPositionProgress;
  uniform float uScrollSizeScale;
  uniform float uSpiralTilt;
  uniform vec2 uTextBounds;
  uniform float uPathMotion;
  uniform float uPathOffset;
  uniform float uPathSampleCount;
  uniform float uPathSpeed;
  uniform float uPixelRatio;
  uniform float uSizeFalloff;
  uniform float uPropagationSoftness;
  uniform float uSettleRatio;
  uniform float uTime;
  uniform float uTwinkleSpeed;
  uniform sampler2D uPathTexture;
  uniform float uViewportAspect;

  varying float vBrightness;
  varying vec3 vColor;
  varying float vLens;
  varying float vOpacity;
  varying float vRayStrength;
  varying float vParticleDiameter;

  ${c}
  ${h}
  ${u}
  ${s.ASTRA_INTRO_MOTION_GLSL}
  ${p}

  vec3 samplePath(float progress) {
    float scaledProgress = clamp(progress, 0.0, 1.0)
      * (uPathSampleCount - 1.0);
    float lowerIndex = floor(scaledProgress);
    float upperIndex = min(lowerIndex + 1.0, uPathSampleCount - 1.0);
    float blend = fract(scaledProgress);
    vec3 lowerPoint = texture2D(
      uPathTexture,
      vec2((lowerIndex + 0.5) / uPathSampleCount, 0.5)
    ).xyz;
    vec3 upperPoint = texture2D(
      uPathTexture,
      vec2((upperIndex + 0.5) / uPathSampleCount, 0.5)
    ).xyz;
    return mix(lowerPoint, upperPoint, blend);
  }

  vec4 samplePathShape(float progress) {
    float scaledProgress = clamp(progress, 0.0, 1.0)
      * (uPathShapeSampleCount - 1.0);
    float lowerIndex = floor(scaledProgress);
    float upperIndex = min(lowerIndex + 1.0, uPathShapeSampleCount - 1.0);
    float blend = fract(scaledProgress);
    vec4 lowerPoint = texture2D(
      uPathShapeTexture,
      vec2((lowerIndex + 0.5) / uPathShapeSampleCount, 0.5)
    );
    vec4 upperPoint = texture2D(
      uPathShapeTexture,
      vec2((upperIndex + 0.5) / uPathShapeSampleCount, 0.5)
    );
    return mix(lowerPoint, upperPoint, blend);
  }

  vec2 samplePathShapeRange(float progress) {
    float sampleIndex = min(
      floor(clamp(progress, 0.0, 0.999999) * uPathShapeSampleCount),
      uPathShapeSampleCount - 1.0
    );
    return texture2D(
      uPathShapeTexture,
      vec2((sampleIndex + 0.5) / uPathShapeSampleCount, 0.5)
    ).zw;
  }

  void main() {
    float pathPhase = fract(orbitProgress + uPathOffset);
    float targetProgress = pathPhase + uDensityFalloff
      * sin(pathPhase * 6.28318530718)
      / 6.28318530718;
    float outwardTarget = uGrowthDirection > 0.0
      ? targetProgress
      : 1.0 - targetProgress;
    float growthBirth = outwardTarget * 0.24;
    float growthLocal = clamp(
      (uGrowthProgress - growthBirth) / max(1.0 - growthBirth, 0.0001),
      0.0,
      1.0
    );
    float growthTravel = growthLocal * growthLocal * (3.0 - 2.0 * growthLocal);
    float growthStart = uGrowthDirection > 0.0 ? 0.0 : 1.0;
    float emittedProgress = mix(growthStart, targetProgress, growthTravel);
    float progress = mix(targetProgress, emittedProgress, uGrowthEnabled);
    float growthVisibility = smoothstep(
      growthBirth,
      growthBirth + 0.025,
      uGrowthProgress
    );
    float middleWeight = sin(clamp(progress, 0.0, 1.0) * 3.14159265359);
    float sizeEnvelope = mix(
      1.0,
      0.14 + 0.86 * pow(max(middleWeight, 0.0), 0.68),
      uSizeFalloff
    );
    float endpointVisibility = smoothstep(0.0, 0.055, progress)
      * (1.0 - smoothstep(0.945, 1.0, progress));
    vec3 animatedPosition = position;

    if (uPathMotion > 0.5) {
      // Fully dispersed stars no longer use the spiral position. Preserve its
      // size/opacity envelopes, but avoid six texture reads per star throughout
      // the article. Other authored entrance presets still need radial distance.
      if (uScrollPositionProgress < 1.0 || uFormationEnabled > 0.5 || uGrowthEnabled > 0.5) {
        float tangentStep = 1.0 / max(uPathSampleCount - 1.0, 1.0);
        vec3 pathPosition = samplePath(progress);
        vec3 before = samplePath(max(progress - tangentStep, 0.0));
        vec3 after = samplePath(min(progress + tangentStep, 1.0));
        vec3 tangent = normalize(after - before);
        vec3 across = normalize(vec3(-tangent.y, tangent.x, 0.0));
        animatedPosition = pathPosition
          + across * starAcrossOffset * mix(1.0, growthTravel, uGrowthEnabled)
          + vec3(
            0.0,
            0.0,
            starDepthOffset * mix(1.0, growthTravel, uGrowthEnabled)
          );
      }
    } else {
      sizeEnvelope = 1.0;
      endpointVisibility = 1.0;
    }

    float radialDistance = length(animatedPosition.xy);
    float localProgress = clamp(
      uFormationProgress
        - radialDistance * uPropagationSoftness * 0.018,
      0.0,
      1.0
    );
    float accretionEnd = clamp(uAccretionRatio, 0.12, 0.72);
    float settleStart = max(accretionEnd + 0.08, 1.0 - uSettleRatio);
    float inward = smoothstep(0.0, accretionEnd, localProgress);
    float exhale = smoothstep(accretionEnd, settleStart, localProgress);
    vec2 radialDirection = animatedPosition.xy / max(radialDistance, 0.0001);
    vec3 farPosition = animatedPosition;
    farPosition.xy += radialDirection * uInwardStrength * (2.0 + radialDistance * 0.28);
    farPosition.z += uInwardStrength * 0.8;
    vec3 condensedPosition = vec3(
      animatedPosition.xy * 0.045,
      animatedPosition.z * 0.12
    );
    vec3 formedPosition = mix(farPosition, condensedPosition, inward);
    formedPosition = mix(formedPosition, animatedPosition, exhale);
    formedPosition.xy += radialDirection
      * sin(exhale * 3.14159265359)
      * (1.0 - exhale)
      * uExhaleStrength;
    float formationVisibility = mix(0.06, 0.58, inward);
    formationVisibility = mix(formationVisibility, 1.0, exhale);
    float coreBurst = exp(-pow((localProgress - accretionEnd) * 11.0, 2.0));
    animatedPosition = mix(animatedPosition, formedPosition, uFormationEnabled);
    float scatterX = fract(sin(
      dot(vec2(orbitProgress, twinklePhase), vec2(127.1, 311.7))
    ) * 43758.5453);
    float scatterY = fract(sin(
      dot(vec2(twinklePhase, starScale), vec2(269.5, 183.3))
    ) * 43758.5453);
    float scatterZ = fract(sin(
      dot(vec2(orbitProgress, starBrightness), vec2(419.2, 371.9))
    ) * 43758.5453);
    float clearanceSeed = fract(sin(
      dot(vec2(starOpacity, twinkleRate), vec2(157.3, 283.9))
    ) * 43758.5453);
    float trackedStarWeight = starHero * uPathShapeTrackingEnabled;
    scatterX = mix(scatterX, uTrackedScatter.x, trackedStarWeight);
    scatterY = mix(scatterY, uTrackedScatter.y, trackedStarWeight);
    scatterZ = mix(scatterZ, uTrackedScatter.z, trackedStarWeight);
    clearanceSeed = mix(
      clearanceSeed,
      uTrackedClearanceSeed,
      trackedStarWeight
    );
    float keepInCenter = step(0.72, clearanceSeed);
    float scatterSide = scatterX < 0.5 ? -1.0 : 1.0;
    // Thin the inner edge so the rails read as a loose field rather than a wall.
    float outerProgress = sqrt(fract(scatterX * 2.0));
    float outerX = scatterSide * mix(
      scatterSide < 0.0 ? -uTextBounds.x : uTextBounds.y,
      uScatterSize.x * 0.5,
      outerProgress
    );
    vec3 scatteredPosition = vec3(
      mix(outerX, (scatterX - 0.5) * uScatterSize.x, keepInCenter),
      (scatterY - 0.5) * uScatterSize.y,
      (scatterZ - 0.5) * 0.5
    );
    vec2 dispersedOffset = astraDispersedMotion(
      uTime,
      scatterX,
      scatterY,
      scatterZ,
      uScrollDrift,
      uDispersedMotion
    );
    scatteredPosition.x += dispersedOffset.x;
    scatteredPosition.y = mod(
      scatteredPosition.y + dispersedOffset.y + uScatterSize.y * 0.5,
      uScatterSize.y
    ) - uScatterSize.y * 0.5;
    scatteredPosition.y -= sin(uScrollPositionProgress * 3.14159265359)
      * (0.15 + scatterZ * 0.25);
    // The opening field fills the viewport; text clearance belongs to scrolling.
    vec3 introScattered = vec3(
      (scatterX - 0.5) * uScatterSize.x,
      (fract(scatterY) - 0.5) * uScatterSize.y,
      (scatterZ - 0.5) * 0.5
    );
    // Extra stars stay in the sky while the full authored set forms the galaxy.
    float backgroundStar = starBackground * uBackgroundStarsEnabled;
    animatedPosition = astraTiltSpiral(animatedPosition, uSpiralTilt);
    animatedPosition = mix(
      animatedPosition,
      introScattered,
      backgroundStar
    );
    animatedPosition = mix(
      animatedPosition,
      scatteredPosition,
      uScrollPositionProgress
    );
    float pathShapeProgress = uPathShapeProgress * (1.0 - backgroundStar);
    float pathShapePositionProgress = uPathShapePositionProgress * (1.0 - backgroundStar);
    float pathShapeDepthCue = 1.0;
    float pathShapeOpacityCue = 1.0;
    float pathShapeBrightKeep = 1.0;
    float shapeBaseSeed = fract(
      orbitProgress * 0.754877666
      + twinklePhase * 0.159154943
      + starScale * 0.117
    );
    float pathShapeTrackingWeight = trackedStarWeight;
    shapeBaseSeed = mix(
      shapeBaseSeed,
      uPathShapeTrackedSeed,
      pathShapeTrackingWeight
    );
    if (pathShapeProgress > 0.0 || pathShapePositionProgress > 0.0) {
    vec2 shapeRange = samplePathShapeRange(shapeBaseSeed);
    float shapeRangeSpan = max(
      shapeRange.y - shapeRange.x,
      1.0 / uPathShapeSampleCount
    );
    float shapeLocalSeed = clamp(
      (shapeBaseSeed - shapeRange.x) / shapeRangeSpan,
      0.0,
      1.0
    );
    float shapeLocalPhase = fract(
      shapeLocalSeed + uPathShapeMotion / shapeRangeSpan
    );
    float shapeLocalProgress = shapeLocalPhase + uDensityFalloff
      * sin(shapeLocalPhase * 6.28318530718)
      / 6.28318530718;
    float shapeSeed = mix(
      shapeRange.x,
      shapeRange.y,
      shapeLocalProgress
    );
    float shapeStep = 1.0 / max(uPathShapeSampleCount - 1.0, 1.0);
    vec3 pathShapePosition = samplePathShape(shapeSeed).xyz;
    vec2 pathShapeBefore = samplePathShape(
      max(shapeSeed - shapeStep, shapeRange.x)
    ).xy * uPathShapeSize;
    vec2 pathShapeAfter = samplePathShape(
      min(shapeSeed + shapeStep, shapeRange.y)
    ).xy * uPathShapeSize;
    vec2 pathShapeTangent = normalize(
      pathShapeAfter - pathShapeBefore + vec2(0.0001, 0.0)
    );
    vec2 pathShapeAcross = vec2(
      -pathShapeTangent.y,
      pathShapeTangent.x
    );
    float pathShapeRandomAcrossScatter = mix(
      (scatterX + scatterY - 1.0) * 0.12,
      uPathShapeTrackedScatter.x,
      pathShapeTrackingWeight
    );
    float pathShapeScatter = (
      starAcrossOffset * 1.1
      + pathShapeRandomAcrossScatter
    ) * uPathShapeScatter;
    float pathShapeDepthEnvelope = sin(
      shapeLocalProgress * 3.14159265359
    );
    float pathShapeContourDepth = sin(
      shapeLocalProgress * 3.14159265359 * 1.35
        + uPathShapeDepthPhase
    ) * uPathShapeDepth * pathShapeDepthEnvelope;
    float pathShapeRandomDepthScatter = mix(
      (scatterZ - 0.5) * 0.22,
      uPathShapeTrackedScatter.y,
      pathShapeTrackingWeight
    );
    vec3 pathShapeOffset = vec3(
      pathShapePosition.xy * uPathShapeSize
        + pathShapeAcross * pathShapeScatter,
      pathShapeContourDepth
      + starDepthOffset * 0.75
      + pathShapeRandomDepthScatter
    );
    pathShapeOffset.z *= uPathShapeScatter;
    float pathShapeCosX = cos(uPathShapeRotation.x);
    float pathShapeSinX = sin(uPathShapeRotation.x);
    pathShapeOffset = vec3(
      pathShapeOffset.x,
      pathShapeOffset.y * pathShapeCosX
        - pathShapeOffset.z * pathShapeSinX,
      pathShapeOffset.y * pathShapeSinX
        + pathShapeOffset.z * pathShapeCosX
    );
    float pathShapeCosY = cos(uPathShapeRotation.y);
    float pathShapeSinY = sin(uPathShapeRotation.y);
    pathShapeOffset = vec3(
      pathShapeOffset.x * pathShapeCosY
        + pathShapeOffset.z * pathShapeSinY,
      pathShapeOffset.y,
      -pathShapeOffset.x * pathShapeSinY
        + pathShapeOffset.z * pathShapeCosY
    );
    pathShapePosition = vec3(uPathShapeCenter, 0.0) + pathShapeOffset;
    float pathShapeFrontness = smoothstep(-1.15, 1.15, pathShapeOffset.z);
    pathShapeDepthCue = mix(0.78, 1.18, pathShapeFrontness);
    pathShapeOpacityCue = mix(0.72, 1.0, pathShapeFrontness);
    float pathShapeMiddleWeight = sin(
      clamp(shapeLocalProgress, 0.0, 1.0) * 3.14159265359
    );
    float pathShapeSizeEnvelope = mix(
      1.0,
      0.14 + 0.86 * pow(max(pathShapeMiddleWeight, 0.0), 0.68),
      uSizeFalloff
    );
    float pathShapeEndpointVisibility = smoothstep(
      0.0,
      0.055,
      shapeLocalProgress
    ) * (1.0 - smoothstep(0.945, 1.0, shapeLocalProgress));
    float pathShapeBrightSeed = fract(sin(
      dot(vec2(orbitProgress, twinklePhase), vec2(193.7, 417.2))
    ) * 43758.5453);
    pathShapeBrightKeep = max(
      starHero,
      step(1.0 - uPathShapeBrightRetention, pathShapeBrightSeed)
    );
    animatedPosition = mix(
      animatedPosition,
      pathShapePosition,
      pathShapePositionProgress
    );
    endpointVisibility = mix(endpointVisibility, 1.0, uScrollScatter);
    sizeEnvelope = mix(sizeEnvelope, 1.0, uScrollScatter);
    endpointVisibility = mix(
      endpointVisibility,
      pathShapeEndpointVisibility,
      pathShapeProgress
    );
    sizeEnvelope = mix(
      sizeEnvelope,
      pathShapeSizeEnvelope,
      pathShapeProgress
    );
    }

    // Scroll and cue morphs move the destination without ending the intro pull.
    animatedPosition = astraIntroMotion(
      animatedPosition, introScattered, mix(uIntroProgress, 1.0, backgroundStar),
      scatterZ, scatterY
    );
    float twinkle = 0.86 + 0.14 * sin(
      twinklePhase + uTime * uTwinkleSpeed * twinkleRate
    );
    float brightStarWeight = smoothstep(1.35, 1.65, starBrightness);
    float pathShapeSuppressedBright = pathShapeProgress
      * brightStarWeight
      * (1.0 - pathShapeBrightKeep);
    vBrightness = uIntensity * starBrightness * twinkle
      * mix(
        1.0,
        uAmbientPulse + coreBurst * (uCoreIntensity - 1.0),
        uFormationEnabled
      )
      * mix(1.0, pathShapeDepthCue, pathShapeProgress)
      * mix(1.0, 0.42, pathShapeSuppressedBright);
    vColor = starColor;
    vOpacity = starOpacity
      * endpointVisibility
      * (0.92 + twinkle * 0.08)
      * mix(1.0, formationVisibility, uFormationEnabled);
    vOpacity *= mix(1.0, growthVisibility, uGrowthEnabled);
    vOpacity *= mix(1.0, pathShapeOpacityCue, pathShapeProgress);
    vRayStrength = smoothstep(1.45, 2.8, starBrightness)
      * mix(1.0, pathShapeBrightKeep, pathShapeProgress);
    float scrollSizeScale = mix(
      uScrollSizeScale,
      1.0,
      pathShapeProgress * brightStarWeight * pathShapeBrightKeep
    );
    // Reveal the dispersed field before pulling its stars into place.
    float introLocalProgress = astraParticleRevealProgress(
      uIntroProgress,
      scatterZ
    );
    float backgroundPresence = backgroundStar
      * max(1.0 - uScrollScatter, uPathShapeProgress);
    scrollSizeScale = mix(scrollSizeScale, 1.0, backgroundPresence);
    vOpacity *= mix(1.0, uBackgroundStarsEnabled, starBackground);
    introLocalProgress = mix(
      introLocalProgress, min(introLocalProgress, 0.2), backgroundPresence
    );
    float introParticleScale = sqrt(introLocalProgress);
    vOpacity *= smoothstep(
      0.0,
      ${i.ASTRA_PARTICLE_OPACITY_REVEAL_END},
      introLocalProgress
    );
    gl_PointSize = uPixelRatio
      * (0.35 + starScale * sizeEnvelope * endpointVisibility * 3.8)
      * (0.97 + twinkle * 0.03)
      * mix(1.0, 1.0 + coreBurst * 0.42, uFormationEnabled)
      * mix(1.0, 0.3 + growthVisibility * 0.7, uGrowthEnabled)
      * scrollSizeScale
      * mix(1.0, pathShapeDepthCue, pathShapeProgress)
      * introParticleScale;
    vec4 viewPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    if (backgroundStar > 0.5) {
      viewPosition = viewMatrix * (uBackgroundModelMatrix * vec4(animatedPosition, 1.0));
    }
    vec4 clipPosition = projectionMatrix * viewPosition;
    vec2 ndc = clipPosition.xy / max(clipPosition.w, 0.0001);
    vLens = 0.0;
    if (uLensActive > 0.0) {
      float lensDistance = length(ndc - uLensPointer);
      vLens = (1.0 - smoothstep(0.0, uLensRadius, lensDistance))
        * uLensActive;
      viewPosition.z += vLens * uLensDepth;
      clipPosition = projectionMatrix * viewPosition;
      clipPosition.xy = uLensPointer * clipPosition.w
        + (clipPosition.xy - uLensPointer * clipPosition.w)
        * (1.0 + vLens * uLensMagnification);
    }
    vBrightness *= 1.0 + vLens * uLensIllumination;
    gl_PointSize *= 1.0 + vLens * uLensMagnification * 0.7;
    vParticleDiameter = gl_PointSize;
    gl_PointSize = max(gl_PointSize, 4.0);
    astraParticleMotion(clipPosition);
    gl_Position = clipPosition;
  }
`,S=`
  varying float vBrightness;
  varying vec3 vColor;
  varying float vLens;
  varying float vOpacity;
  varying float vRayStrength;
  ${l}

  void main() {
    vec2 pixel = (gl_PointCoord - vec2(0.5)) * max(vParticleDiameter, 4.0);
    vec2 point = pixel * 2.0 / max(vParticleDiameter, 0.0001);
    float distanceToCenter = length(point);
    float disc = 1.0 - smoothstep(0.08, 1.0, distanceToCenter);
    float core = pow(disc, 2.2);
    float horizontalRay = exp(-abs(point.y) * 28.0)
      * (1.0 - smoothstep(0.18, 1.0, abs(point.x)));
    float verticalRay = exp(-abs(point.x) * 28.0)
      * (1.0 - smoothstep(0.18, 1.0, abs(point.y)));
    float rays = max(horizontalRay, verticalRay) * 0.28 * vRayStrength;
    float resolved = smoothstep(2.0, 4.0, vParticleDiameter);
    float alpha = mix(astraFilteredCore(pixel, 0.150904), max(core, rays), resolved)
      * vOpacity;

    if (alpha <= 0.0) {
      discard;
    }

    float whiteCore = mix(0.59228, core, resolved)
      * smoothstep(0.9, 2.8, vBrightness)
      * 0.82;
    float colorEnergy = 1.0
      - min(vColor.r, min(vColor.g, vColor.b));
    vec3 emission = mix(vColor, vec3(1.0), whiteCore)
      * vBrightness
      * (1.0 + colorEnergy * 0.42);
    gl_FragColor = vec4(emission, alpha);
  }
`,g={blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.SrcAlphaFactor,blendDst:e.OneFactor,blendEquationAlpha:e.AddEquation,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor},P=`<svg viewBox="0 0 231 325" xmlns="http://www.w3.org/2000/svg">${["M128.472 2.36011C65.4727 24.3601 10.7725 93.1601 9.97246 162.36C8.97246 248.86 79.4138 262.86 87.9725 262.86C116.973 262.86 135.973 244.36 135.973 221.36C135.973 189.86 102.973 193.86 102.973 209.36","M224.973 31.8602C132.473 3.86011 29.9727 75.8601 29.9727 159.86C29.9727 247.86 98.4726 259.86 126.473 247.86","M126.473 215.359C124.639 222.692 117.073 237.159 101.473 236.359C89.1905 235.729 76.0585 219.995 76.4724 195.859C76.4724 165.859 100.473 142.859 132.473 142.859C171.973 142.859 213.473 171.36 213.473 231.36C213.473 276.36 170.473 328.36 85.9727 316.86","M106.973 237.36C81.9727 240.36 61.4727 222.86 61.4727 184.86C61.4727 153.36 91.9727 123.36 132.473 123.36C172.973 123.36 227.973 149.86 227.973 225.36C227.973 287.36 168.473 322.36 121.473 322.36C53.4727 322.36 10.9727 264.86 2.47266 208.36","M114.973 211.36C114.973 225.86 92.4727 226.86 92.4727 205.36C92.4727 183.86 109.938 175.36 127.973 175.36C146.008 175.36 174.473 195.86 174.473 230.86C174.473 264.36 148.473 281.86 133.973 287.36C119.473 292.86 81.6727 296.56 54.4727 269.36"].map(t=>`<path d="${t}"/>`).join("")}</svg>`,y=[{depth:.62,phase:.16,speed:.025,strong:!0},{depth:-.46,phase:.72,speed:-.018,strong:!1},{depth:.78,phase:.38,speed:.021,strong:!0},{depth:-.7,phase:.58,speed:-.016,strong:!1},{depth:.42,phase:.08,speed:.03,strong:!0}];class v extends e.Curve{source;depth;rotationDepth;depthPhase;constructor(t,e,a,r){super(),this.source=t,this.depth=e,this.rotationDepth=a,this.depthPhase=r,this.arcLengthDivisions=640}getPoint(t,a=new e.Vector3){let r=e.MathUtils.clamp(t,0,1),o=this.source.getPointAt(r),i=Math.sin(r*Math.PI),s=Math.sin(r*Math.PI*1.35+this.depthPhase)*this.depth*this.rotationDepth*i;return a.set((o.x-114.973)*(9.7/325),(211.36-o.y)*(9.7/325),s)}}function x(t){let e=t>>>0;return()=>{let t=e+=0x6d2b79f5;return t=Math.imul(t^t>>>15,1|t),(((t^=t+Math.imul(t^t>>>7,61|t))^t>>>14)>>>0)/0x100000000}}function b(t,e,a,r){let o=43758.5453*Math.sin(t*a+e*r);return o-Math.floor(o)}function w(t,a){return t.magFilter=a?e.LinearFilter:e.NearestFilter,t.minFilter=a?e.LinearFilter:e.NearestFilter,t.generateMipmaps=!1,t.wrapS=e.ClampToEdgeWrapping,t.wrapT=e.ClampToEdgeWrapping,t.needsUpdate=!0,t}function A(t,a,r=null,o=0,i=.18,s=0,n=.5,l){let{stars:u,accretionExhale:c,grow:h,interaction:p}=t;return new e.ShaderMaterial({...g,depthTest:!1,depthWrite:!1,fragmentShader:S,toneMapped:!1,transparent:!0,uniforms:{uAccretionRatio:{value:c.accretionRatio},uAmbientPulse:{value:1},uCoreIntensity:{value:c.coreIntensity},uDensityFalloff:{value:e.MathUtils.clamp(u.densityFalloff,0,.98)},uDispersedMotion:{value:0},uFlowSpeed:{value:e.MathUtils.clamp(u.flowSpeed,0,3)},uExhaleStrength:{value:c.exhaleStrength},uFormationEnabled:{value:0},uFormationProgress:{value:1},uBackgroundStarsEnabled:{value:0},uBackgroundModelMatrix:{value:new e.Matrix4},uIntroProgress:{value:Number(!t.animationPlaying||"converge-tilt"!==t.animationPreset)},uGrowthEnabled:{value:0},uGrowthDirection:{value:1},uGrowthProgress:{value:1},uGrowthRadius:{value:8.2},uGrowthSoftness:{value:h.softness},uInwardStrength:{value:c.inwardStrength},uIntensity:{value:e.MathUtils.clamp(u.intensity,.1,3)},uPathMotion:{value:Number(null!==r)},uPathOffset:{value:0},uPathSampleCount:{value:512},uPathSpeed:{value:o},uPathTexture:{value:r},uPathShapeCenter:{value:new e.Vector2},uPathShapeBrightRetention:{value:e.MathUtils.clamp(n,0,1)},uPathShapeDepth:{value:e.MathUtils.clamp(i,-1.8,1.8)},uPathShapeDepthPhase:{value:s},uPathShapeMotion:{value:0},uPathShapeProgress:{value:0},uPathShapePositionProgress:{value:0},uPathShapeRotation:{value:new e.Vector2},uPathShapeScatter:{value:1},uPathShapeSampleCount:{value:1024},uPathShapeSize:{value:new e.Vector2},uPathShapeTrackedScatter:{value:new e.Vector2(l?.acrossScatter??0,l?.depthScatter??0)},uTrackedClearanceSeed:{value:l?.clearanceSeed??0},uTrackedScatter:{value:l?.scatter.clone()??new e.Vector3},uPathShapeTrackedSeed:{value:l?.seed??0},uPathShapeTrackingEnabled:{value:Number(void 0!==l)},uPathShapeTexture:{value:null},uLensActive:{value:0},uLensDepth:{value:p.depthDisplacement},uLensIllumination:{value:p.illumination},uLensMagnification:{value:p.magnification},uLensPointer:{value:new e.Vector2},uLensRadius:{value:.2},uParticleMotionEnabled:{value:0},uPointerRepelRadius:{value:.2},uPixelRatio:{value:a},uSizeFalloff:{value:e.MathUtils.clamp(u.sizeFalloff,0,1)},uPropagationSoftness:{value:c.propagationSoftness},uScatterSize:{value:new e.Vector2(12,12)},uScrollDrift:{value:0},uScrollScatter:{value:0},uScrollPositionProgress:{value:0},uScrollSizeScale:{value:1},uSpiralTilt:{value:0},uSettleRatio:{value:.15},uTextBounds:{value:new e.Vector2(-3,3)},uTime:{value:0},uTwinkleSpeed:{value:e.MathUtils.clamp(u.twinkleSpeed,0,2)},uViewportAspect:{value:1}},vertexShader:m})}function M(t,e){let a=t.reduce((t,e)=>t+e,0);if(e>=a)return t;if(e<=0)return t.map(()=>0);let r=t.map(t=>t/a*e),o=r.map(Math.floor),i=e-o.reduce((t,e)=>t+e,0),s=r.map((t,e)=>({index:e,fraction:t-o[e]}));for(let{index:t}of(s.sort((t,e)=>e.fraction-t.fraction||t.index-e.index),s)){if(i<=0)break;o[t]+=1,i-=1}for(let t=0;t<y.length;t+=1){let e=2*t,a=e+1;0===o[e]&&o[a]>0&&(o[e]=1,o[a]-=1)}return o}function T(t){return Math.sin(e.MathUtils.clamp(t,0,1)*Math.PI)}function C(t){return e.MathUtils.smoothstep(t,0,.055)*(1-e.MathUtils.smoothstep(t,.945,1))}function D(t,a){return e.MathUtils.lerp(1,.14+.86*T(t)**.68,e.MathUtils.clamp(a,0,1))}function F(t,a){let r=L(t,1);return r+e.MathUtils.clamp(a,0,.98)*Math.sin(r*Math.PI*2)/(2*Math.PI)}function R(t,e,a){let r=t.getPointAt(0).lengthSq(),o=t.getPointAt(1).lengthSq()<r;return Math.abs(e)*((a?o:!o)?1:-1)}function L(t,e){return(t%e+e)%e}t.s(["createPathShapeTexture",0,function(){return w(new e.DataTexture(new Float32Array(4096),1024,1,e.RGBAFormat,e.FloatType),!1)},"densityProgress",0,F,"easeOutExpo",0,function(t){return t>=1?1:1-2**(-10*t)},"generateAstraField",0,function(t,o={}){let i=o.tier??3,s=o.trackOpticalSources??!0,n=i<=1?2:4,l=e.MathUtils.clamp(t.stars.density,.25,n),u=e.MathUtils.clamp(t.orbitalDust.density,.1,n),c=y.flatMap(e=>[Math.max(8,Math.round((e.strong?220:170)*l)),t.orbitalDust.enabled?Math.max(1,Math.round((e.strong?150:90)*u)):0]);c.push(t.showCenterCluster?Math.max(18,Math.round(24*l)):0);let h=c.map((e,a)=>"converge-tilt"===t.animationPreset&&a<2*y.length&&a%2==0?Math.ceil(.12*e/.88):0),p=[...c,...h].reduce((t,e)=>t+e,0),m=o.maxParticleCount??p,S=0===i?0:Number.isFinite(m)?Math.max(0,Math.floor(m)):m===1/0?p:0,k=M(c,S),E=k.reduce((t,e)=>t+e,0),B=M(h,Math.max(0,S-E)),I=Number.isFinite(o.pixelRatio)?e.MathUtils.clamp(o.pixelRatio??1,.1,i<=1?1:2===i?1.5:2):1,O=new e.Group,z=new e.Object3D;z.scale.setScalar(0),O.add(z);let V=[],_=[],U=[],N=[],G=null,X=E+B.reduce((t,e)=>t+e,0);if(X>0){new a.SVGLoader().parse(P).paths.map(t=>t.subPaths[0]).forEach((a,o)=>{let i=y[o],n=k[2*o],l=k[2*o+1];if(!a||!i||0===n)return;let u=new v(a,i.depth,e.MathUtils.clamp(t.rotationDepth,0,2),.82*o),c=R(u,i.speed,t.stars.flowInward),h=R(u,i.speed,!1),p=function(t,a,o,i,s,n,l,u){let{stars:c,colorMode:h,colorPalette:p,colorPaletteColors:f,rotationDepth:d}=s,m=n+l,S=new Float32Array(3*m),g=new Float32Array(m),P=new Float32Array(m),y=new Float32Array(3*m),v=new Float32Array(m),M=new Float32Array(m),C=new Float32Array(m),D=new Float32Array(m),R=new Float32Array(m),k=new Float32Array(m),E=new Float32Array(m),B=x(0x243f6a88^(i+1)*0x9e3779b9),I=x(0xa4093822^(i+1)*0x299f31d0),O=new e.Vector3,z=new e.Vector3,V=new e.Vector3,_=new e.Vector3,U=e.MathUtils.clamp(c.densityFalloff,0,1),N=e.MathUtils.clamp(c.scatter,0,.45),{samples:G,texture:X}=function(t){let a=new Float32Array(2048),r=new e.Vector3;for(let e=0;e<512;e+=1){t.getPointAt(e/511,r);let o=4*e;a[o]=r.x,a[o+1]=r.y,a[o+2]=r.z,a[o+3]=1}return{samples:a,texture:w(new e.DataTexture(a,512,1,e.RGBAFormat,e.FloatType),!1)}}(t),W=-1/0,Y=0,q=0,$=.5,Z=0;for(let o=0;o<m;o+=1){let i=B(),s=F(i,U),l=T(s);t.getPointAt(s,O),t.getTangentAt(s,z).normalize(),V.set(-z.y,z.x,0).normalize();let u=N*e.MathUtils.lerp(.3,1,l)*(.22+.78*B()),d=(B()+B()-1)*u,m=(B()+B()-1)*u*.65;O.addScaledVector(V,d),O.z+=m;let x=e.MathUtils.lerp((a.strong?.085:.055)*.22,a.strong?.085:.055,l),b=B()<x,w=(b?.85+1.25*B():.12+B()**2.4*.68)*e.MathUtils.clamp(c.size,.25,3),A=(b?2+1.5*B():.56+.78*B())*(a.strong?1:.82),M=3*o;S[M]=O.x,S[M+1]=O.y,S[M+2]=O.z,g[o]=d,P[o]=A,(0,r.writeStarColor)(y,M,h,I(),p,f),v[o]=m,C[o]=.82+.16*B(),D[o]=i,R[o]=w,k[o]=B()*Math.PI*2,E[o]=.65+.7*B(),o<n&&w>W&&(W=w,Y=d,q=m,$=i,Z=o,_.copy(O))}$=D[Z]??$,Y=g[Z]??Y,q=v[Z]??q;let H=(a.strong?2.2:2.05)*e.MathUtils.clamp(c.size,.25,3);R[Z]=Math.max(R[Z],H),P[Z]=Math.max(P[Z],a.strong?3.35:2.85),M[Z]=1;let j=a.depth*e.MathUtils.clamp(d,0,2),K=.82*i,J=Math.fround(L((D[Z]??0)*.754877666+(k[Z]??0)*.159154943+(R[Z]??0)*.117,1)),Q=b(D[Z]??0,k[Z]??0,127.1,311.7),tt=b(k[Z]??0,R[Z]??0,269.5,183.3),te=b(D[Z]??0,P[Z]??0,419.2,371.9),ta=b(C[Z]??0,E[Z]??0,157.3,283.9),tr=new e.Vector3(Q,tt,te),to=Math.fround((Q+tt-1)*.12),ti=Math.fround((te-.5)*.22);(0,r.writeStarColor)(y,3*Z,h,r.SECONDARY_COLOR_SEEDS[i]??.08,p,f);let ts=new e.BufferGeometry;ts.setAttribute("position",new e.Float32BufferAttribute(S,3)),ts.setAttribute("orbitProgress",new e.Float32BufferAttribute(D,1)),ts.setAttribute("starAcrossOffset",new e.Float32BufferAttribute(g,1)),ts.setAttribute("starDepthOffset",new e.Float32BufferAttribute(v,1)),ts.setAttribute("starHero",new e.Float32BufferAttribute(M,1)),ts.setAttribute("starBackground",new e.Float32BufferAttribute(new Float32Array(m).fill(1,n),1)),ts.setAttribute("starBrightness",new e.Float32BufferAttribute(P,1)),ts.setAttribute("starColor",new e.Float32BufferAttribute(y,3)),ts.setAttribute("starOpacity",new e.Float32BufferAttribute(C,1)),ts.setAttribute("starScale",new e.Float32BufferAttribute(R,1)),ts.setAttribute("twinklePhase",new e.Float32BufferAttribute(k,1)),ts.setAttribute("twinkleRate",new e.Float32BufferAttribute(E,1));let tn=A(s,u,X,o,j,K,.5,{acrossScatter:to,clearanceSeed:ta,depthScatter:ti,scatter:tr,seed:J}),tl=new e.Points(ts,tn);return tl.frustumCulled=!1,tl.renderOrder=40+i,{flareAcrossOffset:Y,flareBasePosition:_.clone(),flareClearanceSeed:ta,flareDepthOffset:q,flarePathSamples:G,flarePosition:_,flareProgress:$,flareScatter:tr,flareShapeAcrossScatter:to,flareShapeDepthScatter:ti,flareShapeSeed:J,geometry:ts,material:tn,pathShapeDepth:j,pathShapeDepthPhase:K,pathTexture:X,points:tl}}(u,i,c,o,t,n,B[2*o],I),m=l>0?function(t,a,r,o,i,s,n){let{orbitalDust:l,stars:u,accretionExhale:c,grow:h,interaction:p}=i,m=new Float32Array(3*s),S=new Float32Array(s),P=new Float32Array(3*s),y=new Float32Array(s),v=new Float32Array(s),b=new Float32Array(s),w=x(0x9e3779b9^(o+1)*0x85ebca6b),A=new e.Vector3,M=new e.Vector3,C=new e.Vector3,D=e.MathUtils.clamp(l.spread,0,.65),F=Math.min(e.MathUtils.clamp(l.tightSpread,0,.3),D),R=e.MathUtils.clamp(u.densityFalloff,0,1),L=e.MathUtils.clamp(u.sizeFalloff,0,1);for(let a=0;a<s;a+=1){var k;let r=(a+.92*w())/s,o=(w()+w()+w())/3,i=w()<R?o:r,n=T(i),l=e.MathUtils.lerp(1,.18+.82*n**.68,L);t.getPointAt(i,A),t.getTangentAt(i,M).normalize(),C.set(-M.y,M.x,0).normalize();let u=.68>w(),c=(u?F:D)*l;A.addScaledVector(C,(w()+w()-1)*c),A.z+=(w()+w()-1)*c*.7;let h=3*a;m[h]=A.x,m[h+1]=A.y,m[h+2]=A.z,y[a]=i,S[a]=w(),P[h]=M.x,P[h+1]=M.y,P[h+2]=M.z,b[a]=w()*(u?1:.72)*l,v[a]=(k=i,e.MathUtils.smoothstep(k,0,.07)*(1-e.MathUtils.smoothstep(k,.84,1))*(u?1:.72)*(.38+.58*w())*e.MathUtils.lerp(1,.3+.7*n,L))}let E=new e.BufferGeometry;E.setAttribute("position",new e.Float32BufferAttribute(m,3)),E.setAttribute("driftPhase",new e.Float32BufferAttribute(S,1)),E.setAttribute("driftTangent",new e.Float32BufferAttribute(P,3)),E.setAttribute("orbitProgress",new e.Float32BufferAttribute(y,1)),E.setAttribute("particleOpacity",new e.Float32BufferAttribute(v,1)),E.setAttribute("particleScale",new e.Float32BufferAttribute(b,1));let B=new e.ShaderMaterial({...g,depthTest:!1,depthWrite:!1,fragmentShader:d,toneMapped:!1,transparent:!0,uniforms:{uAccretionRatio:{value:c.accretionRatio},uAmbientPulse:{value:1},uCoreIntensity:{value:c.coreIntensity},uDirection:{value:r<0?-1:1},uDispersedMotion:{value:0},uDriftDistance:{value:.16},uDriftSpeed:{value:e.MathUtils.clamp(l.driftSpeed,0,1.5)},uExhaleStrength:{value:c.exhaleStrength},uFormationEnabled:{value:0},uFormationProgress:{value:1},uIntroProgress:{value:Number(!i.animationPlaying||"converge-tilt"!==i.animationPreset)},uGrowthEnabled:{value:0},uGrowthProgress:{value:1},uGrowthRadius:{value:8.2},uGrowthSoftness:{value:h.softness},uHeadProgress:{value:a.phase},uInwardStrength:{value:c.inwardStrength},uIntensity:{value:e.MathUtils.clamp(l.intensity,0,3)},uLightReach:{value:e.MathUtils.clamp(l.reach,.02,.4)*(a.strong?1.15:1)},uPixelRatio:{value:n},uStarBrightness:{value:a.strong?1:.62},uStarVisibility:{value:1},uLensActive:{value:0},uLensDepth:{value:p.depthDisplacement},uLensIllumination:{value:p.illumination},uLensMagnification:{value:p.magnification},uLensPointer:{value:new e.Vector2},uLensRadius:{value:.2},uParticleMotionEnabled:{value:0},uPointerRepelRadius:{value:.2},uPropagationSoftness:{value:c.propagationSoftness},uScatterSize:{value:new e.Vector2(12,12)},uScrollDrift:{value:0},uScrollScatter:{value:0},uScrollPositionProgress:{value:0},uSpiralTilt:{value:0},uSettleRatio:{value:.15},uTrailEnabled:{value:1},uTrailLength:{value:.18},uTime:{value:0},uViewportAspect:{value:1}},vertexShader:f}),I=new e.Points(E,B);return I.frustumCulled=!1,I.renderOrder=70+o,{geometry:E,material:B,points:I}}(u,i,c,o,t,l,I):null,S=new e.Group;S.add(p.points),m&&(S.add(m.points),V.push(m.geometry,m.material));let P=null;if(s){(P=new e.Object3D).position.copy(p.flarePosition),P.userData.astraFlareScatter=p.flareScatter;let a=F(p.flareProgress,t.stars.densityFalloff);P.scale.setScalar(C(a)*D(a,t.stars.sizeFalloff)),S.add(P),N.push(P)}O.add(S),_.push({group:S,lag:.18+.17*o,spin:new e.Vector2}),U.push({curve:u,dustMaterial:m?.material??null,flareAcrossOffset:p.flareAcrossOffset,flareBasePosition:p.flareBasePosition,flareClearanceSeed:p.flareClearanceSeed,flareDepthOffset:p.flareDepthOffset,flarePathSamples:p.flarePathSamples,flareProgress:p.flareProgress,flareScatter:p.flareScatter,flareShapeAcrossScatter:p.flareShapeAcrossScatter,flareShapeDepthScatter:p.flareShapeDepthScatter,flareShapeSeed:p.flareShapeSeed,flareSource:P,isCore:!1,outwardSpeed:h,phase:i.phase,motionOffset:0,speed:c,starMaterial:p.material,strong:i.strong,pathShapeDepth:p.pathShapeDepth,pathShapeDepthPhase:p.pathShapeDepthPhase,pathShapeTravel:0,travel:i.phase}),V.push(p.geometry,p.material,p.pathTexture)});let o=k[2*y.length];if(o>0){let a=function(t,a,o){let{stars:i,colorMode:s,colorPalette:n,colorPaletteColors:l}=t,u=new Float32Array(3*a),c=new Float32Array(a),h=new Float32Array(3*a),p=new Float32Array(a),f=new Float32Array(a),d=new Float32Array(a),m=new Float32Array(a),S=new Float32Array(a),g=x(0xb7e15162),P=x(0xc0ac29b7),y=0,v=-1/0;for(let t=0;t<a;t+=1){let a=g()**2.4*.42,o=g()*Math.PI*2,p=3*t;u[p]=Math.cos(o)*a,u[p+1]=Math.sin(o)*a*.72,u[p+2]=(g()-.5)*.16;let x=1-a/.42;c[t]=1.2+2.8*x+.6*g(),(0,r.writeStarColor)(h,p,s,x>.74?.99:P(),n,l),f[t]=.62+.38*x,d[t]=(.28+1.45*x+.45*g())*e.MathUtils.clamp(i.size,.25,3)*.8;let b=c[t]*d[t];b>v&&(y=t,v=b),m[t]=g()*Math.PI*2,S[t]=.55+.45*g()}p[y]=1;let w=3*y,M=new e.Vector3(u[w]??0,u[w+1]??0,u[w+2]??0),T=new e.Vector3(b(0,m[y]??0,127.1,311.7),b(m[y]??0,d[y]??0,269.5,183.3),b(0,c[y]??0,419.2,371.9)),C=b(f[y]??0,S[y]??0,157.3,283.9),D=Math.fround(L(0+(m[y]??0)*.159154943+(d[y]??0)*.117,1)),F=Math.fround((T.x+T.y-1)*.12),R=Math.fround((T.z-.5)*.22),k=new e.BufferGeometry;k.setAttribute("position",new e.Float32BufferAttribute(u,3)),k.setAttribute("orbitProgress",new e.Float32BufferAttribute(new Float32Array(a),1)),k.setAttribute("starAcrossOffset",new e.Float32BufferAttribute(new Float32Array(a),1)),k.setAttribute("starDepthOffset",new e.Float32BufferAttribute(new Float32Array(a),1)),k.setAttribute("starHero",new e.Float32BufferAttribute(p,1)),k.setAttribute("starBackground",new e.Float32BufferAttribute(new Float32Array(a),1)),k.setAttribute("starBrightness",new e.Float32BufferAttribute(c,1)),k.setAttribute("starColor",new e.Float32BufferAttribute(h,3)),k.setAttribute("starOpacity",new e.Float32BufferAttribute(f,1)),k.setAttribute("starScale",new e.Float32BufferAttribute(d,1)),k.setAttribute("twinklePhase",new e.Float32BufferAttribute(m,1)),k.setAttribute("twinkleRate",new e.Float32BufferAttribute(S,1));let E=A({...t,stars:{...i,intensity:1.22*i.intensity}},o,null,0,.18,2.4,.5,{acrossScatter:F,clearanceSeed:C,depthScatter:R,scatter:T,seed:D}),B=new e.Points(k,E);return B.frustumCulled=!1,B.renderOrder=100,{flareBasePosition:M,flareClearanceSeed:C,flareProgress:0,flareScatter:T,flareShapeAcrossScatter:F,flareShapeDepthScatter:R,flareShapeSeed:D,geometry:k,material:E,points:B}}(t,o,I);O.add(a.points),s&&(z.position.copy(a.flareBasePosition),z.scale.setScalar(1),z.userData.astraFlareScatter=a.flareScatter,a.points.add(z)),G=a.points,V.push(a.geometry,a.material),U.push({curve:null,dustMaterial:null,flareAcrossOffset:0,flareBasePosition:a.flareBasePosition,flareClearanceSeed:a.flareClearanceSeed,flareDepthOffset:0,flarePathSamples:null,flareProgress:a.flareProgress,flareScatter:a.flareScatter,flareShapeAcrossScatter:a.flareShapeAcrossScatter,flareShapeDepthScatter:a.flareShapeDepthScatter,flareShapeSeed:a.flareShapeSeed,flareSource:s?z:null,isCore:!0,outwardSpeed:0,phase:0,motionOffset:0,speed:0,starMaterial:a.material,strong:!0,pathShapeDepth:.18,pathShapeDepthPhase:2.4,pathShapeTravel:0,travel:0})}}let W=!1;return{coreCluster:G,coreSource:z,disposables:V,group:O,orbits:_,pathLayers:U,secondarySources:N,particleCount:X,dispose:()=>{W||(W=!0,V.forEach(t=>t.dispose()),O.clear())}}},"positiveModulo",0,L,"samplePath",0,function(t,a,r){let o=Math.max(Math.floor(t.length/4),1),i=e.MathUtils.clamp(a,0,1)*(o-1),s=Math.floor(i),n=Math.min(s+1,o-1),l=i-s,u=4*s,c=4*n;return r.set(e.MathUtils.lerp(t[u]??0,t[c]??0,l),e.MathUtils.lerp(t[u+1]??0,t[c+1]??0,l),e.MathUtils.lerp(t[u+2]??0,t[c+2]??0,l))},"samplePathRange",0,function(t,a,r){let o=Math.max(Math.floor(t.length/4),1),i=4*Math.min(Math.floor(e.MathUtils.clamp(a,0,.999999)*o),o-1);return r.set(t[i+2]??0,t[i+3]??1)},"sizeFalloff",0,D,"tipFade",0,C],861045)},83007,t=>{"use strict";var e=t.i(695418);let a=`
  vec3 astraIntroMotion(
    vec3 position, vec3 scattered, float progress,
    float seed, float travelSeed
  ) {
    if (progress >= 1.0) return position;
    float start = 0.14 + seed * 0.18;
    float duration = 0.58 + travelSeed * 0.1;
    float local = clamp((progress - start) / duration, 0.0, 1.0);
    float smoothPull = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);
    float pull = mix(smoothPull, sin(smoothPull * 3.14159265359 * 0.5), 0.5);
    float angle = sin(pull * 3.14159265359) * (0.44 + seed * 0.22);
    float c = cos(angle);
    float s = sin(angle);
    vec3 orbiting = vec3(
      scattered.x * c - scattered.y * s,
      scattered.x * s + scattered.y * c,
      scattered.z
    );
    return mix(orbiting, position, pull);
  }
`;t.s(["ASTRA_INTRO_MOTION_GLSL",0,a,"applyAstraIntroMotion",0,function(t,a,r,o,i){if(r>=1)return;let s=.14+.18*o,n=e.MathUtils.smootherstep(r,s,s+(.58+.1*i)),l=e.MathUtils.lerp(n,Math.sin(n*Math.PI*.5),.5),u=Math.sin(l*Math.PI)*(.44+.22*o),c=Math.cos(u),h=Math.sin(u);t.set(e.MathUtils.lerp(a.x*c-a.y*h,t.x,l),e.MathUtils.lerp(a.x*h+a.y*c,t.y,l),e.MathUtils.lerp(a.z,t.z,l))}])},384051,t=>{"use strict";var e=t.i(695418);let a=`
  vec4 astraCoast(vec4 state, float mass, float age) {
    float drag = 2.3 / sqrt(mass);
    float velocityDecay = exp(-drag * age);
    float returnDecay = exp(-age);
    state.xy = state.xy * returnDecay
      + state.zw * (returnDecay - velocityDecay) / (drag - 1.0);
    state.zw *= velocityDecay;
    return state;
  }
`;t.s(["PARTICLE_MOTION_COAST_GLSL",0,a,"PARTICLE_MOTION_SETTLE_SECONDS",0,6,"particleMotionMass",0,function(t){return e.MathUtils.lerp(.65,2.4,e.MathUtils.smoothstep(t,1,14))}])},63295,396522,642671,t=>{"use strict";var e=t.i(695418);let a=e.SRGBColorSpace;class r extends e.Loader{constructor(t){super(t),this.defaultDPI=90,this.defaultUnit="px"}load(t,a,r,o){let i=this,s=new e.FileLoader(i.manager);s.setPath(i.path),s.setRequestHeader(i.requestHeader),s.setWithCredentials(i.withCredentials),s.load(t,function(e){try{a(i.parse(e))}catch(e){o?o(e):console.error(e),i.manager.itemError(t)}},r,o)}parse(t){let r=this;function o(t,e,a,r,o,s,n,l){if(0==e||0==a)return void t.lineTo(l.x,l.y);r=r*Math.PI/180,e=Math.abs(e),a=Math.abs(a);let u=(n.x-l.x)/2,c=(n.y-l.y)/2,h=Math.cos(r)*u+Math.sin(r)*c,p=-Math.sin(r)*u+Math.cos(r)*c,f=e*e,d=a*a,m=h*h,S=p*p,g=m/f+S/d;if(g>1){let t=Math.sqrt(g);e*=t,a*=t,f=e*e,d=a*a}let P=f*S+d*m,y=Math.sqrt(Math.max(0,(f*d-P)/P));o===s&&(y=-y);let v=y*e*p/a,x=-y*a*h/e,b=Math.cos(r)*v-Math.sin(r)*x+(n.x+l.x)/2,w=Math.sin(r)*v+Math.cos(r)*x+(n.y+l.y)/2,A=i(1,0,(h-v)/e,(p-x)/a),M=i((h-v)/e,(p-x)/a,(-h-v)/e,(-p-x)/a)%(2*Math.PI);t.currentPath.absellipse(b,w,e,a,A,A+M,0===s,r)}function i(t,e,a,r){let o=Math.sqrt(t*t+e*e)*Math.sqrt(a*a+r*r),i=Math.acos(Math.max(-1,Math.min(1,(t*a+e*r)/o)));return t*r-e*a<0&&(i=-i),i}function s(t,e){e=Object.assign({},e);let a={};if(t.hasAttribute("class")){let e=t.getAttribute("class").split(/\s/).filter(Boolean).map(t=>t.trim());for(let t=0;t<e.length;t++)a=Object.assign(a,m["."+e[t]])}function r(r,o,i){void 0===i&&(i=function(t){return t.startsWith("url")&&console.warn("SVGLoader: url access in attributes is not implemented."),t}),t.hasAttribute(r)&&(e[o]=i(t.getAttribute(r))),a[r]&&(e[o]=i(a[r])),t.style&&""!==t.style[r]&&(e[o]=i(t.style[r]))}function o(t){return Math.max(0,Math.min(1,c(t)))}function i(t){return Math.max(0,c(t))}return t.hasAttribute("id")&&(a=Object.assign(a,m["#"+t.getAttribute("id")])),r("fill","fill"),r("fill-opacity","fillOpacity",o),r("fill-rule","fillRule"),r("opacity","opacity",o),r("stroke","stroke"),r("stroke-opacity","strokeOpacity",o),r("stroke-width","strokeWidth",i),r("stroke-linejoin","strokeLineJoin"),r("stroke-linecap","strokeLineCap"),r("stroke-miterlimit","strokeMiterLimit",i),r("visibility","visibility"),e}function n(t,e,a){let r;if("string"!=typeof t)throw TypeError("Invalid input: "+typeof t);let o=/[ \t\r\n]/,i=/[\d]/,s=/[-+]/,n=/\./,l=/,/,u=/e/i,c=/[01]/,h=0,p=!0,f="",d="",m=[];function S(t,e,a){let r=SyntaxError('Unexpected character "'+t+'" at index '+e+".");throw r.partial=a,r}function g(){""!==f&&(""===d?m.push(Number(f)):m.push(Number(f)*Math.pow(10,Number(d)))),f="",d=""}let P=t.length;for(let y=0;y<P;y++){if(r=t[y],Array.isArray(e)&&e.includes(m.length%a)&&c.test(r)){h=1,f=r,g();continue}if(0===h){if(o.test(r))continue;if(i.test(r)||s.test(r)){h=1,f=r;continue}if(n.test(r)){h=2,f=r;continue}l.test(r)&&(p&&S(r,y,m),p=!0)}if(1===h){if(i.test(r)){f+=r;continue}if(n.test(r)){f+=r,h=2;continue}if(u.test(r)){h=3;continue}s.test(r)&&1===f.length&&s.test(f[0])&&S(r,y,m)}if(2===h){if(i.test(r)){f+=r;continue}if(u.test(r)){h=3;continue}n.test(r)&&"."===f[f.length-1]&&S(r,y,m)}if(3===h){if(i.test(r)){d+=r;continue}if(s.test(r)){if(""===d){d+=r;continue}1===d.length&&s.test(d)&&S(r,y,m)}}o.test(r)?(g(),h=0,p=!1):l.test(r)?(g(),h=0,p=!0):s.test(r)?(g(),h=1,f=r):n.test(r)?(g(),h=2,f=r):S(r,y,m)}return g(),m}let l=["mm","cm","in","pt","pc","px"],u={mm:{mm:1,cm:.1,in:1/25.4,pt:72/25.4,pc:6/25.4,px:-1},cm:{mm:10,cm:1,in:1/2.54,pt:72/2.54,pc:6/2.54,px:-1},in:{mm:25.4,cm:2.54,in:1,pt:72,pc:6,px:-1},pt:{mm:25.4/72,cm:2.54/72,in:1/72,pt:1,pc:6/72,px:-1},pc:{mm:25.4/6,cm:2.54/6,in:1/6,pt:12,pc:1,px:-1},px:{px:1}};function c(t){let e,a="px";if("string"==typeof t||t instanceof String)for(let e=0,r=l.length;e<r;e++){let r=l[e];if(t.endsWith(r)){a=r,t=t.substring(0,t.length-r.length);break}}return"px"===a&&"px"!==r.defaultUnit?e=u.in[r.defaultUnit]/r.defaultDPI:(e=u[a][r.defaultUnit])<0&&(e=u[a].in*r.defaultDPI),e*parseFloat(t)}function h(t){let e=t.elements;return e[0]*e[4]-e[1]*e[3]<0}function p(t){let e=t.elements;return Math.sqrt(e[0]*e[0]+e[1]*e[1])}function f(t){let e=t.elements;return Math.sqrt(e[3]*e[3]+e[4]*e[4])}let d=[],m={},S=[],g=new e.Matrix3,P=new e.Matrix3,y=new e.Matrix3,v=new e.Matrix3,x=new e.Vector2,b=new e.Vector3,w=new e.Matrix3,A=new DOMParser().parseFromString(t,"image/svg+xml");return!function t(r,i){var l,u,A,M,T,C;if(1!==r.nodeType)return;let D=function(t){if(!(t.hasAttribute("transform")||"use"===t.nodeName&&(t.hasAttribute("x")||t.hasAttribute("y"))))return null;let a=function(t){let a=new e.Matrix3;if("use"===t.nodeName&&(t.hasAttribute("x")||t.hasAttribute("y"))){let e=c(t.getAttribute("x")),r=c(t.getAttribute("y"));a.translate(e,r)}if(t.hasAttribute("transform")){let e=t.getAttribute("transform").split(")");for(let t=e.length-1;t>=0;t--){let r=e[t].trim();if(""===r)continue;let o=r.indexOf("("),i=r.length;if(o>0&&o<i){let t=r.slice(0,o),e=n(r.slice(o+1));switch(g.identity(),t){case"translate":if(e.length>=1){let t=e[0],a=0;e.length>=2&&(a=e[1]),g.translate(t,a)}break;case"rotate":if(e.length>=1){let t=0,a=0,r=0;t=e[0]*Math.PI/180,e.length>=3&&(a=e[1],r=e[2]),P.makeTranslation(-a,-r),y.makeRotation(t),v.multiplyMatrices(y,P),P.makeTranslation(a,r),g.multiplyMatrices(P,v)}break;case"scale":if(e.length>=1){let t=e[0],a=t;e.length>=2&&(a=e[1]),g.scale(t,a)}break;case"skewX":1===e.length&&g.set(1,Math.tan(e[0]*Math.PI/180),0,0,1,0,0,0,1);break;case"skewY":1===e.length&&g.set(1,0,0,Math.tan(e[0]*Math.PI/180),1,0,0,0,1);break;case"matrix":6===e.length&&g.set(e[0],e[2],e[4],e[1],e[3],e[5],0,0,1)}}a.premultiply(g)}}return a}(t);return S.length>0&&a.premultiply(S[S.length-1]),w.copy(a),S.push(a),a}(r),F=!1,R=null;switch(r.nodeName){case"svg":case"g":i=s(r,i);break;case"style":!function(t){if(t.sheet&&t.sheet.cssRules&&t.sheet.cssRules.length)for(let e=0;e<t.sheet.cssRules.length;e++){let a=t.sheet.cssRules[e];if(1!==a.type)continue;let r=a.selectorText.split(/,/gm).filter(Boolean).map(t=>t.trim());for(let t=0;t<r.length;t++){let e=Object.fromEntries(Object.entries(a.style).filter(([,t])=>""!==t));m[r[t]]=Object.assign(m[r[t]]||{},e)}}}(r);break;case"path":i=s(r,i),r.hasAttribute("d")&&(R=function(t){let a=new e.ShapePath,r=new e.Vector2,i=new e.Vector2,s=new e.Vector2,l=!0,u=!1,c=t.getAttribute("d");if(""===c||"none"===c)return null;let h=c.match(/[a-df-z][^a-df-z]*/ig);for(let t=0,e=h.length;t<e;t++){var p,f,d,m,S,g,P,y;let e,c=h[t],v=c.charAt(0),x=c.slice(1).trim();switch(!0===l&&(u=!0,l=!1),v){case"M":e=n(x);for(let t=0,o=e.length;t<o;t+=2)r.x=e[t+0],r.y=e[t+1],i.x=r.x,i.y=r.y,0===t?a.moveTo(r.x,r.y):a.lineTo(r.x,r.y),0===t&&s.copy(r);break;case"H":e=n(x);for(let t=0,o=e.length;t<o;t++)r.x=e[t],i.x=r.x,i.y=r.y,a.lineTo(r.x,r.y),0===t&&!0===u&&s.copy(r);break;case"V":e=n(x);for(let t=0,o=e.length;t<o;t++)r.y=e[t],i.x=r.x,i.y=r.y,a.lineTo(r.x,r.y),0===t&&!0===u&&s.copy(r);break;case"L":e=n(x);for(let t=0,o=e.length;t<o;t+=2)r.x=e[t+0],r.y=e[t+1],i.x=r.x,i.y=r.y,a.lineTo(r.x,r.y),0===t&&!0===u&&s.copy(r);break;case"C":e=n(x);for(let t=0,o=e.length;t<o;t+=6)a.bezierCurveTo(e[t+0],e[t+1],e[t+2],e[t+3],e[t+4],e[t+5]),i.x=e[t+2],i.y=e[t+3],r.x=e[t+4],r.y=e[t+5],0===t&&!0===u&&s.copy(r);break;case"S":e=n(x);for(let t=0,o=e.length;t<o;t+=4){a.bezierCurveTo((p=r.x,p-(i.x-p)),(f=r.y,f-(i.y-f)),e[t+0],e[t+1],e[t+2],e[t+3]),i.x=e[t+0],i.y=e[t+1],r.x=e[t+2],r.y=e[t+3],0===t&&!0===u&&s.copy(r)}break;case"Q":e=n(x);for(let t=0,o=e.length;t<o;t+=4)a.quadraticCurveTo(e[t+0],e[t+1],e[t+2],e[t+3]),i.x=e[t+0],i.y=e[t+1],r.x=e[t+2],r.y=e[t+3],0===t&&!0===u&&s.copy(r);break;case"T":e=n(x);for(let t=0,o=e.length;t<o;t+=2){let o=(d=r.x,d-(i.x-d)),n=(m=r.y,m-(i.y-m));a.quadraticCurveTo(o,n,e[t+0],e[t+1]),i.x=o,i.y=n,r.x=e[t+0],r.y=e[t+1],0===t&&!0===u&&s.copy(r)}break;case"A":e=n(x,[3,4],7);for(let t=0,n=e.length;t<n;t+=7){if(e[t+5]==r.x&&e[t+6]==r.y)continue;let n=r.clone();r.x=e[t+5],r.y=e[t+6],i.x=r.x,i.y=r.y,o(a,e[t],e[t+1],e[t+2],e[t+3],e[t+4],n,r),0===t&&!0===u&&s.copy(r)}break;case"m":e=n(x);for(let t=0,o=e.length;t<o;t+=2)r.x+=e[t+0],r.y+=e[t+1],i.x=r.x,i.y=r.y,0===t?a.moveTo(r.x,r.y):a.lineTo(r.x,r.y),0===t&&s.copy(r);break;case"h":e=n(x);for(let t=0,o=e.length;t<o;t++)r.x+=e[t],i.x=r.x,i.y=r.y,a.lineTo(r.x,r.y),0===t&&!0===u&&s.copy(r);break;case"v":e=n(x);for(let t=0,o=e.length;t<o;t++)r.y+=e[t],i.x=r.x,i.y=r.y,a.lineTo(r.x,r.y),0===t&&!0===u&&s.copy(r);break;case"l":e=n(x);for(let t=0,o=e.length;t<o;t+=2)r.x+=e[t+0],r.y+=e[t+1],i.x=r.x,i.y=r.y,a.lineTo(r.x,r.y),0===t&&!0===u&&s.copy(r);break;case"c":e=n(x);for(let t=0,o=e.length;t<o;t+=6)a.bezierCurveTo(r.x+e[t+0],r.y+e[t+1],r.x+e[t+2],r.y+e[t+3],r.x+e[t+4],r.y+e[t+5]),i.x=r.x+e[t+2],i.y=r.y+e[t+3],r.x+=e[t+4],r.y+=e[t+5],0===t&&!0===u&&s.copy(r);break;case"s":e=n(x);for(let t=0,o=e.length;t<o;t+=4){a.bezierCurveTo((S=r.x,S-(i.x-S)),(g=r.y,g-(i.y-g)),r.x+e[t+0],r.y+e[t+1],r.x+e[t+2],r.y+e[t+3]),i.x=r.x+e[t+0],i.y=r.y+e[t+1],r.x+=e[t+2],r.y+=e[t+3],0===t&&!0===u&&s.copy(r)}break;case"q":e=n(x);for(let t=0,o=e.length;t<o;t+=4)a.quadraticCurveTo(r.x+e[t+0],r.y+e[t+1],r.x+e[t+2],r.y+e[t+3]),i.x=r.x+e[t+0],i.y=r.y+e[t+1],r.x+=e[t+2],r.y+=e[t+3],0===t&&!0===u&&s.copy(r);break;case"t":e=n(x);for(let t=0,o=e.length;t<o;t+=2){let o=(P=r.x,P-(i.x-P)),n=(y=r.y,y-(i.y-y));a.quadraticCurveTo(o,n,r.x+e[t+0],r.y+e[t+1]),i.x=o,i.y=n,r.x=r.x+e[t+0],r.y=r.y+e[t+1],0===t&&!0===u&&s.copy(r)}break;case"a":e=n(x,[3,4],7);for(let t=0,n=e.length;t<n;t+=7){if(0==e[t+5]&&0==e[t+6])continue;let n=r.clone();r.x+=e[t+5],r.y+=e[t+6],i.x=r.x,i.y=r.y,o(a,e[t],e[t+1],e[t+2],e[t+3],e[t+4],n,r),0===t&&!0===u&&s.copy(r)}break;case"Z":case"z":a.currentPath.autoClose=!0,a.currentPath.curves.length>0&&(r.copy(s),a.currentPath.currentPoint.copy(r),l=!0);break;default:console.warn(c)}u=!1}return a}(r));break;case"rect":let L,k,E,B,I,O,z;i=s(r,i),L=c((l=r).getAttribute("x")||0),k=c(l.getAttribute("y")||0),E=c(l.getAttribute("rx")||l.getAttribute("ry")||0),B=c(l.getAttribute("ry")||l.getAttribute("rx")||0),I=c(l.getAttribute("width")),O=c(l.getAttribute("height")),(z=new e.ShapePath).moveTo(L+E,k),z.lineTo(L+I-E,k),(0!==E||0!==B)&&z.bezierCurveTo(L+I-.448084975506*E,k,L+I,k+.448084975506*B,L+I,k+B),z.lineTo(L+I,k+O-B),(0!==E||0!==B)&&z.bezierCurveTo(L+I,k+O-.448084975506*B,L+I-.448084975506*E,k+O,L+I-E,k+O),z.lineTo(L+E,k+O),(0!==E||0!==B)&&z.bezierCurveTo(L+.448084975506*E,k+O,L,k+O-.448084975506*B,L,k+O-B),z.lineTo(L,k+B),(0!==E||0!==B)&&z.bezierCurveTo(L,k+.448084975506*B,L+.448084975506*E,k,L+E,k),R=z;break;case"polygon":let V,_;i=s(r,i),u=r,V=new e.ShapePath,_=0,u.getAttribute("points").replace(/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,function(t,e,a){let r=c(e),o=c(a);0===_?V.moveTo(r,o):V.lineTo(r,o),_++}),V.currentPath.autoClose=!0,R=V;break;case"polyline":let U,N;i=s(r,i),A=r,U=new e.ShapePath,N=0,A.getAttribute("points").replace(/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,function(t,e,a){let r=c(e),o=c(a);0===N?U.moveTo(r,o):U.lineTo(r,o),N++}),U.currentPath.autoClose=!1,R=U;break;case"circle":let G,X,W,Y,q;i=s(r,i),G=c((M=r).getAttribute("cx")||0),X=c(M.getAttribute("cy")||0),W=c(M.getAttribute("r")||0),(Y=new e.Path).absarc(G,X,W,0,2*Math.PI),(q=new e.ShapePath).subPaths.push(Y),R=q;break;case"ellipse":let $,Z,H,j,K,J;i=s(r,i),$=c((T=r).getAttribute("cx")||0),Z=c(T.getAttribute("cy")||0),H=c(T.getAttribute("rx")||0),j=c(T.getAttribute("ry")||0),(K=new e.Path).absellipse($,Z,H,j,0,2*Math.PI),(J=new e.ShapePath).subPaths.push(K),R=J;break;case"line":let Q,tt,te,ta,tr;i=s(r,i),Q=c((C=r).getAttribute("x1")||0),tt=c(C.getAttribute("y1")||0),te=c(C.getAttribute("x2")||0),ta=c(C.getAttribute("y2")||0),(tr=new e.ShapePath).moveTo(Q,tt),tr.lineTo(te,ta),tr.currentPath.autoClose=!1,R=tr;break;case"defs":F=!0;break;case"use":i=s(r,i);let to=(r.getAttributeNS("http://www.w3.org/1999/xlink","href")||"").substring(1),ti=r.viewportElement.getElementById(to);ti?t(ti,i):console.warn("SVGLoader: 'use node' references non-existent node id: "+to)}R&&(void 0!==i.fill&&"none"!==i.fill&&R.color.setStyle(i.fill,a),function(t,a){function r(t){b.set(t.x,t.y,1).applyMatrix3(a),t.set(b.x,b.y)}let o=t.subPaths;for(let t=0,i=o.length;t<i;t++){let i=o[t].curves;for(let t=0;t<i.length;t++){let o=i[t];o.isLineCurve?(r(o.v1),r(o.v2)):o.isCubicBezierCurve?(r(o.v0),r(o.v1),r(o.v2),r(o.v3)):o.isQuadraticBezierCurve?(r(o.v0),r(o.v1),r(o.v2)):o.isEllipseCurve&&(x.set(o.aX,o.aY),r(x),o.aX=x.x,o.aY=x.y,function(t){let e=t.elements,a=e[0]*e[3]+e[1]*e[4];return 0!==a&&Math.abs(a/(p(t)*f(t)))>Number.EPSILON}(a)?function(t){let r=t.xRadius,o=t.yRadius,i=Math.cos(t.aRotation),s=Math.sin(t.aRotation),n=new e.Vector3(r*i,r*s,0),l=new e.Vector3(-o*s,o*i,0),u=n.applyMatrix3(a),c=l.applyMatrix3(a),p=g.set(u.x,c.x,0,u.y,c.y,0,0,0,1),f=P.copy(p).invert(),d=y.copy(f).transpose().multiply(f).elements,m=function(t,e,a){let r,o,i,s,n,l=t+a,u=t-a,c=Math.sqrt(u*u+4*e*e);return l>0?o=t*(n=1/(r=.5*(l+c)))*a-e*n*e:l<0?o=.5*(l-c):(r=.5*c,o=-.5*c),Math.abs(i=u>0?u+c:u-c)>2*Math.abs(e)?(s=1/Math.sqrt(1+(n=-2*e/i)*n),i=n*s):0===Math.abs(e)?(i=1,s=0):(i=1/Math.sqrt(1+(n=-.5*i/e)*n),s=n*i),u>0&&(n=i,i=-s,s=n),{rt1:r,rt2:o,cs:i,sn:s}}(d[0],d[1],d[4]),S=Math.sqrt(m.rt1),v=Math.sqrt(m.rt2);if(t.xRadius=1/S,t.yRadius=1/v,t.aRotation=Math.atan2(m.sn,m.cs),!((t.aEndAngle-t.aStartAngle)%(2*Math.PI)<Number.EPSILON)){let r=P.set(S,0,0,0,v,0,0,0,1),o=y.set(m.cs,m.sn,0,-m.sn,m.cs,0,0,0,1),i=r.multiply(o).multiply(p),s=t=>{let{x:a,y:r}=new e.Vector3(Math.cos(t),Math.sin(t),0).applyMatrix3(i);return Math.atan2(r,a)};t.aStartAngle=s(t.aStartAngle),t.aEndAngle=s(t.aEndAngle),h(a)&&(t.aClockwise=!t.aClockwise)}}(o):function(t){let e=p(a),r=f(a);t.xRadius*=e,t.yRadius*=r;let o=e>Number.EPSILON?Math.atan2(a.elements[1],a.elements[0]):Math.atan2(-a.elements[3],a.elements[4]);t.aRotation+=o,h(a)&&(t.aStartAngle*=-1,t.aEndAngle*=-1,t.aClockwise=!t.aClockwise)}(o))}}}(R,w),d.push(R),R.userData={node:r,style:i});let ts=r.childNodes;for(let e=0;e<ts.length;e++){let a=ts[e];F&&"style"!==a.nodeName&&"defs"!==a.nodeName||t(a,i)}D&&(S.pop(),S.length>0?w.copy(S[S.length-1]):w.identity())}(A.documentElement,{fill:"#000",fillOpacity:1,strokeOpacity:1,strokeWidth:1,strokeLineJoin:"miter",strokeLineCap:"butt",strokeMiterLimit:4}),{paths:d,xml:A.documentElement}}static createShapes(t){let a={loc:0,t:0};function r(t,e,r){let o=r.x-e.x,i=r.y-e.y,s=t.x-e.x,n=t.y-e.y,l=o*n-s*i;if(t.x===e.x&&t.y===e.y){a.loc=0,a.t=0;return}if(t.x===r.x&&t.y===r.y){a.loc=1,a.t=1;return}if(l<-Number.EPSILON){a.loc=3;return}if(l>Number.EPSILON){a.loc=4;return}if(o*s<0||i*n<0){a.loc=5;return}if(Math.sqrt(o*o+i*i)<Math.sqrt(s*s+n*n)){a.loc=6;return}a.loc=2,a.t=0!==o?s/o:n/i}let o=0x3b9ac9ff,i=-0x3b9ac9ff,s=t.subPaths.map(t=>{let a=t.getPoints(),r=-0x3b9ac9ff,s=0x3b9ac9ff,n=-0x3b9ac9ff,l=0x3b9ac9ff;for(let t=0;t<a.length;t++){let e=a[t];e.y>r&&(r=e.y),e.y<s&&(s=e.y),e.x>n&&(n=e.x),e.x<l&&(l=e.x)}return i<=n&&(i=n+1),o>=l&&(o=l-1),{curves:t.curves,points:a,isCW:e.ShapeUtils.isClockWise(a),identifier:-1,boundingBox:new e.Box2(new e.Vector2(l,s),new e.Vector2(n,r))}});s=s.filter(t=>t.points.length>1);for(let t=0;t<s.length;t++)s[t].identifier=t;let n=s.map(n=>(function(t,o,i,s,n){var l,u;let c,h;(null==n||""===n)&&(n="nonzero");let p=new e.Vector2;t.boundingBox.getCenter(p);let f=(l=[new e.Vector2(i,p.y),new e.Vector2(s,p.y)],u=t.boundingBox,c=new e.Vector2,u.getCenter(c),h=[],o.forEach(t=>{t.boundingBox.containsPoint(c)&&(function(t,o){let i=[],s=[];for(let n=1;n<t.length;n++){let l=t[n-1],u=t[n];for(let t=1;t<o.length;t++){let n=function(t,e,o,i){let s=t.x,n=e.x,l=o.x,u=i.x,c=t.y,h=e.y,p=o.y,f=i.y,d=(u-l)*(c-p)-(f-p)*(s-l),m=(f-p)*(n-s)-(u-l)*(h-c),S=d/m,g=((n-s)*(c-p)-(h-c)*(s-l))/m;if(0===m&&0!==d||S<=0||S>=1||g<0||g>1)return null;if(0===d&&0===m){for(let l=0;l<2;l++){if(r(0===l?o:i,t,e),0==a.loc){let t=0===l?o:i;return{x:t.x,y:t.y,t:a.t}}if(2==a.loc)return{x:+(s+a.t*(n-s)).toPrecision(10),y:+(c+a.t*(h-c)).toPrecision(10),t:a.t}}return null}for(let s=0;s<2;s++)if(r(0===s?o:i,t,e),0==a.loc){let t=0===s?o:i;return{x:t.x,y:t.y,t:a.t}}return{x:+(s+S*(n-s)).toPrecision(10),y:+(c+S*(h-c)).toPrecision(10),t:S}}(l,u,o[t-1],o[t]);null!==n&&void 0===i.find(t=>t.t<=n.t+Number.EPSILON&&t.t>=n.t-Number.EPSILON)&&(i.push(n),s.push(new e.Vector2(n.x,n.y)))}}return s})(l,t.points).forEach(e=>{h.push({identifier:t.identifier,isCW:t.isCW,point:e})})}),h.sort((t,e)=>t.point.x-e.point.x),h);f.sort((t,e)=>t.point.x-e.point.x);let d=[],m=[];f.forEach(e=>{e.identifier===t.identifier?d.push(e):m.push(e)});let S=d[0].point.x,g=[],P=0;for(;P<m.length&&m[P].point.x<S;)g.length>0&&g[g.length-1]===m[P].identifier?g.pop():g.push(m[P].identifier),P++;if(g.push(t.identifier),"evenodd"===n){let e=g.length%2==0,a=g[g.length-2];return{identifier:t.identifier,isHole:e,for:a}}if("nonzero"===n){let e=!0,a=null,r=null;for(let t=0;t<g.length;t++){let i=g[t];e?(r=o[i].isCW,e=!1,a=i):r!==o[i].isCW&&(r=o[i].isCW,e=!0)}return{identifier:t.identifier,isHole:e,for:a}}console.warn('fill-rule: "'+n+'" is currently not implemented.')})(n,s,o,i,t.userData?t.userData.style.fillRule:void 0)),l=[];return s.forEach(t=>{if(!n[t.identifier].isHole){let a=new e.Shape;a.curves=t.curves,n.filter(e=>e.isHole&&e.for===t.identifier).forEach(t=>{let r=s[t.identifier],o=new e.Path;o.curves=r.curves,a.holes.push(o)}),l.push(a)}}),l}static getStrokeStyle(t,e,a,r,o){return{strokeColor:e=void 0!==e?e:"#000",strokeWidth:t=void 0!==t?t:1,strokeLineJoin:a=void 0!==a?a:"miter",strokeLineCap:r=void 0!==r?r:"butt",strokeMiterLimit:o=void 0!==o?o:4}}static pointsToStroke(t,a,o,i){let s=[],n=[],l=[];if(0===r.pointsToStrokeWithBuffers(t,a,o,i,s,n,l))return null;let u=new e.BufferGeometry;return u.setAttribute("position",new e.Float32BufferAttribute(s,3)),u.setAttribute("normal",new e.Float32BufferAttribute(n,3)),u.setAttribute("uv",new e.Float32BufferAttribute(l,2)),u}static pointsToStrokeWithBuffers(t,a,r,o,i,s,n,l){let u,c,h,p,f,d=new e.Vector2,m=new e.Vector2,S=new e.Vector2,g=new e.Vector2,P=new e.Vector2,y=new e.Vector2,v=new e.Vector2,x=new e.Vector2,b=new e.Vector2,w=new e.Vector2,A=new e.Vector2,M=new e.Vector2,T=new e.Vector2,C=new e.Vector2,D=new e.Vector2,F=new e.Vector2,R=new e.Vector2;r=void 0!==r?r:12,o=void 0!==o?o:.001,l=void 0!==l?l:0;let L=(t=function(t){let e=!1;for(let a=1,r=t.length-1;a<r;a++)if(t[a].distanceTo(t[a+1])<o){e=!0;break}if(!e)return t;let a=[];a.push(t[0]);for(let e=1,r=t.length-1;e<r;e++)t[e].distanceTo(t[e+1])>=o&&a.push(t[e]);return a.push(t[t.length-1]),a}(t)).length;if(L<2)return 0;let k=t[0].equals(t[L-1]),E=t[0],B=a.strokeWidth/2,I=1/(L-1),O=0,z,V=!1,_=0,U=3*l,N=2*l;G(t[0],t[1],d).multiplyScalar(B),x.copy(t[0]).sub(d),b.copy(t[0]).add(d),w.copy(x),A.copy(b);for(let e=1;e<L;e++){if(u=t[e],c=e===L-1?k?t[1]:void 0:t[e+1],G(E,u,d),S.copy(d).multiplyScalar(B),M.copy(u).sub(S),T.copy(u).add(S),z=O+I,h=!1,void 0!==c){G(u,c,m),S.copy(m).multiplyScalar(B),C.copy(u).sub(S),D.copy(u).add(S),p=!0,S.subVectors(c,E),0>d.dot(S)&&(p=!1),1===e&&(V=p),S.subVectors(c,u),S.normalize();let t=Math.abs(d.dot(S));if(t>Number.EPSILON){let e=B/t;S.multiplyScalar(-e),g.subVectors(u,E),P.copy(g).setLength(e).add(S),F.copy(P).negate();let r=P.length(),o=g.length();g.divideScalar(o),y.subVectors(c,u);let i=y.length();switch(y.divideScalar(i),g.dot(F)<o&&y.dot(F)<i&&(h=!0),R.copy(P).add(u),F.add(u),f=!1,h?p?(D.copy(F),T.copy(F)):(C.copy(F),M.copy(F)):Y(),a.strokeLineJoin){case"bevel":q(p,h,z);break;case"round":$(p,h),p?W(u,M,C,z,0):W(u,D,T,z,1);break;default:let s=B*a.strokeMiterLimit/r;s<1?"miter-clip"!==a.strokeLineJoin?q(p,h,z):($(p,h),p?(y.subVectors(R,M).multiplyScalar(s).add(M),v.subVectors(R,C).multiplyScalar(s).add(C),X(M,z,0),X(y,z,0),X(u,z,.5),X(u,z,.5),X(y,z,0),X(v,z,0),X(u,z,.5),X(v,z,0),X(C,z,0)):(y.subVectors(R,T).multiplyScalar(s).add(T),v.subVectors(R,D).multiplyScalar(s).add(D),X(T,z,1),X(y,z,1),X(u,z,.5),X(u,z,.5),X(y,z,1),X(v,z,1),X(u,z,.5),X(v,z,1),X(D,z,1))):(h?(p?(X(b,O,1),X(x,O,0),X(R,z,0),X(b,O,1),X(R,z,0),X(F,z,1)):(X(b,O,1),X(x,O,0),X(R,z,1),X(x,O,0),X(F,z,0),X(R,z,1)),p?C.copy(R):D.copy(R)):p?(X(M,z,0),X(R,z,0),X(u,z,.5),X(u,z,.5),X(R,z,0),X(C,z,0)):(X(T,z,1),X(R,z,1),X(u,z,.5),X(u,z,.5),X(R,z,1),X(D,z,1)),f=!0)}}else Y()}else Y();k||e!==L-1||Z(t[0],w,A,p,!0,O),O=z,E=u,x.copy(C),b.copy(D)}if(k){if(h&&i){let t=R,e=F;V!==p&&(t=F,e=R),p?(f||V)&&(e.toArray(i,0),e.toArray(i,9),f&&t.toArray(i,3)):(f||!V)&&(e.toArray(i,3),e.toArray(i,9),f&&t.toArray(i,0))}}else Z(u,M,T,p,!1,z);return _;function G(t,e,a){return a.subVectors(e,t),a.set(-a.y,a.x).normalize()}function X(t,e,a){i&&(i[U]=t.x,i[U+1]=t.y,i[U+2]=0,s&&(s[U]=0,s[U+1]=0,s[U+2]=1),U+=3,n&&(n[N]=e,n[N+1]=a,N+=2)),_+=3}function W(t,e,a,o,i){d.copy(e).sub(t).normalize(),m.copy(a).sub(t).normalize();let s=Math.PI,n=d.dot(m);1>Math.abs(n)&&(s=Math.abs(Math.acos(n))),s/=r,S.copy(e);for(let e=0,a=r-1;e<a;e++)g.copy(S).rotateAround(t,s),X(S,o,i),X(g,o,i),X(t,o,.5),S.copy(g);X(g,o,i),X(a,o,i),X(t,o,.5)}function Y(){X(b,O,1),X(x,O,0),X(M,z,0),X(b,O,1),X(M,z,0),X(T,z,1)}function q(t,e,a){e?t?(X(b,O,1),X(x,O,0),X(M,z,0),X(b,O,1),X(M,z,0),X(F,z,1),X(M,a,0),X(C,a,0),X(F,a,.5)):(X(b,O,1),X(x,O,0),X(T,z,1),X(x,O,0),X(F,z,0),X(T,z,1),X(T,a,1),X(F,a,0),X(D,a,1)):(t?(X(M,a,0),X(C,a,0)):(X(T,a,1),X(D,a,0)),X(u,a,.5))}function $(t,e){e&&(t?(X(b,O,1),X(x,O,0),X(M,z,0),X(b,O,1),X(M,z,0),X(F,z,1),X(M,O,0),X(u,z,.5),X(F,z,1),X(u,z,.5),X(C,O,0),X(F,z,1)):(X(b,O,1),X(x,O,0),X(T,z,1),X(x,O,0),X(F,z,0),X(T,z,1),X(T,O,1),X(F,z,0),X(u,z,.5),X(u,z,.5),X(F,z,0),X(D,O,1)))}function Z(t,e,r,o,s,l){switch(a.strokeLineCap){case"round":s?W(t,r,e,l,.5):W(t,e,r,l,.5);break;case"square":if(s)d.subVectors(e,t),m.set(d.y,-d.x),S.addVectors(d,m).add(t),g.subVectors(m,d).add(t),o?(S.toArray(i,3),g.toArray(i,0),g.toArray(i,9)):(S.toArray(i,3),1===n[7]?g.toArray(i,9):S.toArray(i,9),g.toArray(i,0));else{d.subVectors(r,t),m.set(d.y,-d.x),S.addVectors(d,m).add(t),g.subVectors(m,d).add(t);let e=i.length;o?(S.toArray(i,e-3),g.toArray(i,e-6)):(g.toArray(i,e-6),S.toArray(i,e-3)),g.toArray(i,e-12)}}}}}t.s(["SVGLoader",0,r],63295);let o=[{id:"astra",label:"Astra",colors:["#6DCBF4","#7AB1FE","#F87915","#FA994C","#F5F6FB"]},{id:"aurora",label:"Aurora",colors:["#47E2C2","#6DCBF4","#B06DFF","#E96AC8","#F5F6FB"]},{id:"ember",label:"Ember",colors:["#F7CB59","#FA994C","#F67576","#B06DFF","#F5F6FB"]}],i="astra",s=new Map(o.map(({id:t,colors:a})=>[t,a.map(t=>new e.Color(t))])),n=new e.Color(1,1,1),l=new Map;t.s(["SECONDARY_COLOR_SEEDS",0,[.08,.58,.22,.68,.44],"writeStarColor",0,function(t,a,r,u,c=i,h){let p=function(t,a,r=i,u){if(!t)return n;let c=function(t,a){let r=s.get(t)??s.get(i);if(!r)throw Error("The default Astra star palette is missing");if(!a)return r;let n=(o.find(e=>e.id===t)?.colors??o[0].colors).map((t,e)=>a[e]||t),u=n.join(","),c=l.get(u);if(c)return l.delete(u),l.set(u,c),c;let h=n.map(t=>new e.Color(t));if(l.size>=32){let t=l.keys().next().value;void 0!==t&&l.delete(t)}return l.set(u,h),h}(r,u);return a<.36?c[0]:a<.52?c[1]:a<.64?c[2]:a<.74?c[3]:c[4]}(r,u,c,h);t[a]=p.r,t[a+1]=p.g,t[a+2]=p.b}],396522),t.s(["ASTRA_PARTICLE_OPACITY_REVEAL_END",0,.2,"getAstraParticleRevealProgress",0,function(t,a){let r=Number.isFinite(t)?e.MathUtils.clamp(t,0,1):0,o=.015*(Number.isFinite(a)?e.MathUtils.clamp(a,0,1):0);return e.MathUtils.smoothstep(r,o,.14+o)*e.MathUtils.lerp(.2,1,e.MathUtils.smoothstep(r,.2,1))}],642671)}]);