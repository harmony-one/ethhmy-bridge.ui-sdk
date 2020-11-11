import * as React from 'react';
import { Box, BoxProps } from 'grommet'
import { observer } from 'mobx-react-lite';
import { Icon, Text } from '../components/Base';
import { useStores } from '../stores';
import { formatWithSixDecimals, truncateAddressString } from '../utils';
import { EXCHANGE_MODE, TOKEN } from '../stores/interfaces';
import { useState } from 'react';
// import { EXPLORER_URL } from '../../blockchain';

export const Price = observer(
  (props: { value: number; isEth: boolean; boxProps?: BoxProps }) => {
    const { user } = useStores();

    return (
      <Box
        direction="column"
        align="end"
        justify="center"
        pad={{ right: 'medium' }}
        {...props.boxProps}
      >
        <Text style={{ fontSize: 14 }}>{`${props.value} ${
          props.isEth ? 'ETH' : 'ONE'
          }`}</Text>
        <Text size="xsmall" color="rgba(102, 102, 102, 0.9)">
          $
          {formatWithSixDecimals(
            props.value * (props.isEth ? user.ethRate : user.oneRate),
          )}
        </Text>
      </Box>
    );
  },
);

const AssetRow = props => {
  return (
    <Box
      direction="row"
      justify="between"
      margin={{ bottom: 'medium' }}
      align="start"
    >
      <Box>
        <Text size="small" bold={true}>
          {props.label}
        </Text>
      </Box>
      <Box direction="row" align="center">
        {props.address ? (
          <a href={props.link}>
            <Text
              size="small"
              style={{
                fontFamily: 'monospace',
                cursor: 'pointer',
                // textDecoration: 'underline',
              }}
            >
              {props.value}
            </Text>
          </a>
        ) : (
          <div>
            {props.value ? <Text size="small">{props.value}</Text> : null}
            {props.children}
          </div>
        )}

        {props.after && (
          <Text style={{ marginLeft: 5 }} color="Basic500">
            {props.after}
          </Text>
        )}
        {props.address && (
          <Icon
            glyph="PrintFormCopy"
            size="20px"
            color="#1c2a5e"
            style={{ marginLeft: 10, width: 20 }}
          />
        )}
      </Box>
    </Box>
  );
};

// const DataItem = (props: {
//   text: any;
//   label: string;
//   icon: string;
//   iconSize: string;
//   color?: string;
//   link?: string;
// }) => {
//   return (
//     <Box direction="row" justify="between" gap="10px">
//       <Box direction="row" justify="start" align="center" gap="5px">
//         <Icon
//           glyph={props.icon}
//           size={props.iconSize}
//           color={props.color || '#1c2a5e'}
//           style={{ marginBottom: 2, width: 20 }}
//         />
//         <Text color="#1c2a5e" size={'small'}>
//           {props.label}
//         </Text>
//       </Box>
//       {props.link ? (
//         <a
//           href={props.link}
//           target="_blank"
//           style={{ color: props.color || '#1c2a5e' }}
//         >
//           <Text color={props.color || '#1c2a5e'} size={'small'} bold={true}>
//             {props.text}
//           </Text>
//         </a>
//       ) : (
//         <Text color={props.color || '#1c2a5e'} size={'small'} bold={true}>
//           {props.text}
//         </Text>
//       )}
//     </Box>
//   );
// };

export const Details = observer<{ showTotal?: boolean; children?: any }>(
  ({ showTotal, children }) => {
    const { exchange, userMetamask } = useStores();
    const [isShowDetail, setShowDetails] = useState(false);

    const isETH = exchange.mode === EXCHANGE_MODE.ETH_TO_ONE;

    return (
      <Box direction="column">
        <AssetRow
          label="ETH address"
          value={truncateAddressString(exchange.transaction.ethAddress)}
          address={true}
        />
        <AssetRow
          label="ONE address"
          value={truncateAddressString(exchange.transaction.oneAddress)}
          address={true}
        />
        {exchange.token === TOKEN.ERC20 ? (
          <AssetRow
            label={`${String(
              userMetamask.erc20TokenDetails &&
                userMetamask.erc20TokenDetails.symbol,
            ).toUpperCase()} amount`}
            value={formatWithSixDecimals(exchange.transaction.amount)}
          />
        ) : (
          <AssetRow
            label={`${String(exchange.token).toUpperCase()} amount`}
            value={formatWithSixDecimals(exchange.transaction.amount)}
          />
        )}

        {/*<DataItem*/}
        {/*  icon="User"*/}
        {/*  iconSize="16px"*/}
        {/*  text={truncateAddressString(exchange.transaction.oneAddress)}*/}
        {/*  label="ONE address:"*/}
        {/*  link={EXPLORER_URL + `/address/${exchange.transaction.oneAddress}`}*/}
        {/*/>*/}

        {children ? <Box direction="column">{children}</Box> : null}

        {showTotal ? (
          <Box
            direction="column"
            pad={{ top: 'small' }}
            margin={{ top: 'small' }}
            style={{ borderTop: '1px solid #dedede' }}
          >
            <AssetRow label="Network Fee (total)" value="">
              {!exchange.isFeeLoading ? (
                <Price
                  value={exchange.networkFee}
                  isEth={exchange.mode === EXCHANGE_MODE.ETH_TO_ONE}
                  boxProps={{ pad: {} }}
                />
              ) : (
                <Text>...loading</Text>
              )}
            </AssetRow>

            {!isShowDetail && isETH && !exchange.isFeeLoading ? (
              <Box
                direction="row"
                justify="end"
                margin={{ top: '-10px' }}
                onClick={() => setShowDetails(true)}
              >
                <Icon
                  size="14px"
                  glyph="ArrowDown"
                  style={{ marginRight: 10 }}
                />
                <Text size="small">Show more details</Text>
              </Box>
            ) : null}

            {!exchange.isFeeLoading &&
            exchange.mode === EXCHANGE_MODE.ETH_TO_ONE &&
            isShowDetail ? (
              <div style={{ opacity: 1 }}>
                <AssetRow label="Approve (~50000 gas)" value="">
                  <Price
                    value={exchange.networkFee / 2}
                    isEth={exchange.mode === EXCHANGE_MODE.ETH_TO_ONE}
                    boxProps={{ pad: {} }}
                  />
                </AssetRow>
                <AssetRow label="Lock token (~50000 gas)" value="">
                  <Price
                    value={exchange.networkFee / 2}
                    isEth={exchange.mode === EXCHANGE_MODE.ETH_TO_ONE}
                    boxProps={{ pad: {} }}
                  />
                </AssetRow>
              </div>
            ) : null}

            {isShowDetail && isETH ? (
              <Box
                direction="row"
                justify="end"
                onClick={() => setShowDetails(false)}
              >
                <Icon size="14px" glyph="ArrowUp" style={{ marginRight: 10 }} />
                <Text size="small">Hide details</Text>
              </Box>
            ) : null}

            {/*<AssetRow*/}
            {/*  label="Total"*/}
            {/*  value={formatWithSixDecimals(*/}
            {/*    Number(exchange.transaction.amount) + exchange.networkFee,*/}
            {/*  )}*/}
            {/*/>*/}
          </Box>
        ) : null}

        {exchange.txHash ? (
          <Box direction="column" margin={{ top: 'large' }}>
            <AssetRow
              label="Transaction hash"
              value={truncateAddressString(exchange.txHash)}
              address={true}
            />
          </Box>
        ) : null}
      </Box>
    );
  },
);

export const TokenDetails = observer<{ showTotal?: boolean; children?: any }>(
  ({ showTotal, children }) => {
    const { userMetamask, exchange, user } = useStores();

    if (!userMetamask.erc20TokenDetails) {
      return null;
    }

    if (exchange.mode === EXCHANGE_MODE.ONE_TO_ETH && !user.hrc20Address) {
      return <Text color="red">Token not found</Text>;
    }

    return (
      <Box direction="column">
        <AssetRow
          label="Token name"
          value={userMetamask.erc20TokenDetails.name}
        />
        <AssetRow
          label="Token Symbol"
          value={userMetamask.erc20TokenDetails.symbol}
        />
        {exchange.mode === EXCHANGE_MODE.ETH_TO_ONE &&
        userMetamask.ethAddress ? (
          <AssetRow
            label="User Ethereum Balance"
            value={formatWithSixDecimals(userMetamask.erc20Balance)}
          />
        ) : null}

        {exchange.mode === EXCHANGE_MODE.ONE_TO_ETH && user.address ? (
          <AssetRow
            label="User Harmony Balance"
            value={formatWithSixDecimals(user.hrc20Balance)}
          />
        ) : null}
      </Box>
    );
  },
);
