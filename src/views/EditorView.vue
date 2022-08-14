<!-- Template -->
<template>
    <div>
        <EditorSidePanel />
    </div>
</template>

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";
import EditorSidePanel from "@/components/Editor/EditorSidePanel.vue";

export default defineComponent({
    name: "EditorView",
    props: {},
    methods: {},
    components: { EditorSidePanel }
});
</script>

<!-- Styles -->
<style></style>
