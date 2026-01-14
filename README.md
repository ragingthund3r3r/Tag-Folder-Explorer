# Tag Folder Plugin


A tag folder based explorer for obsidian. Uses the nested tags feature of obsidian to create virtual folders, thus allowing individual files to exist in multiple locations, inside a single vault.

So the idea is that generally i tend to store all my files on my computer in my "Downloads" folder. So its pretty much a mess. But the benefit is that all files are sorted in chronological order. On the other hand, I've tried sorting project specific files into their own nested folders, but the issue is that once you pt a file deep into a nested location, you instantly forget that file and that folder exists. 

This project is a balance between both.  It provides a virtual nested tag-based view so that each file can be added into multiple paths. At the same time, the classic obsidian sidebar already provides a great chronological view. 


## Nested Tags in Obsidian
Obsidian naturally uses a feature called nested tags in order to organize and allow graular branching among tags.

That means that if I have two tags named "orange" and "apple", I can place them under the same parent tag as "fruit/orange" and "fruit/apple". 

This is a great way to organize your tags, but Ive realized that although obsidian has a great system that handles nested tags, the tag explorer view is quite weak. 

Also at the same time nested tags can be used as a placeholder for traditional folder paths, thus allowing us to add multiple nested tags to a single file. That way a single file (if contains more than one nested tag), can be present in multiple "virtual" folders at the same time.


Since obsidian doesnt naturally have a file explorer, i considered that such a project would solve both the problems. It would create a scaffolding fro a traditional file explorer plugin, but more importanly leverage the nested tag feature of obsidian to boost the general useability of obsidian itself