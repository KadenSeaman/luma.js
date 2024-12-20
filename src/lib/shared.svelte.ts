export const viewport = $state({
    offsetX: 0,
    offsetY: 0,
    scale: 2,
    effectiveX: 0,
    effectiveY: 0,
})

export const app = $state({
    rendererWidth: 0,
    rendererHeight: 0,
    editorWidth: 0,
    editorHeight: 0,
    resizerWidth: 0,
    resizerHeight: 0,
    grabbing: false,
})

export interface NodeType{
    id?: string;
    name?: string;
    attributes?: string[];
    methods?: string[];
    connections?:string[];
}

export let nodeData = $state<NodeType[]>([]);
