<script lang='ts'>
import { viewport } from './shared.svelte';

interface Props{
    posX:number;
    posY:number;
    nodeWidth:number;
    nodeHeight:number;
    nodeFontSize:number;
    selected:boolean;
}

let {posX, posY, nodeWidth, nodeHeight, nodeFontSize, selected}:Props = $props(); 

</script>

<div>
  <div 
    id='luma-node' 
    style='--posX: {(posX + viewport.offsetX) * viewport.scale}px;
           --posY: {(posY + viewport.offsetY) * viewport.scale}px; 
           --nodeWidth: {nodeWidth * viewport.scale}px; --nodeHeight: {nodeHeight * viewport.scale}px; 
           --nodeFontSize: {nodeFontSize * viewport.scale}px'>I am a node<br>Kaden</div>
</div>

<style>
  #luma-node{
      font-size: var(--nodeFontSize);
      text-align: center;
      padding: 5px;
      border-radius: 5px;
      position: absolute;
      top: var(--posY);
      left: var(--posX);
      width: var(--nodeWidth);
      height: var(--nodeHeight);
      background-color: white;
      border: 1px solid black;
      color: black;
  }
</style>