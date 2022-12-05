<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="操作日志" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="收益曲线" name="timeline">
                <timeline />
              </el-tab-pane>
              <!-- <el-tab-pane label="外部链接" name="account">
                <account :user="user" />
              </el-tab-pane> -->
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'viptime',
      'status',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        // role: this.roles.join(' | '),
        role: this.roles[0]=='user'?'用户':'管理员',
        email: 'admin@test.com',
        viptime:parseInt(parseInt(this.viptime)/24),
        status:this.status,
        avatar: this.avatar
      }
    }
  }
}
</script>
