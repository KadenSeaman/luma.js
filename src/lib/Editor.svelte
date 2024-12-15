<script lang='ts'>
    import { app, nodeData } from "./shared.svelte.js";
    import type { NodeType } from "./shared.svelte.js";
    import { v4 as uuid} from 'uuid';

    // State Management
    let numberOfLines:number = $state(1);
    let editor: HTMLTextAreaElement;
    let lineNumbers: HTMLElement;

    // Scroll Synchronization
    const synchronizeLineNumberScroll = () => {
        if(lineNumbers && editor){
            lineNumbers.scrollTop = editor.scrollTop;
        }
    };

    // Line Number Management
    const updateLineNumbers = () => {
        numberOfLines = Math.max(editor.value.split('\n').length, 1);
    };

    const insertAtCursor = (text: string) => {
        const startPos = editor.selectionStart;
        const endPos = editor.selectionEnd;

        editor.value = editor.value.slice(0, startPos) + text + editor.value.slice(endPos);

        // Reposition cursor
        const newCursorPos = startPos + text.length;
        editor.selectionStart = newCursorPos;
        editor.selectionEnd = newCursorPos;
    };

    const handleKeyUp = (e:KeyboardEvent) => {
        parseTextToNodes();
    };

    const handleKeyDown = (e:KeyboardEvent) => {
        if(e.key === 'Tab'){
            e.preventDefault();
            insertAtCursor('\t');
        }

        setTimeout(() => {
                updateLineNumbers();
        }, 1);
    }

    const parseTextToNodes = () => {
        nodeData.length = 0;

        const lines = editor.value.split('\n');

        const nodeList: NodeType[] = [];
        let currentNode: NodeType = {};

        let node = false;

        for(let line of lines){
            line = line.replace(/^[ \r\n]+/, '').trimEnd();

            //end node
            if(line[0] === '}'){
                node = false;
                nodeList.push(currentNode);
                currentNode = {};
            }
            //start node
            else if(line.includes('{')){
                currentNode = {
                    id: uuid(),
                    name: line.replace('{', ''),
                    attributes: [],
                    methods: [],
                    connections: []
                };
                node = true;
            }
            else if(line[0] === '\t'){
                let method = line.includes('(');

                if(method){
                    currentNode?.methods?.push(line.trim());
                }
                else if(line.slice(1,4) === '-->'){
                    currentNode?.connections?.push(line.replace('-->',''));
                }
                else{
                    currentNode?.attributes?.push(line.trim());
                }
            }
        }

        nodeData.push(...nodeList);
    }
</script>

<div  class="editor-container" style='--width: {`${app.editorWidth}px`}; --height: {`${app.editorHeight}px`}'>
    <div bind:this={lineNumbers} class="line-numbers">
        {#each {length: numberOfLines} as _, i}
            <div class='line-number'>{i + 1}</div>
        {/each}
    </div>
    <textarea bind:this={editor} onscroll={synchronizeLineNumberScroll} onkeyup={handleKeyUp} onkeydown={handleKeyDown} class="editor"></textarea>
</div>


<style>
    .editor-container{
        box-sizing: border-box;
        width: var(--width);
        margin: 0;
        padding: 10px 10px;
        border-radius: 5px;
        gap: 10px;
        display: flex;
        position: relative;
        font-family: monospace;
        line-height: 21px;
        background: #232323;
        overflow: hidden;
    }

    .editor{
        margin: 0;
        line-height: 21px;
        padding: 0;
        padding-right: 30px;
        margin-left: 10px;
        border: 0;
        background: #232323;
        color: #6bbdf8;
        height: 100%;
        width: 90%;
        outline: none;
        resize: none;
        white-space: pre;
        overflow-y: scroll;
    }

    .line-numbers{
        text-align: right;
        display: flex;
        flex-direction: column;
        color:#838383;
        vertical-align: bottom;
        width: 30px;
        overflow-y: hidden;
        scrollbar-width: 0px;
    }

    .line-number{
        height: 21px;
    }
</style>