<!-- Template -->
<template>
    <TitleBar></TitleBar>
    <ProjectManagerView></ProjectManagerView>
</template>

<!-- Script -->
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ComponentTest from "./views/ComponentTest.vue";
import TitleBar from "./components/TitleBar/TitleBar.vue";
import ProjectManagerView from "@/views/ProjectManagerView.vue";

@Options({
    components: {
        TitleBar,
        ComponentTest,
        ProjectManagerView
    },
    props: {
        // ipc: remote.ipcMain
    },
})
export default class App extends Vue {}
</script>

<!-- Style -->
<style>
:root {
    --color-background: rgb(30, 30, 30);
    --color-border: rgb(69, 69, 69);
    --color-accent: rgb(25, 223, 78);
    --color-accent-lighter: rgb(87, 255, 132);
    --color-textcolor: rgb(255, 255, 255);
    --color-textcolor-secondary: rgb(169, 169, 169);

    --color-button: rgb(52, 52, 52);
    --color-button-hover: rgb(65, 65, 65);
    --color-button-active: rgb(40, 40, 40);
    --color-titlebar: rgb(15, 15, 15);
    --color-textfield: rgb(15, 15, 15);

    --gradient-accent: linear-gradient(
        90deg,
        rgba(25, 193, 76, 1) 0%,
        rgba(2, 190, 115, 1) 100%
    );
    --gradient-accent-lighter: linear-gradient(
        90deg,
        rgba(60, 225, 119, 1) 0%,
        rgba(31, 200, 154, 1) 100%
    );
    --gradient-accent-darker: linear-gradient(
        90deg,
        rgba(17, 161, 60, 1) 0%,
        rgba(3, 116, 71, 1) 100%
    );

    --background-primary: #111111;
    --background-secondary: #1a1a1a;
    --background-tertiary: #222222;
    --foreground-primary: rgb(218, 213, 213);
    --foreground-secondary: rgb(165, 165, 165);
    --foreground-border: rgb(56, 56, 56);
    --blue: #18488f;
    --red: #8a1010;
    --yellow: #a56023;
    --green: #068606;
}

#app {
    color: var(--color-textcolor);
    font-size: 10pt;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* overflow:hidden; */

    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
}

*{
    user-select: none;
    -webkit-user-drag: none;
}
</style>
