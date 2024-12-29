<script lang='ts'>
    import { viewport, type ConnectionType } from "./shared.svelte";

    let {rootName, targetName, rootX, rootY, targetX, targetY}:ConnectionType = $props();

    let startX = $derived(((Number(rootX) + viewport.offsetX) * viewport.scale));
    let startY = $derived((Number(rootY) + viewport.offsetY) * viewport.scale);
    let endX = $derived((Number(targetX) + viewport.offsetX) * viewport.scale);
    let endY = $derived((Number(targetY) + viewport.offsetY) * viewport.scale);

</script>

<line
    x1="{startX}"
    y1="{startY}" 
    x2="{endX}"
    y2="{endY}" 
    stroke="white" 
    stroke-width="{2 * viewport.scale}"
/>