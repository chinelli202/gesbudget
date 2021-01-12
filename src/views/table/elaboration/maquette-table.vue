<template>
    <div class="app-container">
        <el-table
            :data="maquetteData"
            style="width: 100%"
            lazy
            :load="load"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                label="Unité"
                prop="label">
            </el-table-column>
            <el-table-column
                label="Montant"
                prop="montant">
            </el-table-column>
            <el-table-column
                label="Description"
                prop="description">
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">

import {Vue, Component, Prop} from 'vue-property-decorator'
import {IMaquetteData} from '@/api/types'

@Component({
    name:'MaquetteTable'
})

export default class extends Vue {

@Prop() private maquetteData!: IMaquetteData[]

}
</script>