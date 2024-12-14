<script lang='ts'>
import { viewport } from './shared.svelte.js';

interface Props{
    posX:number;
    posY:number;
    nodeWidth:number;
    nodeHeight:number;
    nodeFontSize:number;
    selected?:boolean;
    data: any;
}

let {posX, posY, nodeWidth, nodeHeight, nodeFontSize, selected = false, data}:Props = $props(); 

</script>

<div>
  <div 
    id='luma-node' 
    style='--posX: {(posX + viewport.offsetX) * viewport.scale}px;
           --posY: {(posY + viewport.offsetY) * viewport.scale}px; 
           --nodeWidth: {nodeWidth * viewport.scale}px; --nodeHeight: {nodeHeight * viewport.scale}px; 
           --nodeFontSize: {nodeFontSize * viewport.scale}px'>
          
    <p id='title'>{data.name}</p>
    {#if data.attributes[0]} 
      <div class='break'></div>
      <ol>
        {#each data.attributes as attr}
          <li class='attribute'>{attr.trim()}</li>
        {/each}
      </ol> 
    {/if}
    {#if data.methods[0]}
      <div class='break'></div>
      <ol>
        {#each data.methods as method}
          <li class='method'>{method.trim()}</li>
        {/each}
      </ol>
    {/if}
    </div>
</div>

<style>
  #luma-node{
      font-size: var(--nodeFontSize);
      text-align: center;
      padding: 5px;
      border-radius: 15px;
      position: absolute;
      top: var(--posY);
      left: var(--posX);
      width: var(--nodeWidth);
      background-color: white;
      border: 1px solid black;
      color: black;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  }
  #title{
    font-size: var(--nodeFontSize);
    font-weight: bold;
  }
  .break{
    width: 90%;
    border: 1px solid black;
  }
  ol{
    padding:0;
    margin:0;
  }
  li{
    margin-top: 10px;
    padding-bottom: 10px;
    list-style: none;
  }

</style>