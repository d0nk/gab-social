import { defineMessages, injectIntl } from 'react-intl'
import ContentLoader from 'react-content-loader'
import { DEFAULT_THEME } from '../../constants'

const messages = defineMessages({
  loading: { id: 'loading_indicator.label', defaultMessage: 'Loading..' },
})

const mapStateToProps = (state) => ({
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
})

export default
@injectIntl
@connect(mapStateToProps)
class PlaceholderLayout extends PureComponent {
  
  static propTypes = {
    children: PropTypes.node,
    intl: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
    viewBox: PropTypes.object.isRequired,
  }

  render() {
    const {
      intl,
      theme,
      viewBox,
    } = this.props

    const title = intl.formatMessage(messages.loading)
    const backgroundColor = theme !== 'light' ? '#555' : '#f3f3f3'
    const foregroundColor = theme !== 'light' ? '#888' : '#ecebeb'

    return (
      <ContentLoader
        title={title}
        speed={1.25}
        viewBox={viewBox}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
      >
        {this.props.children}
      </ContentLoader>
    )
  }

}