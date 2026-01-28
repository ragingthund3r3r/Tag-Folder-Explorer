import { TFile, App } from 'obsidian';
import type { IFileLeaf } from './interfaces';

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
    private tagpath: string;
    private file: TFile;
    private app: App;
    
    // ==================== CONSTRUCTOR ====================
    
    /**
     * Creates new FileLeaf object with the given name and path
     * 
     * @param name - The name of the file
     * @param path - The relative path of the file in the vault
     * @param tagpath - The tag path associated with the file
     * @param file - The TFile reference of the actual file
     * @param app - The Obsidian App instance for API access
     * 
     * Used when: Building the tree structure from vault scan, adding new files to tree
     */
    constructor(name: string, path: string, tagpath: string, app: App) {
        this.name = name;
        this.path = path;
        this.tagpath = tagpath;
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
     * Gets the tag path associated with the file
     *
     * @returns string - The tag path associated with the file
     * 
     * Used when: Displaying tag paths in UI, tag-based lookups, tree navigation
     */
    public getTagPath(): string {
        return this.tagpath;
    }

    /**
     * Edits/updates the name of the file
     * 
     * @param newName - The new filename to set
     * 
     * Used when: Renaming files, file management operations
     */
    public editFileName(newName: string): void {
        this.name = newName;
    }

    /**
     * Edits/updates the path of the file
     * 
     * @param newPath - The new relative path of the file in the vault
     * 
     * Used when: Moving files, reorganizing vault structure
     */
    public editPath(newPath: string): void {
        this.path = newPath;
    }

    /**
     * Edits/updates the tag path associated with the file
     * 
     * @param newTagPath - The new tag path to associate with the file
     * 
     * Used when: Retagging files, updating file categorization
     */
    public editTagPath(newTagPath: string): void {
        this.tagpath = newTagPath;
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
     * Retrieves the file's creation and modification timestamps
     * 
     * Returns an object containing the file's creation date (ctime) and
     * modification date (mtime) as stored by Obsidian. These are Unix timestamps
     * in milliseconds.
     * 
     * @returns object - Object with ctime and mtime properties
     * 
     * Used when: Displaying file timestamps, sorting by date, file metadata display
     */
    public fileObsCreateModDate(): { ctime: number; mtime: number } {
        return {
            ctime: this.file.stat.ctime,
            mtime: this.file.stat.mtime
        };
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