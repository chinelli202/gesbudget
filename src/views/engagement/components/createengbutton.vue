<template>
  <el-button
    :disabled="inactive"
    type="primary"
    icon="el-icon-edit"
    @click="launchDialogForm"
  >
    Créer un engagement
  </el-button>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component({
  name: 'CreateEngButton',
  components: {
    
  }
})

export default class CreateEngButton extends Vue {
  @Prop() private inactive!: string
}
</script>