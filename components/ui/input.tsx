import * as React from 'react'
import { TextInput, type TextInputProps } from 'react-native'

import { cn } from '@/lib/utils'

function Input({
  className,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>
}) {
  return (
    <TextInput
      className={cn(
        'native:text-lg text-body native:leading-tight border-input bg-background placeholder:text-muted-foreground web:flex web:w-full web:py-2 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 h-12 rounded-md border px-3 file:border-0 file:bg-transparent file:font-medium lg:text-sm',
        props.editable === false && 'web:cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Input }
