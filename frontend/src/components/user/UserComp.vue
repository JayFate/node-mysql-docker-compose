<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
          >
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="userList" style="width: 100%" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            @change="userStateChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button
            @click="showEditDialog(scope.row.id)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          >
            {{ scope.a }}</el-button
          >
          <el-button
            @click="rmUserById(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户的对话框 -->
    <el-dialog
      @close="addDialogClose"
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      @close="editDialogClose"
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义邮箱的规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      // 查询到的用户信息
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }

      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      console.log('newSize', newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      console.log('newPage', newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClose() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 点取消按钮重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 校验成功，发起网络请求添加用户
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败!')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.editDialogVisible = false
        this.$message.success('修改用户成功')
        this.getUserList()
      })
    },
    // 根据id删除对应的用户
    async rmUserById(id) {
      // 先弹框询问是否删除
      // res : confirm / cancel
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((errStr) => {
        // 点取消进入 catch
        return errStr
      })
      if (res !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      const { data: delRes } = await this.$http.delete(`users/${id}`)
      if (delRes.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
