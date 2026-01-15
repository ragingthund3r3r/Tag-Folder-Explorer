import { TFile } from 'obsidian';

/**
 * Interface for FileLeaf objects - represents individual files as leaf nodes in the tag tree
 * 
 * FileLeaf objects are always leaf nodes in the tree structure. They represent actual files
 * in the vault and their ancestors (TagNode chain) represent the nested tag path that
 * leads to this file.
 */
export interface IFileLeaf {
    // ==================== PROPERTIES ====================
    
    /**
     * The name of the file
     * Contains just the filename (e.g., "my-notes.md")
     */
    //  name: string;
    
    /**
     * The file's relative path inside the vault
     * Describes how to get to the file inside the vault from the vault root
     * (e.g., "folder/subfolder/my-notes.md")
     */
    // path: string;

    /**
     * The tag path associated with this file
     * Represents the nested tag path that leads to this file (e.g., "subject/math")
     */
    // tagpath: string;

    
    /**
     * An Obsidian API reference to the file object
     * This is the actual TFile object that Obsidian uses to represent this file
     */
    // file: TFile;



    
    // ==================== FUNCTIONS ====================
    
    /**
     * Creates new file node object with the given name and path
     * 
     * @param name - The name of the file
     * @param path - The relative path of the file in the vault
     * @param tagpath - The tag path associated with the file
     * @param file - The TFile reference of the actual file
     * @param app - The Obsidian App instance for API access
     * @returns FileLeaf - The constructed FileLeaf object
     * 
     * Used when: Building the tree structure from vault scan, adding new files to tree
     */
    // constructor(name: string, path: string): IFileLeaf; // Note: constructors aren't part of interfaces in TS
    



    
    /**
     * Gets the name of the file
     * 
     * @returns string - The filename (e.g., "my-notes.md")
     * 
     * Used when: Displaying file names in UI, file operations, tree rendering
     */
    getName(): string;
    
    /**
     * Gets the path of the file
     * 
     * @returns string - The relative path of the file in the vault
     * 
     * Used when: File operations, path-based lookups, tree navigation
     */
    getPath(): string;
    


    /**     
     * Gets the tag path associated with the file
     *
     * @returns string - The tag path associated with the file
     *
     * Used when: Tag-based operations, tree positioning, file categorization
     */
    getTagPath(): string;

    /**
     * Edits/updates the name of the file
     * 
     * @param newName - The new filename to set
     * 
     * Used when: Renaming files, file management operations
     */
    editFileName(newName: string): void;

    /**
     * Edits/updates the path of the file
     * 
     * @param newPath - The new relative path of the file in the vault
     * 
     * Used when: Moving files, reorganizing vault structure
     */
    editPath(newPath: string): void;

    /**
     * Edits/updates the tag path associated with the file
     * 
     * @param newTagPath - The new tag path to associate with the file
     * 
     * Used when: Retagging files, updating file categorization
     */
    editTagPath(newTagPath: string): void;

    
    
    /**
     * Retrieves all the tag paths that this file exists under
     * 
     * Reads the actual file and extracts all the tags that are present in this file,
     * both in the metadata and file body. These represent all the "paths" or locations
     * where this file appears in the tag tree.
     * 
     * @returns string[] - List of all tag paths as strings (e.g., ["subject/math", "homework"])
     * 
     * Used when: Building tree structure, updating file positions, tree validation
     */
    retrieveAllPaths(): string[];
    
    /**
     * Retrieves the metadata of the actual file
     * 
     * Returns the metadata of the actual file as a dictionary/object with
     * keys representing the metadata fields.
     * 
     * @returns Record<string, any> - Dictionary with keys as the metadata fields
     * 
     * Used when: Displaying file properties, metadata-based operations, file analysis
     */
    fileMetadata(): Record<string, any>;
    
    /**
     * Reads the initial content of the file for preview
     * 
     * Reads the file contents (after metadata) and strips away all initial spaces
     * and then returns the first "k" characters. "k" is yet to be decided.
     * 
     * @returns string - String of the first k characters of the file content
     * 
     * Used when: File preview in UI, quick content display, search result previews
     */
    readInitial(): string;
}

/**
 * Interface for TagNode objects - represents tag nodes in the hierarchical tag tree
 * 
 * TagNode objects form the core skeleton of the tree structure. They represent individual
 * tags or nested tag segments and maintain parent-child relationships to create the
 * hierarchical tag tree. Files (FileLeaf objects) are attached to these nodes based
 * on their tag paths.
 */
export interface ITagNode {
    // ==================== PROPERTIES ====================
    
    /**
     * The name of the tag that this node represents
     * Multiple nodes may have the same name since they are nested at different
     * locations and under different parents (e.g., "math" under both "school/math" and "hobby/math")
     */
    // name: string;
    
    /**
     * The nested path of tags till now, including this node's tag name
     * Represents the full tag path from root to this node (e.g., "subject/math")
     */
    // path: string;
    
    /**
     * A pointer to the parent object of this node
     * Points to the parent TagNode. If this is the root node, this property is empty/null.
     */
    // parent: ITagNode | null;
    
    /**
     * A dictionary of TagNode objects that are children of this node
     * Keyed by the names of individual tags that exist under this TagNode as children
     */
    // children: Record<string, ITagNode>;
    
    /**
     * A list of FileLeaf objects present under this tag path
     * Contains every file that has this nested tag path in it
     */
    // files: IFileLeaf[];
    
    // ==================== FUNCTIONS ====================
    

    // ==================== CREATE ====================

    /**
     * Given a tag name, creates a new child node under this current node
     * 
     * Creates a new TagNode as a child of this node. The new child will have
     * this node as its parent and will be added to the children dictionary.
     * 
     * @param newChildTagName - The name of the new child tag node to create
     * @returns boolean - true if successful, false if node already exists or other issues
     * 
     * Used when: Building tree structure, adding new tag branches, tree expansion
     */
    addChildNode(newChildTagName: string): boolean;
    
    
    
    /**
     * Creates a new FileLeaf object under this Tag Node and adds it to the files list
     * 
     * Instantiates a new FileLeaf with the provided name and path, then adds it
     * to this node's files array.
     * 
     * @param nameOfFile - The name of the file to create
     * @param pathToFile - The path to the file in the vault
     * @returns boolean - true if successful, false otherwise
     * 
     * Used when: Adding files to tag locations, building tree from vault scan
     */
    createNewFile(nameOfFile: string, pathToFile: string): boolean;


    /**
     * Checks if a metadata file corresponding to this node exists, creates it if it doesn't
     * 
     * Creates a new metadata file in the `.TagNodeMeta` hidden folder at vault root.
     * The filename follows the convention: `{path_with_underscores}_{base64_encoded_path}.md`
     * For example, path "subject/math" becomes "subject_math_c3ViamVjdC9tYXRo.md"
     * The file contains YAML frontmatter between --- delimiters for metadata storage.
     * 
     * @returns boolean - true if created successfully, false if already exists or other issues
     * 
     * Used when: Initializing tag metadata, setting up tag properties, first-time tag creation
     */
    createNewMeta(): boolean;




    // ==================== READ ====================

    /**
     * Gets the name of the node object and returns it
     * 
     * @returns string - The name of this tag node
     * 
     * Used when: Display operations, node identification, tree traversal
     */
    getName(): string;
    
    /**
     * Gets the path of the node object and returns it
     * 
     * @returns string - The full nested tag path to this node
     * 
     * Used when: Path display, breadcrumb generation, node location identification
     */
    getPath(): string;
    
    /**
     * Gets the parent of the node object and returns it
     * 
     * @returns ITagNode | null - The parent TagNode object, or null if this is root
     * 
     * Used when: Tree traversal upward, path reconstruction, parent operations
     */
    getParent(): ITagNode | null;
    
    /**
     * Gets all children of the node object and returns them
     * 
     * @returns Record<string, ITagNode> - Dictionary of all child TagNode objects
     * 
     * Used when: Tree traversal downward, displaying child tags, tree expansion
     */
    getChildren(): Record<string, ITagNode>;
    
    /**
     * Gets a specific child of the node object with a given name and returns it
     * 
     * @param nameOfChild - The name of the child node to retrieve
     * @returns ITagNode | null - The child TagNode object, or null if not found
     * 
     * Used when: Navigating to specific child, checking child existence, targeted operations
     */
    getChild(nameOfChild: string): ITagNode | null;
    
    /**
     * Gets all the files of the node object and returns them
     * 
     * @returns IFileLeaf[] - Array of all FileLeaf objects under this node
     * 
     * Used when: Displaying files under tag, file listing, content operations
     */
    getFiles(): Set<IFileLeaf>;
    
    /**
     * Gets a specific file of the node object with a given name and returns it
     * 
     * @param nameOfFile - The name of the file to retrieve
     * @returns IFileLeaf | null - The FileLeaf object, or null if not found
     * 
     * Used when: Finding specific file, file operations, targeted file access
     */
    getFile(nameOfFile: string): IFileLeaf | null;
    
    /**
     * Retrieves the metadata inside the metadata file corresponding to this node
     * 
     * Reads and parses the metadata file from `.TagNodeMeta` folder for this tag node.
     * Extracts the YAML frontmatter content between --- delimiters and returns it
     * as a dictionary/object. Uses the path-based filename convention to locate the file.
     * 
     * @returns Record<string, any> - Contents of metadata file YAML frontmatter as dictionary
     * 
     * Used when: Reading tag properties, loading tag settings, metadata operations
     */
    readMeta(): Record<string, any>;





    // ==================== UPDATE ====================


    /**
     * Given the new name of the node, renames the node
     * 
     * Updates the name property of this node. Also updates the path with the new name.
     * Does not propagate changes to children or parent relationships.
     * 
     * @param newName - The new name for this tag node
     * @returns boolean - true if successful, false otherwise
     * 
     * Used when: Tag renaming operations, node name corrections, tree restructuring
     */
    renameNode(newName: string): boolean;
    
    /**
     * Given a new path for this node, replaces the old path with the new path
     * 
     * Updates the path property of this node. Should be used carefully as it
     * affects the node's position in the tree hierarchy.
     * Extracts the node name from the new path and updates the name property as well.
     * 
     * @param newPath - The new path for this tag node
     * @returns boolean - true if successful, false otherwise
     * 
     * Used when: Tree restructuring, path corrections, node relocation
     */
    editPath(newPath: string): boolean;
    
    
    /**
     * Updates an existing metadata file with the payload that is provided
     * 
     * Modifies the metadata file in `.TagNodeMeta` folder corresponding to this node.
     * The payload data is written as YAML frontmatter between --- delimiters.
     * The filename is generated using the path-to-filename convention with base64 encoding.
     * 
     * @param payload - The metadata content to write as YAML frontmatter
     * @returns boolean - true if update successful, false otherwise
     * 
     * Used when: Updating tag properties, modifying tag settings, metadata synchronization
     */
    updateMeta(payload: Record<string, any>): boolean;
    

    



    // ==================== DELETE ====================
    
    /**
     * Given a child tag name, removes that child node from the children list
     * 
     * Removes the specified child node and recursively deletes that node and
     * all its children. This is a destructive operation.
     * 
     * @param childTagName - The name of the child tag node to remove
     * @returns boolean - true if successful, false otherwise
     * 
     * Used when: Tree pruning, tag removal, tree cleanup operations
     */
    removeChildNode(childTagName: string): boolean;
    


    
    /**
     * Given a filename, removes the FileLeaf object from this node
     * 
     * Searches for the file with the specified name in the files array and
     * removes it from this node.
     * 
     * @param fileName - The name of the file to remove
     * @returns boolean - true if successful, false otherwise
     * 
     * Used when: File deletion, tag removal from files, tree maintenance
     */
    removeFile(fileName: string): boolean;




    /**
     * Deletes the metadata file corresponding to this node
     * 
     * Removes the metadata file from `.TagNodeMeta` folder associated with this tag node.
     * Uses the path-based filename convention to locate and delete the correct file.
     * This is a destructive operation that permanently removes the metadata.
     * 
     * @returns boolean - true if delete successful, false otherwise
     * 
     * Used when: Tag cleanup, removing tag metadata, tree maintenance
     */
    deleteMeta(): boolean;
    

}



/**
 * Interface for TreeRoot objects - represents the root of the tag tree
 * 
 * TreeRoot object is the root of the tag tree structure. It contains the top-level tag nodes and untagged files.
 */
export interface ITreeRoot {
    // ==================== PROPERTIES ====================
    
    /**
     * The tags that have no parents and are directly under the root. 
     * Contains a list of top-level TagNode objects.
     */
    //  rootTags: Set<ITagNode>;
    
    /**
     * Files that dont have any parent tags associated with them
     * Contains a list of FileLeaf objects that are untagged.
     */
    // untaggedFiles: Set<IFileLeaf>;


    /**
     * A dictionary object of sorted trees of different types. 
     * These trees are flattened static json representations.
     * Keyed by the type of sort that is applied. 
     * We precompute this so that a static reference to this can be sent to the frontend for population. 
     * The keys are "Alphabetical_asc", "Alphabetical_desc", "ModifiedDate_asc", "ModifiedDate_desc", "CreatedDate_asc", "CreatedDate_desc", "FileSize_asc", "FileSize_desc"
     * 
     */
    // sortedTrees: {
    //     "Alphabetical_asc": any;
    //     "Alphabetical_desc": any;
    //     "ModifiedDate_asc": any;
    //     "ModifiedDate_desc": any;
    //     "CreatedDate_asc": any;
    //     "CreatedDate_desc": any;
    //     "FileSize_asc": any;
    //     "FileSize_desc": any;
    // };

    
    /**
     * Flags that the tree maintains in order to determine and calculate the state of the tree. 
     * This entire object is a nested object thus making it easier to add new flags in the future and access the existing ones.
     * Contains the following flags:
     * - isDirty: parent_object - Indicates if the static snapshots of the tree are dirty.
     *     - alphabetical_asc: boolean - Indicates if the alphabetical ascending snapshot is dirty.
     *     - alphabetical_desc: boolean - Indicates if the alphabetical descending snapshot is dirty.
     *     - modifiedDate_asc: boolean - Indicates if the modified date ascending snapshot is dirty.
     *     - modifiedDate_desc: boolean - Indicates if the modified date descending snapshot is dirty.
     *     - createdDate_asc: boolean - Indicates if the created date ascending snapshot is dirty.
     *     - createdDate_desc: boolean - Indicates if the created date descending snapshot is dirty.
     *     - fileSize_asc: boolean - Indicates if the file size ascending snapshot is dirty.
     *     - fileSize_desc: boolean - Indicates if the file size descending snapshot is dirty.
     * - broadcastCounter: number - A counter to track broadcast events for tree updates.
     * - folderPosition: boolean - Indicates if folder position is above files in the tree. 1 is above 0 is below.
     */
    // flags: {
    //     isDirty: {
    //         alphabetical_asc: boolean;
    //         alphabetical_desc: boolean;
    //         modifiedDate_asc: boolean;
    //         modifiedDate_desc: boolean;
    //         createdDate_asc: boolean;
    //         createdDate_desc: boolean;
    //         fileSize_asc: boolean;
    //         fileSize_desc: boolean;
    //     };
    //     broadcastCounter: number;
    //     folderPosition: boolean;
    // };


    /**
     * This indicates the actual folder paths that we have to skip during tree construction. 
     * This is a set of strings where each string is a folder path relative to the vault root.
     * For example, to skip a folder named "Private" at the vault root, the entry would be "Private".
     * To skip a subfolder named "Secret" inside a folder "Work", the entry would be "Work/Secret".
     * This allows users to exclude specific folders from being scanned and included in the tag tree.
     */
    // excludedFolders: Set<string>;

    
    // ==================== FUNCTIONS ====================
    
    /**
     * Creates new tree root object
     * 
     * @param rootTags 
     * @param untaggedFiles
     * @param flags
     * @param excludedFolders
     * @param app - The Obsidian App instance for API access
     * @returns TreeRoot - The constructed TreeRoot object
     * 
     * Used when: Building the tree structure from vault scan, adding new files to tree
     */
    // constructor(): ITreeRoot; // Note: constructors aren't part of interfaces in TS
    



    
    /**
     * Dumps the current computed tree, computed snapshots and recomputes the whole tree datastructure and updates all static snapshots
     * 
     * @returns void 
     * 
     * Used when: We need to recompute the entire tree from scratch, such as after bulk changes
     */
    recomputeTree(): void;
    

    // im not pre computing or sorting right now so will handle this later
    // /**
    //  * Dumps the current snapshots of the tree and recomputes all static snapshots
    //  * 
    //  * @returns void
    //  * 
    //  * Used when: Some files have changed and we need to update the sorted snapshots
    //  */
    // resortTree(): void;
    


    /**     
     * Gets the list of TagNode Objects in the tree
     *
     * @returns - The list of root tags in the tree
     *
     */
    getRootTags(): Set<ITagNode>;


    /**
     * Gets the list of LeafNode Objects in the tree
     * 
     * @returns - The list of untagged files in the tree
     * 
     */
    getUntaggedFiles(): Set<IFileLeaf>;

    // /**
    //  * Gets the readonly json version of the sorted tree of the specified type
    //  * 
    //  * @param type - The key of the type of sorted tree to retrieve
    //  * 
    //  */
    // getSortedTrees(type): unknown;



    /**
     * Gets the readonly json version of the sorted tree of the specified type
     * 
     * 
     */
    getSortedTree(): unknown;
    
    
    /**
     * Retruns the list of paths that are supposed to be skipped during computation
     * 
     */
    getSkipFolderPath(): string[];

  
    
    /**
     * Returns a list of paths of the current tree where the file that is passed in exists.
     * 
     * @param filename - The name of the file 
     * @param filepath - The path of the file relative to the root of the vault
     * 
     */
    getAllInstancesOfFile(filename:string, filepath:string): string[];
    

    // // getAllDirectChildrenNodes
    // // getAllDirectChildrenFiles


    // the two below make these redundant
    // /**
    //  * Returns a specific node according to the name provided, only from the roottag list 
    //  * 
    //  * @param tagname - The name of the tag 
    //  * 
    //  */
    // getChildNode(tagname:string): ITagNode | null;
    

    // /**
    //  * Returns a specific file according to the name and path provided, only from the untagged files list 
    //  * 
    //  * @param filename - The name of the file 
    //  * @param filepath - The path of the file relative to the root of the vault
    //  * 
    //  */
    // getChildFile(filename:string, filepath:string): IFileLeaf | null;


    
    /**
     * Returns a specific node according to the name provided, from whole tree
     * 
     * @param tagname - The name of the tag 
     * 
     */
    getNode(tagname:string): ITagNode | null;
    

    /**
     * Returns a specific file according to the name and path provided, from the whole tree
     * 
     * @param filename - The name of the file 
     * @param filepath - The path of the file relative to the root of the vault
     * 
     */
    getFile(filename:string, filepath:string): IFileLeaf | null;



    // // setFlag
    
    
    /**
     * Deletes a specific node according to the name provided, from whole tree
     * 
     * @param tagname - The name of the tag 
     * 
     */
    delChildNode(tagname:string): boolean | null;
    

    /**
     * Deletes a specific file according to the name and path provided, from the whole tree
     * 
     * @param filename - The name of the file 
     * @param filepath - The path of the file relative to the root of the vault
     * 
     */
    delChildFile(filename:string, filepath:string): boolean | null;

}
