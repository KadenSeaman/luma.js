<script lang='ts'>
import { viewport } from './shared.svelte';

interface Props{
    posX:number;
    posY:number;
    nodeWidth:number;
    nodeHeight:number;
    nodeFontSize:number;
}

let {posX, posY, nodeWidth, nodeHeight, nodeFontSize}:Props = $props(); 

</script>

<div>
  <div 
    id='luma-node' 
    style='--posX: {(posX + viewport.offsetX) * viewport.scale}px;
           --posY: {(posY + viewport.offsetY) * viewport.scale}px; 
           --nodeWidth: {nodeWidth * viewport.scale}px; --nodeHeight: {nodeHeight * viewport.scale}px; 
           --nodeFontSize: {nodeFontSize * viewport.scale}px'>I am a node</div>
</div>

<style>
  #luma-node{
      font-size: var(--nodeFontSize);
      position: absolute;
      top: var(--posY);
      left: var(--posX);
      width: var(--nodeWidth);
      height: var(--nodeHeight);
      background-color: white;
      border: 1px solid black;
      color: black;
  }
  #luma-node:hover{
      border: 2px dashed black;
  }
  #luma-node:active{
      border: 2px solid black;
  }
</style>