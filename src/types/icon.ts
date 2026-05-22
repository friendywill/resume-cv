import * as React from 'react';

export type IconProps = React.ComponentPropsWithRef<'svg'> & {
  title?: string;
  color?: string;
  size?: string | number;
};

export type CustomIconType = React.ForwardRefExoticComponent<IconProps>;
