<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
    :pagination="pagination"
    @change="handleTableChange"
    :loading="loading"
  />
</template>

<script>
import { ref, watch } from "vue";
import { Table } from "ant-design-vue";

export default {
  components: {
    ATable: Table,
  },
  setup() {
    const data = ref([]); // 当前页数据
    const selectedRowKeys = ref([]); // 当前页选中的行
    const allSelectedRowKeys = ref([]); // 跨页选择的行
    const pagination = ref({ current: 1, pageSize: 10 });
    const loading = ref(false);

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
      },
    ];

    // 模拟请求数据
    const fetchData = async () => {
      loading.value = true;
      // 这里模拟请求数据
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            data: Array.from(
              { length: pagination.value.pageSize },
              (_, index) => ({
                key:
                  index +
                  (pagination.value.current - 1) * pagination.value.pageSize,
                name: `User ${
                  index +
                  (pagination.value.current - 1) * pagination.value.pageSize
                }`,
                age: 20 + (index % 30),
              })
            ),
            total: 100,
          });
        }, 1000)
      );
      data.value = response.data;
      pagination.value.total = response.total;
      loading.value = false;

      // 更新选择的行
      updateSelectedRows();
    };

    // 更新跨页选择的行
    const updateSelectedRows = () => {
      selectedRowKeys.value = selectedRowKeys.value.filter((key) =>
        data.value.some((row) => row.key === key)
      );
      allSelectedRowKeys.value = [
        ...new Set([...allSelectedRowKeys.value, ...selectedRowKeys.value]),
      ];
    };

    // 处理页码变化
    const handleTableChange = (pagination) => {
      pagination.value = pagination;
      fetchData();
    };

    // 选择行的回调
    const rowSelection = {
      selectedRowKeys: selectedRowKeys.value,
      onChange: (keys) => {
        selectedRowKeys.value = keys;
        updateSelectedRows();
      },
    };

    // 初次加载数据
    fetchData();

    return {
      data,
      selectedRowKeys,
      rowSelection,
      pagination,
      loading,
      columns,
    };
  },
};
</script>
