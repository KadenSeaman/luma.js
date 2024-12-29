<script lang='ts'>
import { viewport, type NodeType } from './shared.svelte.js';

let {name, x, y, width, height, attributes, methods}:NodeType = $props(); 

</script>
  <div 
  class='luma-node'
  style='--x: {(x + viewport.offsetX) * viewport.scale}px;
          --y: {(y + viewport.offsetY) * viewport.scale}px; 
          --width: {width * viewport.scale};
          --height: {height * viewport.scale};
          --scale: {viewport.scale};
          --fontSize: {12 * viewport.scale}px'>
        
  <p id='title'>{name}</p>
  {#if attributes[0]} 
    <div class='break'></div>
    <ol>
      {#each attributes as attr}
        <li class='attribute'>{attr.trim()}</li>
      {/each}
    </ol> 
  {/if}
  {#if methods[0]}
    <div class='break'></div>
    <ol>
      {#each methods as method}
        <li class='method'>{method.trim()}</li>
      {/each}
    </ol>
  {/if}
</div>

<style>
  .luma-node{
      position: absolute;
      left: var(--x);
      top: var(--y);

      width: var(--width);
      height: var(--height);

      font-size: var(--fontSize);
      text-align: center;
      color: black;

      border-radius: 15px;
      background-color: white;
      border: 1px solid black;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;
      padding: calc(var(--scale) * 10px);
  }
  #title{
    font-size: var(--fontSize);
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