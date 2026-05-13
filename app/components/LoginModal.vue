<script setup lang="ts">
import * as z from 'zod'
const { setSession, user, signOut } = useAuth()
const props = defineProps({
  open: Boolean
})
const emit = defineEmits(['close'])
const step = ref<'phone' | 'otp'>('phone');

const state = reactive({
  phone: '',
  token: []
})

const captchaToken = ref();

const phoneSchema = z.object({ phone: z.string().min(10, 'Enter a valid 10-digit phone number') })
const otpSchema = z.object({ token: z.array(z.string()).length(6) })

async function sendCode() {
  await $fetch('/api/auth/send-otp', { method: 'POST', body: { phone: state.phone, captchaToken: captchaToken.value }
})
  step.value = 'otp'
}

async function verify() {
  const data = await $fetch('/api/auth/verify-otp', { method: 'POST', body: { phone: state.phone, token: state.token } })
  setSession(data.session);
  emit('close')
}

async function handleSignOut() {
  await signOut()
  emit('close')
}
</script>

<template>
    <UModal :open="props.open" @update:open="emit('close')" class="mx-auto flex items-center flex-col flex-1 p-8 sm:p-6 gap-y-8 w-full min-h-80">
        <template #content>
          <div class="w-full flex flex-col gap-4 p-6">

            <template v-if="user">
              <div class="w-full flex flex-col items-center gap-3">
                <UIcon name="i-lucide-circle-check" class="text-4xl mb-1"/>
                <h1 class="text-2xl font-semibold">You're already signed in!</h1>
              </div>
              <UButton variant="outline" color="neutral" label="Sign Out" icon="i-lucide-log-out" class="flex justify-center" @click="handleSignOut"/>
            </template>

            <template v-else>
              <div class="w-full flex flex-col items-center">
                <UIcon name="i-lucide-user" class="text-3xl mb-2"/>
                <h1 class="text-2xl font-semibold">Login</h1>
                <p class="text-base text-pretty text-muted">Enter your credentials to access your account.</p>
              </div>
              <div class="w-full">
                <UForm v-if="step==='phone'" :state="state" :schema="phoneSchema" @submit="sendCode" class="mx-auto flex flex-col gap-2">
                  <UFormField label="Phone Number" name="phone">
                    <UInput v-model="state.phone" type="tel" placeholder="(555) 000-0000" class="w-full">
                      <template #leading><span class="text-sm text-muted select-none">+1</span></template>
                    </UInput>
                  </UFormField>
                  <NuxtTurnstile v-model="captchaToken" :options="{ size: 'flexible', theme: 'dark' }" class="w-full"/>
                  <UButton variant="solid" color="primary" label="Send Passcode" icon="i-lucide-message-square-lock" type="submit" class="flex justify-center"/>
                </UForm>
                <UForm v-else-if="step==='otp'" :state="state" :schema="otpSchema" @submit="verify" class="mx-auto flex flex-col gap-2">
                  <UFormField label="Passcode" name="otp">
                    <UPinInput v-model="state.token" :length="6" otp/>
                  </UFormField>
                  <UButton variant="solid" color="primary" label="Login" icon="i-lucide-key" type="submit" class="flex justify-center"/>
                </UForm>
              </div>
            </template>

          </div>
        </template>
    </UModal>
</template>
