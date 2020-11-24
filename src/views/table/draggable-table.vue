<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        Général
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          Recettes
        </template>
        <el-menu-item index="2-1">
          Charges de personnel
        </el-menu-item>
        <el-menu-item index="2-2">
          Missions
        </el-menu-item>
        <el-menu-item index="2-4">
          Diverses Représentations
        </el-menu-item>
        <el-menu-item index="2-5">
          Charges diverses de fonctionnement
        </el-menu-item>
        <el-menu-item index="2-6">
          Honoraires
        </el-menu-item>
        <el-menu-item index="2-7">
          Dons - subventions
        </el-menu-item>
        <el-menu-item index="2-8">
          Formation
        </el-menu-item>
        <el-menu-item index="2-9">
          Imprévus
        </el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">
            item quatre
          </template>
          <el-menu-item index="2-4-1">
            item un
          </el-menu-item>
          <el-menu-item index="2-4-2">
            item deux
          </el-menu-item>
          <el-menu-item index="2-4-3">
            item trois
          </el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item
        index="3"
        disabled
      >
        Dépenses
      </el-menu-item>
      <el-menu-item index="4">
        <a
          href="https://www.ele.me"
          target="_blank"
        >Commandes</a>
      </el-menu-item>
    </el-menu>
    <el-table
      ref="draggableTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="ID"
        width="65"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="Prévisions"
      >
        <template slot-scope="{row}">
          <span>{{ row.previsions }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="300px"
        label="Réalisations Mois"
      >
        <template slot-scope="{row}">
          <span>{{ row.realisationsMois }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="Réalisations Précédentes"
      >
        <template slot-scope="{row}">
          <span>{{ row.realisationsPrecedentes }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="105px"
        label="Réalisations Cumulées"
      >
        <template slot-scope="{row}">
          <span>{{ row.realisationsCumulees }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Engagements"
        width="95"
      >
        <template slot-scope="{row}">
          <span>{{ row.engagements }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="Execution"
        width="110"
      >
        <template slot-scope="{row}">
          <span>{{ row.execution }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Solde"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.solde }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Taux d'exécution"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.tauxExecution }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column
        prop="date"
        label="date"
        sortable
        width="180"
      />
      <el-table-column
        prop="name"
        label="Nom"
        sortable
        width="180"
      />
    </el-table>

    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="date"
        label="Date"
        width="180"
      />
      <el-table-column
        prop="name"
        label="Nom"
        width="180"
      />
    </el-table>

    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <div class="show-d">
      <el-tag style="margin-right:12px;">
        {{ $t('table.dragTips1') }} :
      </el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>{{ $t('table.dragTips2') }} :</el-tag> {{ newList }}
    </div>
  </div>
</template>

<script lang="ts">
import Sortable from 'sortablejs'
import { Component, Vue } from 'vue-property-decorator'
import { getBudgetsFonctionnement } from '@/api/budgetfonctionnement'
import { IBudgetFonctionnement } from '@/api/types'

@Component({
  name: 'DraggableTable'
})
export default class extends Vue {
  private list: IBudgetFonctionnement[] = []
  private listLoading = true
  private total = []
  private oldList: number[] = []
  private newList: number[] = []
  private listQuery = {
    page: 1,
    limit: 10
  }

  private sortable: Sortable | null = null

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getBudgetsFonctionnement(this.listQuery)
    this.list = data
    // Just to simulate the time of the request
    // setTimeout(() => {
    //   this.listLoading = false
    // }, 0.5 * 1000)
    this.total = data.total
    this.oldList = this.list.map((v) => v.id)
    this.newList = this.oldList.slice()
    this.$nextTick(() => {
      this.setSort()
    })
    this.listLoading = false
  }

  private setSort() {
    const el = (this.$refs.draggableTable as Vue).$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0] as HTMLElement
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      onEnd: evt => {
        if (typeof (evt.oldIndex) !== 'undefined' && typeof (evt.newIndex) !== 'undefined') {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      }
    })
  }

  data() {
    return {
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: 'wangxiaohu'
      }, {
        id: 2,
        date: '2016-05-04',
        name: 'wangxiaohu'
      }, {
        id: 3,
        date: '2016-05-01',
        name: 'wangxiaohu',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: 'wangxiaohu'
        }, {
          id: 32,
          date: '2016-05-01',
          name: 'wangxiaohu',
          children: [{
            id: 731,
            date: '2016-05-01',
            name: 'wangxiaohu'
          }, {
            id: 732,
            date: '2016-05-01',
            name: 'wangxiaohu'
          }]
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: 'wangxiaohu'
      }],
      tableData1: [{
        id: 1,
        date: '2016-05-02',
        name: 'wangxiaohu'
      }, {
        id: 2,
        date: '2016-05-04',
        name: 'wangxiaohu'
      }, {
        id: 3,
        date: '2016-05-01',
        name: 'wangxiaohu',
        hasChildren: true
      }, {
        id: 4,
        date: '2016-05-03',
        name: 'wangxiaohu'
      }],
      activeIndex: '1',
      activeIndex2: '1'
    }
  }

  private load(tree : any, treeNode : any, resolve : any) {
    setTimeout(() => {
      resolve([
        {
          id: 31,
          date: '2016-05-01',
          name: 'wangxiaohu'
        }, {
          id: 32,
          date: '2016-05-01',
          name: 'wangxiaohu'
        }
      ])
    }, 1000)
  }

  private handleSelect(key : any, keyPath : any) {
    console.log(key, keyPath)
  }
}
</script>

<style lang="scss">
.sortable-ghost {
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style lang="scss" scoped>
.icon-star {
  margin-right: 2px;
}

.draggable-handler {
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>
