module.exports = {
    SidePanel: {
        name: 'side-panel',
        template: `
            <div style="display: flex; flex-direction: row">
                <div class="sidebar" id="sidebar" style="height: 100%">
                    <!- TODO: Sidebar->
                    <!- Create SidebarButton Component->
                    <!- Refactor the following buttons to using the component->
                    <div class="sidebarbtn" id="sidebar-filebrowser" onclick="openSidePanel('fileBrowser',this);">File Explorer
                    </div>
                    <div class="sidebarbtn" id="sidebar-git" onclick="openSidePanel('github',this);">Git</div>
                    <div class="sidebarbtn" id="sidebar-todo" onclick="openSidePanel('todo',this);">Todo</div>
            
                    <div style="flex-grow: 1;"></div>
                    <div class="sidebarbtn" onclick="window.location = './project-manager.html'"><i class="fas fa-home"></i></div>
                    
                    
                </div>
            
                <div class="sidebar-panel" id="sidePanel" style="display: none">
                    <!- TODO: SidebarPanel->
                    <!- Add data to have content of this change dynamically->
                    
                    <div id="fileBrowser" style="max-height: 100%">
            
                    <!- TODO: FileBrowser->
                    <!- Refactor into own component->
                        <div class="filebrowserheader" id="filebrowserheader">
                            <div id="fbHeaderBP" onclick="openFileBrowser(0);" class="filebrowserheader-item selected">BP</div>
                            <div id="fbHeaderRP" onclick="openFileBrowser(1);" class="filebrowserheader-item">RP</div>
                        </div>
            
                        <div id="filebrowsercontent"
                            style="position:  absolute;overflow-y: auto;top: 37px;bottom: 0;width: calc(var(--var-side-width) - 32px);">
                        </div>
            
                    </div>
            
                    <div id="github"></div>
            
                    <div id="todo"></div>
            
                </div>
            
            </div>
`
    }
}