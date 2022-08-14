import ComponentTest from "@/views/ComponentTest.vue";
import EditorViewVue from "@/views/EditorView.vue";
import ProjectManagerViewVue from "@/views/ProjectManagerView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "projectmanager",
            component: ProjectManagerViewVue,
        },
        {
            path: "/comptest",
            name: "comptest",
            component: ComponentTest,
        },
        {
            path: "/editor",
            name: "editor",
            component: EditorViewVue,
        },
    ],
});

export default router;
