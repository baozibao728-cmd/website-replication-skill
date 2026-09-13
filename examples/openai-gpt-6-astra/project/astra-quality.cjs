// Local visual-fidelity override, scoped to the Astra hero renderer only.
// Original archive bytes remain unchanged.
module.exports=function(source){
 const marker='"createAstraRenderer",0,function(e,a,n,s={}){';
 if(source.split(marker).length!==2)throw new Error('Astra renderer entry changed; refusing ambiguous patch');
 return source.replace(marker,marker+'n={...n,tier:3,getMaxParticleCount:()=>40000,getPostprocessing:()=>"full",getMaxShaderSamples:()=>16,getAntialias:()=>true,getDpr:()=>[1,2]};e.dataset.mirrorParticleBudget="40000";e.dataset.mirrorPostprocessing="full";');
};
