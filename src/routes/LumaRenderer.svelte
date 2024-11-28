<script lang="ts">
    interface Props{
        width:string;
        height:string;
        backgroundColor?: string;
        grid?: string;
        gridColor?: string; 
    }

let {width='1920', height='1080', backgroundColor='white', grid='true', gridColor='lightgrey'}:Props = $props();


let offsetX:number = $state(1);
let offsetY:number = $state(0);

let scale:number = $state(5);

let dragging:boolean = false;
let mouseClickX:number = 0;
let mouseClickY:number = 0;


let zoomMax:number = 15;
let zoomMin:number = 2;

let mouseX:number = $state(0);
let mouseY:number = $state(0);


// TODO: this only works if the rernderer is centered on the page
let middleX:number = window.screen.width / 2;
let middleY:number = window.screen.height / 2;

const startDrag = (e:MouseEvent) => {
    dragging = true;
    mouseClickX = e.pageX;
    mouseClickY = e.pageY;
}
const drag = () => {
    if(dragging){        
        offsetX += mouseX - mouseClickX;
        mouseClickX = mouseX;
        offsetY += mouseY - mouseClickY;
        mouseClickY = mouseY;
    } 
}
const endDrag = () => {
    dragging = false;
}
const handleWheel = (e:WheelEvent) => {
    e.preventDefault();

    if(scale === zoomMin && e.deltaY > 0) return;
    if(scale === zoomMax && e.deltaY < 0) return;

    //move to mouse cursor if zooming in
    if(e.deltaY < 0){
        // if(e.pageX > middleX){
        //     offsetX -= e.pageX - middleX;
        // }
        // else{
        //     offsetX += middleX - e.pageX;
        // }
    }

    if(e.deltaY < 0){
        //scroll up
        scale += 1;
    } 
    else{
        //scroll down
        scale -= 1;
    }
}
const resetView = () => {
    offsetX = 0;
    offsetY = 0;
    scale = 10;
}
const updateMousePos = (e:MouseEvent) => {
    mouseX = e.pageX;
    mouseY = e.pageY;

    if(dragging) drag();
}

//node testing
let posX:number = $state(250);
let posY:number = $state(0);
let nodeWidth:number = $state(250);
let nodeHeight:number = $state(250);
let nodeFontSize:number = $state(24);

</script>

<!-- svelte-ignore  -->
<div role='button' tabindex="0" onmouseleave={endDrag} onwheel={handleWheel} onmousemove={updateMousePos} onmousedown={startDrag} onmouseup={endDrag} id='luma-renderer' style:width={width} style:height={height}>
    <div id='luma-background' style='--offsetX: {offsetX}px; --offsetY: {offsetY}px; --scale: {scale * 10}px; --bg-color:{backgroundColor}; --grid-color:{gridColor}' style:background-color={backgroundColor} class={grid === 'true' ? 'grid' : ''}></div>
    <div id='luma-node' style='--posX: {posX + offsetX}px; --posY: {posY + offsetY}px; --nodeWidth: {nodeWidth * scale / 10}px; --nodeHeight: {nodeHeight * scale / 10}px; --nodeFontSize: {nodeFontSize * scale / 10}px'>I am a node</div>
    <div id='luma-node' style='--posX: {posX + offsetX + 200}px; --posY: {posY + offsetY}px; --nodeWidth: {nodeWidth * scale / 10}px; --nodeHeight: {nodeHeight * scale / 10}px; --nodeFontSize: {nodeFontSize * scale / 10}px'>I am a node</div>

    <button aria-label="reset the renderer view to origin (0,0)" id='luma-reset-view' onmousedown={resetView}>Reset</button>
    <div id='luma-debug'>
        <p>x position: {-offsetX}</p>
        <p>y position: {offsetY}</p>
        <p>scale: {scale}</p>
        <p>middleX: {middleX}</p>
        <p>middleY: {middleY}</p>
        <p>mouseX: {mouseX}</p>
        <p>mouseY: {mouseY}</p>
    </div>
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
        linear-gradient(to top, var(--grid-color) 1px, transparent 1px);
    }
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