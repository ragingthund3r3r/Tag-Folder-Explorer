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
     * @returns FileLeaf - The constructed FileLeaf object
     * 
     * Used when: Building the tree structure from vault scan, adding new files to tree
     */
    // constructor(name: string, path: string): IFileLeaf; // Note: constructors aren't part of interfaces in TS
    
    /**
     * Updates the file name when the actual file is renamed externally
     * 
     * We aren't handling renaming files via the plugin, so this function is for
     * when the name of the file is modified externally and needs to be updated 
     * for this object. Also recomputes the file property on a file rename.
     * 
     * @param newName - The new name of the file
     * @returns boolean - true if successfully renamed, false otherwise
     * 
     * Used when: File system watcher detects file rename, manual tree updates
     */
    renameFile(newName: string): boolean;
    
    /**
     * Updates the file path when the file is moved externally
     * 
     * For now we aren't handling shifting files via the plugin, so this function
     * is for editing the path of a file when something like a parent folder name
     * is edited or a file is shifted etc. Recomputes file property as well.
     * 
     * @param newPath - The new relative path of the file
     * @returns boolean - true if successfully edited, false otherwise
     * 
     * Used when: File system watcher detects file move, folder renames, manual tree updates
     */
    editPath(newPath: string): boolean;
    
    /**
     * Adds a new tag to the metadata of the actual file
     * 
     * Adds the tag that is provided to the metadata of the actual file that
     * this FileLeaf represents. Returns a promise since it's a file edit operation.
     * 
     * @param newNestedTag - The new nested tag to add (e.g., "subject/math")
     * @returns Promise<boolean> - Promise that resolves to success/failure
     * 
     * Used when: User adds tags through UI, programmatic tag addition, tree manipulation
     */
    addNewTag(newNestedTag: string): Promise<boolean>;
    
    /**
     * Removes a specific tag from the actual file
     * 
     * Removes the tag that is provided from the actual file that it represents.
     * This removal is for every instance of the tag mention in the file and is
     * not restricted to the metadata of the file. Does not remove further nested tags.
     * For example: if the tag to remove is "school/subject" then "school/subject/maths" is NOT deleted.
     * 
     * @param tagToRemove - The tag to remove (e.g., "school/subject")
     * @returns Promise<boolean> - Promise that resolves to success/failure
     * 
     * Used when: User removes specific tags through UI, tree cleanup operations
     */
    removeTag(tagToRemove: string): Promise<boolean>;
    
    /**
     * Removes a tag and all its nested varieties from the actual file
     * 
     * Removes the tag and all nested varieties of the given tag from the actual file.
     * This removal is for every instance of the tag mention in the file and is not
     * restricted to the metadata of the file. Removes all varieties of the nested tags.
     * For example: if the tag to remove is "school/subject" then "school/subject/maths"
     * as well as "school/subject/science" are also deleted.
     * 
     * @param tagToRemove - The root tag to remove along with all nested variants
     * @returns Promise<boolean> - Promise that resolves to success/failure
     * 
     * Used when: User wants to completely remove a tag branch, major tree restructuring
     */
    removeTagAllNested(tagToRemove: string): Promise<boolean>;
    
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