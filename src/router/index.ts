import ComponentTest from "@/views/ComponentTest.vue";
import ProjectManagerViewVue from "@/views/ProjectManagerView.vue";
import EditorView from "@/views/EditorView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Project Manager",
            component: ProjectManagerViewVue
        },
        {
            path: "/editor",
            name: "Editor",
            component: EditorView
        },
        {
            path: "/comptest",
            name: "comptest",
            component: ComponentTest,
        }
    ],
});

export default router;
