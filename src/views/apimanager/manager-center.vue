<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="configStatus==='create'?handleConfigCreate():handleConfigUpdate()">
        API管理
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-s-flag" @click="chooseTacticVisible = true">
        策略管理
      </el-button>
    </div>
<!--选择策略-->
    <el-dialog :title="selecttactic_title" :visible.sync="chooseTacticVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 500px; margin-left:50px;">
        <el-form-item label="策略名" prop="name">
          <el-select v-model="tactic.tactic_name" class="filter-item" placeholder="Please select">
            <el-option v-for="item in tacticOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="模拟盘实盘选择">
          <el-select v-model="tactic.flag" placeholder="请选择实盘或者模拟盘">
            <el-option label="模拟盘" value="1"></el-option>
          <el-option label="实盘" value="0"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="币种" prop="name">
          <el-input v-model="tactic.symbol" />
        </el-form-item>
        <el-form-item label="说明" prop="name">
        <h3>如果币种已有策略则执行的是修改操作，如果没有，则执行的是创建的操作</h3>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseTacticVisible= false">
          取消
        </el-button>
        <el-button type="primary" @click="getTactic()">
          确认
        </el-button>
      </div>
    </el-dialog>

<!--编辑策略-->
    <el-drawer
      title="策略编辑"
      :before-close="handleClose"
      :visible.sync="tacticdialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      
      >
      <div class="demo-drawer__content" >
        <el-form>
        <el-form-item label="策略名" :label-width="formLabelWidth">
          <el-input v-model="tactic.tactic_name" :disabled="true"></el-input>
        </el-form-item>
        <div v-if="tactic.tactic_name == '云方一号'">

        <el-form-item label="盘选择" :label-width="formLabelWidth">
        <el-select v-model="tactic.flag" placeholder="请选择实盘或者模拟盘">
          <el-option label="模拟盘" value="1"></el-option>
          <el-option label="实盘" value="0"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="做多价格上限" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_long_up" controls-position="right" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="做多价格下限" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_long_down" controls-position="right" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="做空价格上限" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_short_up" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="做空价格下限" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_short_down" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="开多张数" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.open_long_piece" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="开空张数" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.open_short_piece" :precision="0" :step="1" ></el-input-number>
        </el-form-item>
        <el-form-item label="加多百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.add_long_percent"  :step="0.001" ></el-input-number>
        </el-form-item>
        <el-form-item label="加空百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.add_short_percent"  :step="0.001"></el-input-number>
        </el-form-item>
        <el-form-item label="平多百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.level_long_percent"  :step="0.001"></el-input-number>
        </el-form-item>
        <el-form-item label="平空百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.level_short_percent"  :step="0.001"></el-input-number>
        </el-form-item>
        <el-form-item label="盈利金额平多" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_profit_level_long"  :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="盈利金额平空" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_profit_level_short"  :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="总盈利平多空" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_total_profit_level_long_short" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="总均价平单百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_total_avg" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="可用保证金风控比例" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.valid_manage_risk_percent" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="保证金维持率限制" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.limit_sustain_rate":step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="多张数限制" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.long_piece_limit" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="空张数限制" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.short_piece_limit" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="加单价格方式选择" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.choose_add_price_way" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="加单张数方式选择" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.choose_add_piece_way" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="设定重复次数" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.number_repetitions" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="翻倍" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.double" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="阈值" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.threshold" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="平推张数" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.flat_piece" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="计数阈值" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.count_threshold" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="设置时间间隔" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.time_gap" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="设置涨跌百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.set_rise_fall_rate" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="追踪启动百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.trace_start_rate" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="追踪回调百分比" :label-width="formLabelWidth">
          <el-input-number v-model="tactic.trace_callback_rate" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="识别号" :label-width="formLabelWidth">
          <el-input v-model="tactic.identify_id"></el-input>
        </el-form-item>
        <el-form-item label="策略备注" :label-width="formLabelWidth">
          <el-input v-model="tactic.tactic_mark"></el-input>
        </el-form-item>
        </div>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="UpdateTactic()" :loading="loading">{{ loading ? '提交中 ...' : '保存' }}</el-button>
        </div>
      </div>
    </el-drawer>

     <el-table
      v-loading="tacticLoading"
      :data="tactic_list"
      border
      highlight-current-row
      style="width: 80%;"
    >
    <el-table-column label="币种" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.symbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="策略备注" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tactic_mark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="策略名" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tactic_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一键启动" width="250" align="center" >
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.choose_status"
              active-text="开启"
              inactive-text="暂停"
              :active-value="true"
              :inactive-value="false"
              @change="SubmitTactic(scope.$index)">
            </el-switch>
          </template>  
      </el-table-column>
      <el-table-column label="操作" width="250" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.native="EditUserTactic(scope.$index)" circle></el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 

    </el-table> -->
      <!--

      <el-table-column label="操作时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实时保证金" width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleConfigUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.money }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.open }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="策略操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleConfigUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            保存
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->

<!--api设置-->
    <el-dialog :title="configMap[configStatus]" :visible.sync="configFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 500px; margin-left:50px;">
        <el-form-item label="交易所" prop="station">
          <el-select v-model="temp.station" class="filter-item" placeholder="Please select">
            <el-option v-for="item in stationTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="api key" prop="api">
          <el-input v-model="temp.api" />
        </el-form-item>
        <el-form-item label="secret key" prop="secret">
          <el-input v-model="temp.secret" />
        </el-form-item>
        <el-form-item label="passphrase" prop="passphrase">
          <el-input v-model="temp.passphrase" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="configStatus==='create'?createConfigData():updateConfigData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchApiList, createApi, updateApi, fetchTactic, updateTactic, fetchUsertactic,updataUsetTactic } from '@/api/article'

const stationTypeOptions = [
  { key: 'OKX', display_name: 'OKX' }
]
const tacticOptions = [
  { key: '云方一号', display_name: '云方一号' }
]
export default {
  name: 'ComplexTable',
  data() {
    return {
      tactic_list:[],
      tactic_info_list:null,
      tacticdialog: false,
      loading: false,
      tacticLoading: true,
      stationTypeOptions,
      tacticOptions,
      formLabelWidth: '150px',
      timer: null,
      tactic: {
        user_id:'',
        flag:'',
        tactic_name: '云方一号',
        tactic_mark: '',
        set_long_up: '',
        set_long_down: '',
        set_short_up: '',
        set_short_down: '',
        open_long_piece: '',
        open_short_piece: '',
        add_long_percent: '',
        add_short_percent: '',
        level_long_percent: '',
        level_short_percent: '',
        set_profit_level_long: '',
        set_profit_level_short: '',
        set_total_profit_level_long_short: '',
        set_total_avg: '',
        valid_manage_risk_percent: '',
        limit_sustain_rate: '',
        long_piece_limit: '',
        short_piece_limit: '',
        choose_add_price_way: '',
        choose_add_piece_way: '',
        double: '',
        threshold: '',
        flat_piece: '',
        count_threshold: '',
        time_gap: '',
        set_rise_fall_rate: '',
        trace_start_rate: '',
        trace_callback_rate: '',
        symbol: '',
        identify_id: '',
        number_repetitions: '',
      },
      temp_tactic: {
        user_id:'',
        flag:'',
        tactic_name: '马丁',
        tactic_mark: '',
        set_long_up: '',
        set_long_down: '',
        set_short_up: '',
        set_short_down: '',
        open_long_piece: '',
        open_short_piece: '',
        add_long_percent: '',
        add_short_percent: '',
        level_long_percent: '',
        level_short_percent: '',
        set_profit_level_long: '',
        set_profit_level_short: '',
        set_total_profit_level_long_short: '',
        set_total_avg: '',
        valid_manage_risk_percent: '',
        limit_sustain_rate: '',
        long_piece_limit: '',
        short_piece_limit: '',
        choose_add_price_way: '',
        choose_add_piece_way: '',
        double: '',
        threshold: '',
        flat_piece: '',
        count_threshold: '',
        time_gap: '',
        set_rise_fall_rate: '',
        trace_start_rate: '',
        trace_callback_rate: '',
        symbol: '',
        identify_id: '',
        number_repetitions: '',
      },
      temp: {
        station:'',
        api:'',
        secret:'',
        passphrase:''
      },
      configFormVisible: false,
      chooseTacticVisible: false,
      configStatus: '',
      configMap: {
        update: 'Edit API',
        create: 'Create API'
      },
      selecttactic_title:'请选择策略',
      rules: {
        station: [{ required: true, message: 'exchange is required', trigger: 'change' }],
        api: [{ required: true, message: 'api key is required', trigger: 'change' }],
        secret: [{ required: true, message: 'secret key is required', trigger: 'change' }],
        passphrase: [{ required: true, message: 'passphrase is required', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'uid',
      'name'
    ])
  },
  mounted() {
    this.getApi(this.uid)
    this.getUserTactic()
    setTimeout(() => {
          this.tacticLoading = false
        }, 0.5 * 1000)
    console.log(this.tactic_list)
  },
  methods: {
    EditUserTactic(index){
      var temp = this.tactic_list[index]
      this.tactic.tactic_name = temp.tactic_name
      this.tactic.symbol = temp.symbol
      this.tactic.flag = '0'
      this.getTactic()
    },
    getUserTactic(){
      this.tactic_list = []
      console.log('GetUserTactic')
      var tmp = {user_id:this.uid,tactic_name:this.tactic.tactic_name,symbol:this.tactic.symbol,flag:'0'}
      fetchUsertactic(tmp).then(response => {
        console.log(response.data.length)
        for (var i=0;i<response.data.length;i++){
          this.tactic_list.push({
            symbol: response.data[i].symbol,
            tactic_mark:response.data[i].tactic_mark,
            tactic_name:response.data[i].tactic_name,
            thread_id:response.data[i].thread_id,
            status:response.data[i].status,
            choose_status:response.data[i].status=='1'?true:false
          })
        }
        console.log('tmp1')
        console.log(this.tactic_list)
      })
    },
    SubmitTactic(index){
      var tmp = this.tactic_list[index]
      console.log('tmp2'+tmp)
      var tmpusertactic = {user_id:this.uid,tactic_name:tmp.tactic_name,symbol:tmp.symbol,status:tmp.choose_status==true?'0':'1',thread_id:tmp.thread_id}
      updataUsetTactic(tmpusertactic).then(
        this.tacticLoading = true,
            setTimeout(() => {
                this.getUserTactic()
                this.tacticLoading = false
                this.$notify({
                  title: 'Success',
                  message: 'Update Successfully',
                  type: 'success',
                  duration: 2000
                })
              }, 1 * 1000),
            
      )
    },
    getApi(uid){
      fetchApiList({
        id:0,
        user_id:uid,
        api_key:'',
        secret_key:'',
        passphrase:'',
      }).then(
        response => {
        this.configStatus = 'update'
        this.temp.station = response.data[0].station
        this.temp.api = response.data[0].api_key
        this.temp.secret = response.data[0].secret_key
        this.temp.passphrase = response.data[0].passphrase
      
        console.log('OK!')
      }
      ).catch(error => {
        this.configStatus = 'create'
        this.configFormVisible = true
        this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      })
    },
    getTactic() {
      this.tacticLoading = true
      var tmp = {user_id:this.uid,tactic_name:this.tactic.tactic_name,symbol:this.tactic.symbol,flag:this.tactic.flag}
      console.log('teee')
      console.log(tmp)
      fetchTactic(tmp).then(response => {
        this.tactic_info_list = response.data,
        this.tactic.user_id = this.tactic_info_list.user_id,
        this.tactic.flag = this.tactic_info_list.flag,
        this.tactic.tactic_name = this.tactic_info_list.tactic_name,
        this.tactic.tactic_mark = this.tactic_info_list.tactic_mark,
        this.tactic.set_long_up = this.tactic_info_list.set_long_up,
        this.tactic.set_long_down = this.tactic_info_list.set_long_down,
        this.tactic.set_short_up = this.tactic_info_list.set_short_up,
        this.tactic.set_short_down = this.tactic_info_list.set_short_down,
        this.tactic.open_long_piece = this.tactic_info_list.open_long_piece,
        this.tactic.open_short_piece = this.tactic_info_list.open_short_piece,
        this.tactic.add_long_percent = this.tactic_info_list.add_long_percent,
        this.tactic.add_short_percent = this.tactic_info_list.add_short_percent,
        this.tactic.level_long_percent = this.tactic_info_list.level_long_percent,
        this.tactic.level_short_percent = this.tactic_info_list.level_short_percent,
        this.tactic.set_profit_level_long = this.tactic_info_list.set_profit_level_long,
        this.tactic.set_profit_level_short = this.tactic_info_list.set_profit_level_short,
        this.tactic.set_total_profit_level_long_short = this.tactic_info_list.set_total_profit_level_long_short,
        this.tactic.set_total_avg = this.tactic_info_list.set_total_avg,
        this.tactic.valid_manage_risk_percent = this.tactic_info_list.valid_manage_risk_percent,
        this.tactic.limit_sustain_rate = this.tactic_info_list.limit_sustain_rate ,
        this.tactic.long_piece_limit = this.tactic_info_list.long_piece_limit,
        this.tactic.short_piece_limit = this.tactic_info_list.short_piece_limit,
        this.tactic.choose_add_price_way = this.tactic_info_list.choose_add_price_way,
        this.tactic.choose_add_piece_way = this.tactic_info_list.choose_add_piece_way,
        this.tactic.double = this.tactic_info_list.double,
        this.tactic.threshold = this.tactic_info_list.threshold,
        this.tactic.flat_piece = this.tactic_info_list.flat_piece,
        this.tactic.count_threshold = this.tactic_info_list.count_threshold,
        this.tactic.time_gap = this.tactic_info_list.time_gap,
        this.tactic.set_rise_fall_rate = this.tactic_info_list.set_rise_fall_rate,
        this.tactic.trace_start_rate = this.tactic_info_list.trace_start_rate,
        this.tactic.trace_callback_rate = this.tactic_info_list.trace_callback_rate,
        this.tactic.symbol = this.tactic_info_list.symbol,
        this.tactic.identify_id = this.tactic_info_list.identify_id,
        this.tactic.number_repetitions = this.tactic_info_list.number_repetitions,
        
        this.tacticdialog = true
        console.log('content',this.tactic)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.tacticLoading = false
        }, 0.5 * 1000)
      })
    },
    handleConfigCreate() {
      this.configStatus = 'create'
      this.configFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
          }
          console.log(tmp)
          createApi(tmp).then(() => {
            this.configFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
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
          }
          
          updateApi(tmp).then(() => {
            
            this.configFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    UpdateTactic(){
      this.$refs['drawer'].closeDrawer()
    },
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm('确定要修改策略吗？')
        .then(_ => {
          this.loading = true;
          this.temp_tactic.user_id = String(this.tactic.user_id),
          this.temp_tactic.flag = String(this.tactic.flag),
          this.temp_tactic.tactic_name = String(this.tactic.tactic_name),
          this.temp_tactic.tactic_mark = String(this.tactic.tactic_mark),
          this.temp_tactic.set_long_up = String(this.tactic.set_long_up),
          this.temp_tactic.set_long_down = String(this.tactic.set_long_down),
          this.temp_tactic.set_short_up = String(this.tactic.set_short_up),
          this.temp_tactic.set_short_down = String(this.tactic.set_short_down),
          this.temp_tactic.open_long_piece = String(this.tactic.open_long_piece),
          this.temp_tactic.open_short_piece = String(this.tactic.open_short_piece),
          this.temp_tactic.add_long_percent = String(this.tactic.add_long_percent),
          this.temp_tactic.add_short_percent = String(this.tactic.add_short_percent),
          this.temp_tactic.level_long_percent = String(this.tactic.level_long_percent),
          this.temp_tactic.level_short_percent = String(this.tactic.level_short_percent),
          this.temp_tactic.set_profit_level_long = String(this.tactic.set_profit_level_long),
          this.temp_tactic.set_profit_level_short = String(this.tactic.set_profit_level_short),
          this.temp_tactic.set_total_profit_level_long_short = String(this.tactic.set_total_profit_level_long_short),
          this.temp_tactic.set_total_avg = String(this.tactic.set_total_avg),
          this.temp_tactic.valid_manage_risk_percent = String(this.tactic.valid_manage_risk_percent),
          this.temp_tactic.limit_sustain_rate = String(this.tactic.limit_sustain_rate),
          this.temp_tactic.long_piece_limit = String(this.tactic.long_piece_limit),
          this.temp_tactic.short_piece_limit = String(this.tactic.short_piece_limit),
          this.temp_tactic.choose_add_price_way = String(this.tactic.choose_add_price_way),
          this.temp_tactic.choose_add_piece_way = String(this.tactic.choose_add_piece_way),
          this.temp_tactic.double = String(this.tactic.double),
          this.temp_tactic.threshold = String(this.tactic.threshold),
          this.temp_tactic.flat_piece = String(this.tactic.flat_piece),
          this.temp_tactic.count_threshold = String(this.tactic.count_threshold),
          this.temp_tactic.time_gap = String(this.tactic.time_gap),
          this.temp_tactic.set_rise_fall_rate = String(this.tactic.set_rise_fall_rate),
          this.temp_tactic.trace_start_rate = String(this.tactic.trace_start_rate),
          this.temp_tactic.trace_callback_rate = String(this.tactic.trace_callback_rate),
          this.temp_tactic.symbol = String(this.tactic.symbol),
          this.temp_tactic.identify_id = String(this.tactic.identify_id),
          this.temp_tactic.number_repetitions = String(this.tactic.number_repetitions),

          console.log(this.temp_tactic)
          updateTactic(this.temp_tactic).then(response => {
            this.tactic_list = []
            this.getUserTactic()
            this.chooseTacticVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          });
          
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch(_ => {});
    },
    cancelForm() {
      this.loading = false;
      this.tacticdialog = false;
      this.chooseTacticVisible = false;
      clearTimeout(this.timer);
    }
  }
}
</script>

<style>
.demo-drawer__footer{
        width: 50%;
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 10px 16px;
        text-align: right;
    }
.el-input {
  width: 200px;
}
.el-drawer__body {
        overflow: auto;
    }
.el-drawer__container {
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    
}
</style>