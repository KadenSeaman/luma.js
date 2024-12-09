<script>
import LumaRenderer from '../lib/LumaRenderer.svelte';
import Editor from '../lib/Editor.svelte';
import Resizer from '../lib/Resizer.svelte';

</script>

<div id="app">
    <Editor />
    <Resizer />
    <LumaRenderer grid={true} width=auto height=100% backgroundColor=white></LumaRenderer>
</div>


<style>
    #app{
        display: flex;
        width: 100vw;
        height: 100vh;
    }
</style>