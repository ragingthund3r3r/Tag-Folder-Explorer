import type { TreeRoot } from './TreeRoot';
import type { ISerializedTagNode, ITagNode } from './interfaces'
import { writable } from 'svelte/store';

let treeObj: TreeRoot | null = null;

/**
 * A Svelte store that signals when the tree data has been updated.
 * Components can subscribe to this to know when to refresh their data.
 * The value increments each time the tree is initialized/updated.
 */
export const treeReady = writable(0);

/**
 * Initialize the model interface with a TreeRoot instance
 */
export function initModelInterface(treer: TreeRoot) {
    treeObj = treer;
    // Notify all subscribers that the tree is ready/updated
    treeReady.update(n => n + 1);
}

/**
 * Get the serialized tree structure for the left sidebar
 * Returns the complete tag tree with root tags and untagged files
 */
export function getleftSidebarTree() {
    if (!treeObj) {
        return { rootTags: [], untaggedFiles: [] };
    }
    return treeObj.getSortedTree();
}








/**
 * Get data for the right sidebar (placeholder)
 */
export function getrightSidebarData() {
    return treeObj;
}

/**
 * Get data for the main view (placeholder)
 */
export function getmainViewData(currpath: string): ISerializedTagNode | null {
 
    const node = treeObj?.getNode(currpath);
    return node ? node.serializeTagNode() : null;
    

}
