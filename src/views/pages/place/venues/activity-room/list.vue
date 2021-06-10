<template>
    <div class="container pd15">
        <search class="mt15"></search>
        <Table></Table>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import search from './search.vue'
    import Table from './table.vue'
    @Component({
        components: {
            search,
            Table
        }
    })
    export default class list extends Vue {
    }
</script>

<style scoped lang="scss">
    .operate{
        position: fixed;
        bottom:100px;
        left:30%;
    }
</style>
