import type { TreeRoot } from './TreeRoot';
import type { ISerializedTagNode, ITagNode } from './interfaces'

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
export function getrightSidebarData(parentfolder: string, type: string, path: string) {


    
    // console.log("from inside modelInterface")
    // console.log(type)
    // console.log(path)

 

    if (type == 'folder'){
        const node = treeObj?.getNode(path);
        let foldermetadata = node?.readMeta()
        return foldermetadata
    }
    if (type =='file'){
        // console.log("from inside file")
        let filename = path.split("/").pop()?.replace(/\.[^/.]+$/, "") ?? "";
        const file = treeObj?.getFile(filename, path, parentfolder)
        let filemetadata = file?.fileMetadata()
        let fileinitial = file?.readInitial()
        let fileobsdata = file?.fileObsCreateModDate()



        // console.log(filemetadata)
        // console.log(fileinitial)
        // console.log(fileobsdata)
        // console.log("++++++++")
        return {filemetadata, fileinitial, fileobsdata}


    }
    


    return treeObj;
}

/**
 * Get data for the main view (placeholder)
 */
export function getmainViewData(currpath: string): ISerializedTagNode | null {
 
    const node = treeObj?.getNode(currpath);
    return node ? node.serializeTagNode() : null;
    

}
