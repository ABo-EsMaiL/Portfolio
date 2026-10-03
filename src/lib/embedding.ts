// Synthetic embedding illustration, not vectors inferred from a visitor or portrait.
export function createEmbeddingCloud(count = 1200) {
  if (!Number.isInteger(count) || count < 24 || count > 1200) throw new Error('Embedding count out of range');
  let seed=0x39fa2;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed+.5)/4294967296;};
  const gaussian=()=>Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());
  const centers=[[-.45,-.3,.35,.55,.2,0],[.5,.45,.1,-.15,-.3,.25],[.05,.1,-.5,-.4,.4,.5]];
  const vectors=new Float32Array(count*6),positions=new Float32Array(count*3),phases=new Float32Array(count);
  for(let i=0;i<count;i++) {
    for(let d=0;d<6;d++) vectors[i*6+d]=centers[i%3][d]+gaussian()*.16;
    // Three orthonormal pair-sum axes: all six latent coordinates contribute.
    positions[i*3]=.19+(vectors[i*6]+vectors[i*6+1])/Math.SQRT2*.22;
    positions[i*3+1]=.12+(vectors[i*6+2]+vectors[i*6+3])/Math.SQRT2*.26;
    positions[i*3+2]=-.55+(vectors[i*6+4]+vectors[i*6+5])/Math.SQRT2*.3;
    phases[i]=random()*Math.PI*2;
  }
  const neighbors:number[]=[],segments:number[]=[];
  // Sparse representative graph; neighbors are measured in 6D, not screen distance.
  for(let i=0;i<count;i+=8) {
    const nearest:{index:number;distance:number}[]=[];
    for(let j=0;j<count;j+=8) {
      if(i===j) continue;
      let distance=0;for(let d=0;d<6;d++) distance+=(vectors[i*6+d]-vectors[j*6+d])**2;
      nearest.push({index:j,distance});
    }
    nearest.sort((a,b)=>a.distance-b.distance);
    for(const {index:j} of nearest.slice(0,2)) {
      if(i>j) continue;
      neighbors.push(i,j);segments.push(...positions.slice(i*3,i*3+3),...positions.slice(j*3,j*3+3));
    }
  }
  return {vectors,positions,phases,neighbors,segments:new Float32Array(segments)};
}
