import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEmbeddingCloud } from '../src/lib/embedding.ts';

test('synthetic 6D vectors project deterministically; sparse graph uses latent-space neighbors',()=>{
  const cloud=createEmbeddingCloud();
  assert.deepEqual(cloud,createEmbeddingCloud());
  assert.equal(cloud.positions.length,1200*3);
  assert.equal(cloud.vectors.length,1200*6);
  assert.ok([...cloud.positions,...cloud.segments].every(Number.isFinite));
  for(let i=0;i<1200;i++) {
    assert.ok(Math.abs(cloud.positions[i*3]-(.19+(cloud.vectors[i*6]+cloud.vectors[i*6+1])/Math.SQRT2*.22))<1e-6);
    assert.ok(cloud.positions[i*3+2]<0,'cloud stays behind the real portrait');
  }
  const distance=(i:number,j:number)=>Array.from({length:6},(_,d)=>(cloud.vectors[i*6+d]-cloud.vectors[j*6+d])**2).reduce((a,b)=>a+b,0);
  for(let edge=0;edge<cloud.neighbors.length;edge+=2) {
    const i=cloud.neighbors[edge],j=cloud.neighbors[edge+1];
    assert.notEqual(i,j);
    const nearest=Array.from({length:150},(_,k)=>k*8).filter(k=>k!==i).sort((a,b)=>distance(i,a)-distance(i,b)).slice(0,2);
    assert.ok(nearest.includes(j),'edge must preserve a true 6D neighborhood');
  }
  assert.ok(cloud.segments.length>0);
  assert.throws(()=>createEmbeddingCloud(NaN));assert.throws(()=>createEmbeddingCloud(1201));
});
