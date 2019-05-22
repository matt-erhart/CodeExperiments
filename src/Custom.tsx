import * as React from 'react'
import { memo } from 'react'
import styled from 'styled-components'

export const Div100vh = styled.div`
  width: 100vw;
  height: 100vh;
  border: 1px solid lightblue;
`
const _DivRect = styled.div`
  position: absolute;
  border: 1px solid hsl(220, 82%, 66%);
`

export const DivRect = React.memo<any>((props) => {
  // const {style, ...rest} = props
  return <_DivRect {...props} />
})