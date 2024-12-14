<script lang='ts'>
	import { useUpdateNodeInternals } from "reactflow";
    /*
        TODO:
        copy and paste doesnt update line nums 
        what happens when you run past limit of line nums lol
    */
   import { app, nodeData } from "./shared.svelte.js";
   import type { NodeType } from "./shared.svelte.js";

    let numberOfLines:number = $state(1);
    let editor:HTMLTextAreaElement;

    const handleKeyUp = (e:KeyboardEvent) => {
        parseToNodes();
    }

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
        numberOfLines = Math.max(numberOfLines, 1);
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

    const parseToNodes = () => {
        while(nodeData.length > 0) nodeData.pop();

        let inputStr = editor.value;

        let lines = inputStr.split('\n');

        let nodeList: NodeType[] = [];
        let nodeTarget: NodeType = {};

        let node = false;

        for(let line of lines){
            line = line.replace(/^[ \r\n]+/, '').trimEnd();

            //end node
            if(line[0] === '}'){
                node = false;
                nodeList.push(nodeTarget);
                nodeTarget = {};
            }
            //start node
            else if(line.includes('{')){
                nodeTarget = {
                    name: line.replace('{', ''),
                    attributes: [],
                    methods: [],
                };
                node = true;
            }
            else if(line[0] === '\t'){
                let method = line.includes('(');

                if(method){
                    nodeTarget?.methods?.push(line.trim());
                }
                else{
                    nodeTarget?.attributes?.push(line.trim());
                }
            }
        }

        for(const node of nodeList){
            nodeData.push(node);
        }
    }
</script>

<div class="editor" style='--width: {`${app.editorWidth}px`}; --height: {`${app.editorHeight}px`}'>
    <div class="line-numbers">
        {#each {length: numberOfLines} as _, i}
            <span class='line-numbers'>{i + 1}</span>
        {/each}
    </div>
    <textarea bind:this={editor} onkeyup={handleKeyUp} onkeydown={handleKeyDown} name="" id=""></textarea>
</div>


<style>
    .editor {
        display: inline-flex;
        position: relative;
        gap: 10px;
        font-family: monospace;
        line-height: 21px;
        background: #232323;
        overflow: auto;
        width: var(--width);
        margin: 0;
        padding: 10px 10px;
        border-radius: 5px;
        box-sizing: border-box;
    }

    textarea {
        margin: 0;
        line-height: 21px;
        overflow-y: visible;
        padding: 0;
        padding-left: 10px;
        border: 0;
        background: #232323;
        color: #6bbdf8;
        width: 90%;
        outline: none;
        resize: none;
        white-space: pre;
        overflow-wrap: normal;
        overflow-x: scroll;
    }

    .line-numbers{
        text-align: right;
        display: flex;
        flex-direction: column;
        color:#838383;
        vertical-align: bottom;
        padding-left: 10px;
        width: 20px;
    }
</style>