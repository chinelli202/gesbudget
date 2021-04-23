<template>
  <el-card style="margin-bottom:20px;">
    <!-- <div
      slot="header"
      class="clearfix"
    >
      <span>About me</span>
    </div> -->

    <div class="user-profile">
      <!-- <div class="box-center">
        <pan-thumb
          :image="user.avatar"
          :height="'100px'"
          :width="'100px'"
          :hoverable="false"
        >
          <div>Hello</div>
          {{ user.roles }}
        </pan-thumb>
      </div> -->
      <div class="box-center">
        <div class="user-name text-center">
          {{ user.name }}
          <br>({{ user.matricule }})
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-s-cooperation" /><span>{{ $t('usercard.position') }}</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ $t('user.division.'+user.division) || 'Division non spécifiée' }} : {{ $t('user.fonction.'+user.fonction) || 'Fonction non spécifiée' }}
          </div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-message" /><span>{{ $t('usercard.email') }}</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.email }}
          </div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-user" /><span>{{ $t('usercard.date_embauche') }}</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.date_embauche || 'Non spécifiée' }}
          </div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-location-information" /><span>{{ $t('usercard.adresse') }}</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.adresse || 'Non spécifiée' }}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IProfile } from '../index.vue'
import PanThumb from '@/components/PanThumb/index.vue'

@Component({
  name: 'UserCard',
  components: {
    PanThumb
  }
})
export default class extends Vue {
  @Prop({ required: true }) private user!: IProfile
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
