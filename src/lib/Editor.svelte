<script lang='ts'>
	import { browser } from "$app/environment";
    let numberOfLines:number = $state(1);
    let editor:HTMLTextAreaElement;

    let maxRows = browser ? Math.floor(window.innerHeight / 21) - 1 : 0;
    
    const handleKeyDown = (e:KeyboardEvent) => {
        if(e.key === 'Tab'){
            e.preventDefault();
            addTab();
        }
        if(e.key === 'Enter'){
            e.preventDefault();
            addLine();
        }
        if(e.key === 'Backspace'){
            e.preventDefault();
            backspaceSelection();
        }
        if(e.key === 'Delete'){
            e.preventDefault();
            deleteSelection();
        }
    }

    const addTab = () => {
        let prevSelectPos = editor.selectionStart;

        let selectedString = editor.value.slice(editor.selectionStart, editor.selectionEnd);

        let numberOfLinesDeleted = selectedString.split('\n').length - 1 || 0;
        numberOfLines -= numberOfLinesDeleted;

        editor.value = editor.value.slice(0,editor.selectionStart) + '\t' + editor.value.slice(editor.selectionEnd);
        editor.selectionStart = prevSelectPos + 1;
        editor.selectionEnd = prevSelectPos + 1;
    }

    const addLine = () => {
        let prevSelectPos = editor.selectionStart;

        let selectedString = editor.value.slice(editor.selectionStart, editor.selectionEnd);

        let numberOfLinesDeleted = selectedString.split('\n').length - 1 || 0;
        numberOfLines -= numberOfLinesDeleted;

        editor.value = editor.value.slice(0,editor.selectionStart) + '\n' + editor.value.slice(editor.selectionEnd);
        editor.selectionStart = prevSelectPos + 1;
        editor.selectionEnd = prevSelectPos + 1;
        numberOfLines++;
    }

    const deleteSelection = () => {
        let prevSelectPos = editor.selectionStart;

        let selectedString = editor.value.slice(editor.selectionStart, editor.selectionEnd);

        let numberOfLinesDeleted = selectedString.split('\n').length;
        numberOfLines -= numberOfLinesDeleted;

        editor.value = editor.value.slice(0,editor.selectionStart) + editor.value.slice(editor.selectionEnd + 1);
        editor.selectionStart = prevSelectPos;
        editor.selectionEnd = prevSelectPos;
    }


    const backspaceSelection = () => {
        let prevSelectPos:number = editor.selectionStart;

        //multiple select
        if(Math.abs(editor.selectionStart - editor.selectionEnd) > 0){
            let selectedString = '';
            selectedString = editor.value.slice(editor.selectionStart, editor.selectionEnd + 1);

            let numberOfLinesDeleted = selectedString.split('\n').length - 1;

            numberOfLines -= numberOfLinesDeleted;
            editor.value = editor.value.slice(0,editor.selectionStart) + editor.value.slice(editor.selectionEnd);
        }
        //no select
        else{
            let selectedString = '';
            selectedString = editor.value.slice(editor.selectionStart - 1, editor.selectionEnd);
            if(selectedString === '\n') numberOfLines--;
            editor.value = editor.value.slice(0, editor.selectionStart - 1) + editor.value.slice(editor.selectionEnd);
            prevSelectPos--;
        }
        editor.selectionStart = prevSelectPos;
        editor.selectionEnd = prevSelectPos;
    }

</script>

<div class="editor">
    <div class="line-numbers">

        {#each {length: numberOfLines} as _, i}
            <span class='line-numbers'>{i + 1}</span>
        {/each}
    </div>
    <textarea bind:this={editor} onkeydown={handleKeyDown} name="" id=""></textarea>
</div>


<style>
    .editor {
        box-sizing: border-box;
        display: inline-flex;
        gap: 10px;
        font-family: monospace;
        line-height: 21px;
        background: white;
        border-radius: 2px;
        padding: 20px 10px;
        height: 100%;
        overflow: auto;
    }

    textarea {
        line-height: 21px;
        overflow-y: visible;
        padding: 0;
        border: 0;
        background: white;
        color: black;
        min-width: 500px;
        outline: none;
        resize: none;
        white-space: pre;
        overflow-wrap: normal;
        overflow-x: scroll;
    }

    .line-numbers{
        width: 20px;
        text-align: right;
        display: flex;
        flex-direction: column;
        color:black;
        text-decoration: underline;
    }
</style>