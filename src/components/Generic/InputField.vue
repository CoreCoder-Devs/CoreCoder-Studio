<!-- 
    Input field
    Basic input field with validator and limitting
    todo: character limit
 -->
<!-- Template -->
<template>
    <div class="inputfield">
        <a>{{ $props.label }}</a>
        <input type="text" :placeholder="$props.defaultValue"/>
    </div>
</template>

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    // Insert your code here
    props: {
        validator: Function,
        label: String,
        defaultValue: String
    }
});
</script>

<!-- Styles -->
<style scoped>
.inputfield {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 8px;
}

.inputfield > a{
    font-size: 8pt;
    color: var(--color-textcolor-secondary);
}

.inputfield > input{
    background-color: var(--color-textfield);
    outline: none;
    border: none;
    color: var(--color-textcolor-secondary);
    outline: 1px solid var(--color-border);
    padding: 8px;
    /* border-radius: 4px; */
}
.inputfield > input:focus{
    outline: 1px solid var(--color-accent);
    color: var(--color-textcolor);
}
</style>