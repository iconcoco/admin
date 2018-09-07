<template>
    <div class="pagination" v-if="total>0">

        <div class="p-container clearfix">
             <template v-if="total>15">
                <a href="javascript:;" class="pre" v-if="current!=1" @click="bindchosepage(current-1)">上一页</a>

                <!-- 如果当前的页码距离靠前 -->
                <template v-if="current<=8">
                     <a v-for="n in current" :key="n" @click="bindchosepage(n)"  :class="{active:n==current}" href="javascript:;">{{n}}</a>
                     <span>...</span>
                    <a href="javascript:;" @click="bindchosepage(total-2)">{{total-2}}</a>
                    <a href="javascript:;" @click="bindchosepage(total-1)">{{total-1}}</a>
                    <a href="javascript:;" @click="bindchosepage(total)">{{total}}</a>
                </template>

                <!-- 如果当前页码在中间 -->
                <template v-if="current>8&&total-current>=5">
                    <a v-for="n in 4" :key="n" href="javascript:;">{{n}}</a>
                    <span>...</span>
                    <a href="javascript:;"  @click="bindchosepage(current-1)">{{current-1}}</a>
                    <a href="javascript:;" class="active" @click="bindchosepage(current)">{{current}}</a>
                    <a href="javascript:;" @click="bindchosepage(current+1)">{{current+1}}</a>
                    <span>...</span>
                     <a href="javascript:;" @click="bindchosepage(total-2)">{{total-2}}</a>
                    <a href="javascript:;" @click="bindchosepage(total-1)">{{total-1}}</a>
                    <a href="javascript:;" @click="bindchosepage(total)">{{total}}</a>

                </template>

                <!-- 如果当前的页码比较靠后 -->
                <template v-if="total-current<5">
                     <a v-for="n in 5" :key="n" href="javascript:;" @click="bindchosepage(n)">{{n}}</a>     
                     <span>...</span>                  
                    <a href="javascript:;" v-for="n in atLast" :key="n" @click="bindchosepage(n)" :class="{active:n==current}">{{n}}</a>
                </template>

                <a href="javascript:;" class="next" @click="bindchosepage(current+1)" v-if="current!=total">下一页</a>
            </template>

            <template v-else>
                <template v-if="total==1">
                    <a href="javascript:;" class="pre">上一页</a>
                    <a class="active" href="javascript:;">1</a>
                    <a href="javascript:;" class="next">下一页</a>
                </template>
                
                <template v-else>
                    <a href="javascript:;" class="pre"  v-if="current!=1" @click="bindchosepage(current-1)">上一页</a>
                    <a v-for="n in total" :key="n" :class="{active:n==current}"  @click="bindchosepage(n)" href="javascript:;">{{n}}</a>
                    <a href="javascript:;" class="next"  @click="bindchosepage(current+1)"  v-if="current!=total">下一页</a>
                </template>
                
            </template>
        </div>

        <div class="jumper">
            <el-button type="warning" @click="jumpToPage" plain>跳到</el-button>
            <el-input v-model="jump" placeholder=""></el-input>
            <label>页</label>
        </div>
      
    </div>
</template>

<script>

    /**
     * 分页组件
     * author:lcx
     * 641616451@qq
     * 组件参数：
     *      page :当前页码
     *      count:页码总数
     *      chosefallback:点击页码之后的函数，接收一个页码参数；
     */
    export default{
        data(){
            return{
                current:'',
                total:'',
                jump:'1',
                atLast:[]
            }
        },
        props:{
            'page':{
                required: true
            },
            'count':{
                required: true
            },
            'chosefallback':{
                required: true
            }
            
        },
        created() {
            this.current = Number(this.page);
            this.total   = Number(this.count);
            

            if(this.total>15&&(this.total-this.current<5)){
                this.atLast =[];
                for(let i = (this.current-1);i<=this.total;i++){
                     this.atLast.push(i);
                }
            }
        },
        watch:{
            page(n){
                this.current = Number(n);

                if(this.total>15&&(this.total-this.current<5)){
                    this.atLast =[];
                    for(let i = (this.current-1);i<=this.total;i++){
                        this.atLast.push(i);
                    }
                }
            },
            count(n){
                this.total = Number(n);
            }
        },
        methods:{
            bindchosepage(val){
                if(val == this.current) return;
                this.chosefallback(val);
            },
            jumpToPage(){

                if(this.jump > this.total) return;
                if(this.jump == this.current) return;
                this.chosefallback(this.jump);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-input,
    .el-button{
        vertical-align: top;
        height: 34px;
        line-height: 34px;
    }

    .el-input{
         width: 50px;
    }

    label{
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        color: #666;
        vertical-align: top;
    }



    // .el-input{
    //     width: 50px;
    //     height: 28px;
    //     line-height: 28px;
    // }

    .pagination{
        display: block;
        text-align: center;
        background-color: #fff;
        position: relative;
        .p-container{
            display: inline-block;
        }
        .jumper{
            position: absolute;
            top: 0;
            right: 0;
        }
        a:hover{
            background-color: #eee;
            // font-weight: bold;
        }
        a.active{
            color: #fff;
            border-color: #1890ff;
            background-color: #1890ff;
        }

        a,span{
            display: inline-block;
            width: 34px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border:1px solid #ddd;
            background-color: #fafafa;
            color: #666;
            float: left;
            margin-left: -1px;
            font-size: 14px;
        }

        span{
            background-color: #fff;
            border: 0;
            margin-left: 0px;
        }
        .pre{
            width: auto;
            padding: 0 10px; 
            border-radius: 4px 0 0 4px;
        }
        .next{
            width: auto;
            padding: 0 10px;
             border-radius: 0  4px  4px 0;
        }
    }

</style>

