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

export const renderedNodes:any = $state({})

export interface NodeType{
    name?: string;
    attributes?: string[];
    methods?: string[];
}

export interface NodeConnection{
    [index: number] : string;
}

export let nodeData = $state<NodeType[]>([]);
export let connectionData = $state<NodeConnection[]>([]);
