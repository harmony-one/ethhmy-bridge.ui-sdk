import * as React from 'react'
import { Box } from 'grommet'
import styles from './styles-large-button.styl'
import cn from 'classnames'
import { Text } from '../components/Base'
import { ReactComponent as EthSvg } from '../images/eth.svg'
import { ReactComponent as OneSvg } from '../images/one.svg'
import { ReactComponent as RightSvg } from '../images/right.svg'

export const LargeButton = (props: {
  title: string
  onClick: () => void
  description: string
  isActive: boolean
  reverse?: boolean
}) => {
  return (
    <Box
      direction='column'
      align='center'
      justify='center'
      className={cn(
        styles.largeButtonContainer,
        props.isActive ? styles.active : ''
      )}
      onClick={props.onClick}
      gap='10px'
    >
      <Box direction={props.reverse ? 'row-reverse' : 'row'} align='center'>
        <Box direction='row' align='center'>
          <EthSvg className={styles.imgToken} />
          {/*<img className={styles.imgToken} src={link} />*/}
          <Text size='large' className={styles.title}>
            ETH
          </Text>
        </Box>
        <Box direction='row' margin={{ horizontal: 'medium' }} align='center'>
          <RightSvg />
          {/*<img src='/right.svg' />*/}
        </Box>
        <Box direction='row' align='center'>
          <OneSvg className={styles.imgToken} />
          {/*<img className={styles.imgToken} src="/one.svg" />*/}
          <Text size='large' className={styles.title}>
            ONE
          </Text>
        </Box>
      </Box>
      <Text size='xsmall' color='#748695' className={styles.description}>
        {props.description}
      </Text>
    </Box>
  )
}
