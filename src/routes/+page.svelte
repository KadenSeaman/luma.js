<script>
import LumaRenderer from '../lib/LumaRenderer.svelte';
import Editor from '../lib/Editor.svelte';
</script>

<div id="app">
    <Editor />
    <LumaRenderer grid={true} width=100% height=100% backgroundColor=white></LumaRenderer>
</div>


<style>
    #parser-input{
        width: 500px;
        resize: none;
    }
    #app{
        display: flex;
        width: 100vw;
        height: 100vh;
    }
</style>