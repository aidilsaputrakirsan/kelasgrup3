<!-- 📄 src/components/ui/AppInput.vue -->
<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-medium text-charcoal-soft">
      {{ label }}
      <span v-if="required" class="text-dusty-rose ml-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Input field -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
        class="w-full glass rounded-xl px-4 py-3 text-charcoal-soft placeholder-charcoal-soft/60 border border-white/20 focus:border-dusty-rose focus:ring-2 focus:ring-dusty-rose/20 transition-all duration-200 disabled:opacity-50"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      
      <!-- Icon slot -->
      <div v-if="$slots.icon" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-soft/60">
        <slot name="icon" />
      </div>
      
      <!-- Error state -->
      <div v-if="error" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-500 flex items-center gap-1">
      {{ error }}
    </p>
    
    <!-- Helper text -->
    <p v-else-if="helper" class="text-sm text-charcoal-soft/70">
      {{ helper }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  label: String,
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  helper: String
})

defineEmits(['update:modelValue', 'focus', 'blur'])

const inputClasses = computed(() => ({
  'border-red-500 focus:border-red-500 focus:ring-red-500/20': props.error,
  'pl-10': !!props.$slots?.icon
}))
</script>