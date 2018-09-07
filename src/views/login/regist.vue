<template>
    <div class="regist-container">
        <div class="banner">
            <el-form :model="form">
            
                <div class="regist-logo"></div>
                <!-- 用户名 -->
                <el-form-item name="userCode">
                    <el-input name="userCode" v-model="form.userCode" placeholder="账号"></el-input>
                </el-form-item>

                <el-form-item name="userName">
                    <el-input name="userName" v-model="form.userName" placeholder="用户名"></el-input>
                </el-form-item>

                <el-form-item name="phone">
                    <el-input name="phone" v-model="form.phone"  @blur="bindIptblur('phone')" placeholder="手机号码"></el-input>
                </el-form-item>

                <el-form-item name="email">
                    <el-input name="email" v-model="form.email" @blur="bindIptblur('email')" placeholder="邮箱"></el-input>
                </el-form-item>

                <el-form-item name="password">
                    <el-input type="password" name="password" @blur="bindIptblur('password')"  v-model="form.pwssword" placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item name="confirmpsw">
                    <el-input  type="password" name="confirmpsw" @blur="bindIptblur('confirmpsw')"  v-model="form.confirmpsw" placeholder="确认密码"></el-input>
                </el-form-item>

                <el-button @click="submitForm" type="warning">立即注册</el-button>

                <router-link class="fr" to="/login">使用已有账号登录</router-link>
            </el-form>
        </div>
    </div>
</template>

<script>

    import { register } from '../../utils/axios/api.js';

    import VERIFICATION from './../../utils/verfication.js';

    export default{
        data(){
            return{
                form:{
                   userCode:'', 
                   userName:'', 
                   phone:'', 
                   email:'', 
                   password:'', 
                   confirmpsw:'', 
                }
            }
        },
        methods:{
            //重置填写的表单
            reset(){
                for (const key in this.form) {
                    this.form[key] = '';
                }
            },
            //立即注册按钮
            submitForm(){
                let m = ['phone','email','password'];

               let flag = m.every(i=>{
                    return VERIFICATION(i,this.form[i]);
                });

                if(!flag) return;

                if(!(this.form.confirmpsw == this.form.pwssword)) return this.$massage.error(`两次输入密码不一致`);

                register(this.form).then(res=>{
                    if(res.code==0){
                        this.reset();
                        this.$message.success(`注册成功！`);
                        let _this = this;
                        setTimeout(()=>{
                            _this.$router.push({name:'login'});
                        },2000);
                    }else{
                        this.$message.error(res.msg);
                    }

                });
            },
             bindIptblur(name){
                if(name.toLocaleUpperCase() == 'CONFIRMPSW'){
                    if(!(this.form.confirmpsw == this.form.pwssword)) return this.$message.error(`两次输入密码不一致`);
                }
                else{
                    VERIFICATION(name,this.form[name]);
                }
            },
        }
    }

</script>


<style lang="scss" scoped>
    .regist-container{
        width: 100%;
        height: 100%;
        background: url('../../image/login/loginBg.png') no-repeat center center fixed;
    }

    .el-form{
        position: absolute;
        width: 300px;
        left: 50%;
        top:20%;
        margin-left: -150px;
        background-color: #fff;
         border-radius: 8px;
        padding: 10px;
        box-shadow: 0 0 5px 5px rgba(0,0,0,.2);

        a{
            color: #409EFF;
            margin-top: 20px;
        }

        .el-button{
            width: 100%;
        }

        .regist-logo{
            margin: 20px auto;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: url('../../image/login/icon.jpg') no-repeat center center;
            background-size: 100% 100%;
        }
    }
</style>

