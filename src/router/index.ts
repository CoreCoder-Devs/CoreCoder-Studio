import ComponentTest from "@/views/ComponentTest.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/comptest",
            name: "comptest",
            component: ComponentTest,
        },
    ],
});

export default router;
