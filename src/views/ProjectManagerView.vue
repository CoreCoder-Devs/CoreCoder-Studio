

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";
import Scaffold from "@/components/Scaffold.vue"
import BaseButton from "@/components/Generic/BaseButton.vue";
import Label from "@/components/Generic/Label.vue";
import ProjectButton from "@/components/ProjectButton.vue";
import { ProjectData, getAllProjects, ProjectType } from "@/modules/ProjectManager";
import path from "path";
import Dialog from "@/components/Dialogs/Dialog.vue";
export default defineComponent({
    // Insert your code here
    data() {
        return {
            projects: []
        }
    },
    methods: {
        refresh() {
            // Load all the projects
            // Optionally you can provide a boolean to load the non-dev files
            this.projects = getAllProjects("behavior") as [];
        },
        showCreateDlg(){
            var dlg : any = this.$refs.createdlg;
            dlg.show = true;
        }
    },
    mounted() {
        this.refresh();
    },
    components: {
        Scaffold,
        BaseButton,
        Label,
        ProjectButton,
        Dialog
    }
});
</script>


<!-- Template -->
<template>
    <Scaffold style="padding: 8px">
        <div class="topBar">
            <BaseButton type="primary" @click="showCreateDlg">Create New</BaseButton>
            <BaseButton>Import</BaseButton>
            <BaseButton>Settings</BaseButton>
        </div>
        <h4>Projects</h4>
        <div class="project-container">
            <ProjectButton v-for="item in $data.projects" :project="(item as ProjectData)"></ProjectButton>
        </div>
    </Scaffold>
    <img src="icon-noBG.svg" class="backdrop" />

    <Dialog ref="createdlg">
        <h>What is a water?</h>
        <div style="display: flex; flex-direction: row; justify-content: center;">
            <BaseButton type="primary">Yes</BaseButton>
            <BaseButton>false</BaseButton>
            <BaseButton>bruh</BaseButton>
        </div>
    </Dialog>
</template>

<!-- Styles -->
<style scoped>
.topBar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.backdrop {
    position: absolute;
    width: 256px;
    height: 256px;
    right: 8px;
    bottom: 8px;
    opacity: 5%;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
}

.project-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    overflow-y: auto;
    height: 100%;
}
</style>

