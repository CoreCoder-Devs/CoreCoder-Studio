<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Options, Vue } from "vue-class-component";

import { CoreCoderWindow } from "@/CoreCoderWindow";
declare let window: CoreCoderWindow;
declare type TitleBarAction = "close" | "maximize" | "minimize";
export default defineComponent({
    props: {
        action: String as PropType<TitleBarAction>,
    },
    methods: {
        onClick(event: MouseEvent): void {
            window.ipcRenderer.send(this.action);
        },
    },
});
</script>
<template>
    <div class="titlebarbtn" @click="onClick"></div>
</template>
<style>
.titlebarbtn {
    width: 48px;
    height: 32px;
    -webkit-app-region: no-drag;
}

.titlebarbtn:hover {
    background-color: var(--color-button);
    transition: background-color 0.1s;
}

.titlebar > .titlebarbtn::after {
    width: 48px;
    height: 32px;
    left: 0px;
    content: " ";
    position: absolute;
    background-color: white;
    user-select: none;
    pointer-events: none;
}

.titlebar .closebtn::after {
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E")
        no-repeat 50% 50%;
}

.titlebar .titlebarbtn:hover.closebtn {
    background-color: rgb(212, 71, 71);
}

.titlebar .maximizebtn::after {
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E")
        no-repeat 50% 50%;
}

.titlebar .restorebtn::after {
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E")
        no-repeat 50% 50%;
}

.titlebar .minimizebtn::after {
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E")
        no-repeat 50% 50%;
}
</style>
