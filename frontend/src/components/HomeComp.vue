<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <el-container>
      <el-aside :width="!isCollapse ? '200px' : '64px'">
        <div @click="toggleCollapse" class="toggle-button">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="(item, index) in menuList" :index="item.id + ''" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconArr[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconArr: [
        'el-icon-user-solid',
        'el-icon-s-platform',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-data'
      ],
      isCollapse: false,
      activePath: window.sessionStorage.getItem('activePath')
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log('getMenuList')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存二级菜单的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  width: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  text-align: center;
  letter-spacing: 0.2em;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
}
</style>
