<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="app-container">
        <el-row :gutter="10" style="margin-bottom: 1em">
          <el-col :span="8" :offset="6">
            <el-input v-model="libelle" placeholder="Rechercher par libelle">  
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="etat" style="width: 14vw" multiple placeholder="Etat de l'engagement">
              <el-option
                v-for="item in etatSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; margin-right: 3em; color: rgb(132, 146, 166); font-size: 13px;">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-cascader
              style="width: 20vw"
              placeholder="Ligne budgétaire"
              :options="options"
              :props="{ checkStrictly: true, expandTrigger: 'hover'}"
              clearable>
            </el-cascader>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" :offset="6">
            <el-select v-model="value1" style="width: 14.5vw" multiple placeholder="Engagements ayant été...">
              <el-option
                v-for="item in statutSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="etat" style="width: 14.5vw" multiple placeholder="Choisir un utilisateur">
              <el-option
                v-for="item in etatSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="Statut" style="width: 14vw" multiple placeholder="Statut de l'engagement">
              <el-option
                v-for="item in statutSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; margin-right: 3em; color: rgb(132, 146, 166); font-size: 13px;">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="monthrange"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="à"
              start-placeholder="Mois de début"
              end-placeholder="Mois de fin"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
        </el-row>
        
        <EngagementsList
          :etat="etatString"
          :tableHeight="'72vh'"
          :displayCreateButton="false"
        />
      </div>
    </div>
    <div />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import EngagementsList from '../components/engagementslist'

@Component({
  name: 'DashboardEditor',
  components: {
    EngagementsList
  }
})
export default class extends Vue {
  private etat: string[] = []
  private libelle = ''
  private title = 'Consulter les engagements'
  private monthrange = []

  get name() {
    return UserModule.name
  }

  get avatar() {
    return UserModule.avatar
  }

  get roles() {
    return UserModule.roles
  }

  get etatString() {
    return this.etat.join(',')
  }

  private options = [{
          value: 'guide',
          label: 'Guide',
          children: [{
            value: 'disciplines',
            label: 'Disciplines',
            children: [{
              value: 'consistency',
              label: 'Consistency'
            }, {
              value: 'feedback',
              label: 'Feedback'
            }, {
              value: 'efficiency',
              label: 'Efficiency'
            }, {
              value: 'controllability',
              label: 'Controllability'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'side nav',
              label: 'Side Navigation'
            }, {
              value: 'top nav',
              label: 'Top Navigation'
            }]
          }]
        }, {
          value: 'component',
          label: 'Component',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout'
            }, {
              value: 'color',
              label: 'Color'
            }, {
              value: 'typography',
              label: 'Typography'
            }, {
              value: 'icon',
              label: 'Icon'
            }, {
              value: 'button',
              label: 'Button'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio'
            }, {
              value: 'checkbox',
              label: 'Checkbox'
            }, {
              value: 'input',
              label: 'Input'
            }, {
              value: 'input-number',
              label: 'InputNumber'
            }, {
              value: 'select',
              label: 'Select'
            }, {
              value: 'cascader',
              label: 'Cascader'
            }, {
              value: 'switch',
              label: 'Switch'
            }, {
              value: 'slider',
              label: 'Slider'
            }, {
              value: 'time-picker',
              label: 'TimePicker'
            }, {
              value: 'date-picker',
              label: 'DatePicker'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker'
            }, {
              value: 'upload',
              label: 'Upload'
            }, {
              value: 'rate',
              label: 'Rate'
            }, {
              value: 'form',
              label: 'Form'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table'
            }, {
              value: 'tag',
              label: 'Tag'
            }, {
              value: 'progress',
              label: 'Progress'
            }, {
              value: 'tree',
              label: 'Tree'
            }, {
              value: 'pagination',
              label: 'Pagination'
            }, {
              value: 'badge',
              label: 'Badge'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert'
            }, {
              value: 'loading',
              label: 'Loading'
            }, {
              value: 'message',
              label: 'Message'
            }, {
              value: 'message-box',
              label: 'MessageBox'
            }, {
              value: 'notification',
              label: 'Notification'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu'
            }, {
              value: 'tabs',
              label: 'Tabs'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb'
            }, {
              value: 'dropdown',
              label: 'Dropdown'
            }, {
              value: 'steps',
              label: 'Steps'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog'
            }, {
              value: 'tooltip',
              label: 'Tooltip'
            }, {
              value: 'popover',
              label: 'Popover'
            }, {
              value: 'card',
              label: 'Card'
            }, {
              value: 'carousel',
              label: 'Carousel'
            }, {
              value: 'collapse',
              label: 'Collapse'
            }]
          }]
        }, {
          value: 'resource',
          label: 'Resource',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'docs',
            label: 'Design Documentation'
          }]
        }]

  private etatSelect = [{
        value: 'INIT',
        label: 'Initiés'
      },
      {
        value: 'PEG',
        label: 'Engagés'
      },
      {
        value: 'IMP',
        label: 'Imputés'
      },
      {
        value: 'APUR',
        label: 'Apurés'
      },
      {
        value: 'CLOT',
        label: 'Clôturés'
      }]

  private statutSelect = [{
        value: 'SAISI',
        label: 'Saisi'
      },
      {
        value: 'VALIDP',
        label: 'Validés au 1er niveau'
      },
      {
        value: 'VALIDS',
        label: 'Validés au 2nd niveau'
      },
      {
        value: 'VALIDF',
        label: 'Validés au niveau final'
      }]
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: #ffffff;
  // min-height: 100vh;
  padding: 0px 30px 0px;

  .introduction {
    margin: 0;
    text-align: right;

    .display_name {
      font-size: 38px;
      line-height: 38px;
      color: #212121;
    }
  }

  .app-container {
    padding: 10px 0px;
  }

  .info-roles {
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
