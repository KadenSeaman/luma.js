<script lang="ts">
import { viewport } from './shared.svelte.js';
import LumaNode from './LumaNode.svelte';

interface Props{
    width:string;
    height:string;
    backgroundColor?: string;
    grid?: boolean;
    gridColor?: string; 
}

let {width='1920', height='1080', backgroundColor='white', grid=true, gridColor='lightgrey'}:Props = $props();


let dragging:boolean = false;

let zoomMax:number = 15;
let zoomMin:number = 1;

let mouseX:number = $state(0);
let mouseY:number = $state(0);
let prevMouseX:number = 0;
let prevMouseY:number = 0;

let cursorType:string = $state('default');

let startSelectX = $state(0);
let startSelectY = $state(0);
let selectX = $state(0);
let selectY = $state(0);
let selectWidth = $state(0);
let selectHeight = $state(0);
let selecting = $state(false);

let renderer: HTMLElement;

const startViewportDrag = () => { 
    dragging = true;
    cursorType = 'grabbing';
    prevMouseX = mouseX;
    prevMouseY = mouseY;
}
const dragViewport = () => {
    viewport.offsetX += (mouseX - prevMouseX) / viewport.scale;
    viewport.offsetY += (mouseY - prevMouseY) / viewport.scale;

    prevMouseX = mouseX;
    prevMouseY = mouseY;
}
const endViewportDrag = () => {
    dragging = false;
    cursorType = 'default';
}
const viewportZoom = (e:WheelEvent) => {
    //prevent zooming beyond min/max limits
    if(viewport.scale === zoomMin && e.deltaY > 0) return;
    if(viewport.scale === zoomMax && e.deltaY < 0) return;

    //determine zoom direction
    const zoomDirection:number = e.deltaY < 0 ? 1 : -1;
    const newScale:number = viewport.scale + zoomDirection;

    //change offset so the zoom stays centered on middle of screen and moves toward the mouse on zoomin
    let prevWidth:number = renderer.offsetWidth / viewport.scale;
    let newWidth:number = renderer.offsetWidth / newScale;
    let prevHeight:number = renderer.offsetHeight / viewport.scale;
    let newHeight:number = renderer.offsetHeight / newScale;

    let mouseWidth:number = zoomDirection === 1 ? mouseX / newScale : 0;
    let mouseHeight:number = zoomDirection === 1 ? mouseY / newScale : 0;

    viewport.offsetX -= ((prevWidth - newWidth) / 2) + mouseWidth;
    viewport.offsetY -= ((prevHeight - newHeight) / 2) + mouseHeight;
    viewport.scale = newScale;
}
const startSelect = (e:MouseEvent) => {
    selecting = true;
    startSelectX = e.clientX - renderer.offsetLeft;
    startSelectY = e.clientY;
}
const updateSelect = (e:MouseEvent) => {
    //if user clicks and selects to the left move visual starts
    selectX = e.clientX < startSelectX ? e.clientX : startSelectX;
    selectY = e.clientY < startSelectY ? e.clientY : startSelectY;

    selectWidth = Math.abs(startSelectX - e.clientX);
    selectHeight = Math.abs(startSelectY - e.clientY);
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
    viewportZoom(e);
}
const handleMouseButtonDown = (e: MouseEvent) => {
    e.preventDefault();
    if(e.button === 1) startViewportDrag();
    if(e.button === 0) startSelect(e);
}
const handleMouse = (e:MouseEvent) => {
    //origin (0,0) is at the center of the renderer
    mouseX = e.clientX - renderer.getBoundingClientRect().left - renderer.clientWidth / 2;
    mouseY = e.clientY - renderer.getBoundingClientRect().top - renderer.clientHeight / 2;

    if(dragging) dragViewport();
    if(selecting) updateSelect(e);
}
const handleMouseButtonUp = (e: MouseEvent) => {
    e.preventDefault();
    if(e.button === 1) endViewportDrag();
    if(e.button === 0) endSelect();
}

</script>

<div bind:this={renderer} role='button' style:cursor={cursorType} tabindex="0" onmousedown={handleMouseButtonDown} onmouseup={handleMouseButtonUp} onmouseleave={endViewportDrag} onwheel={handleWheel} onmousemove={handleMouse} id='luma-renderer' style:width={width} style:height={height}>
    <div id='luma-background'
         style='--offsetX: {viewport.offsetX * viewport.scale}px; --offsetY: {viewport.offsetY * viewport.scale}px; --scale: {viewport.scale * 10}px; --bg-color:{backgroundColor}; --grid-color:{gridColor}' 
         style:background-color={backgroundColor} 
         class={grid ? 'grid' : ''}>
    </div>
    <div style='--selectX: {selectX}px; --selectY: {selectY}px; --selectWidth: {selectWidth}px; --selectHeight: {selectHeight}px' id='luma-select'></div>
    <LumaNode selected={false} posX={500} posY={10} nodeWidth={100} nodeHeight={100} nodeFontSize={12}/>
    <LumaNode selected={false} posX={300} posY={10} nodeWidth={100} nodeHeight={100} nodeFontSize={12}/>
    <button aria-label="reset the renderer view to origin (0,0)" id='luma-reset-view' onmousedown={resetViewport}>Reset</button>
    <div id='luma-debug'>
        <p>x position: {-viewport.offsetX}</p>
        <p>y position: {viewport.offsetY}</p>
        <p>scale: {viewport.scale}</p>
        <p>mouseX: {mouseX}</p>
        <p>mouseY: {mouseY}</p>
        <p>selecting: {selecting}</p>
    </div>
</div>

<style>
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
    #luma-renderer{
        position:relative;
        overflow: hidden;
        margin:0px;
        padding:0px;
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
        width: 100px;
        height: 100px;
        right: 0;
        bottom: 0;
    }
    #luma-debug{
        position: absolute;
        width: 150px;
        height: 100px;
        left: 20px;
        top: 0;
    }
    .grid{
        background-size: var(--scale) var(--scale);
        background-position: var(--offsetX) var(--offsetY);
        background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
        linear-gradient(to top, var(--grid-color) 1px, transparent 1px)
    }
</style>