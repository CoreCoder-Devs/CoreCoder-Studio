<!-- Template -->
<template>
    <div class="shade" v-if="show" @click="clickShade">
        <div class="modal" @click="(e)=>{e.stopPropagation();}">
            <slot></slot>
        </div>
    </div>
</template>

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    // Insert your code here
    methods:{
        clickShade(){
            this.show = false;
        }
    },
    expose:["show"],
    data(){
        return {
            show: true
        };
    }
});
</script>

<!-- Styles -->
<style scoped>
.shade{
    position: absolute;
    left: 0; right: 0;
    top: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.486);
    display: flex;
    justify-content: center;
}
.modal{
    background-color: var(--color-background);
    padding: 32px;
    height: fit-content;
    margin: auto;
    border-radius: 4px;
    border: 1px solid var(--foreground-border);
    box-shadow: 2px 4px 8px black;

    display: flex;
    flex-direction: column;
}
</style>