<script lang="ts">
import { viewport, app, nodeData } from './shared.svelte.js';
import LumaNode from './LumaNode.svelte';


let debug:boolean = false;

interface Props{
    backgroundColor?: string;
    grid?: boolean;
    gridColor?: string;
}

let {backgroundColor='white', grid=true, gridColor='lightgrey'}:Props = $props();

let dragging:boolean = false;

let zoomMax:number = 15;
let zoomMin:number = 1;

let relativeMouseX:number = $state(0);
let relativeMouseY:number = $state(0);
let absoluteMouseX:number = $state(0);
let absoluteMouseY:number = $state(0);

let prevRelativeMouseX:number = 0;
let prevRelativeMouseY:number = 0;

let cursorType:string = $state('default');

let startSelectX:number = $state(0);
let startSelectY:number = $state(0);
let selectX:number = $state(0);
let selectY:number = $state(0);
let selectWidth:number = $state(0);
let selectHeight:number = $state(0);
let selecting:boolean = $state(false);

let renderer: HTMLElement;
let rendererWidth:number = $state(0);
let rendererHeight:number = $state(0);
let svg: SVGElement;

const startViewportDrag = () => { 
    dragging = true;
    cursorType = 'grabbing';
}
const dragViewport = () => {
    viewport.offsetX += (relativeMouseX - prevRelativeMouseX) / viewport.scale;
    viewport.offsetY += (relativeMouseY - prevRelativeMouseY) / viewport.scale;
}
const endViewportDrag = () => {
    dragging = false;
    cursorType = 'default';
}
const zoomViewport = (deltaY:number, mouseOffset:boolean) => {
    //prevent zooming beyond min/max limits
    if(viewport.scale === zoomMin && deltaY > 0) return;
    if(viewport.scale === zoomMax && deltaY < 0) return;

    //determine zoom direction
    const zoomDirection:number = deltaY < 0 ? 1 : -1;
    const newScale:number = viewport.scale + zoomDirection;

    //change offset so the zoom stays centered on middle of screen and moves toward the mouse on zoomin
    let prevScaledWidth:number = renderer.offsetWidth / viewport.scale;
    let newScaledWidth:number = renderer.offsetWidth / newScale;
    let prevScaledHeight:number = renderer.offsetHeight / viewport.scale;
    let newScaledHeight:number = renderer.offsetHeight / newScale;

    //only zoom towards mouse on zoom in
    let mouseWidth:number = zoomDirection === 1 && mouseOffset ? relativeMouseX / newScale : 0;
    let mouseHeight:number = zoomDirection === 1 && mouseOffset ? relativeMouseY / newScale : 0;

    viewport.offsetX -= ((prevScaledWidth - newScaledWidth) / 2) + mouseWidth;
    viewport.offsetY -= ((prevScaledHeight - newScaledHeight) / 2) + mouseHeight;
    viewport.scale = newScale;
}
const zoomIn = () => {
    zoomViewport(-1, false);
}
const zoomOut = () => {
    zoomViewport(1, false);
}
const startSelect = (e:MouseEvent) => {
    selecting = true;
    startSelectX = absoluteMouseX;
    startSelectY = absoluteMouseY;
}
const updateSelect = (e:MouseEvent) => {
    //if user clicks and selects to the left move visual starts
    //this is all calculated based upon origin being at 0,0 in the top left corner of the renderer
    selectX = absoluteMouseX < startSelectX ? absoluteMouseX : startSelectX;
    selectY = absoluteMouseY < startSelectY ? absoluteMouseY : startSelectY;

    selectWidth = Math.abs(startSelectX - absoluteMouseX);
    selectHeight = Math.abs(startSelectY - absoluteMouseY);
}
const endSelect = () => {
    selectWidth = 0;
    selectHeight = 0;   
    selecting = false;
}


// high level functionality
const resetViewport = () => {
    viewport.offsetX = 0;
    viewport.offsetY = 0;
    viewport.scale = 3;
}
const handleWheel = (e:WheelEvent) => {
    e.preventDefault();
    zoomViewport(e.deltaY, true);
}
const handleMouseButtonDown = (e: MouseEvent) => {
    e.preventDefault();
    if(e.button === 1) startViewportDrag();
    if(e.button === 0) startSelect(e);
}
const handleMouse = (e:MouseEvent) => {
    //relative mouse's 0,0 (origin) is at the center of the renderer
    prevRelativeMouseX = relativeMouseX;
    prevRelativeMouseY = relativeMouseY;

    relativeMouseX = e.clientX - renderer.getBoundingClientRect().left - renderer.clientWidth / 2;
    relativeMouseY = e.clientY - renderer.getBoundingClientRect().top - renderer.clientHeight / 2;

    //absolute mouse's 0,0 (origin) is at the tope left of the renderer
    absoluteMouseX = e.clientX - renderer.getBoundingClientRect().left;
    absoluteMouseY = e.clientY - renderer.getBoundingClientRect().top;


    if(dragging) dragViewport();
    if(selecting) updateSelect(e);
}
const handleMouseButtonUp = (e: MouseEvent) => {
    e.preventDefault();
    if(e.button === 1) endViewportDrag();
    if(e.button === 0) endSelect();
}
</script>

<div id='luma-renderer' bind:this={renderer} role='button' tabindex="0" onmousedown={handleMouseButtonDown} onmouseup={handleMouseButtonUp} onmouseleave={endViewportDrag} onwheel={handleWheel} onmousemove={handleMouse} style='--width:{`${app.rendererWidth}px`}; --height:{`${app.rendererHeight}px`}; cursor:{cursorType}'>
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='none' viewBox='0 0 {app.rendererWidth} {app.rendererHeight}' id='connection-overlay' bind:this={svg}>
        <line   x1="{(viewport.offsetX + 70) * viewport.scale}" 
                y1="{(viewport.offsetY + 30) * viewport.scale}" 
                x2="{(viewport.offsetX + 210) * viewport.scale}" 
                y2="{(viewport.offsetY + 30) * viewport.scale}" 
                stroke="white" 
                stroke-width="{2 * viewport.scale}"/>
    </svg>
    <div id='luma-background'
         style='--offsetX: {viewport.offsetX * viewport.scale}px; --offsetY: {viewport.offsetY * viewport.scale}px; --scale: {viewport.scale * 10}px; --bg-color:{backgroundColor}; --grid-color:{gridColor};' 
         style:background-color={backgroundColor}
         class={grid ? 'grid' : ''}>
    </div>
    <div id='luma-select' 
        style='--selectX: {selectX}px; --selectY: {selectY}px; --selectWidth: {selectWidth}px; --selectHeight: {selectHeight}px'>
    </div>

    {#each nodeData as node, i}
        <LumaNode selected={false} posX={i * 200} posY={0} nodeWidth={100} nodeHeight={100} nodeFontSize={12} data={nodeData[i]}/>
        {node.connections}
    {/each}

    <button aria-label="zoom out" id='luma-zoom-out' onmousedown={zoomOut}>-</button>
    <button aria-label="zoom in" id='luma-zoom-in' onmousedown={zoomIn}>+</button>
    <button aria-label="reset the renderer view to origin (0,0)" id='luma-reset-view' onmousedown={resetViewport}>Reset</button>

    {#if debug}
        <div id='luma-debug'>
            <p>x position: {-viewport.offsetX.toFixed(2)}</p>
            <p>y position: {viewport.offsetY.toFixed(2)}</p>
            <p>scale: {viewport.scale}</p>
            <p>mouseX: {relativeMouseX}</p>
            <p>mouseY: {relativeMouseY}</p>
            <p>selecting: {selecting}</p>
        </div>
    {/if}
</div>

<style>
    #connection-overlay{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        padding:0;
        margin:0;
        pointer-events: none;
        z-index: 99999;
    }
    #luma-renderer{
        position: relative;
        overflow: hidden;
        margin: 0px;
        padding: 0px;
        width: var(--width);
        height: 100%;
        border-radius: 5px;
        box-sizing: border-box;
    }
    #luma-select{
        position: absolute;
        background-color: hsla(0, 0%, 50%, 0.1);
        border-radius: 5px;
        border: 1px solid hsla(0, 0%, 50%, 0.6);
        width: var(--selectWidth);
        height: var(--selectHeight);
        top: var(--selectY);
        left: var(--selectX);
        z-index: 999;
    }
    #luma-background{
        background-color: var(--bg-color);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    #luma-reset-view{
        position: absolute;
        width: 50px;
        height: 50px;
        right: 0;
        bottom: 0;
    }
    #luma-zoom-out{
        position: absolute;
        width: 50px;
        height: 50px;
        right: 100px;
        bottom: 0;
    }
    #luma-zoom-in{
        position: absolute;
        width: 50px;
        height: 50px;
        right: 50px;
        bottom: 0;
    }
    #luma-debug{
        position: absolute;
        left: 20px;
        top: 0;
        color: white;
        font-weight: bold;
        padding: 10px;
        border-radius: 2px;
    }
    .grid{
        background-size: var(--scale) var(--scale);
        background-position: var(--offsetX) var(--offsetY);
        background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
        linear-gradient(to top, var(--grid-color) 1px, transparent 1px)
    }
</style>