export const viewport = $state({
    offsetX: 0,
    offsetY: 0,
    scale: 2,
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
    name: string;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    leftConnection: [number,number];
    rightConnection: [number,number];
    topConnection: [number,number];
    bottomConnection: [number,number];
    attributes: string[];
    methods: string[];
}

export interface ConnectionType{
    rootName: string;
    targetName: string;
    rootX: number;
    rootY: number;
    targetX: number;
    targetY: number;
}

export let parsedNodes = $state<NodeType[]>([]);
export let parsedConnections = $state<ConnectionType[]>([]);