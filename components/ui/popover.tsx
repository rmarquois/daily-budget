import * as PopoverPrimitive from '@rn-primitives/popover'
import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { useWebPortal } from '../WebPortalContext'

import { TextClassContext } from '@/components/ui/text'
import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  portalHost,
  ...props
}: PopoverPrimitive.ContentProps & {
  ref?: React.RefObject<PopoverPrimitive.ContentRef>
  portalHost?: string
}) {
  const { container } = useWebPortal()
  return (
    <PopoverPrimitive.Portal container={container} hostName={portalHost}>
      <PopoverPrimitive.Overlay style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}>
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut}>
          <TextClassContext.Provider value="text-popover-foreground">
            <PopoverPrimitive.Content
              align={align}
              sideOffset={sideOffset}
              className={cn(
                'border-border bg-popover web:cursor-auto web:outline-none web:animate-in web:fade-in-0 web:zoom-in-95 web:data-[side=bottom]:slide-in-from-top-2 web:data-[side=left]:slide-in-from-right-2 web:data-[side=right]:slide-in-from-left-2 web:data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md shadow-neutral-50',
                className
              )}
              {...props}
            />
          </TextClassContext.Provider>
        </Animated.View>
      </PopoverPrimitive.Overlay>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
