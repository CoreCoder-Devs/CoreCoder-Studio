

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";
import Scaffold from "@/components/Scaffold.vue"
import BaseButton from "@/components/Generic/BaseButton.vue";
import Label from "@/components/Generic/Label.vue";
import ProjectButton from "@/components/ProjectButton.vue";
import { ProjectData, getAllProjects, ProjectType } from "@/modules/ProjectManager";
import path from "path";
export default defineComponent({
    // Insert your code here
    data() {
        return {
            projects: []
        }
    },
    methods: {
        refresh(){
        // Load all the projects
        // Optionally you can provide a boolean to load the non-dev files
        this.projects = getAllProjects("behavior") as [];
        }
    },
    mounted() {
        this.refresh();
    },
    components: {
        Scaffold,
        BaseButton,
        Label,
        ProjectButton
    }
});
</script>

<script setup lang="ts">
</script>

<!-- Template -->
<template>
    <Scaffold style="padding: 8px">
        <div class="topBar">
            <BaseButton type="primary">Create New</BaseButton>
            <BaseButton>Import</BaseButton>
            <BaseButton>Settings</BaseButton>
        </div>
        <h4>Projects</h4>
        <div class="project-container">
            <ProjectButton 
                v-for="item in $data.projects" 
                :project="(item as ProjectData)"
            ></ProjectButton>
        </div>
    </Scaffold>
    <img src="icon-noBG.svg" class="backdrop" />
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

