<template>
    <span class="tab">
        {{ data.name }}
    </span>
</template>

<script lang="ts">
interface EditorSidePanelTabData {
    name: string;
    label: string;
    component: string;
}

export default {
    props: {
        data: {
            type: Object as import("@vue/runtime-core").PropType<EditorSidePanelTabData>,
            required: true,
        },
    },
};
</script>

<style scoped>
.tab {
    display: inline-block;
    padding: 0.5rem;
    cursor: pointer;
    user-select: none;
    background: var(--background-secondary);
}

.tab:active {
    background: var(--background-tertiary);
    border-bottom: 2px solid var(--color-accent);
}
</style>
