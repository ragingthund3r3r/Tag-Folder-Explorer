import { App, TFile, TFolder } from 'obsidian';
import { ITagNode, IFileLeaf } from './interfaces';
import { FileLeaf } from './FileLeaf';
import * as fs from 'fs';
import * as path from 'path';

/**
 * TagNode class - represents tag nodes in the hierarchical tag tree
 * 
 * TagNode objects form the core skeleton of the tree structure. They represent individual
 * tags or nested tag segments and maintain parent-child relationships to create the
 * hierarchical tag tree. Files (FileLeaf objects) are attached to these nodes based
 * on their tag paths.
 */
export class TagNode implements ITagNode {
    // ==================== PROPERTIES ====================
    
    /**
     * The name of the tag that this node represents
     * Multiple nodes may have the same name since they are nested at different
     * locations and under different parents (e.g., "math" under both "school/math" and "hobby/math")
     */
    private name: string;
    
    /**
     * The nested path of tags till now, including this node's tag name
     * Represents the full tag path from root to this node (e.g., "subject/math")
     */
    private path: string;
    
    /**
     * A pointer to the parent object of this node
     * Points to the parent TagNode. If this is the root node, this property is null.
     */
    private parent: ITagNode | null;
    
    /**
     * A dictionary of TagNode objects that are children of this node
     * Keyed by the names of individual tags that exist under this TagNode as children
     */
    private children: Record<string, ITagNode>;
    
    /**
     * A set of FileLeaf objects present under this tag path
     * Contains every file that has this nested tag path in it (guaranteed unique)
     */
    private files: Set<IFileLeaf>;
    
    /**
     * Reference to the Obsidian App instance for file operations
     * Used for metadata file operations and vault access
     */
    private app: App;
    
    // ==================== CONSTRUCTOR ====================
    
    /**
     * Creates a new TagNode object with the given name, path, and parent
     * 
     * Initializes a new TagNode with the specified properties. Children and files
     * set are left empty on initialization and populated as needed.
     * 
     * @param name - The name of this tag node
     * @param path - The full nested tag path to this node
     * @param parent - The parent TagNode object, or null if this is root
     * @param app - The Obsidian App instance for file operations
     */
    constructor(name: string, path: string, parent: ITagNode | null, app: App) {
        this.name = name;
        this.path = path;
        this.parent = parent;
        this.children = {};
        this.files = new Set<IFileLeaf>();
        this.app = app;
        
        // Automatically create metadata file for this node
        this.createNewMeta();
    }
    

    // ==================== CREATE METHODS ====================

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
    addChildNode(newChildTagName: string): boolean {
        try {
            // Validate the child tag name
            if (!newChildTagName || newChildTagName.trim() === '') {
                return false;
            }
            
            const childName = newChildTagName.trim();
            
            // Check if child already exists
            if (this.children[childName]) {
                return false; // Child already exists
            }
            
            // Create the child path
            const childPath = this.path === '' ? childName : this.path + '/' + childName;
            
            // Create new child node
            const childNode = new TagNode(childName, childPath, this, this.app);
            
            // Add to children dictionary
            this.children[childName] = childNode;
            
            return true;
        } catch (error) {
            console.error('Error adding child node:', error);
            return false;
        }
    }

    /**
     * Creates a new FileLeaf object under this Tag Node and adds it to the files set
     * 
     * Instantiates a new FileLeaf with the provided name and path, then adds it
     * to this node's files set.
     * 
     * @param nameOfFile - The name of the file to create
     * @param pathToFile - The path to the file in the vault
     * @returns boolean - true if successful, false otherwise
     * 
     * Used when: Adding files to tag locations, building tree from vault scan
     */
    createNewFile(nameOfFile: string, pathToFile: string): boolean {
        try {
            // Validate inputs
            if (!nameOfFile || !pathToFile || nameOfFile.trim() === '' || pathToFile.trim() === '') {
                return false;
            }
            
            // Check if file already exists in this node
            if (this.getFile(nameOfFile)) {
                return false; // File already exists
            }
            


            // Create FileLeaf instance and add it to this node
            const fileLeaf = new FileLeaf(nameOfFile.trim(), pathToFile.trim(), this.path, this.app);
            this.files.add(fileLeaf);
            
            return true;
        } catch (error) {
            console.error('Error creating new file:', error);
            return false;
        }
    }
    
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
    createNewMeta(): boolean {
        try {
            const metadataPath = this.getMetadataFilePath();
            
            // Check if metadata file already exists
            if (fs.existsSync(metadataPath)) {
                return false; // File already exists
            }
            
            // Ensure .TagNodeMeta folder exists
            const metaFolderPath = path.dirname(metadataPath);
            if (!fs.existsSync(metaFolderPath)) {
                fs.mkdirSync(metaFolderPath, { recursive: true });
            }
            
            // Create initial metadata content with YAML frontmatter
            const initialContent = `---
path: "${this.path}"
name: "${this.name}"
created: "${new Date().toISOString()}"
modified: "${new Date().toISOString()}"
description: |-
  TagNode Metadata for ${this.name}
  This file contains metadata for the TagNode at path: \`${this.path}\`
legend: |-
  - 🔴, label one
  - 🟠, label two
  - 🟡, label three
  - 🟢, label four
  - 🔵, label five
  - 🟣, label six
---

`;
            
            // Create the metadata file
            fs.writeFileSync(metadataPath, initialContent, 'utf8');
            
            return true;
        } catch (error) {
            console.error('Error creating metadata file:', error);
            return false;
        }
    }




    // ==================== READ METHODS ====================
    
    /**
     * Gets the name of the node object and returns it
     * 
     * @returns string - The name of this tag node
     * 
     * Used when: Display operations, node identification, tree traversal
     */
    getName(): string {
        return this.name;
    }
    
    /**
     * Gets the path of the node object and returns it
     * 
     * @returns string - The full nested tag path to this node
     * 
     * eg if the folder name is "math" and its parent is "subject", the path is "subject/math"
     * 
     * Used when: Path display, breadcrumb generation, node location identification
     */
    getPath(): string {
        return this.path;
    }
    
    /**
     * Gets the parent of the node object and returns it
     * 
     * @returns ITagNode | null - The parent TagNode object, or null if this is root
     * 
     * Used when: Tree traversal upward, path reconstruction, parent operations
     */
    getParent(): ITagNode | null {
        return this.parent;
    }
    
    /**
     * Gets all children of the node object and returns them
     * 
     * @returns Record<string, ITagNode> - Dictionary of all child TagNode objects
     * 
     * Used when: Tree traversal downward, displaying child tags, tree expansion
     */
    getChildren(): Record<string, ITagNode> {
        return this.children;
    }
    
    /**
     * Gets a specific child of the node object with a given name and returns it
     * 
     * @param nameOfChild - The name of the child node to retrieve
     * @returns ITagNode | null - The child TagNode object, or null if not found
     * 
     * Used when: Navigating to specific child, checking child existence, targeted operations
     */
    getChild(nameOfChild: string): ITagNode | null {
        return this.children[nameOfChild] || null;
    }
    
    /**
     * Gets all the files of the node object and returns them
     * 
     * @returns Set of all FileLeaf objects under this node
     * 
     * Used when: Displaying files under tag, file listing, content operations
     */
    getFiles(): Set<IFileLeaf> {
        return this.files;
    }
    
    /**
     * Gets a specific file of the node object with a given name and returns it
     * 
     * @param nameOfFile - The name of the file to retrieve
     * @returns IFileLeaf | null - The FileLeaf object, or null if not found
     * 
     * Used when: Finding specific file, file operations, targeted file access
     */
    getFile(nameOfFile: string): IFileLeaf | null {
        for (const file of this.files) {
            if (file.getName() === nameOfFile) {
                return file;
            }
        }
        return null;
    }
    
    
    /**
     * Generates the absolute file system path for this TagNode's metadata file
     * 
     * Creates the full path using the convention: {vault_path}/.TagNodeMeta/{path_with_underscores}_{base64_encoded_path}.md
     * For example, path "subject/math" becomes "{vault}/.TagNodeMeta/subject_math_c3ViamVjdC5tYXRo.md"
     * 
     * @returns string - The absolute file system path to the metadata file
     */
    private getMetadataFilePath(): string {
        // Get the vault's base path from the app
        const vaultPath = (this.app.vault.adapter as any).basePath || '';
        
        // Replace / with _ for human-readable part
        const humanReadablePath = this.path.replace(/\//g, '_');
        
        // Base64 encode the original path
        const base64Path = btoa(this.path);
        
        // Combine both parts with underscore separator and .md extension
        const filename = `${humanReadablePath}_${base64Path}.md`;
        
        // Return absolute path
        return path.join(vaultPath, '.TagNodeMeta', filename);
    }
    

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
    readMeta(): Record<string, any> {
        try {
            const metadataPath = this.getMetadataFilePath();
            
            // Check if metadata file exists
            if (!fs.existsSync(metadataPath)) {
                return {}; // File doesn't exist, return empty object
            }
            
            // Read file content
            const fileContent = fs.readFileSync(metadataPath, 'utf8');
            
            // Extract YAML frontmatter
            const yamlMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
            if (!yamlMatch) {
                return {}; // No YAML frontmatter found
            }
            
            const yamlContent = yamlMatch[1];
            
            // Parse frontmatter supporting scalars, block scalars, and block lists
            function parseFrontmatter(yaml: string): Record<string, any> {
                const result: Record<string, any> = {};
                if (!yaml) return result;

                const lines = yaml.split('\n');
                let i = 0;
                while (i < lines.length) {
                    const line = lines[i];
                    // skip empty lines
                    if (/^\s*$/.test(line)) { i++; continue; }

                    // block list (key:) followed by indented - items
                    const listKeyMatch = line.match(/^(\w[\w-]*):\s*$/);
                    if (listKeyMatch) {
                        const key = listKeyMatch[1];
                        const items: string[] = [];
                        i++;
                        while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
                            const item = lines[i].replace(/^\s*-\s+/, '').trim();
                            items.push(item.replace(/^"|"$/g, ''));
                            i++;
                        }
                        result[key] = items;
                        continue;
                    }

                    // block scalar (key: | or key: |-) followed by indented lines
                    const blockMatch = line.match(/^(\w[\w-]*):\s*\|[-]?\s*$/);
                    if (blockMatch) {
                        const key = blockMatch[1];
                        i++;
                        const blockLines: string[] = [];
                        while (i < lines.length && /^(\s+).*/.test(lines[i])) {
                            // remove leading indentation (at least one space)
                            blockLines.push(lines[i].replace(/^\s{1,}/, ''));
                            i++;
                        }
                        result[key] = blockLines.join('\n');
                        continue;
                    }

                    // single-line scalar
                    const scalarMatch = line.match(/^(\w[\w-]*):\s*(?:"([^"]*)"|'([^']*)'|([^#].*))?$/);
                    if (scalarMatch) {
                        const key = scalarMatch[1];
                        const val = scalarMatch[2] ?? scalarMatch[3] ?? (scalarMatch[4] ? scalarMatch[4].trim() : '');
                        result[key] = val;
                        i++;
                        continue;
                    }

                    // If none matched, skip the line
                    i++;
                }
                return result;
            }
            
            return parseFrontmatter(yamlContent);
        } catch (error) {
            console.error('Error reading metadata file:', error);
            return {};
        }
    }    



    // ==================== UPDATE METHODS ====================
    
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
    renameNode(newName: string): boolean {
        try {
            // Validate the new name
            if (!newName || newName.trim() === '') {
                return false;
            }
            
            // Update the name
            this.name = newName.trim();
            
            // Reconstruct the path with the new name
            if (this.parent) {
                this.path = this.parent.getPath() + '/' + this.name;
            } else {
                this.path = this.name;
            }
            
            return true;
        } catch (error) {
            console.error('Error renaming node:', error);
            return false;
        }
    }
    
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
    editPath(newPath: string): boolean {
        try {
            // Validate the new path
            if (!newPath || newPath.trim() === '') {
                return false;
            }
            
            // Extract the name from the path (last segment after final '/')
            const pathSegments = newPath.trim().split('/');
            const extractedName = pathSegments[pathSegments.length - 1];
            
            if (!extractedName) {
                return false;
            }
            
            // Update both path and name
            this.path = newPath.trim();
            this.name = extractedName;
            
            return true;
        } catch (error) {
            console.error('Error editing path:', error);
            return false;
        }
    }
    

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
    updateMeta(payload: Record<string, any>): boolean {
        try {
            const metadataPath = this.getMetadataFilePath();
            
            // Check if metadata file exists
            if (!fs.existsSync(metadataPath)) {
                return false; // File doesn't exist
            }
            // Read full file and extract frontmatter + body
            const fileContent = fs.readFileSync(metadataPath, 'utf8');
            const fmMatch = fileContent.match(/^(---\n[\s\S]*?\n---)\n*/);
            let existingFm = '';
            let body = '';
            if (fmMatch) {
                existingFm = fmMatch[1];
                body = fileContent.slice(fmMatch[0].length);
            }

            const fmInner = existingFm ? existingFm.replace(/^---\n/, '').replace(/\n---$/, '') : '';

            // Simple frontmatter parser supporting:
            // - single-line scalars: key: "value" or key: value
            // - block scalars: key: |-\n  line\n  line
            // - block lists: key:\n  - item1\n  - item2
            function parseFrontmatter(yaml: string): Record<string, any> {
                const result: Record<string, any> = {};
                if (!yaml) return result;

                const lines = yaml.split('\n');
                let i = 0;
                while (i < lines.length) {
                    const line = lines[i];
                    // skip empty lines
                    if (/^\s*$/.test(line)) { i++; continue; }

                    // block list (key:) followed by indented - items
                    const listKeyMatch = line.match(/^(\w[\w-]*):\s*$/);
                    if (listKeyMatch) {
                        const key = listKeyMatch[1];
                        const items: string[] = [];
                        i++;
                        while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
                            const item = lines[i].replace(/^\s*-\s+/, '').trim();
                            items.push(item.replace(/^"|"$/g, ''));
                            i++;
                        }
                        result[key] = items;
                        continue;
                    }

                    // block scalar (key: | or key: |-) followed by indented lines
                    const blockMatch = line.match(/^(\w[\w-]*):\s*\|[-]?\s*$/);
                    if (blockMatch) {
                        const key = blockMatch[1];
                        i++;
                        const blockLines: string[] = [];
                        while (i < lines.length && /^(\s+).*/.test(lines[i])) {
                            // remove leading indentation (at least one space)
                            blockLines.push(lines[i].replace(/^\s{1,}/, ''));
                            i++;
                        }
                        result[key] = blockLines.join('\n');
                        continue;
                    }

                    // single-line scalar
                    const scalarMatch = line.match(/^(\w[\w-]*):\s*(?:"([^"]*)"|'([^']*)'|([^#].*))?$/);
                    if (scalarMatch) {
                        const key = scalarMatch[1];
                        const val = scalarMatch[2] ?? scalarMatch[3] ?? (scalarMatch[4] ? scalarMatch[4].trim() : '');
                        result[key] = val;
                        i++;
                        continue;
                    }

                    // If none matched, skip the line
                    i++;
                }
                return result;
            }

            const existingData = parseFrontmatter(fmInner);

            // Merge payload into existingData
            for (const [key, incoming] of Object.entries(payload)) {
                const existing = existingData[key];

                // Normalize incoming to either array or scalar/string
                const incomingVal = Array.isArray(incoming) ? incoming.slice() : incoming;

                if (existing === undefined) {
                    // property doesn't exist -> create
                    existingData[key] = incomingVal;
                    continue;
                }

                // If existing is array
                if (Array.isArray(existing)) {
                    const toAdd = Array.isArray(incomingVal) ? incomingVal : [incomingVal];
                    const merged = existing.concat(toAdd).map(String);
                    // dedupe
                    existingData[key] = Array.from(new Set(merged));
                    continue;
                }

                // If existing is string
                if (typeof existing === 'string') {
                    if (Array.isArray(incomingVal)) {
                        // convert existing string to array and merge
                        existingData[key] = Array.from(new Set([existing].concat(incomingVal.map(String))));
                    } else {
                        // append incoming to existing string separated by newline
                        const incStr = incomingVal === null || incomingVal === undefined ? '' : String(incomingVal);
                        if (incStr === '') {
                            // nothing to append
                            existingData[key] = existing;
                        } else if (existing.includes(incStr)) {
                            existingData[key] = existing; // avoid exact duplicate append
                        } else {
                            existingData[key] = existing + '\n' + incStr;
                        }
                    }
                    continue;
                }

                // Fallback: replace
                existingData[key] = incomingVal;
            }

            // Serialize frontmatter
            function serializeFrontmatter(obj: Record<string, any>): string {
                const lines: string[] = [];
                for (const [k, v] of Object.entries(obj)) {
                    if (Array.isArray(v)) {
                        lines.push(`${k}:`);
                        for (const item of v) {
                            // quote items that contain special chars or leading/trailing spaces
                            const s = String(item);
                            lines.push(`  - ${s}`);
                        }
                    } else if (typeof v === 'string' && v.includes('\n')) {
                        lines.push(`${k}: |-`);
                        for (const l of v.split('\n')) {
                            lines.push(`  ${l}`);
                        }
                    } else if (typeof v === 'string') {
                        // scalar string
                        const s = v.replace(/"/g, '\\"');
                        lines.push(`${k}: "${s}"`);
                    } else if (v === null || v === undefined) {
                        lines.push(`${k}: ""`);
                    } else {
                        // numbers, booleans
                        lines.push(`${k}: ${String(v)}`);
                    }
                }
                return lines.join('\n');
            }

            const newFmInner = serializeFrontmatter(existingData);
            const newFm = `---\n${newFmInner}\n---\n\n`;

            // Write back file preserving body
            fs.writeFileSync(metadataPath, newFm + body, 'utf8');

            return true;
        } catch (error) {
            console.error('Error updating metadata file:', error);
            return false;
        }
    }
    


    // ==================== DELETE METHODS ====================
    
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
    removeChildNode(childTagName: string): boolean {
        try {
            // Check if child exists
            if (!this.children[childTagName]) {
                return false; // Child doesn't exist
            }
            
            // Get the child node
            const childNode = this.children[childTagName];
                        
            // Remove from children dictionary
            delete this.children[childTagName];

            childNode.deleteMeta();
            
            return true;
        } catch (error) {
            console.error('Error removing child node:', error);
            return false;
        }
    }
    

    /**
     * Given a filename, removes the FileLeaf object from this node
     * 
     * Searches for the file with the specified name in the files set and
     * removes it from this node.
     * 
     * @param fileName - The name of the file to remove
     * @returns boolean - true if successful, false otherwise
     * 
     * Used when: File deletion, tag removal from files, tree maintenance
     */
    removeFile(fileName: string): boolean {
        try {
            // Find the file with the matching name
            for (const file of this.files) {
                if (file.getName() === fileName) {
                    // Remove the file from the set
                    this.files.delete(file);
                    return true;
                }
            }
            
            return false; // File not found
        } catch (error) {
            console.error('Error removing file:', error);
            return false;
        }
    }
   
    
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
    deleteMeta(): boolean {
        try {
            const metadataPath = this.getMetadataFilePath();
            
            // Check if metadata file exists
            if (!fs.existsSync(metadataPath)) {
                return false; // File doesn't exist
            }
            
            // Delete the metadata file
            fs.unlinkSync(metadataPath);
            
            return true;
        } catch (error) {
            console.error('Error deleting metadata file:', error);
            return false;
        }
    }
    

}