<script lang="ts">
    interface Props{
        width:string;
        height:string;
        backgroundColor?: string;
        grid?: string;
        gridColor?: string; 
    }

let {width='1920', height='1080', backgroundColor='white', grid='true', gridColor='lightgrey'}:Props = $props();

let offsetX:number = $state(0);
let offsetY:number = $state(0);

let scale:number = $state(5);

let dragging:boolean = false;
let mouseClickX:number = 0;
let mouseClickY:number = 0;


let zoomMax:number = 15;
let zoomMin:number = 2;

const startDrag = (e:MouseEvent) => {
    dragging = true;
    mouseClickX = e.pageX;
    mouseClickY = e.pageY;
}
const drag = (e:MouseEvent) => {
    if(dragging){
        offsetX += e.pageX - mouseClickX;
        mouseClickX = e.pageX;
        offsetY += e.pageY - mouseClickY;
        mouseClickY = e.pageY;
    } 
}
const endDrag = () => {
    dragging = false;
}
const handleWheel = (e:WheelEvent) => {
    if(e.deltaY < 0){
        //scroll up
        scale += 1;
    } 
    else{
        //scroll down
        scale -= 1;
    }
    scale = Math.min(scale, zoomMax);
    scale = Math.max(scale, zoomMin);
}


</script>

<!-- svelte-ignore  -->
<div role='button' tabindex="0" onwheel={handleWheel} onmousemove={drag} onmousedown={startDrag} onmouseup={endDrag} id='luma-renderer' style:width={width} style:height={height}>
    <div id='luma-background' style='--offsetX: {offsetX}px; --offsetY: {offsetY}px; --scale: {scale * 10}px; --bg-color:{backgroundColor}; --grid-color:{gridColor}' style:background-color={backgroundColor} class={grid === 'true' ? 'grid' : ''}></div>
</div>

<style>
    #luma-renderer{
        position:relative;
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
    #luma-background:hover{
        cursor: grab;
    }
    #luma-background:active{
        cursor: grabbing;
    }
    
    .grid{
        background-size: var(--scale) var(--scale);
        background-position: var(--offsetX) var(--offsetY);
        background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
        linear-gradient(to top, var(--grid-color) 1px, transparent 1px);
    }
</style>