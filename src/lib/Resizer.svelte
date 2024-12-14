<script lang='ts'>
    import { app } from './shared.svelte';
</script>

<div role='button' tabindex="0" id='resizer' style='--width: {`${app.resizerWidth}px`}; --height: {`${app.resizerHeight}px`}'></div>

<style>
    #resizer{
        width: var(--width);
        height: 100%;
        background-color: #232323;
        border-radius: 5px;
        border: 1px solid darkgray;
        box-sizing: border-box;
    }
    #resizer:hover {
        background-color: #6bbdf8;
        cursor: ew-resize;
    }
</style>