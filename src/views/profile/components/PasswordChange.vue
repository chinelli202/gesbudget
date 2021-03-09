<template>
<div class="">
  <el-row style="margin-top: 2em">
    <el-col :span="8" :offset="1">
      <el-form
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        class="login-form"
        autocomplete="off"
        label-position="left"
      >
        <el-tooltip
          v-model="capsTooltip"
          :content="$t('passwordchange.label.caps_is_on')"
          placement="right"
          manual
        >
          <el-form-item
            prop="old_password"
            :label="$t('passwordchange.label.old_password')">
            <el-input
              :key="oldPasswordType"
              ref="old_password"
              v-model="passwordForm.old_password"
              :type="oldPasswordType"
              :placeholder="$t('passwordchange.label.old_password')"
              prefix-icon="el-icon-key"
              name="old_password"
              tabindex="2"
              autocomplete="off"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="submit"
            />
          </el-form-item>
        </el-tooltip>

        <el-tooltip
          v-model="capsTooltip"
          :content="$t('passwordchange.label.caps_is_on')"
          placement="right"
          manual
        >
          <el-form-item
            prop="new_password"
            :label="$t('passwordchange.label.new_password')"
            >
            <el-input
              :key="newPasswordType"
              ref="new_password"
              v-model="passwordForm.new_password"
              :type="newPasswordType"
              :placeholder="$t('passwordchange.label.new_password')"
              prefix-icon="el-icon-key"
              name="new_password"
              tabindex="2"
              autocomplete="off"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="submit"
            />
          </el-form-item>
        </el-tooltip>

        <el-tooltip
          v-model="capsTooltip"
          :content="$t('passwordchange.label.caps_is_on')"
          placement="right"
          manual
        >
          <el-form-item
            prop="confirm_new_password"
            :label="$t('passwordchange.label.confirm_new_password')">
            <el-input
              :key="cNewPasswordType"
              ref="confirm_new_password"
              v-model="passwordForm.confirm_new_password"
              :type="cNewPasswordType"
              :placeholder="$t('passwordchange.label.confirm_new_password')"
              prefix-icon="el-icon-key"
              name="confirm_new_password"
              tabindex="2"
              autocomplete="off"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="submit"
            />
          </el-form-item>
        </el-tooltip>

        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%; margin-bottom:30px;"
            :disabled="!canSubmit"
            @click.native.prevent="submit"
          >
            {{ $t('passwordchange.label.submit') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { IProfile } from '../index.vue'
import { changePassword } from '@/api/users'

@Component({
  name: 'PasswordChange'
})
export default class extends Vue {
  private passwordForm = {
    old_password : '',
    new_password : '',
    confirm_new_password : ''
  }
  private loading = false
  private capsTooltip = false
  private oldPasswordType = 'password'
  private newPasswordType = 'password'
  private cNewPasswordType = 'password'

  get canSubmit() {
    return this.passwordForm.old_password.length + this.passwordForm.new_password.length + this.passwordForm.confirm_new_password.length >= 15
  }

  private showOldPwd() {
    if (this.oldPasswordType === 'password') {
      this.oldPasswordType = ''
    } else {
      this.oldPasswordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.old_password as Input).focus()
    })
  }

  private showNewPwd() {
    if (this.newPasswordType === 'password') {
      this.newPasswordType = ''
    } else {
      this.newPasswordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.new_password as Input).focus()
    })
  }

  private showCNewPwd() {
    if (this.cNewPasswordType === 'password') {
      this.cNewPasswordType = ''
    } else {
      this.cNewPasswordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.confirm_new_password as Input).focus()
    })
  }

  mounted() {
    (this.$refs.old_password as Input).focus()
  }

  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 5) {
      callback(new Error('Le mot de passe doit avoir au moins 5 caractères'))
    } else {
      callback()
    }
    callback()
  }

  private validateConfirmPassword = (rule: any, value: string, callback: Function) => {
    if (this.passwordForm.new_password != this.passwordForm.confirm_new_password) {
      callback(new Error('Ce champs doit être identique au mot de passe'))
    } else {
      callback()
    }
  }

  private validateNewPassword = (rule: any, value: string, callback: Function) => {
    if (this.passwordForm.new_password == this.passwordForm.old_password) {
      callback(new Error('Le nouveau mot de passe doit être différent de l\'ancien'))
    } else {
      callback()
    }
  }

  private passwordRules = {
    old_password: [
      { validator: this.validatePassword, trigger: 'blur' }],
    new_password: [
      { validator: this.validatePassword, trigger: 'blur' },
      { validator: this.validateNewPassword, trigger: 'blur' }
      ],
    confirm_new_password: [
      { validator: this.validatePassword, trigger: 'blur' },
      { validator: this.validateConfirmPassword, trigger: 'blur' }
    ]
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e
    this.capsTooltip = key !== null && key.length === 1 && (key >= 'A' && key <= 'Z')
  }

  private submit() {
    
    (this.$refs.passwordForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        console.log("submit")
        changePassword(this.passwordForm)
          .then(() => {
              this.loading = false;
              (this.$refs.passwordForm as ElForm).resetFields();
          }).catch(error => {
            console.info(error.message)
            this.loading = false
          })
      } else {
        return false
      }
    })
  }
  
}
</script>

<style lang="scss" scoped>
  .show-pwd {
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

</style>
