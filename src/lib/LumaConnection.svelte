<script lang='ts'>
    import { viewport } from "./shared.svelte";

    interface Props{
        rootX:number;
        rootY:number;
        rootW:number;
        rootH:number;
        targetX:number;
        targetY:number;
        targetW:number;
        targetH:number;
        type?:string;
    }

    let {rootX, rootY, rootW, rootH, targetX, targetY, targetW, targetH}:Props = $props()



    let startX = $derived(((Number(rootX) + Number(rootW) + viewport.offsetX) * viewport.scale));
    let startY = $derived((Number(rootY)  + Number(rootH / 2) + viewport.offsetY) * viewport.scale);
    let endX = $derived((Number(targetX) +                      viewport.offsetX + 5) * viewport.scale);
    let endY = $derived((Number(targetY) + Number(targetH / 2) + viewport.offsetY) * viewport.scale);

</script>

<line
    x1="{startX}"
    y1="{startY}" 
    x2="{endX}"
    y2="{endY}" 
    stroke="white" 
    stroke-width="{2 * viewport.scale}"
/>