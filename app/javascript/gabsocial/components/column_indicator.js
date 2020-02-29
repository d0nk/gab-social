import { defineMessages, injectIntl } from 'react-intl'
import Icon from './icon'
import Text from './text'

const messages = defineMessages({
  loading: { id: 'loading_indicator.label', defaultMessage: 'Loading..' },
  missing: { id: 'missing_indicator.sublabel', defaultMessage: 'This resource could not be found.' },
})

export default
@injectIntl
class ColumnIndicator extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    type: PropTypes.oneOf([
      'loading',
      'missing',
      'error',
    ]),
    message: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }

  render() {
    const { type, message, intl } = this.props

    const title = type !== 'error' ? intl.formatMessage(messages[type]) : message

    return (
      <div className={[_s.default, _s.width100PC, _s.justifyContentCenter, _s.alignItemsCenter, _s.paddingVertical15PX].join(' ')}>
        <Icon id={type} width='44px' height='44px' />
        {
          type !== 'loading' &&
          <Text
            align='center'
            size='medium'
            className={_s.marginTop10PX}
          >
            {title}
          </Text>
        }
      </div>
    )
  }

}
