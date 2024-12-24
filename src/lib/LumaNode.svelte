<script lang='ts'>
import { onMount } from 'svelte';
import { viewport, renderedNodes } from './shared.svelte.js';
	import { scale } from 'svelte/transition';

interface Props{
    posX:number;
    posY:number;
    nodeFontSize:number;
    data: any;
}

let {posX, posY, nodeFontSize, data}:Props = $props(); 

let thisNode: HTMLElement | null = $state(null);

onMount(() => {
  renderedNodes[data.name] = thisNode;
})

</script>
  <div 
  data-x = {posX}
  data-y = {posY}
  data-w = {thisNode?.clientWidth || 0 / viewport.scale}
  data-h = {thisNode?.clientHeight || 0 / viewport.scale}

  bind:this = {thisNode}

  class='luma-node'
  style='--posX: {(posX + viewport.offsetX) * viewport.scale}px;
          --posY: {(posY + viewport.offsetY) * viewport.scale}px; 
          --scale: {viewport.scale};
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


<style>
  .luma-node{
      font-size: var(--nodeFontSize);
      text-align: center;
      border-radius: 15px;
      position: absolute;
      top: var(--posY);
      left: var(--posX);
      background-color: white;
      border: 1px solid black;
      color: black;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: calc(var(--scale) * 10px);
  }
  #title{
    font-size: var(--nodeFontSize);
    font-weight: bold;
  }
  .break{
    width: 95%;
    border: 1px solid black;
  }
  ol{
    padding:0;
    margin:0;
  }
  li{
    margin-top: 5px;
    list-style: none;
  }

</style>