<script setup>
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
const articleList = ref([])
const total = ref(0)
const loading = ref(false)
// 定义请求参数对象
const params = ref({
  pagenum: 1, //当前页
  pagesize: 5, //当前生效的每页条数
  cate_id: '',
  state: ''
})

// 基于params参数，获取文章列表
const getArticleList = async () => {
  loading.value = true

  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total

  loading.value = false
}
onMounted(() => getArticleList())

// 处理分页逻辑
const onSizeChange = (size) => {
  // console.log(size)
  // 每页条数变化时，将访问页设置成第一页
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  // console.log(page)
  params.value.pagenum = page
  getArticleList()
}
// 重置和搜索
const onSearch = () => {
  // 搜索从第一页开始
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  // 将筛选条件清空，从第一页开始
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()
// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}

//添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 添加渲染到最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  // 编辑直接渲染到当前页即可
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extar>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id" width="240px"></channel-select>
      </el-form-item>
      <el-form-item v-model="params.state" label="发布状态：">
        <el-select style="width: 240px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      :current-page="params.pagenum"
      :page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
