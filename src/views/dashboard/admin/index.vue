<template>
    <div class="register-container">
      <article class="header">
        <header>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="login"></el-avatar>
          <h2 style="float:left;color: black;margin-left: 10px;">注册用户</h2>
        </header>
      </article>
      <section>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          autocomplete="off"
          :hide-required-asterisk="true"
          size="medium"
        >
          <div style="padding-top: 10px">
            <el-form-item label="用户名" prop="iphone">
              <el-col :span="10">
                <el-input
                  v-model="ruleForm.iphone"
                  placeholder="请输入手机号码后点击获取注册码"
                />
              </el-col>
              <el-button
                :loading="codeLoading"
                :disabled="isDisable"
                size="small"
                round
                style="background-color:#a2e043;"
                @click="sendMsg"
              >获取注册码</el-button>
  
              <span class="status">{{ statusMsg }}</span>
            </el-form-item>
            <el-form-item label="注册码" prop="code">
              <el-col :span="10">
                <el-input
                  v-model="ruleForm.code"
                  placeholder="请点击获取注册码按钮"
                />
              </el-col>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="ruleForm.role">
              <el-option label="用户" value="user"></el-option>
              <el-option label="管理员" value="admin"></el-option>
          </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-col :span="10">
                <el-input
                  v-model="ruleForm.mark"
                  placeholder="请输入备注信息"
                />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 40%"
                @click="register"
              >注册</el-button>
            </el-form-item>
          </div>
        </el-form>
      </section>
      <div class="error">{{ error }}</div>
      <div style="margin: 20px;">
        <el-button class="filter-item" type="success" icon="el-icon-s-flag" @click="fetchalluser()">
            刷新数据
          </el-button>
        <el-table
        v-loading="tacticLoading"
        :data="user_list"
        highlight-current-row
        stripe height="300"
        style="width: 85%;margin: 30px;"
      >
      <el-table-column label="序号" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
      <el-table-column label="用户名" width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录码" width="300px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余时间(天)" width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.viptime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>

        <el-table-column label="总收益" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.totalincome }}</span>
          </template>
        </el-table-column>

        <el-table-column label="上传时间" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.uptime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="open(scope.$index)">
            续费
          </el-button>
        </template>
        </el-table-column>
      </el-table>
      </div>
    </div>
  </template>
  
  <script>
  import { getRegCode,Register,Fetchalluser,UpdateVipTime} from '@/api/user'
  export default {
    name: 'Register',
    data() {
      return {
        statusMsg: '',
        error: '',
        isDisable: false,
        tacticLoading:true,
        codeLoading: false,
        user_list:[],
        ruleForm: {
          iphone: '',
          code: '',
          mark:'',
          role:'user'
        },
        rules: {
          iphone: [{
            required: true,
            pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            type: 'string',
            message: '请获取登陆码',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted(){
      this.fetchalluser()
    },
    methods: {
      open(index) {
        var day = this.user_list[index].viptime
        this.$prompt('请修改会员天数(原：'+day+'天)', this.user_list[index].name , {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          var temp = {user_id:1,data:{username:this.user_list[index].name,viptime:value}}
          UpdateVipTime(temp).then(
            this.user_list[index].viptime = value,
            this.$message({
            type: 'success',
            message: this.user_list[index].name+'的会员天数已修改为:' + value+'天'
          })
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
      },
      sendMsg: function() {
        const self = this
        let emailPass
        let timerid
        if (timerid) {
          return false
        }
        self.statusMsg = ''
        this.$refs['ruleForm'].validateField('iphone', (valid) => {
          emailPass = valid
        })
        // 向后台API验证码发送
        if (!emailPass) {
          self.codeLoading = true
          self.statusMsg = '登录码获取中...'
          getRegCode().then(res => {
            self.ruleForm.code = res.data.regcode
            self.codeLoading = false
            self.isDisable = false
            self.statusMsg = ''
          })
        }
      },
      // 用户注册
      register: function() {
        var temp = {user_id:12,data:{username:this.ruleForm.iphone,password:this.ruleForm.code,viptime:'31622400',role:this.ruleForm.role,ip:this.ruleForm.mark}}
        Register(temp).then(
          res=>{
            console.log(res)
            this.$message({
              showClose: true,
              message: '注册成功，请把登录码告诉用户',
              type: 'success'
            })
          }
        )
      },
      fetchalluser: function(){
        this.user_list = []
        Fetchalluser().then(
          res =>{
            console.log(res)
            for(var i =0;i<res.data.length;i++){
              this.user_list.push({
                id:res.data[i][0],
                name:res.data[i][1],
                password:res.data[i][2],
                role:res.data[i][3] == 'user'?'用户':'管理员',
                viptime:parseInt(parseInt(res.data[i][5])/86400),
                remark:new Date(parseInt(res.data[i][6]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' '),
                ip:res.data[i][7],
                totalincome:res.data[i][8],
                uptime:new Date(parseInt(res.data[i][9]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
              })
            }
            this.tacticLoading = false
          }
        )
      }
    }
  }
  </script>
  
  <style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
  $bg: #283443;
  $light_gray: rgb(0, 0, 0);
  $cursor: rgb(0, 0, 0);
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .register-container .el-input input {
      color: $cursor;
    }
  }
  /* reset element-ui css */
  .register-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 95%;
      input {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        -webkit-appearance: none;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      label {
        font-style: normal;
        font-size: 18px;
        color: $light_gray;
      }
    }
  }
  </style>
  
  <style lang="scss" scoped>
  $bg: #ffffff;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .register-container {
    margin: 20px;
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    .header {
      border-bottom: 2px solid rgb(235, 232, 232);
      min-width: 980px;
      color: #666;
      header {
        margin: 0 auto;
        padding: 10px 0;
        width: 980px;
        height: 80px;
        .login {
          margin-top: 10px;
          float: left;
        }
        .bold {
          font-style: normal;
          color: $light_gray;
        }
      }
    }
    > section {
      margin-left: 30%;
      padding-top: 30px;
      width: 980px;
      min-height: 300px;
      padding-right: 100px;
      box-sizing: border-box;
      .status {
        font-size: 12px;
        margin-left: 20px;
        color: #e6a23c;
      }
      .error {
        color: red;
      }
    }
    .tips {
      float: right;
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
  }
  </style>
  
  <style scoped>
  /* 修改验证器样式 */
  ::v-deep .el-form-item.is-error .el-input__inner {
    border-color: #053752;
  }
  ::v-deep .el-form-item.is-error .el-input__validateIcon {
    color: #889aa4;
  }
  ::v-deep .el-form-item__error {
    color: #e6a23c;
  }
  </style>