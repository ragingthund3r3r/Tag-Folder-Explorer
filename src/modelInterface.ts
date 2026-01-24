import type { TreeRoot } from './TreeRoot';

let treeObj: TreeRoot | null = null;

/**
 * Initialize the model interface with a TreeRoot instance
 */
export function initModelInterface(treer: TreeRoot) {
    treeObj = treer;
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
export function getmainViewData(currpath: string) {

    return treeObj?.getNode(currpath);
}
