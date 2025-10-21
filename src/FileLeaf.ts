import { TFile, App } from 'obsidian';
import { IFileLeaf } from './interfaces';

/**
 * FileLeaf class - Represents individual files as leaf nodes in the tag tree
 * 
 * FileLeaf objects are always leaf nodes in the tree structure. They represent actual files
 * in the vault and their ancestors (TagNode chain) represent the nested tag path that
 * leads to this file.
 */
export class FileLeaf implements IFileLeaf {
    // ==================== PROPERTIES ====================
    

    private name: string;
    private path: string;
    private file: TFile;
    private app: App;
    
    // ==================== CONSTRUCTOR ====================
    
    /**
     * Creates new FileLeaf object with the given name and path
     * 
     * @param name - The name of the file
     * @param path - The relative path of the file in the vault
     * @param app - The Obsidian App instance for API access
     * 
     * Used when: Building the tree structure from vault scan, adding new files to tree
     */
    constructor(name: string, path: string, app: App) {
        this.name = name;
        this.path = path;
        this.app = app;
        
        // Get the TFile reference from the vault using the path
        const tFile = this.app.vault.getAbstractFileByPath(path);
        if (tFile instanceof TFile) {
            this.file = tFile;
        } else {
            throw new Error(`File not found at path: ${path}`);
        }
    }
    
    

    // ==================== FUNCTIONS ====================
    
    /**
     * Gets the name of the file
     * 
     * @returns string - The filename (e.g., "my-notes.md")
     * 
     * Used when: Displaying file names in UI, file operations, tree rendering
     */
    public getName(): string {
        return this.name;
    }
    
    /**
     * Gets the path of the file
     * 
     * @returns string - The relative path of the file in the vault
     * 
     * Used when: File operations, path-based lookups, tree navigation
     */
    public getPath(): string {
        return this.path;
    }
    
    
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
    public renameFile(newName: string): boolean {
        try {
            // Update the name property
            this.name = newName;
            
            // Reconstruct the path with the new name
            const pathParts = this.path.split('/');
            pathParts[pathParts.length - 1] = newName;
            this.path = pathParts.join('/');
            
            // Recompute the file property with the new path
            const tFile = this.app.vault.getAbstractFileByPath(this.path);
            if (tFile instanceof TFile) {
                this.file = tFile;
                return true;
            } else {
                // Revert changes if file not found
                throw new Error(`File not found at new path: ${this.path}`);
            }
        } catch (error) {
            console.error('Failed to rename file:', error);
            return false;
        }
    }
    
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
    public editPath(newPath: string): boolean {
        try {
            // Update the path property
            this.path = newPath;
            
            // Extract the new name from the new path
            const pathParts = newPath.split('/');
            this.name = pathParts[pathParts.length - 1];
            
            // Recompute the file property with the new path
            const tFile = this.app.vault.getAbstractFileByPath(this.path);
            if (tFile instanceof TFile) {
                this.file = tFile;
                return true;
            } else {
                // Revert changes if file not found
                throw new Error(`File not found at new path: ${this.path}`);
            }
        } catch (error) {
            console.error('Failed to edit file path:', error);
            return false;
        }
    }
    
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
    public async addNewTag(newNestedTag: string): Promise<boolean> {
        try {
            // Clean the tag (remove # if present)
            const cleanTag = newNestedTag.startsWith('#') ? newNestedTag.slice(1) : newNestedTag;
            
            // Use Obsidian's built-in API to modify frontmatter
            await this.app.fileManager.processFrontMatter(this.file, (frontmatter) => {
                // Initialize tags array if it doesn't exist
                if (!frontmatter.tags) {
                    frontmatter.tags = [];
                } else if (!Array.isArray(frontmatter.tags)) {
                    // Convert single tag to array
                    frontmatter.tags = [frontmatter.tags];
                }
                
                // Add the new tag if it's not already present
                if (!frontmatter.tags.includes(cleanTag)) {
                    frontmatter.tags.push(cleanTag);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Failed to add new tag:', error);
            return false;
        }
    }
    
    /**
     * Removes a specific tag from the actual file
     * 
     * Removes the tag that is provided from both the frontmatter metadata and inline 
     * content of the actual file. Does not remove further nested tags.
     * For example: if the tag to remove is "school/subject" then "school/subject/maths" is NOT deleted.
     * 
     * @param tagToRemove - The tag to remove (e.g., "school/subject")
     * @returns Promise<boolean> - Promise that resolves to success/failure
     * 
     * Used when: User removes specific tags through UI, tree cleanup operations
     */
    public async removeTag(tagToRemove: string): Promise<boolean> {
        try {
            // Clean the tag (remove # if present)
            const cleanTag = tagToRemove.startsWith('#') ? tagToRemove.slice(1) : tagToRemove;
            
            // First, remove from frontmatter using Obsidian API
            await this.app.fileManager.processFrontMatter(this.file, (frontmatter) => {
                if (frontmatter.tags) {
                    if (Array.isArray(frontmatter.tags)) {
                        // Remove the tag from the array
                        frontmatter.tags = frontmatter.tags.filter((tag: string) => tag !== cleanTag);
                        // Remove the tags property if array is now empty
                        if (frontmatter.tags.length === 0) {
                            delete frontmatter.tags;
                        }
                    } else if (frontmatter.tags === cleanTag) {
                        // Remove the single tag
                        delete frontmatter.tags;
                    }
                }
            });
            
            // Second, remove inline tags from file content
            const content = await this.app.vault.read(this.file);
            
            // Format the tag with hash prefix for inline removal
            const tagPattern = cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
            
            // Create regex to match exact tag (not nested variants)
            // Since tags only contain a-zA-Z0-9_-/, we only need to escape the forward slash
            const escapedTag = tagPattern.replace(/\//g, '\\/');
            const exactTagRegex = new RegExp(`${escapedTag}(?=\\s|$)`, 'g');
            
            // Remove all instances of the exact inline tag
            const updatedContent = content.replace(exactTagRegex, '').replace(/\n\s*\n\s*\n/g, '\n\n'); // Clean up extra newlines
            
            // Write the updated content back to the file (only if content changed)
            if (content !== updatedContent) {
                await this.app.vault.modify(this.file, updatedContent);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to remove tag:', error);
            return false;
        }
    }
    
    /**
     * Removes a tag and all its nested varieties from the actual file
     * 
     * Removes the tag and all nested varieties of the given tag from both the frontmatter 
     * metadata and inline content of the actual file. Removes all varieties of the nested tags.
     * For example: if the tag to remove is "school/subject" then "school/subject/maths"
     * as well as "school/subject/science" are also deleted.
     * 
     * @param tagToRemove - The root tag to remove along with all nested variants
     * @returns Promise<boolean> - Promise that resolves to success/failure
     * 
     * Used when: User wants to completely remove a tag branch, major tree restructuring
     */
    public async removeTagAllNested(tagToRemove: string): Promise<boolean> {
        try {
            // Clean the tag (remove # if present)
            const cleanTag = tagToRemove.startsWith('#') ? tagToRemove.slice(1) : tagToRemove;
            
            // First, remove from frontmatter using Obsidian API
            await this.app.fileManager.processFrontMatter(this.file, (frontmatter) => {
                if (frontmatter.tags) {
                    if (Array.isArray(frontmatter.tags)) {
                        // Remove the tag and all nested variants from the array
                        frontmatter.tags = frontmatter.tags.filter((tag: string) => 
                            !tag.startsWith(cleanTag) || (tag !== cleanTag && !tag.startsWith(cleanTag + '/'))
                        );
                        // Remove the tags property if array is now empty
                        if (frontmatter.tags.length === 0) {
                            delete frontmatter.tags;
                        }
                    } else if (typeof frontmatter.tags === 'string' && 
                              (frontmatter.tags === cleanTag || frontmatter.tags.startsWith(cleanTag + '/'))) {
                        // Remove the single tag if it matches or is nested
                        delete frontmatter.tags;
                    }
                }
            });
            
            // Second, remove inline tags from file content
            const content = await this.app.vault.read(this.file);
            
            // Format the tag with hash prefix for inline removal
            const tagPattern = cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
            
            // Create regex to match the tag and all nested variants
            // Since tags only contain a-zA-Z0-9_-/, we only need to escape the forward slash
            const escapedTag = tagPattern.replace(/\//g, '\\/');
            const nestedTagRegex = new RegExp(`${escapedTag}(?:\\/[a-zA-Z0-9_\\-\\/]*)?(?=\\s|$)`, 'g');
            
            // Remove all instances of the tag and its nested variants
            const updatedContent = content.replace(nestedTagRegex, '').replace(/\n\s*\n\s*\n/g, '\n\n'); // Clean up extra newlines
            
            // Write the updated content back to the file (only if content changed)
            if (content !== updatedContent) {
                await this.app.vault.modify(this.file, updatedContent);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to remove nested tags:', error);
            return false;
        }
    }
    
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
    public retrieveAllPaths(): string[] {
        try {
            // Get the cached metadata for this file
            const metadata = this.app.metadataCache.getFileCache(this.file);
            
            const allTags: string[] = [];
            
            // Extract all tags (both frontmatter and inline) from metadata
            if (metadata?.tags) {
                for (const tagCache of metadata.tags) {
                    // Remove the # prefix from tag names
                    const tagName = tagCache.tag.startsWith('#') ? tagCache.tag.slice(1) : tagCache.tag;
                    allTags.push(tagName);
                }
            }
            
            // Since metadata.tags already includes both frontmatter and inline tags,
            // we don't need to check frontmatter.tags separately
            return allTags;
        } catch (error) {
            console.error('Failed to retrieve all paths:', error);
            return [];
        }
    }
    
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
    public fileMetadata(): Record<string, any> {
        try {
            // Get the cached metadata for this file
            const metadata = this.app.metadataCache.getFileCache(this.file);
            
            if (metadata?.frontmatter) {
                return metadata.frontmatter;
            } else {
                return {};
            }
        } catch (error) {
            console.error('Failed to retrieve file metadata:', error);
            return {};
        }
    }
    
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
    public readInitial(): string {
        try {
            // For now, setting k = 200 characters as a reasonable preview length
            const k = 200;
            
            // Get the cached metadata to find where content starts
            const metadata = this.app.metadataCache.getFileCache(this.file);
            
            // Read the file synchronously (if possible) or return empty string
            // Note: In a real implementation, this might need to be async
            const cachedRead = this.app.vault.cachedRead(this.file);
            
            if (cachedRead instanceof Promise) {
                // If it's a promise, we can't handle it synchronously
                console.warn('File content not cached, returning empty preview');
                return '';
            }
            
            let content = cachedRead as string;
            
            // Remove frontmatter if present
            if (metadata?.frontmatter && content.startsWith('---')) {
                const frontmatterEnd = content.indexOf('---', 3);
                if (frontmatterEnd !== -1) {
                    content = content.substring(frontmatterEnd + 3);
                }
            }
            
            // Strip initial whitespace and newlines
            content = content.trim();
            
            // Return first k characters
            return content.length > k ? content.substring(0, k) + '...' : content;
        } catch (error) {
            console.error('Failed to read initial content:', error);
            return '';
        }
    }
}