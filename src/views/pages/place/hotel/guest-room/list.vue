<template>
    <div class="container pd15">
        <Head></Head>
        <search class="mt15"></search>
        <Table></Table>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import Head from './head.vue'
    import search from './search.vue'
    import Table from './table.vue'
    @Component({
        components: {
            Head,
            search,
            Table
        }
    })
    export default class list extends Vue {
    }
</script>

<style scoped lang="scss">

</style>
