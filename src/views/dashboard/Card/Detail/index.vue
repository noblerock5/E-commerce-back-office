<template>
    <div>
        <div class="card-header">
            <span>{{title}}</span>
            <svg t="1668931949603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3433"
                width="16" height="16">
                <path
                    d="M633.173333 763.605333h-85.162666V359.509333A35.968 35.968 0 0 0 512 323.498667H416a35.968 35.968 0 1 0 0 72.021333h59.989333v368.085333H390.826667a35.968 35.968 0 1 0 0 72.021334h242.432a35.968 35.968 0 1 0 0-72.021334zM476.032 224.512a36.010667 36.010667 0 1 0 72.021333 0 36.010667 36.010667 0 0 0-72.021333 0z"
                    fill="#2c2c2c" opacity=".65" p-id="3434"></path>
            </svg>
        </div>
        <div class="card-content">{{count}}</div>
        <div class="card-charts">
            <!-- 用具名插槽玩一下,起个名就叫name吧 -->
            <slot name="charts"></slot>
        </div>
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: ['title', 'count']
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    color:#d9d9d9;
    font-size: 12px;
}
.card-content{
    font-size: 30px;
    padding:  10px 0px;
}
.card-charts {
    height: 150px;
}
.card-footer {
    border-top: 1px solid #eee;
    padding-top: 10px ;
}
</style>