import type { LucideProps } from 'lucide-react-native'
import * as icons from 'lucide-react-native/icons'
import { styled } from 'nativewind'
import React from 'react'
import { memo, useMemo } from 'react'

export type IconName = keyof typeof icons
type IconProps = LucideProps & { name: IconName; className?: string }

const Icon: React.FC<IconProps> = memo(({ name, className, ...rest }) => {
  const CustomIcon = useMemo(() => {
    const Icon = icons[name] ?? icons.Image
    Icon.displayName = name

    return styled(Icon, {
      className: {
        target: 'style',
        nativeStyleMapping: {
          color: true,
          opacity: true,
          width: true,
          height: true,
        },
      },
    })
  }, [name])

  return <CustomIcon className={className} {...rest} />
})

export default Icon
