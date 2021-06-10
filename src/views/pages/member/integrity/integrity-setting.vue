<template>
    <div class="member-system-tabs">
        <Tabs :animated="false" v-model="tabValue">
            <TabPane label="诚信等级" name="level">
                <Level/>
            </TabPane>
            <TabPane label="诚信行为" name="task">
                <Task/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';

    import Level from './level.vue';
    import Task from './task.vue'

    @Component({
        components: {
            Level,
            Task
        }
    })
    export default class MemberSetting extends Vue {
        tabValue = 'level';

        created() {
            // 判断是否有参数name
            if (this.$route.query.name) {
                this.tabValue = this.$route.query.name as string;
            }
        }
    }
</script>
<style lang="scss">
    .member-system-tabs {
        .ivu-tabs-bar {
            padding: 0 15px 15px;
            border-bottom: 8px solid $grayDark;
        }
    }
</style>
<style lang='scss' scoped>
    .member-system-tabs {
        padding-top: 15px;
    }
</style>
