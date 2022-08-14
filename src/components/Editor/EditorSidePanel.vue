<template>
    <div>
        <EditorSidePanelTab v-for="tab in tabs" :key="tab.name" :data="tab" />
    </div>
</template>

<script>
import EditorSidePanelTab from "./EditorSidePanelTab.vue";
import EditorSidePanelTab1 from "./EditorSidePanelViews/EditorSidePanelTab1.vue";
import EditorSidePanelTab2 from "./EditorSidePanelViews/EditorSidePanelTab2.vue";

export default {
    components: {
        EditorSidePanelTab,
    },
    data: function () {
        return {
            tabs: [
                {
                    name: "tab1",
                    label: "Tab 1",
                    component: EditorSidePanelTab1,
                },
                {
                    name: "tab2",
                    label: "Tab 2",
                    component: EditorSidePanelTab2,
                },
            ],
        };
    },
};
</script>

<style></style>
