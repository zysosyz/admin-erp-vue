<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }"
  >
  </a-table>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";

interface TableItem {
  id: number;
  name: string;
  key?: number;
}

const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 20,
  },
  {
    title: "name",
    dataIndex: "name",
    width: 20,
  },
];
const loading = ref(false);
const dataSource = ref<TableItem[]>([]); // 当前页数据
const selectedRowKeys = ref<number[]>([]); // 当前页选中的行
const allSelectedRowKeys = ref<number[]>([]); // 跨页选择的行
const params = ref({
  _page: 1,
});

const pagination = computed(() => ({
  pageSize: 10,
  total: 100,
  showSizeChanger: false,
}));

// 处理选择变化
const onSelectChange = (selectedKeys: number[], selectedRows: TableItem[]) => {
  // 找出被取消选择的行
  const deselectedKeys = selectedRowKeys.value.filter(
    (key) => !selectedKeys.includes(key)
  );

  selectedRowKeys.value = selectedKeys;

  // 更新全局选中状态
  if (deselectedKeys.length) {
    allSelectedRowKeys.value = allSelectedRowKeys.value.filter(
      (key) => !deselectedKeys.includes(key)
    );
  }

  // 合并当前页和全局选中状态
  allSelectedRowKeys.value = Array.from(
    new Set([...allSelectedRowKeys.value, ...selectedKeys])
  );
};

// 同步当前页的选中状态
const updateSelectedRows = () => {
  selectedRowKeys.value = allSelectedRowKeys.value.filter((key) =>
    dataSource.value.some((row) => row.key === key)
  );
};

// 监听全局选中变化
watch(allSelectedRowKeys, (newValue) => {
  console.log("全局选中变化:", newValue);
});

// 处理分页变化
const handleTableChange = async (paginationInfo: any) => {
  try {
    params.value._page = paginationInfo.current;
    loading.value = true;

    const { data } = await axios.get(
      `http://localhost:3000/users?_page=${params.value._page}`
    );

    dataSource.value = data.data.map((item: TableItem) => ({
      ...item,
      key: item.id,
    }));

    updateSelectedRows();
  } catch (error) {
    console.error("加载数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 初始化加载
onMounted(async () => {
  try {
    loading.value = true;
    const { data } = await axios.get(
      `http://localhost:3000/users?_page=${params.value._page}`
    );

    dataSource.value = data.data.map((item: TableItem) => ({
      ...item,
      key: item.id,
    }));
  } catch (error) {
    console.error("初始化数据失败:", error);
  } finally {
    loading.value = false;
  }
});
</script>
