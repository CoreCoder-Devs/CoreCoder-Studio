<!-- Template -->
<template>
    <div>EditorView</div>
    <BaseButton @click="goHome">Back</BaseButton>
    <a>{{project.name}}</a>
</template>

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";
import BaseButton from "@/components/Generic/BaseButton.vue";
import CoreCoder from "@/modules/CoreCoder";
import { ProjectData } from "@/modules/ProjectManager";

export default defineComponent({
    components: { BaseButton },
    methods:{
        goHome(){
            this.$router.push("/");
        }
    },
    data(){
        return {
            project : (CoreCoder.currentProject as ProjectData)
        };
    },
    mounted(){
    }
});
</script>

<!-- Styles -->
<style scoped>
</style>