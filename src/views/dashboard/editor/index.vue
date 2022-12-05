<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <pan-thumb :image="avatargif" style="float:left">
        角色信息:
        <!-- <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span> -->
        <span style="color:blue;" class="pan-info-roles">欢迎您：{{ name }}</span>
        <span style="color:blue;" class="pan-info-roles">剩余：{{ viptime }}小时</span>
        <span style="color:blue;" class="pan-info-roles">最近登录时间：{{ remark}}</span>
      </pan-thumb>
      <!-- <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" /> -->
      <div class="info-container">
        <!-- <span class="display_name">无限策略</span> -->
        <draggshort ref= 'drag'/>
      </div>
    </div>
    <div>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="configStatus==='create'?handleConfigCreate():handleConfigUpdate()">
            API管理
          </el-button>
          <el-button class="filter-item" type="success" icon="el-icon-s-flag" @click="chooseTacticVisible = true">
            添加币种
          </el-button>
    </div>

    <!-- Api管理 -->
    <el-dialog :title="configMap[configStatus]" :visible.sync="configFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 500px; margin-left:50px;">
        <el-form-item label="交易所" prop="station">
          <el-select v-model="temp.station" class="filter-item" placeholder="Please select">
            <el-option v-for="item in stationTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <p></p>
          <el-radio-group v-model="temp.flag">
            <el-radio :label="0">实盘</el-radio>
            <el-radio :label="1">模拟盘</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="api key" prop="api">
          <el-input v-model="temp.api" />
        </el-form-item>
        <el-form-item label="secret key" prop="secret">
          <el-input v-model="temp.secret" />
        </el-form-item>
        <el-form-item label="密码(passphrase)" prop="passphrase">
          <el-input v-model="temp.passphrase" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="configStatus==='create'?createConfigData():updateConfigData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 币种选择 -->
    <el-dialog :title="title" :visible.sync="chooseTacticVisible">
      <el-form ref="dataForm" label-position="left" label-width="150px" style="width: 300px; margin-left:50px;">
        <el-form-item label="币种" prop="name">
          <el-input v-model="tactic.symbol" />
        </el-form-item>
        <el-form-item label="方向">
          <el-select v-model="tactic.orientation">
            <el-option label="多" value="0"></el-option>
            <el-option label="空" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseTacticVisible= false">
          取消
        </el-button>
        <el-button type="primary" @click="addSymbol()">
          确认
        </el-button>
      </div>
    </el-dialog>
    
    <el-table
      v-loading="tacticLoading"
      :data="tactic_list"
      border
      highlight-current-row
      style="width:90%;margin: 10px;"
    >
    <el-table-column label="交易对" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.symbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方向" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orientation==0?'多':'空' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方式" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.way=='0'?'逆势':'顺势' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开启监控" width="200" align="center" >
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.choose_status"
              active-text="开启"
              inactive-text="暂停"
              :active-value="1"
              :inactive-value="0"
              @change="SubmitSmart(scope.$index)">
            </el-switch>
          </template>  
      </el-table-column>
      <el-table-column label="标记价格" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持仓张数" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.holdpiece }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓均价" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.openavg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未实现盈亏" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.noincome }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估强平价" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.estimate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="270" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.native="EditSmartTactic(scope.$index)" circle></el-button>
          <el-button type="primary" icon="el-icon-delete" @click.native="DeleteTactic(scope.$index)" circle></el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-drawer
      :title="drawer_title"
      :before-close="handleClose"
      :visible.sync="tacticdialog"
      direction="btt"
      size="70%"
      custom-class="demo-drawer">
      <el-collapse v-model="activeName" accordion style="margin:50px">
      <el-collapse-item title="智能模式" name="1">
          <el-card shadow="hover">
        <el-form>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="预算" :label-width="formLabelWidth">
                <el-input-number v-model="tactic.budget" controls-position="right" :step="1000" :min="12" style="width:180px"></el-input-number>
                <el-tag type="success">USDT</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="期望总间隔" :label-width="formLabelWidth">
                <div v-if="tactic.orientation == '0'">
                  <el-input-number v-model="tactic.wantpercent" controls-position="right" :step="1" :min="20" :max='99' style="width:180px"></el-input-number>
                  <el-tag type="danger">%</el-tag>
                </div>
                <div v-else>
                  <el-input-number v-model="tactic.wantpercent" controls-position="right" :step="1" :min="20"  style="width:180px"></el-input-number>
                  <el-tag type="danger">%</el-tag>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总间隔" :label-width="formLabelWidth">
                  <el-input v-model="caculate.totalgap" :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="方向" :label-width="formLabelWidth">
                  <el-select v-model="tactic.orientation" :disabled="true">
                    <el-option label="多" value="0"></el-option>
                    <el-option label="空" value="1"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="方式" :label-width="formLabelWidth">
                  <el-select v-model="tactic.way" placeholder="请选择方式" disabled>
                    <el-option label="逆势" value="0"></el-option>
                    <el-option label="顺势" value="1"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="单数" :label-width="formLabelWidth">
                  <el-input v-model="caculate.orders" :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-form-item label="张数" :label-width="formLabelWidth">
                  <el-input v-model="caculate.pieces" :disabled="true"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="策略类型" :label-width="formLabelWidth">
                  <el-select v-model="tactic.tactictype" placeholder="请选择类型">
                    <el-option label="平推" value="1"></el-option>
                    <el-option label="递增+1" value="2"></el-option>
                    <el-option label="递增+2" value="3"></el-option>
                    <el-option label="递增+3" value="4"></el-option>
                    <el-option label="递增+5" value="5"></el-option>
                    <el-option label="两倍投" value="6"></el-option>
                    <el-option label="叁倍投" value="7"></el-option>
                    <el-option label="平方" value="8"></el-option>
                    <el-option label="斐波那契" value="9"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="风险偏好" :label-width="formLabelWidth">
                  <el-select v-model="tactic.risktend" placeholder="请选择偏好">
                    <el-option label="保守-" value="1"></el-option>
                    <el-option label="保守" value="2"></el-option>
                    <el-option label="保守+" value="3"></el-option>
                    <el-option label="稳健-" value="4"></el-option>
                    <el-option label="稳健" value="5"></el-option>
                    <el-option label="稳健+" value="6"></el-option>
                    <el-option label="激进-" value="7"></el-option>
                    <el-option label="激进" value="8"></el-option>
                    <el-option label="激进+" value="9"></el-option>
                    
                  </el-select>
                </el-form-item>
            </el-col>
          
            <el-col :span="6">
                <el-form-item label="需要本金约" :label-width="formLabelWidth">
                  <el-input v-model="caculate.need" :disabled="true" style="width:180px;color:#000;"></el-input>
                  <el-tag type="success">USDT</el-tag>
                </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="尾单价" :label-width="formLabelWidth">
                  <el-input v-model="caculate.lastprice" style="width:180px" :disabled="true"></el-input>
                  <el-tag type="success">USDT</el-tag>
                </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click.native="UpdataSmart()">保存策略</el-button>
            </el-col>
            <el-col :span="2" :offset="20">
              <el-button type="primary" @click.native="tacticdialog = false" >取消策略</el-button>
            </el-col>
          </el-row>
        </el-form>
          </el-card>
      </el-collapse-item>
      <el-collapse-item title="专业模式（未开放）" name="2">
        <div>敬请期待</div>
      </el-collapse-item>
      <el-collapse-item title="策略库（未开放）" name="3">
        <div>敬请期待</div>
      </el-collapse-item>
      </el-collapse>
      </el-drawer>


    <!-- <div style="border:solid #000000 ; -top:100px;text-align: center;" >
    <img style = "width: 80%;height:90%;" src="@/assets/img/operate_measures.png"></img>
  </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import draggshort from '../components/carddrag-short'
import gif from '@/assets/img/giphy.gif'
import { fetchApiList, createApi, updateApi,addSmartTactic,fetchSmarttactic, UpdateSmartTactic,ComputeSmart,UpdateSmartStatus,DeleteUserTactic,GetHoldCC} from '@/api/index'
const stationTypeOptions = [
  { key: 'OKX', display_name: 'OKX' }
]
export default {
  name: 'DashboardEditor',
  components: { PanThumb,draggshort},
  data() {
    return {
      avatargif:gif,
      tacticdialog: false,
      activeName: '1',
      formLabelWidth: '100px',
      drawer_title: 'ABC',
      title:'添加币种',
      chooseTacticVisible:false,
      configFormVisible: false,
      configStatus: '',
      stationTypeOptions,
      tactic_list:[],
      nowid:0,
      tactic: {
        symbol: 'BTC',//BTC-USDT-SWAP
        budget:'0',
        orientation:'0',
        way:'0',
        tactictype:'1',
        risktend:'1',
        choose_status:'',
        price:'',
        holdpiece:'',
        openavg:'',
        noincome:'',
        estimate:'',
        wantpercent:'0'

      },
      temp: {
        station:'',
        api:'',
        secret:'',
        passphrase:'',
        flag:1
      },
      caculate:{
        orders:'xxx',
        totalgap:'xx%',
        pieces:'xxx',
        need:'xxxx',
        lastprice:'1111'
      },
      configMap: {
        update: '修改 API',
        create: '创建 API'
      },
      rules: {
        station: [{ required: true, message: 'exchange is required', trigger: 'change' }],
        api: [{ required: true, message: 'api key is required', trigger: 'change' }],
        secret: [{ required: true, message: 'secret key is required', trigger: 'change' }],
        passphrase: [{ required: true, message: 'passphrase is required', trigger: 'change' }]
      },
      tactic_list:[],
      tacticLoading:true,
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  mounted(){
    this.$message('收益将于10秒后显示......')
    this.getApi(this.uid)
    this.getSmartTactic()
    this.drawer_title = '策略设置[' + this.tactic.symbol + ']'
  },
  watch:{
    'tactic.wantpercent':{ // 对对象的某一个属性进行深度监听
      handler(nv) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.Comput()
        }, 500);   
      },
      immediate: true,
      deep: true
    },
    'tactic.budget': { // 对对象的某一个属性进行深度监听
      handler(nv) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.Comput()
        }, 500);   
      },
      immediate: true,
      deep: true
    },
    'tactic.tactictype': { // 对对象的某一个属性进行深度监听
      handler(nv) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.Comput()
        }, 500);   
      },
      immediate: true,
      deep: true
    },
    'tactic.risktend': { // 对对象的某一个属性进行深度监听
      handler(nv) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.Comput()
        }, 500);   
      },
      immediate: true,
      deep: true
    }
  },
  methods:{


    DeleteTactic(index){
      var temp = this.tactic_list[index]
      console.log(temp)
      if(String(temp.choose_status)=='1'){
        this.$message.error("请先停止对"+temp.symbol+"的监控再删除！")
      }else{
        this.tacticLoading = true
        var tmp = {'user_id':this.uid,'data':{flag:String(temp.flag),symbol:temp.symbol,orientation:temp.orientation}}
        DeleteUserTactic(tmp).then(response =>{
          this.$message({
              message: '删除成功！',
              type: 'success'
            })
          this.tacticLoading = false,
          this.tactic_list.splice(index, 1)}
          )
        this.tacticLoading = false
      }
    },
    SubmitSmart(index){
      var temp = this.tactic_list[index]
      var tmp = {'user_id':this.uid,'data':{tactictype:temp.tactictype,risktend:temp.risktend,thread_id:temp.thread_id,
        flag:String(temp.flag),symbol:temp.symbol,budget:temp.budget,orientation:temp.orientation,
        api_key:this.temp.api,secret_key:this.temp.secret,passphrase:this.temp.passphrase,wantpercent:temp.wantpercent,
        'status':String(temp.choose_status)}}

        this.tacticLoading = true,
        UpdateSmartStatus(tmp).then( response =>{
          this.$message({
          message: temp.symbol+'执行操作成功！',
          type: 'success'
        })
        this.tacticLoading = false
        console.log(this.tactic_list[index].choose_status)
        if(this.tactic_list[index].choose_status == '1'){
            this.tactic_list[index].timer = setInterval(() => {
                GetHoldCC({user_id:this.uid,data:{flag:String(temp.flag),api_key:this.temp.api,secret_key:this.temp.secret,passphrase:this.temp.passphrase,symbol:temp.symbol,orientation:temp.orientation}}).then(
                  response => {
                  this.tactic_list[index].price = response.data[0]
                  this.tactic_list[index].holdpiece =  response.data[1]
                  this.tactic_list[index].openavg = response.data[2]
                  this.tactic_list[index].noincome = response.data[3]
                  this.tactic_list[index].estimate = response.data[4]
                }
                )
              }, 1000 * 4);
            }
        else{
          clearInterval(this.tactic_list[index].timer)
          this.tactic_list[index].timer = null
          this.tactic_list[index].holdpiece = '0'
          this.tactic_list[index].openavg = '0'
          this.tactic_list[index].noincome = '0'
          this.tactic_list[index].estimate = '0'
        }
      }
      ).catch(
        error => {
          this.tacticLoading = false
          this.tactic_list[index].choose_status = '0'
          this.$message.error(temp.symbol+'执行操作失败！')
        }
      )
    },
    Comput(){
      var tmp = {user_id:this.uid,data:{tactictype:this.tactic.tactictype,risktend:this.tactic.risktend,
        flag:String(this.temp.flag),symbol:this.tactic.symbol,budget:this.tactic.budget,orientation:this.tactic.orientation,
        api_key:this.temp.api,secret_key:this.temp.secret,passphrase:this.temp.passphrase,wantpercent:this.tactic.wantpercent}}
      ComputeSmart(tmp).then(response => {
        if(response.data.length>0){
          this.caculate.totalgap = response.data[0].totalgap+'%'
          this.caculate.orders = response.data[0].orders
          this.caculate.pieces = response.data[0].pieces
          this.caculate.need = response.data[0].need
          this.caculate.lastprice = response.data[0].lastprice
        }
      })
    },
    UpdataSmart(){
      if(String(this.tactic.choose_status)=='1'){
        this.$message.error("请先停止对"+this.tactic.symbol+"的监控再删除！")
      } else{
          var tmp = {user_id:this.uid,orientation:this.tactic.orientation,flag:this.tactic.flag,symbol:this.tactic.symbol,data:{tactictype:this.tactic.tactictype,risktend:this.tactic.risktend,wantpercent:this.tactic.wantpercent,budget:this.tactic.budget}}
          console.log(tmp)
          UpdateSmartTactic(tmp).then(() => {
            this.tactic_list[this.nowid].orientation = this.tactic.orientation
            this.tactic_list[this.nowid].flag =this.tactic.flag
            this.tactic_list[this.nowid].symbol= this.tactic.symbol
            this.tactic_list[this.nowid].tactictype = this.tactic.tactictype
            this.tactic_list[this.nowid].risktend = this.tactic.risktend
            this.tactic_list[this.nowid].budget = this.tactic.budget
            this.tactic_list[this.nowid].wantpercent = this.tactic.wantpercent

            this.$notify({
                  title: 'Success',
                  message: '策略修改成功！',
                  type: 'success',
                  duration: 2000
                })
            setTimeout(() => {
              this.tacticdialog =false
            }, 1.5 * 1000)
          })         
      }
    },
    EditSmartTactic(index){
      this.tacticdialog = true
      var temp = this.tactic_list[index]
      this.tactic.budget = temp.budget
      this.tactic.wantpercent = temp.wantpercent
      this.tactic.orientation = temp.orientation
      this.tactic.way = temp.way
      this.tactic.risktend = temp.risktend
      this.tactic.tactictype = temp.tactictype
      this.tactic.symbol = temp.symbol
      this.drawer_title = '策略设置[' + this.tactic.symbol + ']'
      this.tactic.flag = String(temp.flag)
      this.tactic.choose_status = temp.choose_status
      this.nowid = index
    },
    addSymbol(){
      if (this.tactic_list.length==5){
        this.$message.error('已超出5个币种的上限，请先删除币种再添加！')
        this.chooseTacticVisible = false
      }else{
        var temp = {
        'user_id':this.uid,
        'symbol':this.tactic.symbol,
        'orientation':this.tactic.orientation,
        'flag': String(this.temp.flag),
        'data':{a:1}
      }
      addSmartTactic(temp).then(() => {
        this.$notify({
              title: 'Success',
              message: '添加币种成功！',
              type: 'success',
              duration: 2000
            })
        this.chooseTacticVisible = false
        setTimeout(() => {
        this.getSmartTactic()
        }, 0.5 * 1000)
      })
      }
     
    },
    createConfigData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var tmp = {
            id:0,
            user_id:this.uid,
            api_key:this.temp.api,
            secret_key:this.temp.secret,
            passphrase:this.temp.passphrase,
            flag:String(this.temp.flag)
          }
          console.log(tmp)
          createApi(tmp).then(() => {
            this.configFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建API成功！',
              type: 'success',
              duration: 2000
            })
            this.$refs.drag.flag = this.temp.flag
            this.$refs.drag.api_key = this.temp.api
            this.$refs.drag.secret_key = this.temp.secret
            this.$refs.drag.passphrase = this.temp.passphrase
            // this.getUserTactic()
          })
        }
      })
    },
    handleConfigUpdate() {
      // this.temp = Object.assign({}, row) // copy obj
      this.configStatus = 'update'
      this.configFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateConfigData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          var tmp = {
            id:0,
            user_id:this.uid,
            api_key:this.temp.api,
            secret_key:this.temp.secret,
            passphrase:this.temp.passphrase,
            flag:String(this.temp.flag)
          }
          console.log('config:')
          console.log(tmp)
          updateApi(tmp).then(() => {
            
            this.configFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改API成功！',
              type: 'success',
              duration: 2000
            })
            this.$refs.drag.flag = this.temp.flag
            this.$refs.drag.api_key = this.temp.api
            this.$refs.drag.secret_key = this.temp.secret
            this.$refs.drag.passphrase = this.temp.passphrase
            // this.getUserTactic()
          })
        }
      })
    },
    handleConfigCreate() {
      this.configStatus = 'create'
      this.configFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getApi(uid){
      fetchApiList({
        user_id:uid,
        api_key:'',
        secret_key:'',
        passphrase:'',
        flag:''
      }).then(
        response => {
        this.configStatus = 'update'
        this.temp.station = response.data[0].station
        this.temp.api = response.data[0].api_key
        this.temp.secret = response.data[0].secret_key
        this.temp.passphrase = response.data[0].passphrase
        this.temp.flag =  Number(response.data[0].flag)

        this.$refs.drag.user_id = this.uid
        this.$refs.drag.flag = this.temp.flag
        this.$refs.drag.api_key = this.temp.api
        this.$refs.drag.secret_key = this.temp.secret
        this.$refs.drag.passphrase = this.temp.passphrase
      }
      ).catch(error => {
        this.configStatus = 'create'
        this.configFormVisible = true
        this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      })
    },
    handleClose() {
      this.tacticdialog = false
    },
    getSmartTactic(){
      this.tacticLoading = true
      this.tactic_list = []
      console.log('GetSmartTactic')
      var tmp = {user_id:this.uid,flag:String(this.temp.flag)}
      fetchSmarttactic(tmp).then(response => {
        console.log(response.data.length)
        for (var i=0;i<response.data.length;i++){
          this.tactic_list.push({
            symbol: response.data[i].symbol,
            orientation:response.data[i].orientation,
            flag:response.data[i].flag,
            budget:response.data[i].budget,
            way:response.data[i].way,
            tactictype:response.data[i].tactictype,
            risktend:response.data[i].risktend,
            thread_id:response.data[i].thread_id,
            wantpercent:response.data[i].wantpercent,
            choose_status:Number(response.data[i].status),
            price:'0',
            holdpiece:'0',
            openavg:'0',
            noincome:'0',
            estimate:'0',
            timer:null,
          })
          this.QueryHold(i)
        }
        
      })
      setTimeout(() => {
          this.tacticLoading = false
        }, 0.5 * 1000)
    },
    QueryHold(index){        
      console.log(this.tactic_list[index].choose_status)
      if(this.tactic_list[index].choose_status == 1){
            var temp = this.tactic_list[index]
            this.tactic_list[index].timer = setInterval(() => {
                GetHoldCC({user_id:this.uid,data:{flag:String(temp.flag),api_key:this.temp.api,secret_key:this.temp.secret,passphrase:this.temp.passphrase,symbol:temp.symbol,orientation:temp.orientation}}).then(
                  response => {
                  this.tactic_list[index].price = response.data[0]
                  this.tactic_list[index].holdpiece =  response.data[1]
                  this.tactic_list[index].openavg = response.data[2]
                  this.tactic_list[index].noincome = response.data[3]
                  this.tactic_list[index].estimate = response.data[4]
                }
                )
              }, 1000 * 4);
          }
    }
  },
  computed: {
    ...mapGetters([
      'uid',
      'name',
      'avatar',
      'roles',
      'viptime',
      'status',
      'remark',
    ])
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
