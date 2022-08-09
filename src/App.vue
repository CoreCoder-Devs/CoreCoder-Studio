<template>
    <!-- <img alt="Vue logo" src="./assets/logo.svg" /> -->
    <TitleBar></TitleBar>
    <ComponentTest></ComponentTest>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ComponentTest from "./views/ComponentTest.vue";
import TitleBar from "./components/TitleBar.vue";

@Options({
    components: {
        TitleBar,
        ComponentTest,
    },
    props: {
        // ipc: remote.ipcMain
    },
})
export default class App extends Vue {}
</script>

<style>
:root {
    --color-background: rgb(30, 30, 30);
    --color-accent: rgb(25, 223, 78);
    --color-accent-lighter: rgb(87, 255, 132);
    --color-textcolor: rgb(255, 255, 255);

    --color-button: rgb(65, 65, 65);
    --color-titlebar: rgb(15, 15, 15);
}

#app {
    color: var(--color-background);
    font-size: 10pt;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>
