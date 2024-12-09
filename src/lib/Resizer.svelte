<script lang='ts'>
    let cursorType:string = 'default';

    const handleMouseOver = (e:MouseEvent) => {
        cursorType = 'grab';
    }
</script>


<div role="button" style:cusor={cursorType} tabindex="0" onmousemove={handleMouseOver} id='resizer'></div>

<style>
    #resizer{
        height: 100%;
        width: 20px;
        background-color: purple;
    }
</style>