<script lang='ts'>
import LumaRenderer from '../lib/LumaRenderer.svelte';
import Editor from '../lib/Editor.svelte';
import { app } from '$lib/shared.svelte.js';
import { browser } from '$app/environment';
import Resizer from '$lib/Resizer.svelte';

app.editorHeight = browser ? window.innerHeight : 0;
app.editorWidth = browser ? window.innerWidth * 0.25: 0;
app.resizerHeight = browser ? window.innerHeight : 0;
app.resizerWidth = browser ? 20 : 0;
app.rendererHeight = browser ? window.innerHeight : 0;
app.rendererWidth = browser ? window.innerWidth * 0.75 - app.resizerWidth : 0;

const handleWindowResize = () => {
    app.rendererWidth = browser ? window.innerWidth - app.editorWidth - app.resizerWidth : 0;
    app.rendererHeight = browser ? window.innerHeight : 0;
}
if(browser) window.addEventListener('resize', handleWindowResize);

const handleMouseUp = (e:MouseEvent) => {
    app.grabbing = false;
}

const handleMouse = (e:MouseEvent) => {
        if(e.clientX <= 0){
            app.grabbing = false;
            return;
        }

        if(app.grabbing){
            app.rendererWidth = window.innerWidth - e.clientX - app.resizerWidth;
            app.editorWidth = Math.max(0, e.clientX);
        }
    }

const handleMouseDown = (e:MouseEvent) => {
    if(e.button === 1) e.preventDefault();
    if ((e.target as HTMLElement).id ==='resizer' && e.button === 0) app.grabbing = true;
}

</script>

<div role='button' tabindex="0" id="app" onmouseup={handleMouseUp} onmousemove={handleMouse} onmousedown={handleMouseDown} onmouseleave={handleMouse}>
    <Editor />
    <Resizer />
    <LumaRenderer grid={true} gridColor=#333333 backgroundColor=#232323 />
</div>


<style>
    #app{
        display: flex;
        width: 100vw;
        height: 100vh;
        background-color: #232323;
    }
</style>