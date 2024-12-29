<script lang='ts'>
    import { app, parsedConnections, parsedNodes} from "./shared.svelte.js";
    import type { ConnectionType, NodeType } from "./shared.svelte.js";

    // State Management
    let numberOfLines:number = $state(1);
    let currentLineNumber:number = $state(1);
    let editor: HTMLTextAreaElement;
    let lineNumbers: HTMLElement;
    let numberOfNodes:number = $state(0);


    // Scroll Synchronization
    const synchronizeLineNumberScroll = () => {
        if(lineNumbers && editor){
            lineNumbers.scrollTop = editor.scrollTop;
        }
    };

    // Line Number Management
    const updateLineNumbers = () => {
        numberOfLines = Math.max(editor.value.split('\n').length, 1);

        let lines = editor.value;
        let lineBreaks = 0;

        currentLineNumber = 1;

        for(let i = 0; i < lines.length; i++){
            if(lines[i] === '\n') lineBreaks++;

            let dir = editor.selectionDirection === 'forward' ? editor.selectionEnd : editor.selectionStart;

            if(i === dir - 1){
                currentLineNumber = lineBreaks + 1;
                break;
            }
        }
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
        if(e.ctrlKey && e.key === 'l'){
            e.preventDefault();
        }

        setTimeout(() => {
                updateLineNumbers();
        }, 1);
    }

    const parseTextToNodes = () => {
        const nodeList: NodeType[] = [];
        const connectionList: ConnectionType[] = [];

        parsedConnections.length = 0;
        parsedNodes.length = 0;
        numberOfNodes = 0;

        const lines: String[] = editor.value.split('\n');

        for(let line of lines){
            line = line.replace(/^[ \r\n]+/, '').trimEnd();

            //start node
            if(line.includes('{')){
                let calcX = numberOfNodes * 200;
                let calcY = 0;
                let calcWidth = 100;
                let calcHeight = 100;

                let currentNode:NodeType = {
                    id: numberOfNodes,
                    name: line.replace('{', ''),
                    x: calcX,
                    y: calcY,
                    width: calcWidth,
                    height: calcHeight,
                    leftConnection: [calcX, calcY + calcHeight / 2],
                    rightConnection: [calcX + calcWidth, calcY + calcHeight / 2],
                    bottomConnection: [calcX + calcWidth / 2, calcY + calcHeight],
                    topConnection: [calcX + calcWidth / 2, calcY],
                    attributes: [],
                    methods: [],
                };

                nodeList.push(currentNode);
            }
            //attribute/method etc.
            else if(line[0] === '\t'){
                let method = line.includes('(');

                if(method){
                    currentNode?.methods?.push(line.trim());
                }
                else if(line.slice(1,4) === '-->'){
                    let targetName = line.slice(line.indexOf('>') + 1);
                }
                else{
                    currentNode?.attributes?.push(line.trim());
                }
            }
            //end node
            else if(line[0] === '}'){
                if(currentNode) nodeList.push(currentNode);
                currentNode = null;
                numberOfNodes++;
            }
        }



        parsedNodes.push(...nodeList);
        parsedConnections.push(...connectionList);
    }

</script>

<div class="editor-container" style='--width: {`${app.editorWidth}px`}; --height: {`${app.editorHeight}px`}'>
    <div bind:this={lineNumbers} class="line-numbers">
        {#each {length: numberOfLines} as _, i}
            <div class={i + 1 === currentLineNumber ? 'selected-line-number' : 'line-number'}>{i + 1}</div>
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
    .selected-line-number{
        color:white;
        height: 21px;
        text-align: center;
    }
</style>